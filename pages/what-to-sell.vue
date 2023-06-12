<script lang="ts" setup>
import { tokenRewards } from '~/data/tokens'

definePageMeta({
  title: '💰艾欧泽亚什么值得卖',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const selectedCurrency = ref(0)

const ids = computed(() => {
  if (!tokenRewards[selectedCurrency.value])
    return []
  return Object.keys(tokenRewards[selectedCurrency.value]).map(it => Number.parseInt(it))
})
const costs = computed(() => {
  if (!tokenRewards[selectedCurrency.value])
    return {}
  return tokenRewards[selectedCurrency.value]
})

const costMode = ref(false)
</script>

<template>
  <div class="mx-auto mt-10 container">
    <OptionsPanel :display="{ hq: false }" />
    <div class="grid grid-cols-12 mt-4">
      <Suspense>
        <div class="col-span-3 text-center">
          <div>
            计价方式：
            金币
            <UToggle v-model="costMode" />
            金币/每单位兑换货币
          </div>
          <CurrencyList v-model="selectedCurrency" />
        </div>
        <template #fallback>
          <div class="col-span-3 p-2 text-center">
            加载货币列表中
          </div>
        </template>
      </Suspense>
      <div v-if="selectedCurrency > 0" class="col-span-9">
        <MarketItemList v-if="ids && ids.length > 0" :ids="ids" :costs="costs" :cost-mode="costMode" />
        <div class="m-2 text-center text-gray/80">
          <div v-if="!ids">
            🚧 施工ing... 还未录入数据啦哩 🚧
          </div>
          <div v-else>
            不可交易物品不会显示在这里呦啦哩
          </div>
        </div>
      </div>
      <div v-else class="col-span-5">
        <div class="text-center">
          请先选择货币
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
