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
  <div class="grid grid-cols-4 mx-auto w-max place-items-center gap-4 p-4">
    <NuxtLink to="/item-search">
      <UButton size="xl" icon="i-heroicons-magnifying-glass" variant="solid">
        物品搜索（建议WIFI环境下使用）
      </UButton>
    </NuxtLink>
  </div>
</template>

<style lang="postcss" scoped>

</style>
