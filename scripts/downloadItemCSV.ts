import * as fs from 'node:fs'
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
  await writeFile(saveloc, result)
}

async function main(args: string[]) {
  const OVERWRITE = args.includes('-f') || args.includes('--force')

  try {
    const dir = fileURLToPath(new URL('../app/assets/data', import.meta.url))

    await mkdir(dir, { recursive: true })
    const file_en = path.join(dir, 'Item_compressed.csv')
    if (OVERWRITE || !fs.existsSync(file_en)) {
      console.info(`Downloading ${itemENurl}`)
      await compressDownload(itemENurl, file_en, 'Item_compressed.csv')
    }

    const file_cn = path.join(dir, 'Item_cn_compressed.csv')
    if (OVERWRITE || !fs.existsSync(file_cn)) {
      console.info(`Downloading ${itemCNurl}`)
      await compressDownload(itemCNurl, file_cn, 'Item_cn_compressed.csv')
    }
  } catch (e) {
    console.error('Caught exception, if it\'s connection issue with github, '
      + 'consider run `node ./scripts/downloadItemCSV.ts` with env `NODE_USE_ENV_PROXY=1`')
    console.error(e)
  }
}

main(process.argv)
