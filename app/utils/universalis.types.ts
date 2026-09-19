export interface ProblemDetails {
  type?: string
  title?: string
  status?: number // int32
  detail?: string
  instance?: string
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
  // The average listing price.
  currentAveragePrice: number
  // The average NQ listing price.
  currentAveragePriceNQ: number
  // The average HQ listing price.
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
  // The average sale price.
  averagePrice: number
  // The average NQ sale price.
  averagePriceNQ: number
  // The average HQ sale price.
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
  // The number of listings retrieved for the request. When using the "listings" limit parameter, this may be
  // different from the number of sale entries returned in an API response.
  listingsCount: number // int32
  // The number of sale entries retrieved for the request. When using the "entries" limit parameter, this may be
  // different from the number of sale entries returned in an API response.
  recentHistoryCount: number // int32
  // The number of items (not listings) up for sale.
  unitsForSale: number // int32
  // The number of items (not sale entries) sold over the retrieved sales.
  unitsSold: number // int32
  // Whether this item has ever been updated. Useful for newly-released items.
  hasData: boolean
}

export interface ContentView {
  // The content ID of the object.
  contentID?: string
  // The content type of this object.
  contentType?: string
  // The character name associated with this character object, if this is one.
  characterName?: string
}

export interface MostRecentlyUpdatedItemsView {
  // A list of item upload information in timestamp-descending order.
  items?: WorldItemRecencyView[]
}

export interface RecentlyUpdatedItemsView {
  // A list of item IDs, with the most recent first.
  items?: number[]
}

export interface SourceUploadCountView {
  // The name of the client application.
  sourceName?: string
  // The number of uploads originating from the client application.
  uploadCount: number
}

export interface UploadCountHistoryView {
  // The list of upload counts per day, over the past 30 days.
  uploadCountByDay?: number[]
}

export interface WorldItemRecencyView {
  // The item ID.
  itemID: number // int32
  // The last upload time for the item on the listed world.
  lastUploadTime: number
  // The world ID.
  worldID: number // int32
  // The world name.
  worldName?: string
}

export interface WorldUploadCountView {
  // The number of times an upload has occurred on this world.
  count: number
  // The proportion of uploads on this world to the total number of uploads.
  proportion: number
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
  // The ID of this listing.
  listingID?: string
  // The materia on this item.
  materia?: MateriaView[]
  // Whether or not the item is being sold on a mannequin.
  onMannequin: boolean
  // The city ID of the retainer. This is a game ID; all possible values can be seen at
  // https://xivapi.com/Town.
  //
  // Limsa Lominsa = 1
  // Gridania = 2
  // Ul'dah = 3
  // Ishgard = 4
  // Kugane = 7
  // Crystarium = 10
  // Old Sharlayan = 12
  retainerCity: number // int32
  // The retainer's ID.
  retainerID?: string
  // The retainer's name.
  retainerName?: string
  // A SHA256 hash of the seller's ID.
  sellerID?: string
  // The total price.
  total: number // int32
  // The Gil sales tax (GST) to be added to the total price during purchase.
  tax: number // int32
}

export interface MateriaView {
  // The materia slot.
  slotID: number // int32
  // The materia item ID.
  materiaID: number // int32
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

export interface TaxRatesView {
  // The percent retainer tax in Limsa Lominsa.
  'Limsa Lominsa': number // int32
  // The percent retainer tax in Gridania.
  'Gridania': number // int32
  // The percent retainer tax in Ul'dah.
  'Ul\'dah': number // int32
  // The percent retainer tax in Ishgard.
  'Ishgard': number // int32
  // The percent retainer tax in Kugane.
  'Kugane': number // int32
  // The percent retainer tax in the Crystarium.
  'Crystarium': number // int32
  // The percent retainer tax in Old Sharlayan.
  'Old Sharlayan': number // int32
  // The percent retainer tax in Tuliyollal.
  'Tuliyollal': number // int32
}

export interface AggregatedMarketBoardData {
  results?: Result[]
  failedItems?: number[]
}

export interface AggregatedResult {
  minListing: MinListing
  // medianListing: MedianListing // actually not implemented in universalis
  recentPurchase: RecentPurchase
  averageSalePrice: AverageSalePrice
  dailySaleVelocity: DailySaleVelocity
}

export interface AverageSalePrice {
  world?: AverageSalePriceEntry
  dc?: AverageSalePriceEntry
  region?: AverageSalePriceEntry
}

export interface AverageSalePriceEntry {
  worldId: undefined
  price: number
}

export interface DailySaleVelocity {
  world?: DailySaleVelocityEntry
  dc?: DailySaleVelocityEntry
  region?: DailySaleVelocityEntry
}

export interface DailySaleVelocityEntry {
  worldId: undefined
  quantity: number
}

export interface MedianListing {
  world?: MedianListingEntry
  dc?: MedianListingEntry
  region?: MedianListingEntry
}

export interface MedianListingEntry {
  price: number // int32
}

export interface MinListing {
  world?: MinListingEntry
  dc?: MinListingEntry
  region?: MinListingEntry
}

export interface MinListingEntry {
  price: number // int32
  worldId?: number // int32
}

export interface RecentPurchase {
  world?: RecentPurchaseEntry
  dc?: RecentPurchaseEntry
  region?: RecentPurchaseEntry
}

export interface RecentPurchaseEntry {
  price: number // int32
  timestamp: number // int64
  worldId?: number // int32
}

export interface Result {
  itemId: number // int32
  nq: AggregatedResult
  hq: AggregatedResult
  worldUploadTimes?: WorldUploadTime[]
}

export interface WorldUploadTime {
  worldId: number // int32
  timestamp: number // int64
}

export interface CurrentlyShownMultiViewV2 {
  // The item IDs that were requested.
  itemIDs?: number[]
  // The item data that was requested, keyed on the item ID.
  items?: Record<string, CurrentlyShownView>
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

export interface HistoryMultiViewV2 {
  // The item IDs that were requested.
  itemIDs?: number[]
  // The item data that was requested, keyed on the item ID.
  items?: Record<string, HistoryView>
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

export interface UserListView {
  // The list's ID.
  id?: string
  // The time that this list was created, in milliseconds since the UNIX epoch.
  created?: string
  // The time that this list was updated, in milliseconds since the UNIX epoch.
  updated?: string
  // The name of this list.
  name?: string
  // The IDs of the list items.
  itemIDs?: number[]
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
