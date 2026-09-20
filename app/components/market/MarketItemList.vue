<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { useAggregatedMarketData, useXIVAPIData } from '~/composables/market'

const props = withDefaults(defineProps<{
  ids: number[]
  costs?: Record<string, number>
  costMode?: boolean
}>(), {
  costMode: false,
})

// MARK: properties
const displayCost = computed(() => {
  return !!props.costs
})

const { getWorldName } = useServerInfo()

const toast = useToast()

const itemData = useXIVAPIData(() => props.ids)
const marketData = useAggregatedMarketData(() => props.ids)
const isFetching = computed(() => itemData.pending.value || marketData.pending.value)

const maximumFractionDigits = computed(() => props.costMode ? 2 : 0)

// MARK: accessors & data transform

function getItem(id: number) {
  return itemData.data.value?.get(id)
}
function getMarketItem(id: number) {
  return marketData.data.value?.get(id)
}

function getCost(id: number) {
  return props.costs?.[id] ?? 1
}

function getCostFactor(id: number) {
  return props.costMode ? props.costs?.[id] ?? 1 : 1
}

type Listing = MinListing
  | RecentPurchase
  | AverageSalePrice
  | DailySaleVelocity

function extractValue(listing: Listing | undefined) {
  const obj = listing?.world ?? listing?.dc ?? listing?.region
  if (!obj) {
    return -1
  }
  if (!('price' in obj)) {
    return obj.quantity
  }

  return obj.price
}

function getValidMinValue(nq: number, hq: number) {
  if (nq < 0) return hq
  if (hq < 0) return nq
  return Math.min(nq, hq)
}

function toRowValue(listing: Listing | undefined, hq?: boolean, cost = 1) {
  const obj = listing?.world ?? listing?.dc ?? listing?.region
  const value = extractValue(listing) / cost
  return { value, worldName: getWorldName(obj?.worldId), hq }
}

function toCardArray(id: number, mode: keyof AggregatedResult) {
  const item = itemData.data.value?.get(id)
  if (!item) return []
  const mitem = marketData.data.value?.get(id)
  if (!mitem) return []
  const factor = mode === 'dailySaleVelocity' ? 1 : getCostFactor(id)

  if (item.canBeHQ) {
    return [
      toRowValue(mitem.hq[mode], true, factor),
      toRowValue(mitem.nq[mode], false, factor),
    ]
  }
  return [
    toRowValue(mitem.nq[mode], false, factor),
  ]
}

// MARK: table columns

const columns: TableColumn<number>[] = [
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
    accessorFn: (id) => {
      const cost = getCostFactor(id)
      const mitem = getMarketItem(id)
      if (!mitem) return -1
      return getValidMinValue(extractValue(mitem.nq?.minListing) / cost, extractValue(mitem.hq?.minListing) / cost)
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
    accessorFn: (id) => {
      const cost = getCostFactor(id)
      const mitem = getMarketItem(id)
      if (!mitem) return -1
      return getValidMinValue(extractValue(mitem.nq?.recentPurchase) / cost, extractValue(mitem.hq?.recentPurchase) / cost)
    },
    header: ({ column }) => getHeader(column, '最近成交'),
  },
  {
    id: 'averagePrice',
    accessorFn: (id) => {
      const cost = getCostFactor(id)
      const mitem = getMarketItem(id)
      if (!mitem) return -1
      return getValidMinValue(extractValue(mitem.nq?.averageSalePrice) / cost, extractValue(mitem.hq?.averageSalePrice) / cost)
    },
    header: ({ column }) => getHeader(column, '平均成交价'),
  },
  {
    id: 'dailySaleVelocity',
    accessorFn: (id) => {
      const mitem = getMarketItem(id)
      if (!mitem) return -1
      return getValidMinValue(extractValue(mitem.nq?.dailySaleVelocity), extractValue(mitem.hq?.dailySaleVelocity))
    },
    header: ({ column }) => getHeader(column, '平均日销量'),
  },
]

// MARK: custom table header
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
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

// MARK: event handlers
function copyText(text: string | number | undefined) {
  if (text === undefined) {
    return
  }
  if (copy(`${text}`))
    toast.add({ title: '已复制', duration: 2000 })
}
// :virtualize="props.scrollMargin === undefined ? undefined : { scrollMargin: props.scrollMargin, getScrollElement }"
</script>

