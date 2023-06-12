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

const marketData = ref<any[]>([])
const items = ref<({
  id: number
  name: string
  iconURL: string
} | null)[]>([])

const settings = reactive(useSettings())

const toast = useToast()

const includedFields = [
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

// fetch prices from universalis into `marketData`
watch([() => props.ids, () => settings.selectedServer], async ([newIDs, newServer]) => {
  if (newIDs.length === 0) {
    marketData.value = []
    return
  }
  marketData.value = []
  const toFetch = newIDs.slice(0)
  async function batchAdd(ids: number[]) {
    const response = await fetchMarket(newServer, ids, {
      listings: 1,
      entries: 1,
      fields: includedFields,
    })

    if (!response.ok) {
      toast.add({ title: 'Universalis 当前不可用', description: response.statusText, color: 'red', icon: 'i-heroicons-exclamation-circle' })
      return
    }

    const data = await response.json()

    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return

    if (ids.length > 1)
      marketData.value.push(...ids.map(it => data.items[it]))
    else
      marketData.value.push(data)
  }

  for (let i = 0; i < newIDs.length / 100; i++) {
    if (props.ids !== newIDs) // fast fail if it is changed to another list of items
      return
    await batchAdd(toFetch.splice(0, 100))
  }

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
  return items.value.map((item, idx) => {
    if (!item)
      return null

    const mitem = marketData.value[idx]
    const cost = props.costs?.[item.id]
    if (!props.costMode || !cost) {
      return {
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
    }
    else {
      return {
        ...item,
        cost,
        currentAveragePrice: (mitem?.currentAveragePrice ?? -1) / cost,
        averagePrice: (mitem?.averagePrice ?? -1) / cost,
        regularSaleVelocity: mitem?.regularSaleVelocity ?? -1,
        lowestPrice: (mitem?.listings[0]?.pricePerUnit ?? -1) / cost,
        lowestWorld: mitem?.listings[0]?.worldName ?? '',
        lowestHQ: mitem?.listings[0]?.hq ?? false,
        recentPrice: (mitem?.recentHistory[0]?.pricePerUnit ?? -1) / cost,
        recentWorld: mitem?.recentHistory[0]?.worldName ?? '',
        recentHQ: mitem?.recentHistory[0]?.hq ?? false,
        recentTimestamp: mitem?.recentHistory[0]?.timestamp ?? -1,
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
</script>

<template>
  <UTable :rows="data" :columns="columns">
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
            <div v-if="props.costMode !== undefined" class="mt-1 text-xs text-gray">
              兑换价格：{{ row.cost }}
            </div>
          </div>
        </UButton>
        <template #panel>
          <UButton v-for="link, i in getLinks(row.id, row.name)" :key="i" block color="gray" variant="link" :to="link.url" target="_blank" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid">
            <span class="w-max text-sm">
              {{ link.label }}
            </span>
          </UButton>
        </template>
      </UPopover>
    </template>
    <template #lowestPrice-data="{ row }">
      <div class="min-w-max w-full text-right">
        <div class="mb-1 text-xs text-gray">
          当前最低价
        </div>
        <span v-if="row.lowestWorld" class="float-left pr-2 text-gray">
          {{ row.lowestWorld }}
        </span>
        <span v-if="row.lowestPrice >= 0">
          {{ row.lowestHQ ? '' : '' }} {{ row.lowestPrice.toLocaleString(undefined, { maximumFractionDigits }) }} G
        </span>
        <span v-else>
          -
        </span>
      </div>
    </template>
    <template #currentAveragePrice-data="{ row }">
      <div class="min-w-max w-full text-right">
        <div class="mb-1 text-xs text-gray">
          平均标价
        </div>
        <span v-if="row.currentAveragePrice >= 0">
          {{ row.currentAveragePrice.toLocaleString(undefined, { maximumFractionDigits }) }} G
        </span>
        <span v-else>
          -
        </span>
      </div>
    </template>
    <template #recentPrice-data="{ row }">
      <div class="min-w-max w-full text-right" :title="row.recentTimestamp > 0 ? time(new Date(row.recentTimestamp * 1000), { max: 'day' }) : undefined">
        <div class="mb-1 text-xs text-gray">
          最近成交
        </div>
        <span v-if="row.recentWorld" class="float-left mr-2 text-gray">
          {{ row.recentWorld }}
        </span>
        <span v-if="row.recentPrice >= 0">
          {{ row.recentHQ ? '' : '' }} {{ row.recentPrice.toLocaleString(undefined, { maximumFractionDigits }) }} G
        </span>
        <span v-else>
          -
        </span>
      </div>
    </template>
    <template #averagePrice-data="{ row }">
      <div class="min-w-max w-full text-right">
        <div class="mb-1 text-xs text-gray">
          平均成交价
        </div>
        <span v-if="row.averagePrice >= 0">
          {{ row.averagePrice.toLocaleString(undefined, { maximumFractionDigits }) }} G
        </span>
        <span v-else>
          -
        </span>
      </div>
    </template>
    <template #regularSaleVelocity-data="{ row }">
      <div class="min-w-max w-full text-right">
        {{ row.regularSaleVelocity.toFixed(2) }}
      </div>
    </template>
  </UTable>
</template>

<style lang="postcss" scoped>

</style>
