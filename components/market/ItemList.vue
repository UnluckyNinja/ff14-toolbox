<script lang="ts" setup>
import { formatTimeAgo, notNullish } from '@vueuse/core'
import { garlandDataLink, huijiLink, universalisLink } from '~/composables/useItemExternalLink'

const props = withDefaults(defineProps<{
  ids: number[]
  costs?: Record<string, number>
  costMode?: boolean
}>(), {
  costMode: false,
})

const displayCost = computed(() => {
  return !!props.costs
})

const marketData = ref<any[]>([])
const items = ref<({
  id: number
  name: string
  iconURL: string
} | null)[]>([])

const settings = reactive(useSettings())

const toast = useToast()

const isFetching = ref(false)

// fetch prices from universalis into `marketData`
watch([() => props.ids, () => settings.selectedServer], async ([newIDs, newServer]) => {
  if (newIDs.length === 0) {
    marketData.value = []
    return
  }
  isFetching.value = true
  marketData.value = []
  const toFetch = newIDs.slice(0)
  async function batchAdd(ids: number[]) {
    const promise = fetchMarket(newServer, ids).catch((e) => {
      toast.add({ title: '请求 Universalis 数据失败，请检查网络', description: e, color: 'red', icon: 'i-heroicons-exclamation-circle' })
      return null
    })
    const data = await promise

    if (data === null)
      return

    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return

    if (ids.length > 1)
      marketData.value.push(...ids.map(it => data.items?.[it]))
    else
      marketData.value.push(data)
  }

  for (let i = 0; i < newIDs.length / 100; i++) {
    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return
    await batchAdd(toFetch.splice(0, 100))
  }
  isFetching.value = false

  // console.log(items)
}, { immediate: true })

// fetch item info from xivapi/thewakingsands into `items`
watch(() => props.ids, async (newVal) => {
  items.value.splice(0)

  if (newVal.length === 0)
    return

  const results = await fetchItems(newVal)

  if (props.ids !== newVal)
    return

  const base = EndPoint.base()
  items.value = newVal.map((id) => {
    const item = results.find(it => it.ID === id)
    if (!item)
      return null
    return {
      id: item.ID,
      name: item.Name,
      iconURL: base + item.Icon,
    }
  })
}, { immediate: true })

