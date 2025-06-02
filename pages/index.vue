<script lang="ts" setup>
definePageMeta({
  title: 'FF14 杂七杂八工具箱',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

interface ToolItem {
  link: string
  icon: string
  label: string
  tags: Array<{
    type: 'error' | 'primary' | 'secondary' | 'warning' | 'success' | 'info' | 'neutral' | undefined
    label: string
  }>
  description?: string
}

const gameTools: ToolItem[] = [
  {
    link: '/item-search',
    icon: 'i-heroicons-magnifying-glass',
    label: '市场物品价格速查',
    tags: [{ type: 'warning', label: '~10MB' }],
    description: '任意关键词查询物品价格，例如“乐谱 暗影”，也适合查背包中物品或者配方原料。会下载数据库到本地运行。',
  },
  {
    link: '/loot-search',
    icon: 'i-mdi-treasure-chest',
    label: '副本可交易掉落查询',
    tags: [],
    description: '快速查询挖宝和副本的掉落价格（因开发者动力不足，目前只有挖宝和部分副本的数据）。',
  },
  {
    link: '/what-to-sell',
    icon: 'i-heroicons-shopping-cart',
    label: '艾欧泽亚什么值得卖',
    tags: [],
    description: '货币兑换物品比价，适合货币溢出时快速找到适合挂板子的物品。',
  },
  {
    link: '/quest-gear-box',
    icon: 'i-game-icons-chest-armor',
    label: '主线装备箱可筹备查询',
    tags: [{ type: 'warning', label: '~10MB' }],
    description: '查看装备箱开出的道具哪些可以用于筹备（注意未包含理符数据）。会下载数据库到本地运行。',
  },
  {
    link: '/market-trending',
    icon: 'i-heroicons:presentation-chart-line',
    label: '艾欧泽亚什么涨得凶/跌得狠',
    tags: [],
    description: '用于对比国际服与国服物品价格，查看因版本差导致的市场供需平衡变化',
  },
]
const devTools: ToolItem[] = [
  {
    link: '/name-to-id',
    icon: 'i-heroicons-document-magnifying-glass',
    label: '数据库批量查询',
    tags: [{ type: 'warning', label: '~10MB' }],
    description: '按行批量将物品ID/名称互转，或转为物品属性。会下载数据库到本地运行。',
  },
]
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ list: ToolItem[] }>()
</script>

<template>
  <DefineTemplate v-slot="{ list }">
    <NuxtLink v-for="tool, i in list" :key="i" class="col-span-1" :to="tool.link">
      <UCard class="h-full" :icon="tool.icon" variant="subtle">
        <template #header>
          <div class="text-xl flex gap-1 items-center">
            <UIcon :name="tool.icon" class="size-5" />
            {{ tool.label }}
            <UIcon name="tool.icon" class="size-5" />
          </div>
        </template>
        <div class="flex flex-col gap-2 items-start">
          <UBadge v-for="tag, bi in tool.tags" :key="bi" class="rounded-full" :color="tag.type" variant="subtle">
            {{ tag.label }}
          </UBadge>
          <p>
            {{ tool.description }}
          </p>
        </div>
      </UCard>
    </NuxtLink>
  </DefineTemplate>
  <UContainer class="">
    <h1 class="text-3xl mt-8">
      游戏工具
    </h1>
    <div
      class="my-4 gap-4 grid grid-cols-1 md:grid-cols-3"
    >
      <ReuseTemplate :list="gameTools" />
    </div>
    <h1 class="text-3xl mt-8">
      开发工具
    </h1>
    <div
      class="my-4 gap-4 grid grid-cols-1 items-stretch justify-center md:grid-cols-3"
    >
      <ReuseTemplate :list="devTools" />
    </div>
  </UContainer>
</template>

<style lang="postcss" scoped>

</style>
