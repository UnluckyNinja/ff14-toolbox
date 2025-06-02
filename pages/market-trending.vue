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

const { base } = useXABase()

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
  // TODO: 当ID数量超过100时分段请求
  let data, data2
  try {
    const promiseCurrent = fetchMarket(newServer, newIDs)
    const promiseIntl = fetchMarket(newForeign, newIDs)
    data = await promiseCurrent
    data2 = await promiseIntl
  } catch (e: any) {
    isFetchingMarket.value = false
    toast.add({ title: '请求 Universalis 数据失败，请检查网络', description: e, color: 'error', icon: 'i-heroicons-exclamation-circle' })
    return
  }

  if (latestMarketRequest.value !== sym) {
    return
  }
  marketData.value.push(...newIDs.map(it => data.items?.[it]))
  foreignMarketData.value.push(...newIDs.map(it => data2.items?.[it]))
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
    const item = data.find(it => it.ID === id)
    if (!item)
      return null
    return {
      id: item.ID,
      name: item.Name,
      iconURL: item.Icon,
    }
  })

  isFetchingItems.value = false
})

const columns = [
  {
    id: 'icon',
  },
  {
    id: 'name',
    header: '物品名',
  },
  {
    id: 'lowestPrice',
    header: '当前最低价',
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
</script>

<template>
  <UContainer>
    <OptionsPanel :display="{ hq: false }">
      <div class="col-start-1">
        对比区域：
      </div>
      <USelectMenu v-model="foreignServer" :items="servers.regions" class="min-w-48 w-fit" />
    </OptionsPanel>
    <div class="flex flex-row gap-2">
      <TrendList class="flex-initial min-w-60" @update:items="ids = Array.from($event)" />
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
        <!-- 图标 -->
        <template #icon-cell="{ row }">
          <UniImage class="min-h-12 min-w-12 inline-block" :src="base.icon + row.original.item.iconURL" alt="" :title="`ID: ${row.id}`" />
        </template>
        <!-- 物品名 -->
        <template #name-cell="{ row }">
          <UPopover>
            <UButton block color="neutral" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost">
              <div class="text-left w-full">
                <div class="whitespace-normal">
                  {{ row.original.item.name }}
                </div>
              </div>
            </UButton>
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
          <div v-else class="text-right flex flex-row min-w-max justify-between">
            <!-- TODO: 把这个抽出成一个组件 -->
            <UPopover>
              <UButton block color="neutral" variant="ghost">
                <div class="text-right w-full">
                  <div class="text-muted text-xs text-right">
                    当前
                  </div>
                  <div v-if="row.original.current.lowestPrice >= 0" class="text-muted text-xs mb-1">
                    最低价
                  </div>
                  <span v-if="row.original.current.lowestWorld" class="text-muted pr-2 float-left">
                    {{ row.original.current.lowestWorld }}
                  </span>
                  <span v-if="row.original.current.lowestPrice >= 0">
                    {{ row.original.current.lowestHQ ? '' : '' }}
                    <UniRichNumber :value="row.original.current.lowestPrice" :options="{ maximumFractionDigits: 0 }" :pad-right="0">
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
                  <MarketListings :id="row.original.item.id" />
                </div>
              </template>
            </UPopover>
            <USeparator class="mx-1 h-18" orientation="vertical" />
            <UPopover>
              <UButton block color="neutral" variant="ghost">
                <div class="text-right w-full">
                  <div class="text-muted text-xs text-left">
                    对比
                  </div>
                  <div v-if="row.original.intl.lowestPrice >= 0" class="text-muted text-xs mb-1 text-left">
                    最低价
                  </div>
                  <span v-if="row.original.intl.lowestWorld" class="text-muted pr-2 float-left">
                    {{ row.original.intl.lowestWorld }}
                  </span>
                  <span v-if="row.original.intl.lowestPrice >= 0">
                    {{ row.original.intl.lowestHQ ? '' : '' }}
                    <UniRichNumber :value="row.original.intl.lowestPrice" :options="{ maximumFractionDigits: 0 }" :pad-right="0">
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
                  <MarketListings :id="row.original.item.id" :server="foreignServer" />
                </div>
              </template>
            </UPopover>
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
          <div v-else class="text-right flex flex-row min-w-max justify-between">
            <div>
              <div class="text-xs text-right">
                当前
              </div>
              <div v-if="row.original.current.averagePrice >= 0" class="text-muted text-xs mb-1">
                平均成交价
              </div>
              <div v-if="row.original.current.averagePrice >= 0">
                <UniRichNumber class="text-default" :value="row.original.current.averagePrice" :options="{ maximumFractionDigits: 0 }" :pad-right="0">
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
              </div>
              <div v-else class="i-heroicons-minus" />
            </div>
            <USeparator class="mx-1 h-12" orientation="vertical" />
            <div>
              <div class="text-xs text-left">
                对比
              </div>
              <div v-if="row.original.intl.averagePrice >= 0" class="text-muted text-xs mb-1">
                平均成交价
              </div>
              <div v-if="row.original.intl.averagePrice >= 0">
                <UniRichNumber class="text-default" :value="row.original.intl.averagePrice" :options="{ maximumFractionDigits: 0 }" :pad-right="0">
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
              </div>
              <div v-else class="i-heroicons-minus" />
            </div>
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
            <USeparator />
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
