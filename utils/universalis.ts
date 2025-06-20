export interface CurrentlyShownMultiViewV2 {
  // The item IDs that were requested.
  itemIDs?: number[]
  // The item data that was requested, keyed on the item ID.
  items?: Record<string | number, CurrentlyShownView>
  // The ID of the world requested, if applicable.
  worldID?: number // int32
  // The name of the DC requested, if applicable.
  dcName?: string
  // The name of the region requested, if applicable.
  regionName?: string
  // A list of IDs that could not be resolved to any item data.
  unresolvedItems?: number[]
  // The name of the world requested, if applicable.
  worldName?: string
}

export interface CurrentlyShownView {
  // The item ID.
  itemID: number // int32
  // The world ID, if applicable.
  worldID?: number // int32
  // The last upload time for this endpoint, in milliseconds since the UNIX epoch.
  lastUploadTime: number // int64
  // The currently-shown listings.
  listings?: ListingView[]
  // The currently-shown sales.
  recentHistory?: SaleView[]
  // The DC name, if applicable.
  dcName?: string
  // The region name, if applicable.
  regionName?: string
  // The average listing price, with outliers removed beyond 3 standard deviations of the mean.
  currentAveragePrice: number
  // The average NQ listing price, with outliers removed beyond 3 standard deviations of the mean.
  currentAveragePriceNQ: number
  // The average HQ listing price, with outliers removed beyond 3 standard deviations of the mean.
  currentAveragePriceHQ: number
  // The average number of sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
  // This number will tend to be the same for every item, because the number of shown sales is the same and over the same period.
  // This statistic is more useful in historical queries.
  regularSaleVelocity: number
  // The average number of NQ sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
  // This number will tend to be the same for every item, because the number of shown sales is the same and over the same period.
  // This statistic is more useful in historical queries.
  nqSaleVelocity: number
  // The average number of HQ sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
  // This number will tend to be the same for every item, because the number of shown sales is the same and over the same period.
  // This statistic is more useful in historical queries.
  hqSaleVelocity: number
  // The average sale price, with outliers removed beyond 3 standard deviations of the mean.
  averagePrice: number
  // The average NQ sale price, with outliers removed beyond 3 standard deviations of the mean.
  averagePriceNQ: number
  // The average HQ sale price, with outliers removed beyond 3 standard deviations of the mean.
  averagePriceHQ: number
  // The minimum listing price.
  minPrice: number // int32
  // The minimum NQ listing price.
  minPriceNQ: number // int32
  // The minimum HQ listing price.
  minPriceHQ: number // int32
  // The maximum listing price.
  maxPrice: number // int32
  // The maximum NQ listing price.
  maxPriceNQ: number // int32
  // The maximum HQ listing price.
  maxPriceHQ: number // int32
  // A map of quantities to listing counts, representing the number of listings of each quantity.
  stackSizeHistogram?: object
  // A map of quantities to NQ listing counts, representing the number of listings of each quantity.
  stackSizeHistogramNQ?: object
  // A map of quantities to HQ listing counts, representing the number of listings of each quantity.
  stackSizeHistogramHQ?: object
  // The world name, if applicable.
  worldName?: string
  // The last upload times in milliseconds since epoch for each world in the response, if this is a DC request.
  worldUploadTimes?: object
}

export interface HistoryMultiViewV2 {
  // The item IDs that were requested.
  itemIDs?: number[]
  // The item data that was requested, keyed on the item ID.
  items?: Record<string | number, HistoryView>
  // The ID of the world requested, if applicable.
  worldID?: number // int32
  // The name of the DC requested, if applicable.
  dcName?: string
  // The name of the region requested, if applicable.
  regionName?: string
  // A list of IDs that could not be resolved to any item data.
  unresolvedItems?: number[]
  // The name of the world requested, if applicable.
  worldName?: string
}

export interface HistoryView {
  // The item ID.
  itemID: number // int32
  // The world ID, if applicable.
  worldID?: number // int32
  // The last upload time for this endpoint, in milliseconds since the UNIX epoch.
  lastUploadTime: number // int64
  // The historical sales.
  entries?: MinimizedSaleView[]
  // The DC name, if applicable.
  dcName?: string
  // The region name, if applicable.
  regionName?: string
  // A map of quantities to sale counts, representing the number of sales of each quantity.
  stackSizeHistogram?: object
  // A map of quantities to NQ sale counts, representing the number of sales of each quantity.
  stackSizeHistogramNQ?: object
  // A map of quantities to HQ sale counts, representing the number of sales of each quantity.
  stackSizeHistogramHQ?: object
  // The average number of sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
  regularSaleVelocity: number
  // The average number of NQ sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
  nqSaleVelocity: number
  // The average number of HQ sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
  hqSaleVelocity: number
  // The world name, if applicable.
  worldName?: string
}

export interface ListingView {
  // The time that this listing was posted, in seconds since the UNIX epoch.
  lastReviewTime: number // int64
  // The price per unit sold.
  pricePerUnit: number // int32
  // The stack size sold.
  quantity: number // int32
  // The ID of the dye on this item.
  stainID: number // int32
  // The world name, if applicable.
  worldName?: string
  // The world ID, if applicable.
  worldID?: number // int32
  // The creator's character name.
  creatorName?: string
  // A SHA256 hash of the creator's ID.
  creatorID?: string
  // Whether or not the item is high-quality.
  hq: boolean
  // Whether or not the item is crafted.
  isCrafted: boolean
  // A SHA256 hash of the ID of this listing. Due to some current client-side bugs, this will almost always be null.
  listingID?: string
  // The materia on this item.
  materia?: MateriaView[]
  // Whether or not the item is being sold on a mannequin.
  onMannequin: boolean
  // The city ID of the retainer.
  // Limsa Lominsa = 1
  // Gridania = 2
  // Ul'dah = 3
  // Ishgard = 4
  // Kugane = 7
  // Crystarium = 10
  retainerCity: number // int32
  // A SHA256 hash of the retainer's ID.
  retainerID?: string
  // The retainer's name.
  retainerName?: string
  // A SHA256 hash of the seller's ID.
  sellerID?: string
  // The total price.
  total: number // int32
}

export interface SaleView {
  // Whether or not the item was high-quality.
  hq: boolean
  // The price per unit sold.
  pricePerUnit: number // int32
  // The stack size sold.
  quantity: number // int32
  // The sale time, in seconds since the UNIX epoch.
  timestamp: number // int64
  // Whether or not this was purchased from a mannequin. This may be null.
  onMannequin?: boolean
  // The world name, if applicable.
  worldName?: string
  // The world ID, if applicable.
  worldID?: number // int32
  // The buyer name.
  buyerName?: string
  // The total price.
  total: number // int32
}

export interface MinimizedSaleView {
  // Whether or not the item was high-quality.
  hq: boolean
  // The price per unit sold.
  pricePerUnit: number // int32
  // The stack size sold.
  quantity: number // int32
  // The buyer's character name. This may be null.
  buyerName?: string
  // Whether or not this was purchased from a mannequin. This may be null.
  onMannequin?: boolean
  // The sale time, in seconds since the UNIX epoch.
  timestamp: number // int64
  // The world name, if applicable.
  worldName?: string
  // The world ID, if applicable.
  worldID?: number // int32
}

export interface MateriaView {
  // The materia slot.
  slotID: number // int32
  // The materia item ID.
  materiaID: number // int32
}

export interface DataCenter {
  name?: string
  region?: string
  worlds?: number[]
}

export interface World {
  id: number // int32
  name?: string
}

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