<template>
  <UTable
    sticky
    :data="ids" :columns="columns" :loading="isFetching"
  >
    <template #loading>
      <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
      <div>
        {{ `物品数据 ${itemData.pending ? '⌛️' : '✔️'}，\
            市场数据 ${marketData.pending ? '⌛️' : '✔️'}` }}
      </div>
    </template>
    <template #empty>
      <UIcon name="i-carbon-circle-dash" />
      <div>
        空
      </div>
    </template>
    <!-- MARK: 图标 -->
    <template #icon-cell="{ row }">
      <UniImage class="h-12 w-12 inline-block" :src="getItem(row.original)?.iconURL ?? ''" alt="" :title="`ID: ${row.original}`" />
    </template>
    <!-- MARK: 物品名菜单 -->
    <template #name-cell="{ row }">
      <UPopover>
        <UButton block color="neutral" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost">
          <div class="text-left w-full">
            <div class="whitespace-normal">
              {{ getItem(row.original)?.name }}
            </div>
            <div v-if="displayCost" class="text-xs text-gray mt-1">
              兑换价格：{{ getCost(row.original).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
            </div>
          </div>
        </UButton>
        <template #content>
          <div class="border-accented border rounded-lg">
            <UButton class="cursor-pointer" block color="neutral" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.original)">
              <div class="text-left w-full">
                ID: {{ row.original }}
              </div>
            </UButton>
            <UButton class="cursor-pointer" block color="neutral" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(getItem(row.original)?.name)">
              <div class="text-left w-full">
                {{ getItem(row.original)?.name }}
              </div>
            </UButton>
            <USeparator class="my-2" />
            <UButton v-for="link, i in getLinks(row.original, getItem(row.original)?.name ?? '')" :key="i" block color="neutral" variant="link" :to="link.url" target="_blank" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid">
              <div class="text-sm w-full">
                {{ link.label }}
              </div>
            </UButton>
          </div>
        </template>
      </UPopover>
    </template>
    <!-- MARK: 最低价 -->
    <template #lowestPrice-cell="{ row }">
      <div v-if="marketData.pending.value" class="i-heroicons:ellipsis-horizontal m-auto animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="当前最低价"
          :rows="toCardArray(row.original, 'minListing')"
          :maximum-fraction-digits
          :pad-right="maximumFractionDigits"
          :item-i-d="row.original"
          popup-market="listing"
          unit=""
        />
      </div>
    </template>
    <!-- 最低价 end -->
    <!-- MARK: 最近成交 -->
    <template #recentPrice-cell="{ row }">
      <div v-if="marketData.pending.value" class="i-heroicons-ellipsis-horizontal m-auto animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="最近成交"
          :rows="toCardArray(row.original, 'recentPurchase')"
          :maximum-fraction-digits
          :pad-right="maximumFractionDigits"
          :item-i-d="row.original"
          popup-market="history"
          unit=""
        />
      </div>
    </template>
    <!-- 最近成交 end -->
    <!-- MARK: 平均成交价 -->
    <template #averagePrice-cell="{ row }">
      <div v-if="marketData.pending.value" class="i-heroicons-ellipsis-horizontal m-auto animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="平均成交价"
          :rows="toCardArray(row.original, 'averageSalePrice')"
          :maximum-fraction-digits
          :pad-right="maximumFractionDigits"
          unit=""
        />
      </div>
    </template>
    <!-- 平均成交价 end -->
    <!-- MARK: 平均日销量 -->
    <template #dailySaleVelocity-cell="{ row }">
      <div v-if="marketData.pending.value" class="i-heroicons-ellipsis-horizontal m-auto animate-pulse" />
      <div v-else class="text-right min-w-max">
        <MarketPriceCard
          label="平均日销量"
          :rows="toCardArray(row.original, 'dailySaleVelocity')"
          :maximum-fraction-digits="2"
          :pad-right="0"
        />
      </div>
    </template>
    <!-- 平均日销量 end -->
  </UTable>
</template>

<style lang="postcss" scoped>

</style>
