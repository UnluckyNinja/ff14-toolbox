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
  return Object.keys(tokenRewards[selectedCurrency.value]!).map(it => Number.parseInt(it))
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
  <UContainer class="mt-10">
    <OptionsPanel :display="{ hq: false }">
      <div class="col-start-1">
        计价方式：
      </div>
      <div class="flex whitespace-nowrap items-center">
        金币
        <USwitch v-model="costMode" class="m-1" />
        <span class="whitespace-normal">
          金币/每单位兑换货币
        </span>
      </div>
    </OptionsPanel>
    <div class="mt-4 grid grid-cols-12">
      <Suspense>
        <div class="text-center col-span-12 md:col-span-3">
          <div class="hidden md:block">
            <CurrencyList v-model="selectedCurrency" @update:model-value="updateURL" @currency-name="selectedCurrencyName = $event" />
          </div>
          <USlideover v-model:open="mobileOpenCurrencyList" class="text-center md:hidden">
            <UButton block>
              选择货币 {{ selectedCurrencyName !== '' ? `当前已选择：${selectedCurrencyName}` : '' }}
            </UButton>
            <template #content>
              <UCard
                class="flex flex-1 flex-col h-full"
                :ui="{ body: 'flex-1 overflow-auto divide-y divide-gray-100 dark:divide-gray-800 ring-0' }"
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
            </template>
          </USlideover>
        </div>
        <template #fallback>
          <div class="bg-muted p-2 text-center grid col-span-12 h-40 grid-place-content-center animate-pulse md:col-span-3">
            加载货币列表中
          </div>
        </template>
      </Suspense>
      <div v-if="selectedCurrency > 0" class="col-span-12 md:col-span-9">
        <MarketItemList v-if="ids && ids.length > 0" class="w-fit" :ids="ids" :costs="costs" :cost-mode="costMode" />
        <div class="text-gray/80 m-2 text-center">
          <div v-if="!ids">
            🚧 施工ing... 还未录入数据啦哩 🚧
          </div>
          <div v-else>
            不可交易物品不会显示在这里呦啦哩
          </div>
        </div>
      </div>
      <div v-else class="pt-4 col-span-12 md:col-span-9">
        <div class="text-center">
          请先选择货币
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style lang="postcss" scoped></style>
