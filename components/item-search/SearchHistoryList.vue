<script lang="ts" setup>
import type { ShallowRef } from 'vue'
import type { HistoryItem } from '~/composables/searchHistory'
import type { DuckDBClient } from '~/data/duckDB'

const { history, clear } = useSearchHistory()
const selectedItem = inject<ShallowRef<any>>('selected-item', shallowRef(null))

const db = inject<ShallowRef<DuckDBClient>>('duckDB')

const isSearching = ref(false)

function onClick(item: HistoryItem) {
  if (!db || !db.value)
    return
  if (isSearching.value)
    return
  if (selectedItem.value?.id === item.id)
    return
  // isSearching.value = true
  selectedItem.value = item
  // queryID(item.id).then((result) => {
  //   isSearching.value = false
  // })
}

const list = computed(() => {
  return [...history.value].reverse()
})

function handleDelete() {
  clear()
}
</script>

<template>
  <section>
    <header class="relative text-center text-xl">
      历史记录
      <div v-if="history.length > 0" class="absolute right-0 top-0">
        <UPopover>
          <UButton
            color="red" size="sm" variant="soft"
          >
            清空
          </UButton>
          <template #panel="{ close }">
            <UCard>
              <template #header>
                <span>清空历史记录？</span>
              </template>
              <div class="flex justify-around">
                <UButton color="red" @click="close(); handleDelete()">
                  删除
                </UButton>
                <UButton color="white" @click="close">
                  取消
                </UButton>
              </div>
            </UCard>
          </template>
        </UPopover>
      </div>
    </header>
    <main class="relative mt-4 min-h-60 flex flex-col justify-start border rounded even:children:bg-bluegray/20">
      <div
        v-for="item, i in list"
        :key="item.id" class="flex p-1"
        :class="isSearching ? 'cursor-default' : 'cursor-pointer'"
        @click="onClick(item)"
      >
        <div class="mx-2 flex-none">
          {{ i + 1 }}
        </div>
        <div>
          {{ item.name }}
        </div>
      </div>
      <div v-if="isSearching" class="absolute inset-0 flex items-center bg-gray/20">
        <UIcon name="i-heroicons-arrow-path" class="m-auto animate-spin text-3xl" />
      </div>
    </main>
  </section>
</template>

<style lang="postcss" scoped>

</style>
