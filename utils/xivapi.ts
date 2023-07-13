export interface XAContent<T> {
  Pagination: {
    Page: number
    PageNext: number | null
    PagePrev: number | null
    PageTotal: number
    Results: number
    ResultsPerPage: number
    ResultsTotal: number
  }
  Results: T[]
}

export interface XAItem {
  ID: number
  Icon: string // URL
  Name: string
  Url: string // URL
}

export const BASE_EN = 'https://xivapi.com'
export const BASE_ZH = 'https://cafemaker.wakingsands.com'

const base = useState('xivapi-base', () => BASE_ZH)

function endpointBase() {
  return base.value
}
function items() {
  return new URL('item', base.value).href
}

export const EndPoint = {
  base: endpointBase,
  items,
}

export function changeBase(type: 'zh' | 'en') {
  switch (type) {
    case 'zh':
      base.value = BASE_ZH
      return
    case 'en':
      base.value = BASE_EN
      return // eslint-disable-line no-useless-return
  }
}

export async function fetchItems<T extends string | number>(ids: T[]): Promise<XAItem[]> {
  // docs on $fetch: https://github.com/unjs/ofetch
  const json = await $fetch<XAContent<XAItem>>(EndPoint.items(), {
    query: {
      ids: ids.join(','),
      limit: ids.length,
    },
  })
  return json.Results
}

export function itemIconUrl(iconID: string | number, base = BASE_ZH) {
  const _id = `${iconID}`.padStart(6, '0')
  const folder = _id.substring(0, 3).padEnd(6, '0')
  return `${base}/i/${folder}/${_id}.png`
}

export function itemUrl(id: string | number, base = BASE_ZH) {
  return `${base}/item/${id}`
}

export const failedIcons = useState('failed-icons', () => new Set<number | string>())
