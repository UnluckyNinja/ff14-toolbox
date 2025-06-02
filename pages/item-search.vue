<script lang="ts" setup>
import { useDuckDB } from '~/lib/duckDB'

definePageMeta({
  title: 'FF14 市场物品价格速查',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const db = useDuckDB()

provide('duckDB', db)

// on searchbar select item
const selectedItem = shallowRef(null as any)
provide('selected-item', selectedItem)

const { add } = useSearchHistory()

function onItemClick(item: any) {
  selectedItem.value = item
  add({
    ...item,
  })
}
</script>

<template>
  <UContainer class="mt-10">
    <DBLoading v-if="!db" />
    <div v-else>
      <SearchBar
        @item-click="onItemClick($event)"
      />
      <div>
        <OptionsPanel />
      </div>
      <div class="gap-2 grid grid-cols-6">
        <SearchHistoryList class="col-span-1 hidden md:block" />
        <div class="col-span-6 md:col-span-5">
          <CurrentItemInfo v-if="selectedItem" class="ml-4" :item="selectedItem" />
          <SearchMarketInfo />
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style lang="postcss" scoped>

</style>
