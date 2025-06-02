<script lang="ts" setup>
const selectedItem = inject<Ref<any>>('selected-item')
const settings = reactive(useSettings())
const hq = computed(() => {
  if (selectedItem?.value.canBeHQ && settings.onlyHQ) {
    return true
  }

  return undefined
})

const isUntradable = computed(() => {
  return selectedItem && selectedItem.value.isUntradable === 'True'
})
</script>

<template>
  <div>
    <!-- 物品可交易 -->
    <div v-if="selectedItem && !isUntradable">
      <div class="text-sm text-center grid grid-cols-1 divide-x md:grid-cols-2">
        <!-- on sale -->
        <div>
          <h2 class="text-2xl m-2">
            在售列表
          </h2>
          <MarketListings :id="selectedItem.id" :hq="hq" />
        </div>
        <!-- history -->
        <div>
          <h2 class="text-2xl m-2">
            历史交易
          </h2>
          <MarketHistory :id="selectedItem.id" :hq="hq" />
        </div>
      </div>
    </div>
    <!-- 物品不可交易 -->
    <div v-else-if="selectedItem">
      <div class="text-center">
        <div class="text-lg">
          当前物品不可交易
        </div>
      </div>
    </div>
    <!-- 未选择物品时 -->
    <div v-else>
      <div class="text-center">
        <div class="text-lg">
          请在上方搜索框内输入关键词搜索物品并点击
        </div>
        <div class="text-lg">
          请确保可以正常访问Universalis，建议将相关域名加入到代理列表中
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
