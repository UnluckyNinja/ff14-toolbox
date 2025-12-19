<script lang="ts" setup>
import { notNullish } from '@vueuse/core'
import { scaleLinear } from 'd3'

definePageMeta({
  title: '📈艾欧泽亚什么涨得凶/跌得狠',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const servers = reactive(useServerInfo())
const settings = reactive(useSettings())

const toast = useToast()

const ids = ref<number[]>([])

/**
 * Fetching market data
 */

const isFetchingMarket = ref(false)
const marketData = ref<any[]>([])
const foreignMarketData = ref<any[]>([])
const foreignServer = ref('Japan')
const latestMarketRequest = ref(Symbol('market-handle'))
watch([ids, () => settings.selectedServer, foreignServer], async ([newIDs, newServer, newForeign]) => {
  const sym = Symbol('market-handle')
  latestMarketRequest.value = sym

  marketData.value.splice(0)
  foreignMarketData.value.splice(0)
  if (newIDs.length === 0) {
    return
  }
  isFetchingMarket.value = true
  const toFetch = newIDs.slice()
  // TODO: 当ID数量超过100时分段请求
  const dataCur: (CurrentlyShownView | undefined)[] = []
  const dataIntl: (CurrentlyShownView | undefined)[] = []
  while (toFetch.length > 0) {
    const part = toFetch.splice(0, 100)
    try {
      const temp1 = await fetchMarket(newServer, part)
      const temp2 = await fetchMarket(newForeign, part)
      dataCur.push(...part.map(it => temp1.items?.[it]))
      dataIntl.push(...part.map(it => temp2.items?.[it]))
    } catch (e: any) {
      isFetchingMarket.value = false
      toast.add({ title: '请求 Universalis 数据失败，请检查网络', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
      return
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (latestMarketRequest.value !== sym) {
      return
    }
  }

  marketData.value = dataCur
  foreignMarketData.value = dataIntl
  isFetchingMarket.value = false
})

/**
 * Fetching items info
 */

const isFetchingItems = ref(false)
const itemsData = ref<({
  id: number
  name: string
  iconURL: string
} | null)[]>([])
const latestItemsRequest = ref(Symbol('items-handle'))
// fetch item info from xivapi/thewakingsands into `items`
watch(ids, async (newIDs) => {
  const sym = Symbol('items-handle')
  latestItemsRequest.value = sym
  itemsData.value.splice(0)

  if (newIDs.length === 0) {
    return
  }

  isFetchingItems.value = true

  let data
  try {
    data = await fetchItems(newIDs)
  } catch (e: any) {
    isFetchingItems.value = false
    toast.add({ title: '请求物品信息数据失败，请检查网络，或在页面顶部尝试切换', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
    return
  }

  if (latestItemsRequest.value !== sym) {
    return
  }

  itemsData.value = newIDs.map((id) => {
    const item = data.find(it => it.row_id === id)
    if (!item)
      return null
    return {
      id: item.row_id,
      name: item.fields.Name,
      iconURL: itemIconUrl(item.fields.Icon.id),
    }
  })

  isFetchingItems.value = false
})

const columns = [
  {
    id: 'name',
    header: '物品',
  },
  {
    id: 'lowestPrice',
    header: '最低价',
  },
  {
    id: 'lowestPriceChange',
    header: '涨跌幅',
  },
  {
    id: 'averagePrice',
    header: '平均成交价',
  },
  {
    id: 'averagePriceChange',
    header: '涨跌幅',
  },
  {
    id: 'regularSaleVelocity',
    header: '出货速率',
  },
]

const isFetching = computed(() => {
  return isFetchingMarket.value || isFetchingItems.value
})

const data = computed(() => {
  if (ids.value.length === 0 || isFetching.value)
    return []

  const totalData = ids.value.map((id, idx) => {
    if (!itemsData.value[idx]) {
      return null
    }

    const item = itemsData.value[idx]
    const mitem = marketData.value[idx]
    const fitem = foreignMarketData.value[idx]
    const result = {
      item,
      change: {
        averagePrice: (!fitem?.averagePrice || !mitem?.averagePrice)
          ? null
          : ((fitem.averagePrice - mitem.averagePrice) / mitem.averagePrice) * 100,
        lowestPrice: (!fitem?.listings[0]?.pricePerUnit || !mitem?.listings[0]?.pricePerUnit)
          ? null
          : ((fitem.listings[0].pricePerUnit - mitem.listings[0].pricePerUnit) / mitem.listings[0].pricePerUnit) * 100,
      },
      current: {
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
      },
      intl: {
        currentAveragePrice: fitem?.currentAveragePrice ?? -1,
        averagePrice: fitem?.averagePrice ?? -1,
        regularSaleVelocity: fitem?.regularSaleVelocity ?? -1,
        lowestPrice: fitem?.listings[0]?.pricePerUnit ?? -1,
        lowestWorld: fitem?.listings[0]?.worldName ?? '',
        lowestHQ: fitem?.listings[0]?.hq ?? false,
        recentPrice: fitem?.recentHistory[0]?.pricePerUnit ?? -1,
        recentWorld: fitem?.recentHistory[0]?.worldName ?? '',
        recentHQ: fitem?.recentHistory[0]?.hq ?? false,
        recentTimestamp: fitem?.recentHistory[0]?.timestamp ?? -1,
      },
    }
    return result
  })

  const filtered = totalData.filter(notNullish)
  if (filtered.length < totalData.length) {
    console.warn(`物品列表原始大小：${filtered.length}，过滤失效数据后大小：${totalData.length}`)
  }
  return filtered
})

function copyText(text: string | number) {
  if (copy(`${text}`))
    toast.add({ title: '已复制', duration: 2000 })
}

const changeColor = scaleLinear([-100, 0, 100], ['green', 'gray', 'red'])
const mobileOpenCurrencyList = ref(false)
</script>

<template>
  <UContainer>
    <OptionsPanel :display="{ hq: false }">
      <div class="col-start-1">
        对比区域：
      </div>
      <USelectMenu v-model="foreignServer" :items="servers.regions" class="min-w-48 w-fit" />
    </OptionsPanel>
    <div class="flex flex-col gap-2 md:flex-row">
      <div class="hidden md:block">
        <TrendList class="flex-initial min-w-60" @update:items="ids = Array.from($event)" />
      </div>
      <USlideover v-model:open="mobileOpenCurrencyList" class="text-center md:hidden">
        <UButton block>
          选择分类
        </UButton>
        <template #content>
          <div class="p-2 flex flex-col h-full items-stretch relative">
            <div class="flex-1 overflow-y-auto">
              <TrendList class="" @update:items="ids = Array.from($event); mobileOpenCurrencyList = false" />
            </div>
            <UButton class="" variant="solid" size="xl" block @click="mobileOpenCurrencyList = false">
              关闭
            </UButton>
          </div>
        </template>
      </USlideover>
      <UTable class="flex-1" :data="data" :columns="columns" :loading="isFetching">
        <template #loading>
          <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
          <div>
            {{ `物品数据 ${isFetchingItems ? '⌛️' : '✔️'}，\
                市场数据 ${isFetchingMarket ? '⌛️' : '✔️'}` }}
          </div>
        </template>
        <template #empty>
          <UIcon name="i-carbon-circle-dash" />
          <div>
            空
          </div>
        </template>
        <!-- 物品名 -->
        <template #name-cell="{ row }">
          <UPopover>
            <div class="flex flex-col gap-1 items-center md:flex-row">
              <UniImage class="min-h-12 min-w-12 inline-block" :src="row.original.item.iconURL" alt="" :title="`ID: ${row.id}`" />
              <UButton class="min-w-30" block color="neutral" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost">
                <div class="text-left w-full">
                  <div class="whitespace-normal">
                    {{ row.original.item.name }}
                  </div>
                </div>
              </UButton>
            </div>
            <template #content>
              <div class="border-accented border rounded-lg">
                <UButton class="cursor-pointer" block color="neutral" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.original.item.id)">
                  <div class="text-left w-full">
                    ID: {{ row.original.item.id }}
                  </div>
                </UButton>
                <UButton class="cursor-pointer" block color="neutral" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.original.item.name)">
                  <div class="text-left w-full">
                    {{ row.original.item.name }}
                  </div>
                </UButton>
                <USeparator class="my-2" />
                <UButton v-for="link, i in getLinks(row.original.item.id, row.original.item.name)" :key="i" block color="neutral" variant="link" :to="link.url" target="_blank" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid">
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
          <div v-else class="text-right flex flex-col min-w-max justify-between">
            <MarketPriceCard
              :server="row.original.current.lowestWorld"
              :price="row.original.current.lowestPrice"
              :hq="row.original.current.lowestHQ"
              :item-i-d="row.original.item.id"
              label="最低价"
              note="当前"
              popup-market="listing"
              :popup-server="settings.selectedServer"
            />
            <USeparator class="my-1" orientation="horizontal" />
            <MarketPriceCard
              :server="row.original.intl.lowestWorld"
              :price="row.original.intl.lowestPrice"
              :hq="row.original.intl.lowestHQ"
              :item-i-d="row.original.item.id"
              label="最低价"
              note="对比"
              popup-market="listing"
              :popup-server="foreignServer"
            />
          </div>
        </template>
        <!-- 最低价 end -->
        <!-- 涨跌幅 -->
        <template #lowestPriceChange-cell="{ row }">
          <div class="text-right" :style="{ color: changeColor(row.original.change.lowestPrice ?? 0) }">
            {{ row.original.change.lowestPrice?.toFixed(2) }}%
          </div>
        </template>
        <!-- 涨跌幅 end -->
        <!-- 平均成交价 -->
        <template #averagePrice-cell="{ row }">
          <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
          <div v-else class="text-right flex flex-col min-w-max justify-between">
            <MarketPriceCard
              :price="row.original.current.averagePrice"
              label=""
              note="当前平均成交价"
            />
            <USeparator class="mx-1" orientation="horizontal" />
            <MarketPriceCard
              :price="row.original.intl.averagePrice"
              label=""
              note="对比平均成交价"
            />
          </div>
        </template>
        <!-- 平均成交价 end -->
        <!-- 涨跌幅 -->
        <template #averagePriceChange-cell="{ row }">
          <div class="text-right" :style="{ color: changeColor(row.original.change.averagePrice ?? 0) }">
            {{ row.original.change.averagePrice?.toFixed(2) }}%
          </div>
        </template>
        <!-- 涨跌幅 end -->
        <!-- 出货速率 -->
        <template #regularSaleVelocity-cell="{ row }">
          <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
          <div v-else-if="row.original.current.regularSaleVelocity >= 0" class="text-default text-right min-w-max">
            {{ row.original.current.regularSaleVelocity.toFixed(2) }}
          </div>
          <div v-else class="text-center">
            -
          </div>
          <div class="text-xs text-left">
            <div>
              当前
            </div>
            <USeparator class="my-1" />
            <div>
              对比
            </div>
          </div>
          <div v-if="isFetchingMarket" class="i-heroicons-ellipsis-horizontal animate-pulse" />
          <div v-else-if="row.original.intl.regularSaleVelocity >= 0" class="text-default text-right min-w-max">
            {{ row.original.intl.regularSaleVelocity.toFixed(2) }}
          </div>
          <div v-else class="text-center">
            -
          </div>
        </template>
        <!-- 出货速率 end -->
      </UTable>
    </div>
  </UContainer>
</template>

<style scoped>

</style>
