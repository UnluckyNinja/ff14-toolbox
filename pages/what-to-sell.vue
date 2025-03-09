<script lang="ts" setup>
import { tokenRewards } from '~/data/tokens'

definePageMeta({
  title: '💰艾欧泽亚什么值得卖',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const id = route.query.currency && typeof route.query.currency === 'string'
  ? Number.parseInt(route.query.currency)
  : 0

const selectedCurrency = ref(tokenRewards[id] ? id : 0)
const selectedCurrencyName = ref('')

async function updateURL(value: number | string) {
  navigateTo(`${route.path}?currency=${value}`)
}

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

const mobileOpenCurrencyList = ref(false)
</script>

<template>
  <div class="mx-auto mt-10 container">
    <OptionsPanel :display="{ hq: false }">
      <div class="col-start-1">
        计价方式：
      </div>
      <div class="flex items-center whitespace-nowrap">
        金币
        <UToggle v-model="costMode" class="m-1" />
        <span class="whitespace-normal">
          金币/每单位兑换货币
        </span>
      </div>
    </OptionsPanel>
    <div class="grid grid-cols-12 mt-4">
      <Suspense>
        <div class="col-span-12 text-center md:col-span-3">
          <div class="hidden md:block">
            <CurrencyList v-model="selectedCurrency" @update:model-value="updateURL" @currency-name="selectedCurrencyName = $event" />
          </div>
          <div class="mx-2 md:hidden" @click="mobileOpenCurrencyList = true">
            <UButton block>
              选择货币 {{ selectedCurrencyName !== '' ? `当前已选择：${selectedCurrencyName}` : '' }}
            </UButton>
          </div>
          <USlideover v-model="mobileOpenCurrencyList" class="text-center md:hidden" side="left">
            <UCard
              class="h-full flex flex-1 flex-col"
              :ui="{ body: { base: 'flex-1 overflow-auto' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
            >
              <template #header>
                货币列表
              </template>
              <CurrencyList v-model="selectedCurrency" :header="false" @update:model-value="updateURL" @currency-name="selectedCurrencyName = $event" />
              <template #footer>
                <UButton variant="soft" size="xl" block @click="mobileOpenCurrencyList = false">
                  关闭
                </UButton>
              </template>
            </UCard>
          </USlideover>
        </div>
        <template #fallback>
          <div class="col-span-12 p-2 text-center md:col-span-3">
            加载货币列表中
          </div>
        </template>
      </Suspense>
      <div v-if="selectedCurrency > 0" class="col-span-12 md:col-span-9">
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
      <div v-else class="col-span-12 pt-4 md:col-span-9">
        <div class="text-center">
          请先选择货币
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