// generate data for table
const data = computed(() => {
  if (items.value.length === 0)
    return []
  if (marketData.value.length !== items.value.length)
    /* eslint-disable-next-line no-console */
    console.log('[FF14工具] 市场数据条目数量和传入数据对不上，可能会显示错误数据')

  return items.value.map((item, idx) => {
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
    key: 'icon',
  },
  {
    key: 'name',
    label: '物品名',
  },
  {
    key: 'lowestPrice',
    label: '当前最低价',
    sortable: true,
  },
  {
    key: 'currentAveragePrice',
    label: '平均标价',
    sortable: true,
  },
  {
    key: 'recentPrice',
    label: '最近成交',
    sortable: true,
  },
  {
    key: 'averagePrice',
    label: '平均成交价',
    sortable: true,
  },
  {
    key: 'regularSaleVelocity',
    label: '出货速率',
    sortable: true,
  },
]

const time = formatTimeAgo
const maximumFractionDigits = computed(() => props.costMode ? 2 : 0)
function getLinks(id: number, name: string) {
  return [
    {
      label: '灰机wiki',
      url: huijiLink(id, name),
    },
    {
      label: 'Universalis',
      url: universalisLink(id),
    },
    {
      label: 'GarlandData',
      url: garlandDataLink(id),
    },
  ]
}

function copyText(text: string) {
  if (copy(text))
    toast.add({ title: '已复制', timeout: 2000 })
}
</script>

<template>
  <UTable
    :rows="data" :columns="columns" :loading="isFetching"
    :loading-state="{ icon: 'i-heroicons-arrow-path', label: '加载中' }"
    :empty-state="{ icon: 'i-carbon-circle-dash', label: '空' }"
  >
    <template #icon-data="{ row }">
      <UniImage class="inline-block min-h-12 min-w-12" :src="row.iconURL" alt="" :title="`ID: ${row.id}`" />
    </template>
    <template #name-data="{ row }">
      <UPopover>
        <UButton block color="gray" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost">
          <div class="w-full text-left">
            <div class="whitespace-normal">
              {{ row.name }}
            </div>
            <div v-if="displayCost" class="mt-1 text-xs text-gray">
              兑换价格：{{ row.cost.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
            </div>
          </div>
        </UButton>
        <template #panel>
          <div>
            <UButton block color="gray" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.id)">
              <div class="w-full text-left">
                ID: {{ row.id }}
              </div>
            </UButton>
            <UButton block color="gray" variant="ghost" trailing-icon="i-heroicons-document-duplicate" @click="copyText(row.name)">
              <div class="w-full text-left">
                {{ row.name }}
              </div>
            </UButton>
          </div>
          <hr class="my-2">
          <UButton v-for="link, i in getLinks(row.id, row.name)" :key="i" block color="gray" variant="link" :to="link.url" target="_blank" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid">
            <div class="w-full text-sm">
              {{ link.label }}
            </div>
          </UButton>
        </template>
      </UPopover>
    </template>
    <template #lowestPrice-data="{ row }">
      <div v-if="isFetching" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="min-w-max text-right">
        <UPopover>
          <UButton block color="gray" variant="ghost">
            <div class="w-full text-right">
              <div v-if="row.lowestPrice >= 0" class="mb-1 text-xs text-gray">
                当前最低价
              </div>
              <span v-if="row.lowestWorld" class="float-left pr-2 text-gray">
                {{ row.lowestWorld }}
              </span>
              <span v-if="row.lowestPrice >= 0">
                {{ row.lowestHQ ? '' : '' }}
                <UniRichNumber :value="row.lowestPrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
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
          <template #panel>
            <div class="max-h-50vh overflow-auto">
              <MarketListings :id="row.id" />
            </div>
          </template>
        </UPopover>
      </div>
    </template>
    <template #currentAveragePrice-data="{ row }">
      <div v-if="isFetching" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="min-w-max text-right">
        <div v-if="row.currentAveragePrice >= 0" class="mb-1 text-xs text-gray">
          平均标价
        </div>
        <span v-if="row.currentAveragePrice >= 0">
          <UniRichNumber :value="row.currentAveragePrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
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
    <template #recentPrice-data="{ row }">
      <div v-if="isFetching" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="min-w-max text-right" :title="row.recentTimestamp > 0 ? time(new Date(row.recentTimestamp * 1000), { max: 'day' }) : undefined">
        <UPopover>
          <UButton block color="gray" variant="ghost">
            <div class="w-full text-right">
              <div v-if="row.recentPrice >= 0" class="mb-1 text-xs text-gray">
                最近成交
              </div>
              <span v-if="row.recentWorld" class="float-left mr-2 text-gray">
                {{ row.recentWorld }}
              </span>
              <span v-if="row.recentPrice >= 0">
                {{ row.recentHQ ? '' : '' }}
                <UniRichNumber :value="row.recentPrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
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
          <template #panel>
            <div class="max-h-50vh overflow-auto">
              <MarketHistory :id="row.id" />
            </div>
          </template>
        </UPopover>
      </div>
    </template>
    <template #averagePrice-data="{ row }">
      <div v-if="isFetching" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else class="min-w-max text-right">
        <div v-if="row.averagePrice >= 0" class="mb-1 text-xs text-gray">
          平均成交价
        </div>
        <span v-if="row.averagePrice >= 0">
          <UniRichNumber :value="row.averagePrice" :options="{ maximumFractionDigits }" :pad-right="maximumFractionDigits">
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
    <template #regularSaleVelocity-data="{ row }">
      <div v-if="isFetching" class="i-heroicons-ellipsis-horizontal animate-pulse" />
      <div v-else-if="row.regularSaleVelocity >= 0" class="min-w-max text-right">
        {{ row.regularSaleVelocity.toFixed(2) }}
      </div>
      <div v-else class="text-center">
        -
      </div>
    </template>
  </UTable>
</template>

<style lang="postcss" scoped>

</style>
