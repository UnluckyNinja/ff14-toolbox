<script lang="ts" setup>
definePageMeta({
  title: 'FF14 物品搜索工具',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const { db, initialize } = useDuckDB()

onMounted(initialize)

provide('duckDB', db)

const servers = useServerInfo()

const isAppLoading = computed(() => {
  if (servers.value.regions.length === 0)
    return true
  if (!db.value)
    return true
  return false
})
// on searchbar select item
const selectedItem = shallowRef(null as any)
provide('selected-item', selectedItem)

const { add } = useSearchHistory()

function onItemClick(item: any) {
  selectedItem.value = item
  add({
    id: item.id,
    name: item.name,
    iconID: item.iconID,
  })
}
</script>

<template>
  <div class="container mx-auto mt-10">
    <div v-if="isAppLoading" class="grid items-center gap-4 grid-rows-2 place-content-center text-center text-3xl">
      <div class="row-span-1">
        加载数据中，请稍候<br>
        <span class="text-base">
          （下载5MB左右的数据库，视网络情况可能需要几分钟）<br>
          如果加载较慢，建议后续查询保持页面开启
        </span>
      </div>
      <div class="row-span-1">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl mx-auto" />
      </div>
    </div>
    <div v-else>
      <SearchBar
        class="flex-1"
        @item-click="onItemClick($event)"
      />
      <OptionsPanel />
      <div class="grid grid-cols-6 gap-2">
        <SearchHistoryList class="col-span-1 hidden md:block" />
        <div class="col-span-6 md:col-span-5">
          <CurrentItemInfo v-if="selectedItem" class="ml-4" :item="selectedItem" />
          <MarketInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
