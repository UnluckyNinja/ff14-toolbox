import type { ShallowRef } from 'vue'
import { AsyncDuckDB, ConsoleLogger, getJsDelivrBundles, selectBundle } from '@duckdb/duckdb-wasm'
import { csvParseRows } from 'd3'
import { decompressSync } from 'fflate'
import item_cn_compressed from '~/assets/data/Item_cn_compressed.csv?url'
import item_en_compressed from '~/assets/data/Item_compressed.csv?url'

async function loadDuckDB() {
  if (!import.meta.client) {
    throw new Error('this code should never be run on server')
  }
  const JSDELIVR_BUNDLES = getJsDelivrBundles()

  // Select a bundle based on browser checks
  const bundle = await selectBundle(JSDELIVR_BUNDLES)

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' }),
  )

  // Instantiate the asynchronous version of DuckDB-wasm
  const worker = new Worker(worker_url)
  const logger = new ConsoleLogger()
  const db = new AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  URL.revokeObjectURL(worker_url)
  return db
}

export interface DuckDBClient {
  db: AsyncDuckDB
  query: (query: string, params?: any[]) => Promise<any[]>
}
let client: ShallowRef<DuckDBClient | null> | null = null

export const useDuckDBStatus = createGlobalState(() => {
  const msg = ref('未加载')
  return {
    msg,
    setStatus: (status: string) => {
      msg.value = status
    },
  }
})

export function useDuckDB() {
  async function queryStream(query: string, params?: any[]) {
    if (!client?.value) {
      return {
        async *readRows() {
        },
      }
    }
    const connection = await client.value.db.connect()
    let reader: any, batch: any
    try {
      if (params && params?.length > 0) {
        const statement = await connection.prepare(query)
        reader = await statement.send(...params)
      }
      else {
        reader = await connection.send(query)
      }
      batch = await reader.next()
      if (batch.done)
        throw new Error('missing first batch')
    }
    catch (error) {
      await connection.close()
      throw error
    }
    return {
      async *readRows() {
        try {
          while (!batch.done) {
            yield batch.value.toArray()
            batch = await reader.next()
          }
        }
        finally {
          await connection.close()
        }
      },
    }
  }

  async function query(query: string, params?: any[]) {
    const result = await queryStream(query, params)
    const results = []
    for await (const rows of result.readRows()) {
      for (const row of rows)
        results.push(row)
    }
    return results
  }

  if (client) return client
  const status = useDuckDBStatus()
  status.setStatus('创建数据库中……')
  client = shallowRef<DuckDBClient | null>(null)
  loadDuckDB().then((db) => {
    status.setStatus('加载游戏数据……')
    return prepareItemData(db)
  }).then((db) => {
    status.setStatus('加载完毕')
    client!.value = {
      db,
      query,
    }
  })
  return client
}

// prepare item data for DuckDB
export async function prepareItemData(db: AsyncDuckDB) {
  const item_cn = parseItemCSV(await loadDataFromURL(item_cn_compressed))
  const item_en = parseItemCSV(await loadDataFromURL(item_en_compressed))
  await feedJSON(db, [{
    name: 'items_cn',
    text: JSON.stringify(item_cn),
  }, {
    name: 'items_en',
    text: JSON.stringify(item_en),
  }])
  return db
}

// insert JSON data into DuckDB
async function feedJSON(db: AsyncDuckDB, json: Array<{ name: string, text: string }>) {
  const c = await db.connect()
  const arr = []
  for (const { name, text } of json) {
    arr.push(Promise.resolve(db.registerFileText(`${name}.json`, text)).then(() => {
      c.insertJSONFromPath(`${name}.json`, { name })
    }))
  }
  await Promise.allSettled(arr)
  await c.close()
}

// async load compressed item.csv file
async function loadDataFromURL(url: string) {
  if (import.meta.server)
    throw (new Error('this code should never be run on server'))

  const blob = await fetch(url)

  const uarray = new Uint8Array(await blob.arrayBuffer())
  const result = decompressSync(uarray)
  const data = await new Blob([result]).text()
  return data
}

// parse item.csv file into column datas
function parseItemCSV(text: string) {
  const lineend0 = text.indexOf('\n') // key,0,1 ...
  const lineend1 = text.indexOf('\n', lineend0 + 1) // #, Name, ...
  const lineend2 = text.indexOf('\n', lineend1 + 1) // int,str, ...
  const lineend3 = text.indexOf('\n', lineend2 + 1) // 0, '', ...
  const idxes = text.slice(0, lineend0).split(',')
  const labels = text.slice(lineend0 + 1, lineend1).split(',')
  const keys = idxes.map((it, idx) => `${it}: ${labels[idx]}`)
  const dataColumns = Object.fromEntries(keys.map(it => [it, [] as any[]]))
  csvParseRows(text.slice(lineend3 + 1), (d) => {
    for (let i = 0; i < d.length; i++) {
      dataColumns[keys[i]].push(d[i])
    }
    return null
  })
  return dataColumns
}
