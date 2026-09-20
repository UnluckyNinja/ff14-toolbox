const ITEMS_PER_PAGE = 50

export function useCombinedData(itemIDs: MaybeRefOrGetter<number[]>, key?: string) {
  const itemData = useXIVAPIData(itemIDs, key)
  const marketData = useAggregatedMarketData(itemIDs, key)

  type ItemValue = NonNullable<typeof itemData.data.value> extends Map<any, infer V> ? V : never
  type MarketValue = NonNullable<typeof marketData.data.value> extends Map<any, infer V> ? V : never

  const map = reactive(new Map<number, ItemValue & {
    nq?: MarketValue['nq']
    hq?: MarketValue['hq']
  }>())

  const stop = watch([itemData.data, marketData.data], () => {
    const ids = toValue(itemIDs)
    map.clear()
    if (!itemData.data.value?.size)
      return
    ids.forEach((id) => {
      const item = itemData.data.value?.get(id)
      const mitem = marketData.data.value?.get(id)

      const result = {
        ...item!,
        nq: mitem?.nq,
        hq: mitem?.hq,
      }

      map.set(id, result)
    })
  })

  tryOnScopeDispose(() => {
    stop()
  })

  return {
    data: map,
    itemData,
    marketData,
  }
}

export function useXIVAPIData(itemIDs: MaybeRefOrGetter<number[]>, key?: string) {
  const toast = useToast()

  const promise = useAsyncData(() => `xivapi-item-data:${key ?? toValue(itemIDs).join(',')}`, async (_nuxtApp, { signal }) => {
    if (signal.aborted) {
      return null
    }
    const ids = toValue(itemIDs)
    if (ids.length === 0) {
      return
    }

    const results = await fetchItems(ids).catch((e) => {
      toast.add({ title: '请求 xivapi 数据失败，请检查网络', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
      return null
    })

    if (!results) {
      return null
    }

    // fast fail if it's changed to another list of items
    if (toValue(itemIDs) !== ids)
      return null

    const itemData = new Map<number, {
      id: number
      name: string
      iconURL: string
      canBeHQ: boolean
    }>()

    ids.forEach((id) => {
      const item: XAItem | undefined = results.find((it) => {
        return it.row_id === id
      })
      // @TODO migrate fallback to xivapi v2
      if (!item || !item.fields.Name) {
        //   if (!fallbackItems[id]) {
        itemData.set(id, { id, name: `API未返回有效数据 ${id}`, iconURL: '', canBeHQ: false })
        return
        //   }
        //   item = fallbackItems[id]
      }
      const _item = {
        id: item.row_id,
        name: item.fields.Name,
        iconURL: itemIconUrl(item.fields.Icon.id),
        canBeHQ: item.fields.CanBeHq,
      }
      itemData.set(id, _item)
    })
    return itemData
  }, {
    watch: [() => toValue(itemIDs)],
  })

  return promise
}

export function useAggregatedMarketData(itemIDs: MaybeRefOrGetter<number[]>, key?: string) {
  const settings = reactive(useSettings())

  const toast = useToast()

  function batchFetch(ids: number[]) {
    if (ids.length === 0) {
      return null
    }
    const promise = fetchUniversalis('aggregated/{worldDcRegion}/{itemIds}', {
      path: {
        worldDcRegion: settings.selectedServer,
        itemIds: ids,
      },
    }).catch((e) => {
      toast.add({ title: '请求 Universalis 数据失败，请检查网络', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
      return null
    })

    return promise
  }

  const promise = useAsyncData(() => `aggregated-market-data:${key ?? toValue(itemIDs).join(',')}`, async (_nuxtApp, { signal }) => {
    if (signal.aborted) {
      return null
    }
    const ids = toValue(itemIDs)
    if (ids.length === 0) {
      return
    }
    const marketData = new Map<number, Result>()
    const toFetch = ids.slice(0)
    for (let i = 0; i < ids.length / ITEMS_PER_PAGE; i++) {
      const data = await batchFetch(toFetch.splice(0, ITEMS_PER_PAGE))
      if (toValue(itemIDs) !== ids) // fast fail if it is changed to another list of items
        return
      if (!data) return
      data.results?.forEach((item) => {
        marketData.set(item.itemId, item)
      })
    }
    return marketData
  }, {
    watch: [() => toValue(itemIDs), () => settings.selectedServer],
  })

  return promise
}
