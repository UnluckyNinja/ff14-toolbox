<script lang="ts" setup>
definePageMeta({
  title: 'FF14 杂七杂八工具箱',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})
const gameTools = [
  {
    link: '/item-search',
    icon: 'i-heroicons-magnifying-glass',
    label: '市场物品价格速查(不建议数据网络访问)',
  },
  {
    link: '/loot-search',
    icon: 'i-mdi-treasure-chest',
    label: '副本可交易掉落查询',
  },
  {
    link: '/what-to-sell',
    icon: 'i-heroicons-shopping-cart',
    label: '艾欧泽亚什么值得卖',
  },
  {
    link: '/quest-gear-box',
    icon: 'i-game-icons-chest-armor',
    label: '主线装备箱可筹备查询(不建议数据网络访问)',
  },
]
const devTools = [
  {
    link: '/name-to-id',
    icon: 'i-heroicons-document-magnifying-glass',
    label: '数据库批量查询(不建议数据网络访问)',
  },
]
</script>

<template>
  <div class="text-center">
    <h1 class="mt-8 text-3xl">
      游戏工具
    </h1>
    <div
      class="m-4 mx-auto flex flex-col items-stretch justify-center gap-2 px-2 md:flex-row"
    >
      <NuxtLink v-for="tool, i in gameTools" :key="i" :to="tool.link">
        <UButton size="xl" block :icon="tool.icon" variant="solid">
          {{ tool.label }}
        </UButton>
      </NuxtLink>
    </div>
    <h1 class="mt-8 text-3xl">
      开发工具
    </h1>
    <div
      class="m-4 mx-auto flex flex-col items-stretch justify-center gap-2 px-2 md:flex-row"
    >
      <NuxtLink v-for="tool, i in devTools" :key="i" :to="tool.link">
        <UButton size="xl" block :icon="tool.icon" variant="solid">
          {{ tool.label }}
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
