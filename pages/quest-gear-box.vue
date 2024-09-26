<script lang="ts" setup>
import { classJobCategory, equipSlotCategory } from '~/data/classJobCategory';
import supplyJSON from '~/data/GCSupplyDuty.json'

definePageMeta({
  title: '主线装备箱可筹备查询',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const { db } = useDuckDB()

const { queryIDs } = useQueries(db)

const items = Object.entries(supplyJSON).flatMap(([job, itemsByLevel]) => {
  return Object.entries(itemsByLevel).flatMap(([level, item]) => item.map(it => {
    return {
      id: it.id,
      amount: it.amount,
      jobLevel: level,
      supplyJob: job,
    }
  }))
})

const itemsMap = new Map(items.map(it=>[it.id, it]))

const ids = items.map(it => it.id)

const p = until(db).toBeTruthy().then(() => queryIDs(ids, ['classJobCategory', 'equipSlotCategory']))
const { state: queryResults, isLoading, isReady } = useAsyncState(p, [])

const searchResult = shallowRef([] as typeof queryResults['value'])
const searchResultInfo = computed(()=>{
  return searchResult.value.map(it=>{
    return {
      ...itemsMap.get(parseInt(it.id)),
      name: it.name,
      itemLevel: it.itemLevel,
      classJob: classJobCategory[it.classJobCategory]
    }
  })
})

function filterSupply(itemLevel: string | number, equipSlotCaategory: string | number) {
  searchResult.value = queryResults.value.filter((it) => {
    let slotFlag
    if (selectedEquipSlot.value === '1') {
      slotFlag = it.equipSlotCategory === '1' || it.equipSlotCategory === '2' || it.equipSlotCategory === '13'
    } else {
      slotFlag = it.equipSlotCategory === selectedEquipSlot.value
    }
    return it.itemLevel === '' + selectedItemLevel.value && slotFlag
  })
}

const selectedItemLevel = ref(0)
const selectedEquipSlot = ref('1')

const equipOptions = [Object.entries(equipSlotCategory).map(([k, v]) => {
  return {
    label: v,
    click: () => {
      selectedEquipSlot.value = k
    }
  }
})]


</script>

<template>
  <DBLoading v-if="!db || !isReady" />
  <div v-else class="mx-auto container">
    <OptionsPanel />
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-4 space-y-4">
        <UCard>
          <div class="flex justify-between">
            <UInput type="number" placeholder="物品等级" v-model="selectedItemLevel" />
            <UDropdown :items="equipOptions" :popper="{ placement: 'bottom-start' }">
              <UButton color="white" :label="equipSlotCategory[selectedEquipSlot]"
                trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
            <UButton color="blue" @click="filterSupply(selectedItemLevel, selectedEquipSlot)">查询</UButton>
          </div>
        </UCard>
        <div v-if="searchResultInfo.length > 0" class="jobResult gap-2 text-center items-center border rounded p-2">
            <div class="text-sm">物品名</div>
            <div class="text-sm">提交数量</div>
            <div class="text-sm">提交职业</div>
            <div class="text-sm">提交等级</div>
            <div class="text-sm">装备职业</div>
          <template v-for="item in searchResultInfo">
            <hr class="col-span-6">
            <div class="col-start-1 line-clamp-2" :title="item.name">{{ item.name }}</div>
            <div class="">{{ item.amount }}</div>
            <div class="">{{ item.supplyJob }}</div>
            <div class="">{{ item.jobLevel }}</div>
            <div class="line-clamp-2 text-ellipsis text-xs" :title="item.classJob">{{ item.classJob }}</div>
          </template>
        </div>
      </div>
      <div class="col-span-8">
        <MarketItemList :ids="searchResult.map(it=>parseInt(it.id))" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.jobResult {
  display: grid;
  grid-template-columns: auto max-content max-content max-content auto;
}
</style>
