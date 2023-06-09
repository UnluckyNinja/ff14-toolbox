<script lang="ts" setup>
import type { Instance } from '~/composables/instances'
import { instanceLoots } from '~/data/loots'

definePageMeta({
  title: 'FF14 副本可交易掉落查询',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

// const { db } = useDuckDB()
// const { queryID } = useQueries(db)

// provide('duckDB', db)

const selectedItem = shallowRef(null as any)
provide('selected-item', selectedItem)

const selectedInstance = ref<Instance>()

const isNotDone = computed(() => {
  if (!selectedInstance.value)
    return false
  return !instanceLoots[selectedInstance.value.i]
})

const loots = computed(() => {
  if (!selectedInstance.value || !instanceLoots[selectedInstance.value.i])
    return []
  return instanceLoots[selectedInstance.value.i]
})

const imgUrl = itemIconUrl
</script>

<template>
  <div class="mx-auto mt-10 container">
    <div>
      <OptionsPanel :display="{ hq: false }" />
      <div class="grid grid-cols-7">
        <InstanceList class="col-span-2" @update:model-value="selectedInstance = $event" />
        <div v-if="selectedInstance" class="col-span-5">
          <h2 class="text-center text-xl font-bold">
            <img class="inline-block h-8 w-8" :src="imgUrl(selectedInstance.c.toString())">
            {{ selectedInstance.n }}
          </h2>
          <MarketItemList v-if="loots.length > 0" :ids="loots" />
          <div class="m-2 text-center text-gray/80">
            <div v-if="isNotDone">
              🚧 施工ing... 还未录入数据啦哩 🚧
            </div>
            <div v-else-if="loots.length === 0">
              这个本好像没有可交易掉落啦哩
            </div>
            <div v-else>
              不可交易物品不会显示在这里呦啦哩
            </div>
          </div>
        </div>
        <div v-else class="col-span-5">
          <div class="text-center">
            请先选择副本
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
