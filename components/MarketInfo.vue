<script lang="ts" setup>
const selectedItem = inject<any>('selected-item')
const settings = reactive(useSettings())

const marketInfo = ref<any>(null)
const updating = ref(false)

const isSearchingDataCenter = computed(() => {
  return settings.selectedDataCenter === settings.selectedServer
})

const toast = useToast()

watch([selectedItem, () => settings.selectedServer, () => settings.onlyHQ], async ([item, market, HQ]) => {
  if (!item || !market)
    return {}
  updating.value = true
  const options: any = {
    listings: settings.numberPerPage,
    entries: 10,
  }
  if (item.canBeHQ && HQ)
    options.hq = true

  const response = await fetchMarket(market, item.id, options)
  if (!response.ok) {
    toast.add({ title: 'Universalis 当前不可用', description: response.statusText, color: 'red', icon: 'i-heroicons-exclamation-circle' })
    updating.value = false
    return
  }
  marketInfo.value = await response.json()
  updating.value = false
})
</script>

<template>
  <div>
    <!-- prices -->
    <div v-if="updating">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
      </div>
    </div>
    <div v-else-if="marketInfo && !updating">
      <div
        v-if="marketInfo.listings.length === 0 && marketInfo.recentHistory.length === 0"
        class="m-4 text-center text-xl font-bold"
      >
        该物品可能无法交易
      </div>
      <div v-else class="grid grid-cols-1 text-center text-sm md:grid-cols-2 divide-x">
        <!-- on sale -->
        <div>
          <h2 class="m-2 text-2xl">
            在售列表
          </h2>
          <table class="mx-auto min-w-1/2 table-auto">
            <thead>
              <tr>
                <th>#</th>
                <th v-if="isSearchingDataCenter">
                  服务器
                </th>
                <th>HQ</th>
                <th>单价</th>
                <th>数量</th>
                <th>总计</th>
                <th>雇员名</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item, i in marketInfo.listings" :key="i"
                class="divide-x odd:bg-gray/10 children:px-2 children:py-2 dark:divide-gray"
              >
                <td>{{ i + 1 }}</td>
                <td v-if="isSearchingDataCenter">
                  {{ item.worldName }}
                </td>
                <td>{{ item.hq ? '' : '' }}</td>
                <td class="text-end text-amber-600 dark:text-amber-400">
                  {{ item.pricePerUnit }}
                </td>
                <td>{{ item.quantity }}</td>
                <td class="text-end text-orange-600 dark:text-orange-400">
                  {{ item.total }}
                </td>
                <td>{{ item.retainerName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- history -->
        <div>
          <h2 class="m-2 text-2xl">
            历史交易
          </h2>
          <table class="mx-auto min-w-1/2 table-auto">
            <thead>
              <tr>
                <th>#</th>
                <th v-if="isSearchingDataCenter">
                  服务器
                </th>
                <th>HQ</th>
                <th>单价</th>
                <th>数量</th>
                <th>总计</th>
                <th>购买者</th>
                <th>购买时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item, i in marketInfo.recentHistory" :key="i"
                class="divide-x odd:bg-gray/10 children:px-2 children:py-2 dark:divide-gray"
              >
                <td>{{ i + 1 }}</td>
                <td v-if="isSearchingDataCenter">
                  {{ item.worldName }}
                </td>
                <td>{{ item.hq ? '' : '' }}</td>
                <td class="text-end text-amber-600 dark:text-amber-400">
                  {{ item.pricePerUnit }}
                </td>
                <td>{{ item.quantity }}</td>
                <td class="text-end text-orange-600 dark:text-orange-400">
                  {{ item.total }}
                </td>
                <td>{{ item.buyerName }}</td>
                <td>{{ new Date(item.timestamp * 1000).toLocaleString('zh-CN') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-center">
        <div class="text-lg">
          请在上方搜索框内输入关键词搜索物品并点击
        </div>
        <div class="text-lg">
          请确保可以正常访问Universalis，建议将相关域名加入到代理列表中
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
