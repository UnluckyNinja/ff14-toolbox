<script lang="ts" setup>
import type { ShallowRef } from 'vue'
import type { HistoryItem } from '~/composables/searchHistory'
import type { DuckDBClient } from '~/lib/duckDB'

const { history, clear } = useSearchHistory()
const selectedItem = inject<ShallowRef<any>>('selected-item', shallowRef(null))

const db = inject<ShallowRef<DuckDBClient>>('duckDB')

const isSearching = ref(false)
const openClearPopup = ref(false)

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
    <header class="text-xl text-center relative">
      历史记录
      <div v-if="history.length > 0" class="right-0 top-0 absolute">
        <UPopover v-model:open="openClearPopup">
          <UButton
            color="error" size="sm" variant="subtle"
          >
            清空
          </UButton>
          <template #content>
            <UCard>
              <template #header>
                <span>清空历史记录？</span>
              </template>
              <div class="flex justify-around">
                <UButton color="error" @click="openClearPopup = false; handleDelete()">
                  删除
                </UButton>
                <UButton color="neutral" @click="openClearPopup = false">
                  取消
                </UButton>
              </div>
            </UCard>
          </template>
        </UPopover>
      </div>
    </header>
    <main class="border-muted mt-4 border rounded flex flex-col min-h-60 justify-start relative">
      <div
        v-for="item, i in list"
        :key="i" class="even:bg-muted p-1 flex"
        :class="[isSearching ? 'cursor-default' : 'cursor-pointer']"
        @click="onClick(item)"
      >
        <div class="mx-2 flex-none">
          {{ i + 1 }}
        </div>
        <div>
          {{ item.name }}
        </div>
      </div>
      <div v-if="isSearching" class="bg-gray/20 flex items-center inset-0 absolute">
        <UIcon name="i-heroicons-arrow-path" class="text-3xl m-auto animate-spin" />
      </div>
    </main>
  </section>
</template>

<style lang="postcss" scoped>

</style>
