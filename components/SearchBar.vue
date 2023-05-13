<script lang="ts" setup>
import type { DuckDBClient } from '~/data/duckDB';
import { loadItemData, getItemData } from '~/data';

const emits = defineEmits<{
  (event: 'update:modelValue', value: any[]): void
  (event: 'itemClick', value: any): void
}>()

const db = useState<DuckDBClient | null>('duckdb', ()=>null)

const columnNames = [
  'items."key: #" as id',
  '"9: Name" as name',
  '"10: Icon" as iconID',
  '"11: Level{Item}" as itemLevel',
  '"22: IsUntradable" as isUntradable',
  // '"25: Price{Mid}" as shopPrice',
  // '"8: Description" as description',
  'IF("27: CanBeHq" = \'False\', false, true) as canBeHQ',
]

const uiState = useUIState()
// search
const search = ref('')
const results = shallowRef<any[]>([])
async function searchDB(value: string) {
  if (!value) return []
  const words = value.split(/\s+/)
  // const query = `select items."key: #" as id, "9: Name" as name, "11: Level{Item}" as itemLevel, "25: Price{Mid}" as shopPrice, "8: Description" as description, IF(shop_items."0: Item" is null, false, true) as inShop, IF("27: CanBeHq" = 'False', false, true) as canBeHQ from items left join ( select "0: Item" from shop_items group by shop_items."0: Item" ) as shop_items on items."key: #" = shop_items."0: Item" where name != '' and "22: IsUntradable" = 'False' and ${Array(words.length).fill('name like ?').join(' and ')}`
  const query = `select ${columnNames.join(', ')} from items where name != '' and ${Array(words.length).fill('name like ?').join(' and ')}`
  return await db.value?.query(query, words.map(it => `%${it}%`)) || []
}

// auto update search results
watchDebounced(search, async (newVal) => {
  uiState.value.searching = true
  results.value = await searchDB(newVal)
  uiState.value.searching = false
  uiState.value.showSearchResult = results.value.length > 0
  emits('update:modelValue', results.value)
}, { debounce: 500 })

// switch item list
const compRoot = ref<HTMLDivElement | null>(null)

onClickOutside(compRoot, () => {
  uiState.value.showSearchResult = false
})

const rowsAsArray = computed(() => {
  const array = Array.from(Array(Math.ceil(results.value.length / 3)).keys())
  return array
})

const { list, containerProps, wrapperProps } = useVirtualList(
  rowsAsArray,
  {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 60,
  },
)

function select(index: number){
  uiState.value.showSearchResult = false
  emits('itemClick', results.value[index])
}
</script>

<template>
  <div ref="compRoot" class="relative">
    <div class="relative">
      <AInput @focus="uiState.showSearchResult = results.length > 0" type="text" name="" id="" v-model="search"
        prepend-inner-icon="i-bx-search" />
      <div class="absolute right-10 top-0 h-full flex items-center text-dark/50">找到 {{ results.length }} 物品</div>
    </div>
    <div v-bind="containerProps" v-show="uiState.showSearchResult" class="absolute z-10 top-full w-full 
            h-300px p-2 bg-white
            border border-yellow-600 rounded shadow
            overflow-auto">
      <div v-bind="wrapperProps">
        <div class="grid grid-cols-3" v-for="i, idx in list" :key="idx" style="height: 60px">
          <ItemInfoListItem class="hover:cursor-pointer hover:brightness-110 hover:bg-dark/20" v-if="i.index * 3 < results.length" :item="results[i.index * 3]" @click="select(i.index * 3)"></ItemInfoListItem>
          <ItemInfoListItem class="hover:cursor-pointer hover:brightness-110 hover:bg-dark/20" v-if="i.index * 3 + 1 < results.length" :item="results[i.index * 3 + 1]" @click="select(i.index * 3 +1)"></ItemInfoListItem>
          <ItemInfoListItem class="hover:cursor-pointer hover:brightness-110 hover:bg-dark/20" v-if="i.index * 3 + 2 < results.length" :item="results[i.index * 3 + 2]" @click="select(i.index * 3 + 2)"></ItemInfoListItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>