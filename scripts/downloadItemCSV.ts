import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as fflate from 'fflate'

let itemENurl = 'https://raw.githubusercontent.com/InfSein/ffxiv-datamining-mixed/master/en/Item.csv'
let itemCNurl = 'https://raw.githubusercontent.com/InfSein/ffxiv-datamining-mixed/master/chs/Item.csv'

if (process.env.FFXIV_ITEM_EN_URL) {
  console.info(`Item.csv en is pinned to env:FFXIV_ITEM_EN_URL ${itemENurl}`)
  itemENurl = process.env.FFXIV_ITEM_EN_URL
}
if (process.env.FFXIV_ITEM_CN_URL) {
  console.info(`Item.csv cn is pinned to env:FFXIV_ITEM_CN_URL ${itemCNurl}`)
  itemCNurl = process.env.FFXIV_ITEM_CN_URL
}

async function compressDownload(url: string, saveloc: string, filename: string) {
  const buffer = await (await fetch(url)).arrayBuffer()
  const uarray = new Uint8Array(buffer)
  const result = fflate.compressSync(uarray, {
    mtime: new Date(),
    filename,
  })
  await writeFile(path.join(saveloc, filename), result)
}

try {
  const dir = fileURLToPath(new URL('../app/assets/data', import.meta.url))

  await mkdir(dir, { recursive: true })

  console.info(`Downloading ${itemENurl}`)
  await compressDownload(itemENurl, dir, 'Item_compressed.csv')

  console.info(`Downloading ${itemCNurl}`)
  await compressDownload(itemCNurl, dir, 'Item_cn_compressed.csv')
} catch (e) {
  console.error('Caught exception, if it\'s connection issue with github, '
    + 'consider run `node ./scripts/downloadItemCSV.ts` with env `NODE_USE_ENV_PROXY=1`')
  console.error(e)
}
