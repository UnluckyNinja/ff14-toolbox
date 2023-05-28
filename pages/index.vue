<script lang="ts" setup>
definePageMeta({
  title: 'FF14 杂七杂八工具箱',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})
</script>

<template>
  <div class="text-center">
    本页面查询工具建议在WIFI环境下使用
    <div class="grid grid-cols-4 mx-auto w-max place-items-center gap-4 p-4">
      <NuxtLink to="/item-search">
        <UButton size="xl" icon="i-heroicons-magnifying-glass" variant="solid">
          市场物品价格速查
        </UButton>
      </NuxtLink>
      <NuxtLink to="/loot-search">
        <UButton size="xl" icon="i-mdi-treasure-chest" variant="solid">
          副本可交易掉落查询
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
