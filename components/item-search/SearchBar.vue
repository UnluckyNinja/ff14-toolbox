<script lang="ts" setup>
import type { ShallowRef } from 'vue'
import type { DuckDBClient } from '~/lib/duckDB'

const emits = defineEmits<{
  (event: 'itemClick', value: any): void
}>()

const db = inject<ShallowRef<DuckDBClient | null>>('duckDB')

const isSearching = ref(false)
const showSearchResult = ref(false)

// search
const search = ref('')
const results = shallowRef<any[]>([])

const { queryNames } = useQueries()

async function searchDB(value: string) {
  if (!value || !db?.value)
    return []
  const words = value.split(/\s+/)
  return await queryNames(words)
}

// auto update search results
watchDebounced(search, async (newVal) => {
  isSearching.value = true
  results.value = await searchDB(newVal)
  isSearching.value = false
  showSearchResult.value = results.value.length > 0
}, { debounce: 500 })

// switch item list
const compRoot = ref<HTMLDivElement | null>(null)

onClickOutside(compRoot, () => {
  showSearchResult.value = false
})

// each item/row in the virtual list represents 3 search results
const rowsAsArray = computed(() => {
  const array = Array.from(new Array(Math.ceil(results.value.length / 3)).keys())
  return array
})

const { list, containerProps, wrapperProps } = useVirtualList(
  rowsAsArray,
  {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 60,
  },
)

function select(index: number) {
  showSearchResult.value = false
  emits('itemClick', results.value[index])
}
</script>

<template>
  <div ref="compRoot" class="relative">
    <div class="my-4 grid grid-cols-1 relative">
      <!-- workaround due to nuxtlabs/ui style conflicting with unocss -->
      <!-- <div class="pl-12"></div> -->
      <UInput
        v-model="search"
        size="xl"
        name="search-input"
        placeholder="输入物品名，空格分隔关键词，不区分大小写"
        icon="i-heroicons-magnifying-glass-20-solid"
        :trailing="false"
        @update:model-value="isSearching = true"
        @focus="showSearchResult = results.length > 0"
      />
      <div v-show="search !== ''" class="flex h-full items-center right-10 top-0 absolute">
        <div v-if="isSearching">
          搜索中
        </div>
        <div v-else>
          找到 {{ results.length }} 物品
        </div>
      </div>
    </div>
    <div
      v-show="showSearchResult"
      v-bind="containerProps"
      class="bg-default mt-px p-2 border border-yellow-500 rounded max-h-300px w-full shadow-lg top-full absolute z-10 overflow-auto"
    >
      <div v-bind="wrapperProps">
        <div v-for="i in list" :key="i.index" class="grid grid-cols-3" style="height: 60px">
          <SearchBarItem v-if="i.index * 3 < results.length" class="hover:bg-accented hover:cursor-pointer" :item="results[i.index * 3]" @click="select(i.index * 3)" />
          <SearchBarItem v-if="i.index * 3 + 1 < results.length" class="hover:bg-accented hover:cursor-pointer" :item="results[i.index * 3 + 1]" @click="select(i.index * 3 + 1)" />
          <SearchBarItem v-if="i.index * 3 + 2 < results.length" class="hover:bg-accented hover:cursor-pointer" :item="results[i.index * 3 + 2]" @click="select(i.index * 3 + 2)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
