<script lang="ts" setup>
import { formatTimeAgo } from '@vueuse/core'

const props = defineProps<{
  ids: number[]
}>()

const marketData = ref<any[]>([])
const items = ref<({
  id: number
  name: string
  iconURL: string
} | null)[]>([])

const settings = useSettings()

const toast = useToast()

watch([() => props.ids, () => settings.value.selectedServer], async ([newIDs, newServer]) => {
  if (newIDs.length === 0) {
    marketData.value = []
    return
  }
  marketData.value = []
  const response = await fetchMarket(newServer, newIDs, {
    listings: 1,
    entries: 1,
    fields: [
      // when multiple items
      'items.listings.pricePerUnit',
      'items.listings.worldName',
      'items.currentAveragePrice',
      'items.averagePrice',
      'items.regularSaleVelocity',
      'items.recentHistory.pricePerUnit',
      'items.recentHistory.worldName',
      'items.recentHistory.timestamp',
      // when only one item
      'listings.pricePerUnit',
      'listings.worldName',
      'currentAveragePrice',
      'averagePrice',
      'regularSaleVelocity',
      'recentHistory.pricePerUnit',
      'recentHistory.worldName',
      'recentHistory.timestamp',
    ],
  })

  if (!response.ok) {
    toast.add({ title: 'Universalis 当前不可用', description: response.statusText, color: 'red', icon: 'i-heroicons-exclamation-circle' })
    return
  }

  const data = await response.json()
  if (props.ids !== newIDs)
    return

  if (newIDs.length > 1)
    marketData.value = newIDs.map(it => data.items[it])
  else
    marketData.value = [data]

  // console.log(items)
})

const isFetchingMarket = computed(() => {
  return marketData.value.length !== props.ids.length && marketData.value.length === 0
})

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
})

const time = formatTimeAgo
</script>

<template>
  <table class="m-2 w-full border-spacing-xl table-auto gap-2 whitespace-nowrap">
    <thead>
      <tr class="divide-x">
        <th>图标</th>
        <th>物品名</th>
        <th>当前最低价</th>
        <th>平均标价</th>
        <th>最近成交</th>
        <th>平均成交价</th>
        <th>
          出货速率
          <span class="cursor-help underline underline-dotted" title="游戏内销售历史追溯有数量上限，所以交易量大的物品显示的数据都差不多">?</span>
        </th>
        <!-- <th>链接</th> -->
      </tr>
    </thead>
    <tbody class="odd:children:bg-gray/10">
      <template v-for="item, i in items" :key="i">
        <tr v-if="item" class="text-center divide-x children:p-2">
          <td>
            <UniImage class="inline-block h-12 w-12" :src="item.iconURL" alt="" :title="`ID: ${item.id}`" />
          </td>
          <td class="whitespace-normal">
            {{ item.name }}
          </td>
          <template v-if="marketData[i]">
            <td class="text-right">
              <div>
                <div class="mb-1 text-xs text-gray">
                  当前最低价
                </div>
                <span class="float-left mr-2 text-gray">
                  {{ marketData[i].listings[0]?.worldName ?? '' }}
                </span>
                {{ marketData[i].listings[0]?.pricePerUnit.toLocaleString() ?? '暂无' }}
              </div>
            </td>
            <td class="text-right">
              <div>
                <div class="mb-1 text-xs text-gray">
                  平均标价
                </div>
                {{ Math.round(marketData[i].currentAveragePrice).toLocaleString() }}
              </div>
            </td>
            <td class="text-right">
              <div :title="time(new Date(marketData[i].recentHistory[0].timestamp * 1000), { max: 'day' })">
                <div class="mb-1 text-xs text-gray">
                  最近成交
                </div>
                <span class="float-left mr-2 text-gray">
                  {{ marketData[i].recentHistory[0]?.worldName ?? '' }}
                </span>
                {{ marketData[i].recentHistory[0]?.pricePerUnit.toLocaleString() ?? '暂无' }}
              </div>
            </td>
            <td class="text-right">
              <div>
                <div class="mb-1 text-xs text-gray">
                  平均成交价
                </div>
                {{ Math.round(marketData[i].averagePrice).toLocaleString() }}
              </div>
            </td>
            <td class="text-right">
              <div>
                {{ marketData[i].regularSaleVelocity.toFixed(2) }}
              </div>
            </td>
          </template>
          <td v-else-if="isFetchingMarket" colspan="0">
            查询中
          </td>
          <td v-else colspan="0">
            物品不可出售
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style lang="postcss" scoped>

</style>
