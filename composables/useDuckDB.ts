import { useDuckDB } from '~/lib/duckDB'

export const necessaryQueries = [
  'id',
  'dataSource',
  'name',
] satisfies (keyof typeof columnTable_cn)[]

export const defaultQueries = [
  'iconID',
  'itemLevel',
  'isUntradable',
  // 'shopPrice',
  // 'description',
  'canBeHQ',
] satisfies (keyof typeof columnTable_cn)[]

const columnTable_cn = {
  id: 'items_cn."key: #" as id',
  dataSource: '\'cn\' as dataSource',
  name: 'items_cn."9: Name" as name',
  iconID: 'items_cn."10: Icon" as iconID',
  itemLevel: 'items_cn."11: Level{Item}" as itemLevel',
  isUntradable: 'items_cn."22: IsUntradable" as isUntradable',
  shopPrice: 'items_cn."25: Price{Mid}" as shopPrice',
  description: 'items_cn."8: Description" as description',
  canBeHQ: 'IF(items_cn."27: CanBeHq" = \'False\', false, true) as canBeHQ',
  classJobCategory: 'items_cn."43: ClassJobCategory" as classJobCategory',
  equipSlotCategory: 'items_cn."17: EquipSlotCategory" as equipSlotCategory',
}

const columnTable_en = {
  id: 'items_en."key: #" as id',
  dataSource: '\'en\' as dataSource',
  name: 'items_en."9: Name" as name',
  iconID: 'items_en."10: Icon" as iconID',
  itemLevel: 'items_en."11: Level{Item}" as itemLevel',
  isUntradable: 'items_en."22: IsUntradable" as isUntradable',
  shopPrice: 'items_en."25: Price{Mid}" as shopPrice',
  description: 'items_en."8: Description" as description',
  canBeHQ: 'IF(items_en."27: CanBeHq" = \'False\', false, true) as canBeHQ',
  classJobCategory: 'items_en."43: ClassJobCategory" as classJobCategory',
  equipSlotCategory: 'items_en."17: EquipSlotCategory" as equipSlotCategory',
}

type UnionOfColumns<T extends keyof typeof columnTable_cn, D extends boolean> =
  T | (typeof necessaryQueries[number]) | (D extends true ? typeof defaultQueries[number] : never)

type QueryResult<T extends keyof typeof columnTable_cn, D extends boolean> = {
  [key in UnionOfColumns<T, D>]: string
}

// const query = `select items."key: #" as id, "9: Name" as name, "11: Level{Item}" as itemLevel, "25: Price{Mid}" as shopPrice, "8: Description" as description, IF(shop_items."0: Item" is null, false, true) as inShop, IF("27: CanBeHq" = 'False', false, true) as canBeHQ from items left join ( select "0: Item" from shop_items group by shop_items."0: Item" ) as shop_items on items."key: #" = shop_items."0: Item" where name != '' and "22: IsUntradable" = 'False' and ${Array(words.length).fill('name like ?').join(' and ')}`

export function useQueries() {
  const db = useDuckDB()

  function defuList<T extends keyof typeof columnTable_cn, D extends boolean>(columns: T[], defaulQuery?: D) {
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

  async function queryExactName<T extends keyof typeof columnTable_cn, D extends boolean = true>(name: string, columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const colsCN = list.map(it => columnTable_cn[it])
    const colsEN = list.map(it => columnTable_en[it])

    // "ilike" is case-insensitive
    const queryCN = `SELECT ${colsCN.join(', ')} FROM items_cn WHERE name != '' AND name LIKE ?`
    const queryEN = `SELECT ${colsEN.join(', ')} 
      FROM items_cn RIGHT JOIN items_en 
        ON items_cn."key: #" = items_en."key: #" 
      WHERE (items_cn."key: #" IS NULL OR items_cn."9: Name" = '') AND items_en."9: Name" != '' AND items_en."9: Name" LIKE ?`

    const query = `${queryCN} UNION ALL ${queryEN}`

    const results = await db.value.query(query, [name, name])
    return results[0]
  }

  async function queryNames<T extends keyof typeof columnTable_cn, D extends boolean = true>(words: string[], columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>[]> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const colsCN = list.map(it => columnTable_cn[it])
    const colsEN = list.map(it => columnTable_en[it])

    // "ilike" is case-insensitive
    const queryCN = `SELECT ${colsCN.join(', ')} FROM items_cn WHERE name != '' AND ${new Array(words.length).fill('name ilike ?').join(' and ')}`
    const queryEN = `SELECT ${colsEN.join(', ')} 
      FROM items_cn RIGHT JOIN items_en 
        ON items_cn."key: #" = items_en."key: #" 
      WHERE (items_cn."key: #" IS NULL OR items_cn."9: Name" = '') AND items_en."9: Name" != '' AND ${new Array(words.length).fill('items_en."9: Name" ILIKE ?').join(' and ')}`

    const query = `${queryCN} UNION ALL ${queryEN}`

    const params = words.map(it => `%${it}%`)
    return await db.value.query(query, params.concat(params))
  }

  async function queryIDs<T extends keyof typeof columnTable_cn, D extends boolean = true>(ids: string[] | number[], columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>[]> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const colsCN = list.map(it => columnTable_cn[it])
    const colsEN = list.map(it => columnTable_en[it])

    const queryCN = `SELECT ${colsCN.join(', ')} FROM items_cn WHERE name != '' AND id IN (${new Array(ids.length).fill('?').join(',')})`
    const queryEN = `SELECT ${colsEN.join(', ')} 
      FROM items_cn RIGHT JOIN items_en 
        ON items_cn."key: #" = items_en."key: #" 
      WHERE (items_cn."key: #" IS NULL OR items_cn."9: Name" = '') AND items_en."9: Name" != '' AND items_en."key: #" IN (${new Array(ids.length).fill('?').join(',')})`

    const query = `${queryCN} UNION ALL ${queryEN}`
    return await db.value.query(query, ids.concat(ids))
  }

  async function queryID<T extends keyof typeof columnTable_cn, D extends boolean = true>(id: string | number, columns: T[] = [], defaulQuery?: D): Promise<QueryResult<T, D>[]> {
    if (!db.value)
      throw new Error('No valid DuckDBClient when querying.')

    const list = defuList(columns, defaulQuery)
    const colsCN = list.map(it => columnTable_cn[it])
    const colsEN = list.map(it => columnTable_en[it])

    // const query = `select ${cols.join(', ')} from items where id = ?`

    const queryCN = `SELECT ${colsCN.join(', ')} FROM items_cn where id = ?`
    const queryEN = `SELECT ${colsEN.join(', ')} 
      FROM items_cn RIGHT JOIN items_en 
        ON items_cn."key: #" = items_en."key: #"
      WHERE items_cn."key: #" IS NULL AND items_en."key: #" = ?`

    const query = `${queryCN} UNION ALL ${queryEN}`

    return (await db.value.query(query, [id, id]))[0]
  }

  return {
    queryExactName,
    queryNames,
    queryIDs,
    queryID,
  }
}
