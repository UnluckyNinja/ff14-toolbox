<script lang="ts" setup>
definePageMeta({
  title: 'FF14 市场物品价格速查',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const { db } = useDuckDB()

provide('duckDB', db)

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
  <div class="mx-auto mt-10 container">
    <DBLoading v-if="!db" />
    <div v-else>
      <SearchBar
        class="flex-1"
        @item-click="onItemClick($event)"
      />
      <div>
        <OptionsPanel />
      </div>
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
