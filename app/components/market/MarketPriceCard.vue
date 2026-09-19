<script lang="ts" setup>
const props = defineProps<{
  rows?: ({
    value: number
    worldName?: string
    hq?: boolean
  } | undefined | null)[]
  itemID?: string | number
  label?: string
  note?: string
  unit?: string
  /**
   * fixed decimal fractions
   */
  maximumFractionDigits?: number
  padRight?: number
  popupMarket?: 'listing' | 'history'
  popupServer?: string
}>()

const [DefineTemp, UseTemp] = createReusableTemplate()

const numbersColor = usePricePalette()

function digitsColor(level: number) {
  return numbersColor.value[Math.min(numbersColor.value.length - 1, level)]
}
</script>

<template>
  <DefineTemp>
    <div class="text-right w-full">
      <div v-if="props.label || props.note" class="text-muted text-xs mb-1 flex justify-between">
        <div v-if="props.note">
          {{ props.note }}
        </div>
        <div v-if="props.label" class="ml-auto">
          {{ props.label }}
        </div>
      </div>
      <template v-if="rows && rows.length > 0">
        <template v-for="row, idx in props.rows" :key="idx">
          <div v-if="row && row.value >= 0" class="flex items-baseline justify-between">
            <span v-if="row.worldName || row.hq" class="text-muted text-xs mr-2 float-left">
              {{ row.worldName }}
              <span v-if="row.hq" class="ml-1">
                
              </span>
            </span>
            <span class="text-default ml-auto">
              <UniRichNumber :value="row.value" :options="{ maximumFractionDigits: props.maximumFractionDigits ?? 0 }" :pad-right="props.padRight ?? 0">
                <template #integer="{ integers, group }">
                  <template v-for="part, i in integers" :key="i">
                    <span v-if="i !== 0">
                      {{ group }}
                    </span>
                    <span :style="{ color: digitsColor(integers.length - 1 - i) }">
                      {{ part }}
                    </span>
                  </template>
                </template>
                <template #fraction="{ fraction, decimal }">
                  <span class="text-xs">
                    {{ fraction ? decimal : '' }}{{ fraction }}
                  </span>
                </template>
              </UniRichNumber>
              <span v-if="props.unit">{{ props.unit }}</span>
            </span>
          </div>
          <div v-else class="text-muted">
            <span class="text-xs mr-2">
              {{ row?.hq ? '' : '' }}
            </span>
            <span class="i-heroicons-minus inline-block" />
          </div>
        </template>
      </template>
      <div v-else class="i-heroicons-minus text-muted mx-auto" />
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
