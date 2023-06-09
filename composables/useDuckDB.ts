import type { ShallowRef } from 'nuxt/dist/app/compat/capi'
import { loadItemData } from '~/data'
import type { DuckDBClient } from '~/data/duckDB'

const db = shallowRef<DuckDBClient | null>(null)
let promise: Promise<void> | null = null

export function useDuckDB() {
  async function initialize() {
    // should be run only once in client
    if (db.value)
      return
    const text = await loadItemData()

    const { DuckDBClient } = await import('~/data/duckDB')
    db.value = await DuckDBClient.of({
      items: text,
    })
  }
  if (process.client && !promise)
    promise = initialize()

  return { db }
}

export const columnNames = [
  'items."key: #" as id',
  '"9: Name" as name',
  '"10: Icon" as iconID',
  '"11: Level{Item}" as itemLevel',
  '"22: IsUntradable" as isUntradable',
  // '"25: Price{Mid}" as shopPrice',
  // '"8: Description" as description',
  'IF("27: CanBeHq" = \'False\', false, true) as canBeHQ',
]
// const query = `select items."key: #" as id, "9: Name" as name, "11: Level{Item}" as itemLevel, "25: Price{Mid}" as shopPrice, "8: Description" as description, IF(shop_items."0: Item" is null, false, true) as inShop, IF("27: CanBeHq" = 'False', false, true) as canBeHQ from items left join ( select "0: Item" from shop_items group by shop_items."0: Item" ) as shop_items on items."key: #" = shop_items."0: Item" where name != '' and "22: IsUntradable" = 'False' and ${Array(words.length).fill('name like ?').join(' and ')}`

export function useQueries(db: ShallowRef<DuckDBClient | null>) {
  async function queryExactName(name: string) {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')
    // "ilike" is case-insensitive
    const query = `select ${columnNames.join(', ')} from items where name != '' and name like ?`
    const results = await db.value.query(query, [name])
    return results[0]
  }
  async function queryNames(words: string[]) {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')
    // "ilike" is case-insensitive
    const query = `select ${columnNames.join(', ')} from items where name != '' and ${Array(words.length).fill('name ilike ?').join(' and ')}`
    return await db.value.query(query, words.map(it => `%${it}%`))
  }
  async function queryIDs(ids: string[]) {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')
    const query = `select ${columnNames.join(', ')} from items where name != '' and ${Array(ids.length).fill('id = ?').join(' or ')}`
    return await db.value.query(query, ids)
  }
  async function queryID(id: string) {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')
    const query = `select ${columnNames.join(', ')} from items where id = ?`
    return (await db.value.query(query, [id]))[0]
  }

  return {
    queryExactName,
    queryNames,
    queryIDs,
    queryID,
  }
}
