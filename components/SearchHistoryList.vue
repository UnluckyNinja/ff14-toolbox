<script lang="ts" setup>
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'
import type { HistoryItem } from '~/composables/searchHistory'
import type { DuckDBClient } from '~/data/duckDB'

const { history } = useSearchHistory()
const selectedItem = inject<ShallowRef<any>>('selected-item', shallowRef(null))

const db = inject<ShallowRef<DuckDBClient>>('duckDB')

const { queryID } = useQueries(db!)

const isSearching = ref(false)

function onClick(item: HistoryItem) {
  if (!db || !db.value)
    return
  if (isSearching.value)
    return
  if (selectedItem.value?.id === item.id)
    return
  isSearching.value = true
  queryID(item.id).then((result) => {
    selectedItem.value = result
    isSearching.value = false
  })
}

const list = computed(() => {
  return [...history.value].reverse()
})
</script>

<template>
  <section>
    <header class="text-xl text-center">
      历史记录
    </header>
    <main class="rounded relative border flex flex-col min-h-60 justify-start even:children:bg-bluegray/20">
      <div
        v-for="item, i in list"
        :key="item.id" class="flex p-1"
        :class="isSearching ? 'cursor-default' : 'cursor-pointer'"
        @click="onClick(item)"
      >
        <div class="flex-none mx-2">
          {{ i + 1 }}
        </div>
        <div>
          {{ item.name }}
        </div>
      </div>
      <div v-if="isSearching" class="absolute inset-0 flex items-center bg-gray/20">
        <UIcon name="i-heroicons-arrow-path" class="m-auto text-3xl animate-spin" />
      </div>
    </main>
  </section>
</template>

<style lang="postcss" scoped>

</style>
