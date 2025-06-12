<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import type { ListingView } from '~/utils/universalis'

const props = withDefaults(defineProps<{
  id: number | string
  hq?: boolean
  server?: string
}>(), {
  hq: undefined,
})

const allColumns: TableColumn<ListingView>[] = [
  {
    id: 'world',
    header: '服务器',
  },
  {
    id: 'hq',
    header: '优质',
  },
  // {
  //   key: 'materia',
  //   label: '魔晶石数量',
  // },
  {
    id: 'price',
    header: '单价',
  },
  {
    id: 'amount',
    header: '数量',
  },
  {
    id: 'total',
    header: '总价',
  },
  {
    id: 'retainer',
    header: '雇员名',
  },
]

const { selectedServer, numberPerPage } = useSettings()
const toast = useToast()

const { data, error, pending, refresh } = useAsyncData(() => fetchListings(props.server ?? selectedServer.value, props.id, numberPerPage.value, props.hq))

watch([() => props.id, () => (props.server ?? selectedServer.value), () => props.hq], () => {
  data.value = []
  refresh()
})

onBeforeMount(() => {
  data.value = []
})

watch(error, (newVal) => {
  if (newVal) {
    toast.add({
      title: '请求 Universalis 数据失败',
      description: newVal.message,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
})
</script>

<template>
  <UTable
    :data="data ?? []" :columns="allColumns" :loading="pending"
    :loading-state="{ icon: 'i-heroicons-arrow-path', label: '加载中' }"
    :empty-state="{ icon: 'i-carbon-circle-dash', label: '空' }"
  >
    <template #world-cell="{ row }">
      {{ row.original.worldName ?? selectedServer }}
    </template>
    <template #hq-cell="{ row }">
      {{ row.original.hq ? '' : '' }}
    </template>
    <template #price-header="{ column }">
      <div class="text-right">
        {{ column.columnDef.header }}
      </div>
    </template>
    <template #price-cell="{ row }">
      <div class="text-right">
        {{ row.original.pricePerUnit.toLocaleString() }}
      </div>
    </template>
    <template #amount-header="{ column }">
      <div class="text-right">
        {{ column.columnDef.header }}
      </div>
    </template>
    <template #amount-cell="{ row }">
      <div class="text-right">
        {{ row.original.quantity }}
      </div>
    </template>
    <template #total-header="{ column }">
      <div class="text-right">
        {{ column.columnDef.header }}
      </div>
    </template>
    <template #total-cell="{ row }">
      <div class="text-right">
        {{ row.original.total.toLocaleString() }}
      </div>
    </template>
    <template #retainer-cell="{ row }">
      {{ row.original.retainerName }}
    </template>
  </UTable>
</template>

<style lang="postcss" scoped>
</style>
