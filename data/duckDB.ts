// import {isArqueroTable} from "./arquero.js";
// import {FileAttachment} from "./fileAttachment.js";
// import {cdn} from "./require.js";

import type { Table } from 'apache-arrow'
import { tableFromJSON } from 'apache-arrow'

import * as duckdb from '@duckdb/duckdb-wasm'

import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

import type { ArrowInsertOptions } from '@duckdb/duckdb-wasm/blocking'
import { getArrowTableSchema, isArrowTable } from './arrow'

// Adapted from https://github.com/observablehq/stdlib/blob/main/src/duckdb.js

// Adapted from https://observablehq.com/@cmudig/duckdb-client
// Copyright 2021 CMU Data Interaction Group
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors
//    may be used to endorse or promote products derived from this software
//    without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

let promise: ReturnType<typeof loadDuckDB>

export class DuckDBClient {
  constructor(private db: duckdb.AsyncDuckDB) {

  }

  async queryStream(query: string, params?: any[]) {
    const connection = await this.db.connect()
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
      schema: getArrowTableSchema(batch.value),
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

  async query(query: string, params?: any[]) {
    const result = await this.queryStream(query, params)
    const results = []
    for await (const rows of result.readRows()) {
      for (const row of rows)
        results.push(row)
    }
    Object.assign(results, { schema: result.schema })
    return results
  }

  static async of(sources: { [key: string]: any } = {}, config: any = {}) {
    const db = await createDuckDB()
    if (config.query?.castTimestampToDate === undefined)
      config = { ...config, query: { ...config.query, castTimestampToDate: true } }

    if (config.query?.castBigIntToDouble === undefined)
      config = { ...config, query: { ...config.query, castBigIntToDouble: true } }

    await db.open(config)
    await Promise.all(
      Object.entries(sources).map(async ([name, source]) => {
        // if (source instanceof Blob) { // originally FileAttachment
        // await insertBlob(db, name, source);
        // } else
        if (isArrowTable(source)) { // bare arrow table
          await insertArrowTable(db, name, source)
        }
        else if (Array.isArray(source)) { // bare array of objects
          await insertArray(db, name, source, [])
        }
        else if ('data' in source) { // data + options
          const { data, ...options } = source
          await insertArray(db, name, data, options)
        }
        else {
          throw new Error(`invalid source: ${source}`)
        }
      }),
    )
    return new DuckDBClient(db)
  }
}

Object.defineProperty(DuckDBClient.prototype, 'dialect', {
  value: 'duckdb',
})

async function insertArrowTable(database: duckdb.AsyncDuckDB, name: string, table: Table, options?: ArrowInsertOptions) {
  const connection = await database.connect()
  try {
    await connection.insertArrowTable(table, {
      name,
      schema: 'main',
      ...options,
    })
  } catch (e){
    console.log(`error: ${e}`)
  }
  finally {
    await connection.close()
  }
}

// async function insertArqueroTable(database, name, source) {
//   // TODO When we have stdlib versioning and can upgrade Arquero to version 5,
//   // we can then call source.toArrow() directly, with insertArrowTable()
//   const arrow = await loadArrow();
//   const table = arrow.tableFromIPC(source.toArrowBuffer());
//   return await insertArrowTable(database, name, table);
// }

async function insertArray(database: duckdb.AsyncDuckDB, name: string, array: any[], options?: any) {
  const connection = await database.connect()
  // const table = tableFromJSON(array)
  try {
    const filename = `${name}.json`
    await database.registerFileText(
      filename,
      JSON.stringify(array),
    );
    await connection.insertJSONFromPath(filename, {
      name,
      // schema: 'main',
      ...options,
    })
  } catch (e){
    console.error(`error when inserting table:`)
    console.error(e)
  }
  finally {
    await connection.close()
  }
  // return await insertArrowTable(database, name, table, options)
}

async function loadDuckDB() {
  const bundle = await duckdb.selectBundle({
    mvp: {
      mainModule: duckdb_wasm,
      mainWorker: mvp_worker,
    },
    eh: {
      mainModule: duckdb_wasm_next,
      mainWorker: eh_worker,
    },
  })
  const logger = new duckdb.ConsoleLogger()
  return { bundle, logger }
}

async function createDuckDB() {
  if (promise === undefined)
    promise = loadDuckDB()
  const { bundle, logger } = await promise
  // const worker = await duckdb.createWorker(bundle.mainWorker!); // error
  const worker = new Worker(bundle.mainWorker!)
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  return db
}

// https://duckdb.org/docs/sql/data_types/overview
function getDuckDBType(type: string) {
  switch (type) {
    case 'BIGINT':
    case 'HUGEINT':
    case 'UBIGINT':
      return 'bigint'
    case 'DOUBLE':
    case 'REAL':
    case 'FLOAT':
      return 'number'
    case 'INTEGER':
    case 'SMALLINT':
    case 'TINYINT':
    case 'USMALLINT':
    case 'UINTEGER':
    case 'UTINYINT':
      return 'integer'
    case 'BOOLEAN':
      return 'boolean'
    case 'DATE':
    case 'TIMESTAMP':
    case 'TIMESTAMP WITH TIME ZONE':
      return 'date'
    case 'VARCHAR':
    case 'UUID':
      return 'string'
    // case "BLOB":
    // case "INTERVAL":
    // case "TIME":
    default:
      if (/^DECIMAL\(/.test(type))
        return 'integer'
      return 'other'
  }
}
