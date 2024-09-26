import { decompressSync } from 'fflate'
import { csvParseRows } from 'd3'
import item_cn_compressed from '~/assets/data/Item_cn_compressed.csv?url'

async function loadItemCSV(): Promise<string> {
  if (process.server)
    throw (new Error('this code should never be run on server'))

  const blob = await $fetch<Blob>(item_cn_compressed, {
    responseType: 'blob',
  })

  if (!blob)
    return ''
  const uarray = new Uint8Array(await blob.arrayBuffer())
  const result = decompressSync(uarray)
  return await new Blob([result]).text()
}

let data: Record<string, any>[] = []

function parseItemCSV(text: string) {
  const lineend0 = text.indexOf('\n') // key,0,1 ...
  const lineend1 = text.indexOf('\n', lineend0 + 1) // #, Name, ...
  const lineend2 = text.indexOf('\n', lineend1 + 1) // int,str, ...
  const lineend3 = text.indexOf('\n', lineend2 + 1) // 0, '', ...
  const idxes = text.slice(0, lineend0).split(',')
  const labels = text.slice(lineend0 + 1, lineend1).split(',')
  return csvParseRows(text.slice(lineend3 + 1), (d, i) => {
    return Object.fromEntries(d.map((it, idx) => [`${idxes[idx]}: ${labels[idx]}`, it]))
  })
}

export async function loadItemData() {
  if (data.length === 0)
    data = parseItemCSV(await loadItemCSV())

  return data
}

export function getItemData() {
  return data
}
