<script lang="ts" setup>
import { classJobCategory, equipSlotCategory } from '~/data/classJobCategory'
import supplyJSON from '~/data/GCSupplyDuty.json'
import { useDuckDB } from '~/lib/duckDB'

definePageMeta({
  title: '主线装备箱可筹备查询',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const db = useDuckDB()

const { queryIDs } = useQueries()

const items = Object.entries(supplyJSON).flatMap(([job, itemsByLevel]) => {
  return Object.entries(itemsByLevel).flatMap(([level, item]) => item.map((it) => {
    return {
      id: it.id,
      amount: it.amount,
      jobLevel: level,
      supplyJob: job,
    }
  }))
})

const itemsMap = new Map(items.map(it => [it.id, it]))

const ids = items.map(it => it.id)

const p = until(db).toBeTruthy().then(() => queryIDs(ids, ['classJobCategory', 'equipSlotCategory']))
const { state: queryResults, isLoading: _isLoading, isReady } = useAsyncState(p, [])

const searchResult = shallowRef<typeof queryResults['value']>([])
const searchResultInfo = computed(() => {
  return searchResult.value.map((it) => {
    return {
      ...itemsMap.get(Number.parseInt(it.id)),
      name: it.name,
      itemLevel: it.itemLevel,
      classJob: classJobCategory[it.classJobCategory],
    }
  })
})
const marketItemIDs = computed(() => {
  return searchResult.value.map(it => Number.parseInt(it.id))
})

function filterSupply(itemLevel: string | number, equipSlotCategory: string | number) {
  searchResult.value = queryResults.value.filter((it) => {
    let slotFlag
    if (equipSlotCategory === '1') {
      slotFlag = it.equipSlotCategory === '1' || it.equipSlotCategory === '2' || it.equipSlotCategory === '13'
    } else {
      slotFlag = it.equipSlotCategory === equipSlotCategory
    }
    return it.itemLevel === `${itemLevel}` && slotFlag
  })
}

const selectedItemLevel = ref(0)
const selectedEquipSlot = ref('1')

const equipOptions = [Object.entries(equipSlotCategory).map(([k, v]) => {
  return {
    label: v,
    onSelect: () => {
      selectedEquipSlot.value = k
    },
  }
})]
</script>

<template>
  <DBLoading v-if="!db || !isReady" />
  <UContainer v-else class="mt-10">
    <OptionsPanel />
    <div class="gap-2 grid grid-cols-12">
      <div class="col-span-4 space-y-4">
        <UCard>
          <div class="flex justify-between">
            <UInput v-model="selectedItemLevel" type="number" placeholder="物品等级" />
            <USelect :items="equipOptions" :popper="{ placement: 'bottom-start' }">
              {{ equipSlotCategory[selectedEquipSlot] }}
            </USelect>
            <UButton color="info" @click="filterSupply(selectedItemLevel, selectedEquipSlot)">
              查询
            </UButton>
          </div>
        </UCard>
        <div v-if="searchResultInfo.length > 0" class="border-default jobResult p-2 text-center border rounded-lg gap-2 items-center">
          <div class="text-sm">
            物品名
          </div>
          <div class="text-sm">
            提交数量
          </div>
          <div class="text-sm">
            提交职业
          </div>
          <div class="text-sm">
            提交等级
          </div>
          <div class="text-sm">
            装备职业
          </div>
          <template v-for="item in searchResultInfo" :key="item.id">
            <hr class="col-span-6">
            <div class="col-start-1 line-clamp-2" :title="item.name">
              {{ item.name }}
            </div>
            <div class="">
              {{ item.amount }}
            </div>
            <div class="">
              {{ item.supplyJob }}
            </div>
            <div class="">
              {{ item.jobLevel }}
            </div>
            <div class="text-xs text-ellipsis line-clamp-2" :title="item.classJob">
              {{ item.classJob }}
            </div>
          </template>
        </div>
      </div>
      <div class="col-span-8">
        <MarketItemList :ids="marketItemIDs" />
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.jobResult {
  display: grid;
  grid-template-columns: auto max-content max-content max-content auto;
}
</style>
