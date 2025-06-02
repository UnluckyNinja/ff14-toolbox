<script lang="ts" setup>
const props = defineProps<{
  price: number
  server?: string
  label?: string
  note?: string
  hq?: string
  itemID?: string | number
  /**
   * fixed decimal fractions
   */
  fixed?: number
  padRight?: number
  popupMarket?: 'listing' | 'history'
  popupServer?: string
}>()

const [DefineTemp, UseTemp] = createReusableTemplate()
</script>

<template>
  <DefineTemp>
    <div class="text-right w-full">
      <div v-if="props.server || props.note" class="text-muted text-xs mb-1 flex justify-between">
        <div v-if="props.note">
          {{ props.note }}
        </div>
        <div v-if="props.server">
          {{ props.server }}
        </div>
      </div>
      <div v-if="props.price >= 0" class="flex items-baseline justify-between">
        <span v-if="props.label" class="text-muted text-xs mr-1 float-left">
          {{ props.label }}
        </span>
        <span class="text-default">
          {{ props.hq ? '' : '' }}
          <UniRichNumber :value="props.price" :options="{ maximumFractionDigits: props.fixed ?? 0 }" :pad-right="props.padRight ?? 0">
            <template #whole="{ num }">
              <span>
                {{ num }}
              </span>
            </template>
            <template #fraction="{ num, decimalPoint }">
              <span class="text-xs">
                {{ num ? decimalPoint : '' }}{{ num }}
              </span>
            </template>
          </UniRichNumber>
          <span class="text-amber-500"></span>
        </span>
      </div>
      <div v-else class="i-heroicons-minus" />
    </div>
  </DefineTemp>
  <UseTemp v-if="!props.itemID" class="p-2" />
  <UPopover v-else>
    <UButton block color="neutral" variant="ghost">
      <UseTemp />
    </UButton>
    <template #content>
      <div v-if="props.itemID" class="border-accented border rounded-lg max-h-50vh overflow-auto">
        <MarketListings v-if="props.popupMarket === 'listing'" :id="props.itemID" :server="props.popupServer" />
        <MarketHistory v-else-if="props.popupMarket === 'history'" :id="props.itemID" :server="props.popupServer" />
      </div>
    </template>
  </UPopover>
</template>

<style scoped>

</style>
