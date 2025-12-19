import { csvParseRows } from 'd3'
import { decompressSync } from 'fflate'
import item_cn_compressed from '~/assets/data/Item_cn_compressed.csv?url'
import item_en_compressed from '~/assets/data/Item_compressed.csv?url'

async function loadItemCSV(fileURL: string): Promise<string> {
  if (import.meta.server)
    throw (new Error('this code should never be run on server'))

  const blob = await $fetch<Blob>(fileURL, {
    responseType: 'blob',
  })

  if (!blob)
    return ''
  const uarray = new Uint8Array(await blob.arrayBuffer())
  const result = decompressSync(uarray)
  return await new Blob([result]).text()
}

let data_cn: Record<string, any>[] = []
let data_en: Record<string, any>[] = []

function parseItemCSV(text: string) {
  const lineend0 = text.indexOf('\n') // key,0,1 ...
  const lineend1 = text.indexOf('\n', lineend0 + 1) // #, Name, ...
  const lineend2 = text.indexOf('\n', lineend1 + 1) // int,str, ...
  const lineend3 = text.indexOf('\n', lineend2 + 1) // 0, '', ...
  const idxes = text.slice(0, lineend0).split(',')
  const labels = text.slice(lineend0 + 1, lineend1).split(',')
  const keys = idxes.map((it, idx) => `${it}: ${labels[idx]}`)

  return csvParseRows(text.slice(lineend3 + 1), (d) => {
    const row: Record<string, any> = {}
    d.forEach((it, idx) => {
      row[keys[idx]] = it
    })
    return row
  })
}

export async function loadItemData() {
  if (data_cn.length === 0)
    data_cn = parseItemCSV(await loadItemCSV(item_cn_compressed))
  if (data_en.length === 0)
    data_en = parseItemCSV(await loadItemCSV(item_en_compressed))

  return {
    cn: data_cn,
    en: data_en,
  }
}
