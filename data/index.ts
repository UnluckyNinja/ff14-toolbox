import { decompressSync } from 'fflate'
import { csvParseRows } from 'd3'

let promise: ReturnType<typeof useFetch<Blob>>

async function loadItemCSV(): Promise<string> {
  if (!promise) {
    promise = useFetch<Blob>('/assets/data/Item_cn_compressed.csv', {
      server: false,
      responseType: 'blob'
    })
  }
  if (process.server) throw ('this code should never be run on server')
  const { data, pending, error } = await promise
  if (!data.value) return ""
  const uarray = new Uint8Array(await data.value.arrayBuffer())
  const result = decompressSync(uarray)
  return await new Blob([result]).text()
}

let data: Record<string, any>[] = []

function parseItemCSV(text: string){
  let lineend0 = text.indexOf('\n') // key,0,1 ...
  let lineend1 = text.indexOf('\n', lineend0+1) // #, Name, ...
  let lineend2 = text.indexOf('\n', lineend1+1) // int,str, ...
  let lineend3 = text.indexOf('\n', lineend2+1) // 0, '', ...
  let idxes = text.slice(0, lineend0).split(',')
  let labels = text.slice(lineend0+1, lineend1).split(',')
  return csvParseRows(text.slice(lineend3+1), (d, i)=>{
    return Object.fromEntries(d.map((it, idx)=>[`${idxes[idx]}: ${labels[idx]}`, it]))
  })
}

export async function loadItemData(){
  if (data.length === 0){
    data = parseItemCSV(await loadItemCSV())
  }
  return data
}

export function getItemData(){
  return data
}
