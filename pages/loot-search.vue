<script lang="ts" setup>
import { formatTimeAgo } from '@vueuse/core'
import type { Instance } from '~/composables/instances'
import { instanceLoots } from '~/data/loots'
import { EndPoint, fetchItems } from '~/utils/xivapi'

definePageMeta({
  title: 'FF14 副本可交易掉落查询',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

// const { db } = useDuckDB()
// const { queryID } = useQueries(db)

// provide('duckDB', db)

const selectedItem = shallowRef(null as any)
provide('selected-item', selectedItem)

const selectedInstance = ref<Instance>()

const isNotDone = computed(() => {
  if (!selectedInstance.value)
    return false
  return !instanceLoots[selectedInstance.value.i]
})

const loots = computed(() => {
  if (!selectedInstance.value || !instanceLoots[selectedInstance.value.i])
    return []
  return instanceLoots[selectedInstance.value.i]
})

const marketData = ref<any[]>([])
const items = ref<({
  id: number
  name: string
  iconURL: string
} | null)[]>([])

const settings = useSettings()

const toast = useToast()

watch([loots, () => settings.value.selectedServer], async ([newLoot, newServer]) => {
  if (newLoot.length === 0) {
    marketData.value = []
    return
  }
  marketData.value = []
  const response = await fetchMarket(newServer, newLoot, {
    listings: 1,
    entries: 1,
    fields: [
      // when multiple item
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
  if (loots.value !== newLoot)
    return

  if (newLoot.length > 1)
    marketData.value = newLoot.map(it => data.items[it])
  else
    marketData.value = [data]

  // console.log(items)
})

watch(loots, async (newVal) => {
  items.value.splice(0)

  if (newVal.length === 0)
    return

  const results = await fetchItems(newVal)

  if (loots.value !== newVal)
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
const imgUrl = itemIconUrl
</script>

<template>
  <div class="container mx-auto mt-10">
    <div>
      <OptionsPanel />
      <div class="grid grid-cols-7">
        <InstanceList class="col-span-2" @update:model-value="selectedInstance = $event" />
        <div v-if="selectedInstance" class="col-span-5">
          <h2 class="text-center text-xl font-bold">
            <img class="w-8 h-8 inline-block" :src="imgUrl(selectedInstance.c.toString())">
            {{ selectedInstance.n }}
          </h2>
          <table class="w-full m-2 gap-2 table-auto border-spacing-xl whitespace-nowrap">
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
                  <span class="underline underline-dotted cursor-help" title="游戏内销售历史追溯有数量上限，所以交易量大的物品显示的数据都差不多">?</span>
                </th>
                <!-- <th>链接</th> -->
              </tr>
            </thead>
            <tbody class="odd:children:bg-gray/10">
              <template v-for="item, i in items" :key="i">
                <tr v-if="item" class="divide-x text-center children:p-2">
                  <td>
                    <UniImage class="w-12 h-12 inline-block" :src="item.iconURL" alt="" :title="`ID: ${item.id}`" />
                  </td>
                  <td class="whitespace-normal">
                    {{ item.name }}
                  </td>
                  <td class="text-right">
                    <div v-if="marketData[i]">
                      <div class="text-gray mb-1 text-xs">
                        当前最低价
                      </div>
                      <span class="float-left text-gray mr-2">
                        {{ marketData[i].listings[0]?.worldName ?? '' }}
                      </span>
                      {{ marketData[i].listings[0]?.pricePerUnit.toLocaleString() ?? '暂无' }}
                    </div>
                    <div v-else>
                      查询中
                    </div>
                  </td>
                  <td class="text-right">
                    <div v-if="marketData[i]">
                      <div class="text-gray mb-1 text-xs">
                        平均标价
                      </div>
                      {{ Math.round(marketData[i].currentAveragePrice).toLocaleString() }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div v-if="marketData[i]" :title="time(new Date(marketData[i]?.recentHistory[0].timestamp * 1000), { max: 'day' })">
                      <div class="text-gray mb-1 text-xs">
                        最近成交
                      </div>
                      <span class="float-left text-gray mr-2">
                        {{ marketData[i].recentHistory[0]?.worldName ?? '' }}
                      </span>
                      {{ marketData[i].recentHistory[0]?.pricePerUnit.toLocaleString() ?? '暂无' }}
                    </div>
                    <div v-else>
                      查询中
                    </div>
                  </td>
                  <td class="text-right">
                    <div v-if="marketData[i]">
                      <div class="text-gray mb-1 text-xs">
                        平均成交价
                      </div>
                      {{ Math.round(marketData[i].averagePrice).toLocaleString() }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div v-if="marketData[i]">
                      {{ marketData[i].regularSaleVelocity.toFixed(2) }}
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="text-center m-2 text-gray/80">
            <div v-if="isNotDone">
              🚧 施工ing... 还未录入数据啦哩 🚧
            </div>
            <div v-else-if="loots.length === 0">
              这个本好像没有可交易掉落啦哩
            </div>
            <div v-else>
              不可交易物品不会显示在这里呦啦哩
            </div>
          </div>
        </div>
        <div v-else class="col-span-5">
          <div class="text-center">
            请先选择副本
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
