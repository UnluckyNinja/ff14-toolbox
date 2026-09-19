<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { notNullish } from '@vueuse/core'

const props = withDefaults(defineProps<{
  ids: number[]
  costs?: Record<string, number>
  costMode?: boolean
}>(), {
  costMode: false,
})

// import { fallbackItems } from '~/data/xivapiFallback'

const ITEMS_PER_PAGE = 50

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const displayCost = computed(() => {
  return !!props.costs
})

const marketData = reactive(new Map<number, Result>())
const itemsData = ref<({
  id: number
  name: string
  iconURL: string
  canBeHQ: boolean
} | null)[]>([])

const settings = reactive(useSettings())
const { getWorldName } = useServerInfo()

const toast = useToast()

const isFetchingMarket = ref(false)
const isFetchingXIV = ref(false)
const isFetching = computed(() => isFetchingMarket.value || isFetchingXIV.value)

// fetch prices from universalis into `marketData`
watch([() => props.ids, () => settings.selectedServer], async ([newIDs, newServer]) => {
  if (newIDs.length === 0) {
    marketData.clear()
    return
  }
  isFetchingMarket.value = true
  marketData.clear()
  const toFetch = newIDs.slice(0)
  async function batchAdd(ids: number[]) {
    const promise = fetchUniversalis('aggregated/{worldDcRegion}/{itemIds}', {
      path: {
        worldDcRegion: newServer,
        itemIds: ids,
      },
    }).catch((e) => {
      toast.add({ title: '请求 Universalis 数据失败，请检查网络', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
      return null
    })
    const data = await promise

    if (data === null)
      return

    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return

    data.results?.forEach((item) => {
      marketData.set(item.itemId, item)
    })
  }

  for (let i = 0; i < newIDs.length / ITEMS_PER_PAGE; i++) {
    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return
    await batchAdd(toFetch.splice(0, ITEMS_PER_PAGE))
  }

  isFetchingMarket.value = false
}, { immediate: true })

// fetch item info from xivapi/thewakingsands into `items`
watch(() => props.ids, async (newVal) => {
  itemsData.value.splice(0)

  if (newVal.length === 0) {
    return
  }

  isFetchingXIV.value = true

  const results = await fetchItems(newVal)

  if (props.ids !== newVal)
    return

  itemsData.value = newVal.map((id) => {
    const item: XAItem | undefined = results.find((it) => {
      return it.row_id === id
    })
    // @TODO migrate fallback to xivapi v2
    if (!item || !item.fields.Name) {
    //   if (!fallbackItems[id]) {
      return { id, name: `API未返回有效数据 ${id}`, iconURL: '', canBeHQ: false }
    //   }
    //   item = fallbackItems[id]
    }
    return {
      id: item.row_id,
      name: item.fields.Name,
      iconURL: itemIconUrl(item.fields.Icon.id),
      canBeHQ: item.fields.CanBeHq,
    }
  })

  isFetchingXIV.value = false
}, { immediate: true })

// generate data for table
const data = computed(() => {
  if (itemsData.value.length === 0 || isFetching.value)
    return []
  // if (marketData.value.length !== items.value.length)

  // console.log('[FF14工具] 市场数据条目数量和传入数据对不上，可能会显示错误数据')

  return itemsData.value.map((item) => {
    if (!item)
      return null

    const mitem = marketData.get(item.id)

    const cost = props.costs?.[item.id] ?? 1
    const factor = props.costMode ? cost : 1
    const result = {
      ...item,
      nq: mitem
        ? {
            minListing: toRowValue(mitem.nq.minListing, false, factor),
            recentPurchase: toRowValue(mitem.nq.recentPurchase, false, factor),
            averageSalePrice: toRowValue(mitem.nq.averageSalePrice, false, factor),
            dailySaleVelocity: toRowValue(mitem.nq.dailySaleVelocity, false, factor),
          }
        : undefined,
      hq: mitem
        ? {
            minListing: toRowValue(mitem.hq.minListing, true, factor),
            recentPurchase: toRowValue(mitem.hq.recentPurchase, true, factor),
            averageSalePrice: toRowValue(mitem.hq.averageSalePrice, true, factor),
            dailySaleVelocity: toRowValue(mitem.hq.dailySaleVelocity, true, factor),
          }
        : undefined,
      cost,
    }

    return result
  }).filter(notNullish)
})

type Listing = MinListing
  | RecentPurchase
  | AverageSalePrice
  | DailySaleVelocity

// helper
function toRowValue(listing: Listing | undefined, hq?: boolean, cost = 1) {
  const obj = listing?.world ?? listing?.dc ?? listing?.region
  return obj
    ? 'price' in obj
      ? { value: obj.price / cost, worldName: getWorldName(obj.worldId), hq }
      : { value: obj.quantity, worldName: getWorldName(obj.worldId), hq }
    : { value: -1, worldName: undefined, hq }
}

function getValidMinValue(nq: number, hq: number) {
  if (nq < 0) return hq
  if (hq < 0) return nq
  return Math.min(nq, hq)
}

const columns: TableColumn<typeof data.value[number]>[] = [
  {
    id: 'icon',
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: '物品名',
  },
  {
    id: 'lowestPrice',
    accessorFn: (item) => {
      return getValidMinValue(item.nq?.minListing.value ?? -1, item.hq?.minListing.value ?? -1)
    },
    header: ({ column }) => getHeader(column, '当前最低价'),
  },
  // // Aggreated results doesn't have similar field
  // {
  //   id: 'currentAveragePrice',
  //   accessorKey: 'currentAveragePrice',
  //   header: ({ column }) => getHeader(column, '平均标价'),
  // },
  {
    id: 'recentPrice',
    accessorFn: (item) => {
      return getValidMinValue(item.nq?.recentPurchase.value ?? -1, item.hq?.recentPurchase.value ?? -1)
    },
    header: ({ column }) => getHeader(column, '最近成交'),
  },
  {
    id: 'averagePrice',
    accessorFn: (item) => {
      return getValidMinValue(item.nq?.averageSalePrice.value ?? -1, item.hq?.averageSalePrice.value ?? -1)
    },
    header: ({ column }) => getHeader(column, '平均成交价'),
  },
  {
    id: 'regularSaleVelocity',
    accessorFn: (item) => {
      return getValidMinValue(item.nq?.dailySaleVelocity.value ?? -1, item.hq?.dailySaleVelocity.value ?? -1)
    },
    header: ({ column }) => getHeader(column, '出货速率'),
  },
]

function getHeader(column: any, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      'content': {
        align: 'start',
      },
      'aria-label': 'Actions dropdown',
      'items': [
        {
          label: '升序',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          },
        },
        {
          label: '降序',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        'color': 'neutral',
        'variant': 'ghost',
        label,
        'icon': isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        'class': '-mx-2.5 data-[state=open]:bg-elevated',
        'aria-label': `排序为 ${isSorted === 'asc' ? '升序' : '降序'}`,
      }),
  )
}

