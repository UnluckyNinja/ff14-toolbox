<script lang="ts" setup>
import type { SaleView } from '~/utils/universalis'

const props = withDefaults(defineProps<{
  id: number | string
  hq?: boolean
}>(), {
  hq: undefined,
})

const allColumns = [
  {
    key: 'world',
    label: '服务器',
  },
  {
    key: 'hq',
    label: '优质',
  },
  // {
  //   key: 'materia',
  //   label: '魔晶石数量',
  // },
  {
    key: 'price',
    label: '单价',
  },
  {
    key: 'amount',
    label: '数量',
  },
  {
    key: 'buyerName',
    label: '买家',
  },
  {
    key: 'timestamp',
    label: '交易时间',
  },
]

const { selectedServer, numberPerPage } = useSettings()
const toast = useToast()

const { data, error, pending, refresh } = useAsyncData(() => fetchHistory(selectedServer.value, props.id, numberPerPage.value, props.hq))

watch([() => props.id, selectedServer, () => props.hq], () => {
  data.value = []
  refresh()
})

watch(error, (newVal) => {
  if (newVal) {
    toast.add({
      title: '请求 Universalis 数据失败',
      description: newVal.message,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
})
</script>

<template>
  <UTable
    :rows="data ?? []" :columns="allColumns" :loading="pending"
    :loading-state="{ icon: 'i-heroicons-arrow-path', label: '加载中' }"
    :empty-state="{ icon: 'i-carbon-circle-dash', label: '空' }"
  >
    <template #world-data="{ row }: {row: SaleView}">
      {{ row.worldName ?? selectedServer }}
    </template>
    <template #hq-data="{ row }: {row: SaleView}">
      {{ row.hq ? '' : '' }}
    </template>
    <template #price-header="{ column }">
      <div class="text-right">
        {{ column.label }}
      </div>
    </template>
    <template #price-data="{ row }: {row: SaleView}">
      <div class="text-right">
        {{ row.pricePerUnit.toLocaleString() }}
      </div>
    </template>
    <template #amount-header="{ column }">
      <div class="text-right">
        {{ column.label }}
      </div>
    </template>
    <template #amount-data="{ row }: {row: SaleView}">
      <div class="text-right">
        {{ row.quantity }}
      </div>
    </template>
    <template #buyerName-data="{ row }: {row: SaleView}">
      {{ row.buyerName }}
    </template>
    <template #timestamp-data="{ row }: {row: SaleView}">
      {{ new Date(row.timestamp * 1000).toLocaleString() }}
    </template>
  </UTable>
</template>

<style lang="postcss" scoped>
</style>
