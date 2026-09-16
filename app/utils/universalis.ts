const overviewIncludedFields = [
  // when multiple items
  'items.listings.pricePerUnit',
  'items.listings.worldName',
  'items.listings.hq',
  'items.currentAveragePrice',
  'items.averagePrice',
  'items.regularSaleVelocity',
  'items.recentHistory.pricePerUnit',
  'items.recentHistory.worldName',
  'items.recentHistory.timestamp',
  'items.recentHistory.hq',
  // when only one item
  'listings.pricePerUnit',
  'listings.worldName',
  'listings.hq',
  'currentAveragePrice',
  'averagePrice',
  'regularSaleVelocity',
  'recentHistory.pricePerUnit',
  'recentHistory.worldName',
  'recentHistory.timestamp',
  'recentHistory.hq',
]

const BASE_EN = 'https://universalis.app/api/v2/'

const base: typeof BASE_EN = BASE_EN

interface EndpointParameters {
  'data-centers': never
  'worlds': never
  'aggregated/{worldDcRegion}/{itemIds}': {
    path: {
      itemIds: (string | number)[]
      worldDcRegion: string
    }
    header?: {
      'User-Agent'?: string
      'CF-Connecting-IP'?: string
    }
  }
  'extra/content/{contentId}': {
    path: {
      contentId: string
    }
  }
  'extra/stats/least-recently-updated': {
    query?: {
      world?: string
      dcName?: string
      entries?: number
    }
  }
  '{worldDcRegion}/{itemIds}': {
    path: {
      itemIds: (string | number)[]
      worldDcRegion: string
    }
    query?: {
      listings?: number // default to all
      entries?: number // default to 5
      hq?: boolean // only HQ or all
      statsWithin?: number // ms, default 7 days
      entriesWithin?: number // s
      fields?: string
    }
    header?: {
      'User-Agent'?: string
      'CF-Connecting-IP'?: string
    }
  }
  'history/{worldDcRegion}/{itemIds}': {
    path: {
      itemIds: (string | number)[]
      worldDcRegion: string
    }
    query?: {
      entriesToReturn?: number // default to 1800
      statsWithin?: number // ms default to 7 days
      entriesWithin?: number // s default to 7 days
      entriesUntil?: string // default to now
      minSalePrice?: number
      maxSalePrice?: number
    }
    header?: {
      'User-Agent'?: string
      'CF-Connecting-IP'?: string
    }
  }
  'tax-rates': {
    query?: {
      world?: string
    }
    header?: {
      'User-Agent'?: string
    }
  }
  'marketable': never
  'extra/stats/most-recently-updated': {
    query?: {
      world?: string
      dcName?: string
      entries?: number
    }
  }
  'extra/stats/recently-updated': never
  'extra/stats/uploader-upload-counts': never
  'extra/stats/world-upload-counts': never
  'extra/stats/upload-history': never
  'lists/{listId}': {
    path: {
      listId: string
    }
  }
}

// type SameKeysWith<Target, Type> = [keyof Target] extends [keyof Type] ? Type : never

// type EndpointResult = SameKeysWith<EndpointParameters, {
interface EndpointResult {
  'data-centers': DataCenter[]
  'worlds': World[]
  'aggregated/{worldDcRegion}/{itemIds}': AggregatedMarketBoardData
  'extra/content/{contentId}': ContentView
  'extra/stats/least-recently-updated': MostRecentlyUpdatedItemsView | ProblemDetails
  '{worldDcRegion}/{itemIds}': CurrentlyShownView | CurrentlyShownMultiViewV2
  'history/{worldDcRegion}/{itemIds}': HistoryView | HistoryMultiViewV2
  'tax-rates': HistoryMultiViewV2 | ProblemDetails
  'marketable': number[]
  'extra/stats/most-recently-updated': MostRecentlyUpdatedItemsView | ProblemDetails
  'extra/stats/recently-updated': RecentlyUpdatedItemsView
  'extra/stats/uploader-upload-counts': SourceUploadCountView[]
  'extra/stats/world-upload-counts': Record<string, WorldUploadCountView>
  'extra/stats/upload-history': UploadCountHistoryView
  'lists/{listId}': UserListView
}

export function fetchUniversalis<T extends keyof EndpointParameters>(endpoint: T, options: EndpointParameters[T]): Promise<EndpointResult[T]> {
  let path = endpoint as string
  if ('path' in options) {
    Object.entries(options.path).forEach(([k, v]) => {
      const str = Array.isArray(v) ? v.join(',') : String(v)
      path = path.replaceAll(`{${k}`, str)
    })
  }
  const url = new URL(path, base)

  let query
  if ('query' in options) {
    query = options.query
  }

  let headers
  if ('header' in options) {
    headers = options.header
  }

  return $fetch<EndpointResult[T]>(url.href, {
    headers,
    query,
  })
}

export async function fetchListings(server: string | number, item: number | string, num = 10, hq?: boolean) {
  // here using this marketCurrently has more options
  const fetchOptions: any = {
    query: {
      fields: ['listings'],
      listings: num,
    },
  }

  if (hq !== undefined)
    fetchOptions.query.hq = hq

  const res = await $fetch<CurrentlyShownView>(Endpoint.marketCurrently(server, item), fetchOptions)
  return res.listings ?? []
}

export async function fetchHistory(server: string | number, item: number | string, num = 10, hq?: boolean) {
  // here using this marketCurrently has more options
  const fetchOptions: any = {
    query: {
      fields: ['recentHistory'],
      entries: num,
    },
  }

  if (hq !== undefined)
    fetchOptions.query.hq = hq

  const res = await $fetch<CurrentlyShownView>(Endpoint.marketCurrently(server, item), fetchOptions)
  return res.recentHistory ?? []
}

export async function fetchMarket(server: string | number, items: string | number, options?: any, num?: number, minimalData?: boolean): Promise<CurrentlyShownView>
export async function fetchMarket(server: string | number, items: readonly string[] | readonly number[], options?: any, num?: number, minimalData?: boolean): Promise<CurrentlyShownMultiViewV2>
export async function fetchMarket(server: string | number, items: string | number | readonly string[] | readonly number[], options?: any, num = 1, minimalData = true) {
  const fetchOptions = {
    query: {
      listings: num,
      entries: num,
      fields: minimalData ? overviewIncludedFields.join(',') : undefined,
      ...options,
    },
  }

  let res

  if (Array.isArray(items))
    // put 0, 1 at the end will make response alway become multi view, and avoid 100 limt lost
    // caller still needs to care about 100 limit though
    res = await $fetch<CurrentlyShownMultiViewV2>(Endpoint.marketCurrently(server, [...items, 0, 1]), fetchOptions)
  else
    res = await $fetch<CurrentlyShownView>(Endpoint.marketCurrently(server, items), options)

  return res
}
