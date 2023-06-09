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
    <h1 class="mt-8 text-3xl">
      游戏工具
    </h1>
    <div class="m-4 mx-auto flex justify-center gap-4">
      <NuxtLink to="/item-search">
        <UButton size="xl" icon="i-heroicons-magnifying-glass" variant="solid">
          市场物品价格速查(需加载5MB+)
        </UButton>
      </NuxtLink>
      <NuxtLink to="/loot-search">
        <UButton size="xl" icon="i-mdi-treasure-chest" variant="solid">
          副本可交易掉落查询
        </UButton>
      </NuxtLink>
      <NuxtLink to="/what-to-sell">
        <UButton size="xl" icon="i-heroicons-shopping-cart" variant="solid">
          艾欧泽亚什么值得卖
        </UButton>
      </NuxtLink>
    </div>
    <h1 class="mt-8 text-3xl">
      开发工具
    </h1>
    <div class="m-4 mx-auto flex justify-center gap-4">
      <NuxtLink to="/name-to-id">
        <UButton size="xl" icon="i-heroicons-document-magnifying-glass" variant="solid">
          数据库批量查询
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
