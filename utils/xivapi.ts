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

const BASE_EN = 'https://xivapi.com'
const BASE_ZH = 'https://cafemaker.wakingsands.com'

let base: typeof BASE_EN | typeof BASE_ZH = BASE_ZH

export const EndPoint = {
  base() {
    return base
  },
  items(): `${typeof base}/item` {
    return `${base}/item`
  },
}

export function changeBase(type: 'zh' | 'en') {
  switch (type) {
    case 'zh':
      base = BASE_ZH
      return
    case 'en':
      base = BASE_EN
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
