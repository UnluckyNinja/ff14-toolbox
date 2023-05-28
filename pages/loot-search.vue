<script lang="ts" setup>
definePageMeta({
  title: 'FF14 物品搜索工具',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const { db } = useDuckDB()

provide('duckDB', db)

const selectedItem = shallowRef(null as any)
provide('selected-item', selectedItem)
</script>

<template>
  <div class="grid grid-cols-5">
    <InstanceList class="col-span-1" />
  </div>
</template>

<style lang="postcss" scoped>

</style>