const maximumFractionDigits = computed(() => props.costMode ? 2 : 0)

function copyText(text: string | number) {
  if (copy(`${text}`))
    toast.add({ title: '已复制', duration: 2000 })
}

function toCardArray(row: typeof data.value[number]) {
  if (row.canBeHQ) {
    if (!row.nq && !row.hq) {
      return undefined
    }
    return [row.nq, row.hq]
  }
  if (!row.nq) {
    return undefined
  }
  return [row.nq]
}
</script>

<template>
  <UTable
    :data="data" :columns="columns" :loading="isFetching"
  >
    <template #loading>
      <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
      <div>
        {{ `物品数据 ${isFetchingXIV ? '⌛️' : '✔️'}，\
            市场数据 ${isFetchingMarket ? '⌛️' : '✔️'}` }}
      </div>
    </template>
    <template #empty>
      <UIcon name="i-carbon-circle-dash" />
      <div>
        空
      </div>
    </template>
    <!-- 图标 -->
    <template #icon-cell="{ row }">
      <UniImage class="min-h-12 min-w-12 inline-block" :src="row.original.iconURL" alt="" :title="`ID: ${row.original.id}`" />
    </template>
    <!-- 物品名 -->
    <template #name-cell="{ row }">
      <UPopover>
        <UButton block color="neutral" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost">
          <div class="text-left w-full">
            <div class="whitespace-normal">
              {{ row.original.name }}
            </div>
            <div v-if="displayCost" class="text-xs text-gray mt-1">
              兑换价格：{{ row.original.cost.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
            </div>
          </div>
        </UButton>
        <template #content>
          <div class="border-accented border rounded-lg">
            <UButton class="cursor-pointer" block color="neutral" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.original.id)">
              <div class="text-left w-full">
                ID: {{ row.original.id }}
              </div>
            </UButton>
            <UButton class="cursor-pointer" block color="neutral" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.original.name)">
              <div class="text-left w-full">
                {{ row.original.name }}
              </div>
            </UButton>
            <USeparator class="my-2" />
            <UButton v-for="link, i in getLinks(row.original.id, row.original.name)" :key="i" block color="neutral" variant="link" :to="link.url" target="_blank" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid">
              <div class="text-sm w-full">
                {{ link.label }}
              </div>
            </UButton>
          </div>
        </template>
      </UPopover>
    </template>
    <!-- 最低价 -->
    <template #lowestPrice-cell="{ row }">
      <div v-if="isFetching" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="当前最低价"
          :rows="toCardArray(row.original)?.map(it => it?.minListing)"
          :maximum-fraction-digits
          :pad-right="maximumFractionDigits"
          :item-i-d="row.original.id"
          popup-market="listing"
          unit=""
        />
      </div>
    </template>
    <!-- 最低价 end -->
    <!-- 最近成交 -->
    <template #recentPrice-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="最近成交"
          :rows="toCardArray(row.original)?.map(it => it?.recentPurchase)"
          :maximum-fraction-digits
          :pad-right="maximumFractionDigits"
          :item-i-d="row.original.id"
          popup-market="history"
          unit=""
        />
      </div>
    </template>
    <!-- 最近成交 end -->
    <!-- 平均成交价 -->
    <template #averagePrice-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="平均成交价"
          :rows="toCardArray(row.original)?.map(it => it?.averageSalePrice)"
          :maximum-fraction-digits
          :pad-right="maximumFractionDigits"
          unit=""
        />
      </div>
    </template>
    <!-- 平均成交价 end -->
    <!-- 出货速率 -->
    <template #regularSaleVelocity-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="平均日销量"
          :rows="toCardArray(row.original)?.map(it => it?.dailySaleVelocity)"
          :maximum-fraction-digits="2"
          :pad-right="0"
        />
      </div>
    </template>
    <!-- 出货速率 end -->
  </UTable>
</template>

<style lang="postcss" scoped>

</style>
