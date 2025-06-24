<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { formatTimeAgo, notNullish } from '@vueuse/core'
import { fallbackItems } from '~/data/xivapiFallback'

const props = withDefaults(defineProps<{
  ids: number[]
  costs?: Record<string, number>
  costMode?: boolean
}>(), {
  costMode: false,
})

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const displayCost = computed(() => {
  return !!props.costs
})

const marketData = ref<any[]>([])
const itemsData = ref<({
  id: number
  name: string
  iconURL: string
} | null)[]>([])

const settings = reactive(useSettings())

const toast = useToast()

const isFetchingMarket = ref(false)
const isFetchingXIV = ref(false)
const isFetching = computed(() => isFetchingMarket.value || isFetchingXIV.value)

const { base } = useXABase()

// fetch prices from universalis into `marketData`
watch([() => props.ids, () => settings.selectedServer], async ([newIDs, newServer]) => {
  if (newIDs.length === 0) {
    marketData.value = []
    return
  }
  isFetchingMarket.value = true
  marketData.value = []
  const toFetch = newIDs.slice(0)
  async function batchAdd(ids: number[]) {
    const promise = fetchMarket(newServer, ids).catch((e) => {
      toast.add({ title: '请求 Universalis 数据失败，请检查网络', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
      return null
    })
    const data = await promise

    if (data === null)
      return

    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return

    // if (ids.length > 1)
    marketData.value.push(...ids.map(it => data.items?.[it]))
    // else
    //   marketData.value.push(data)
  }

  for (let i = 0; i < newIDs.length / 100; i++) {
    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return
    await batchAdd(toFetch.splice(0, 100))
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
    let item: { ID: number, Name: string, Icon: string } | undefined = results.find((it) => {
      return it.ID === id
    })
    if (!item) {
      if (!fallbackItems[id]) {
        return null
      }
      item = fallbackItems[id]
    }
    return {
      id: item.ID,
      name: item.Name,
      iconURL: item.Icon,
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

  return itemsData.value.map((item, idx) => {
    if (!item)
      return null

    const mitem = marketData.value[idx]
    const cost = props.costs?.[item.id]
    const result = {
      ...item,
      cost: props.costs ? props.costs[item.id] : 1,
      currentAveragePrice: mitem?.currentAveragePrice ?? -1,
      averagePrice: mitem?.averagePrice ?? -1,
      regularSaleVelocity: mitem?.regularSaleVelocity ?? -1,
      lowestPrice: mitem?.listings[0]?.pricePerUnit ?? -1,
      lowestWorld: mitem?.listings[0]?.worldName ?? '',
      lowestHQ: mitem?.listings[0]?.hq ?? false,
      recentPrice: mitem?.recentHistory[0]?.pricePerUnit ?? -1,
      recentWorld: mitem?.recentHistory[0]?.worldName ?? '',
      recentHQ: mitem?.recentHistory[0]?.hq ?? false,
      recentTimestamp: mitem?.recentHistory[0]?.timestamp ?? -1,
    }
    if (!props.costMode || !cost) {
      return result
    }
    else {
      return {
        ...result,
        currentAveragePrice: result.currentAveragePrice / cost,
        averagePrice: result.averagePrice / cost,
        lowestPrice: result.lowestPrice / cost,
        recentPrice: result.recentPrice / cost,
      }
    }
  }).filter(notNullish)
})

const columns = [
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
    accessorKey: 'lowestPrice',
    header: ({ column }) => getHeader(column, '当前最低价'),
  },
  {
    id: 'currentAveragePrice',
    accessorKey: 'currentAveragePrice',
    header: ({ column }) => getHeader(column, '平均标价'),
  },
  {
    id: 'recentPrice',
    accessorKey: 'recentPrice',
    header: ({ column }) => getHeader(column, '最近成交'),
  },
  {
    id: 'averagePrice',
    accessorKey: 'averagePrice',
    header: ({ column }) => getHeader(column, '平均成交价'),
  },
  {
    id: 'regularSaleVelocity',
    accessorKey: 'regularSaleVelocity',
    header: ({ column }) => getHeader(column, '出货速率'),
  },
] satisfies TableColumn<any>[]

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

const time = formatTimeAgo
const maximumFractionDigits = computed(() => props.costMode ? 2 : 0)

function copyText(text: string | number) {
  if (copy(`${text}`))
    toast.add({ title: '已复制', duration: 2000 })
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
      <UniImage class="min-h-12 min-w-12 inline-block" :src="base.icon + row.original.iconURL" alt="" :title="`ID: ${row.id}`" />
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
        <UPopover>
          <UButton block color="neutral" variant="ghost">
            <div class="text-right w-full">
              <div v-if="row.original.lowestPrice >= 0" class="text-xs text-gray mb-1">
                当前最低价
              </div>
              <span v-if="row.original.lowestWorld" class="text-gray pr-2 float-left">
                {{ row.original.lowestWorld }}
              </span>
              <span v-if="row.original.lowestPrice >= 0">
                {{ row.original.lowestHQ ? '' : '' }}
                <UniRichNumber :value="row.original.lowestPrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
                  <template #whole="{ num }">
                    <span>
                      {{ num }}
                    </span>
                  </template>
                  <template #fraction="{ num, decimalPoint }">
                    <span class="text-xs">
                      {{ num ? decimalPoint : '' }}{{ num }}
                    </span>
                  </template>
                </UniRichNumber>
                <span class="text-amber-500"></span>
              </span>
              <div v-else class="i-heroicons-minus" />
            </div>
          </UButton>
          <template #content>
            <div class="border-accented border rounded-lg max-h-50vh overflow-auto">
              <MarketListings :id="row.original.id" />
            </div>
          </template>
        </UPopover>
      </div>
    </template>
    <!-- 最低价 end -->
    <!-- 平均标价 -->
    <template #currentAveragePrice-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max">
        <div v-if="row.original.currentAveragePrice >= 0" class="text-xs text-gray mb-1">
          平均标价
        </div>
        <span v-if="row.original.currentAveragePrice >= 0">
          <UniRichNumber :value="row.original.currentAveragePrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
            <template #whole="{ num }">
              <span>
                {{ num }}
              </span>
            </template>
            <template #fraction="{ num, decimalPoint }">
              <span class="text-xs">
                {{ num ? decimalPoint : '' }}{{ num }}
              </span>
            </template>
          </UniRichNumber>
          <span class="text-amber-500"></span>
        </span>
        <div v-else class="i-heroicons-minus" />
      </div>
    </template>
    <!-- 平均标价 end -->
    <!-- 最近成交 -->
    <template #recentPrice-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max" :title="row.original.recentTimestamp > 0 ? time(new Date(row.original.recentTimestamp * 1000), { max: 'day' }) : undefined">
        <UPopover>
          <UButton block color="neutral" variant="ghost">
            <div class="text-right w-full">
              <div v-if="row.original.recentPrice >= 0" class="text-xs text-gray mb-1">
                最近成交
              </div>
              <span v-if="row.original.recentWorld" class="text-gray mr-2 float-left">
                {{ row.original.recentWorld }}
              </span>
              <span v-if="row.original.recentPrice >= 0">
                {{ row.original.recentHQ ? '' : '' }}
                <UniRichNumber :value="row.original.recentPrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
                  <template #whole="{ num }">
                    <span>
                      {{ num }}
                    </span>
                  </template>
                  <template #fraction="{ num, decimalPoint }">
                    <span class="text-xs">
                      {{ num ? decimalPoint : '' }}{{ num }}
                    </span>
                  </template>
                </UniRichNumber>
                <span class="text-amber-500"></span>
              </span>
              <div v-else class="i-heroicons-minus" />
            </div>
          </UButton>
          <template #content>
            <div class="border-accented rounded-lg max-h-50vh overflow-auto">
              <MarketHistory :id="row.original.id" />
            </div>
          </template>
        </UPopover>
      </div>
    </template>
    <!-- 最近成交 end -->
    <!-- 平均成交价 -->
    <template #averagePrice-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="text-right min-w-max">
        <div v-if="row.original.averagePrice >= 0" class="text-xs text-gray mb-1">
          平均成交价
        </div>
        <span v-if="row.original.averagePrice >= 0">
          <UniRichNumber :value="row.original.averagePrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
            <template #whole="{ num }">
              <span>
                {{ num }}
              </span>
            </template>
            <template #fraction="{ num, decimalPoint }">
              <span class="text-xs">
                {{ num ? decimalPoint : '' }}{{ num }}
              </span>
            </template>
          </UniRichNumber>
          <span class="text-amber-500"></span>
        </span>
        <div v-else class="i-heroicons-minus" />
      </div>
    </template>
    <!-- 平均成交价 end -->
    <!-- 出货速率 -->
    <template #regularSaleVelocity-cell="{ row }">
      <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else-if="row.original.regularSaleVelocity >= 0" class="text-right min-w-max">
        {{ row.original.regularSaleVelocity.toFixed(2) }}
      </div>
      <div v-else class="text-center">
        -
      </div>
    </template>
    <!-- 出货速率 end -->
  </UTable>
</template>

<style lang="postcss" scoped>

</style>
