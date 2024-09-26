import type { ShallowRef } from 'vue'
import { loadItemData } from '~/data/itemData'
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
  if (import.meta.client && !promise)
    promise = initialize()

  return { db }
}

export const necessaryQueries = [
  'id',
  'name',
] satisfies (keyof typeof columnTable)[]

export const defaultQueries = [
  'iconID',
  'itemLevel',
  'isUntradable',
  // 'shopPrice',
  // 'description',
  'canBeHQ',
] satisfies (keyof typeof columnTable)[]

const columnTable = {
  id: 'items."key: #" as id',
  name: '"9: Name" as name',
  iconID: '"10: Icon" as iconID',
  itemLevel: '"11: Level{Item}" as itemLevel',
  isUntradable: '"22: IsUntradable" as isUntradable',
  shopPrice: '"25: Price{Mid}" as shopPrice',
  description: '"8: Description" as description',
  canBeHQ: 'IF("27: CanBeHq" = \'False\', false, true) as canBeHQ',
  classJobCategory: '"43: ClassJobCategory" as classJobCategory',
  equipSlotCategory: '"17: EquipSlotCategory" as equipSlotCategory',
}

type UnionOfColumns<T extends keyof typeof columnTable, D extends boolean> = 
  T | (typeof necessaryQueries[number]) | (D extends true ? typeof defaultQueries[number] : never)

type QueryResult<T extends keyof typeof columnTable, D extends boolean> = {
  [key in UnionOfColumns<T, D>]: string
}

// const query = `select items."key: #" as id, "9: Name" as name, "11: Level{Item}" as itemLevel, "25: Price{Mid}" as shopPrice, "8: Description" as description, IF(shop_items."0: Item" is null, false, true) as inShop, IF("27: CanBeHq" = 'False', false, true) as canBeHQ from items left join ( select "0: Item" from shop_items group by shop_items."0: Item" ) as shop_items on items."key: #" = shop_items."0: Item" where name != '' and "22: IsUntradable" = 'False' and ${Array(words.length).fill('name like ?').join(' and ')}`

export function useQueries(db: ShallowRef<DuckDBClient | null>) {

  function defuList<T extends keyof typeof columnTable, D extends boolean>(columns: T[], defaulQuery?: D){
    const flag = defaulQuery === undefined ? true : defaulQuery
    let list
    if (columns.length > 0) {
      list = [
        ...necessaryQueries,
        ...(flag ? defaultQueries : []),
        ...columns,
      ]
    } else {
      list = [
        ...necessaryQueries,
        ...(flag ? defaultQueries : []),
      ]
    }
    return list
  }

  async function queryExactName<T extends keyof typeof columnTable, D extends boolean = true>(name: string, columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const cols = list.map(it=>columnTable[it])

    // "ilike" is case-insensitive
    const query = `select ${cols.join(', ')} from items where name != '' and name like ?`
    const results = await db.value.query(query, [name])
    return results[0]
  }
  async function queryNames<T extends keyof typeof columnTable, D extends boolean = true>(words: string[], columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>[]> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const cols = list.map(it=>columnTable[it])

    // "ilike" is case-insensitive
    const query = `select ${cols.join(', ')} from items where name != '' and ${Array(words.length).fill('name ilike ?').join(' and ')}`
    return await db.value.query(query, words.map(it => `%${it}%`))
  }
  async function queryIDs<T extends keyof typeof columnTable, D extends boolean = true>(ids: string[] | number[], columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>[]> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const cols = list.map(it=>columnTable[it])

    const query = `select ${cols.join(', ')} from items where name != '' and ${Array(ids.length).fill('id = ?').join(' or ')}`
    return await db.value.query(query, ids)
  }
  async function queryID<T extends keyof typeof columnTable, D extends boolean = true>(id: string | number, columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>[]> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const cols = list.map(it=>columnTable[it])

    const query = `select ${cols.join(', ')} from items where id = ?`
    return (await db.value.query(query, [id]))[0]
  }

  return {
    queryExactName,
    queryNames,
    queryIDs,
    queryID,
  }
}
