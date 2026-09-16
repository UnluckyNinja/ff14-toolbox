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

/* Endpoint helper */

function endpointBase() {
  return base
}
function dataCenters() {
  return new URL('data-centers', base).href
}
function worlds() {
  return new URL('worlds', base).href
}
function marketCurrently(server: string | number, items: number | string | readonly number[] | readonly string[]) {
  return new URL(`${server}/${Array.isArray(items) ? items.join(',') : items}`, base).href
}
function marketHistory(server: string | number, items: number | string | readonly number[] | readonly string[]) {
  return new URL(`history/${server}/${Array.isArray(items) ? items.join(',') : items}`, base).href
}

export const Endpoint = {
  base: endpointBase,
  dataCenters,
  worlds,
  marketCurrently,
  marketHistory,
}
// listing
// multiple items
// history

export function fetchDataCenters() {
  return $fetch<DataCenter[]>(Endpoint.dataCenters())
}

export function fetchWorlds() {
  return $fetch<World[]>(Endpoint.worlds())
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
