<script lang="ts" setup>
import type { ShallowRef } from 'nuxt/dist/app/compat/capi'
import type { HistoryItem } from '~/composables/searchHistory'
import type { DuckDBClient } from '~/data/duckDB'

const { history, clear } = useSearchHistory()
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
    <main class="rounded relative border flex flex-col min-h-60 justify-start even:children:bg-bluegray/20 mt-4">
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
      <div v-if="isSearching" class="flex items-center absolute inset-0 bg-gray/20">
        <UIcon name="i-heroicons-arrow-path" class="text-3xl animate-spin m-auto" />
      </div>
    </main>
  </section>
</template>

<style lang="postcss" scoped>

</style>
