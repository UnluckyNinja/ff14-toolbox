<script lang="ts" setup>
import { notNullish } from '@vueuse/core'
import { tokens } from '~/data/tokens'

const props = withDefaults(defineProps<{
  modelValue: number
  header?: boolean
}>(), {
  header: true
})

const emits = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'currencyName', value: string): void
}>()

async function fetchCurrency() {
  if (tokens.length === 0)
    return []

  const items = await fetchItems(tokens)
  return tokens.map(id => items.find(it => it.ID === id)).filter(notNullish)
}

const base = EndPoint.base()
const list = await fetchCurrency()

emits('currencyName', list.find(it=>it.ID === props.modelValue)?.Name ?? '')

function currencyChange(item: XAItem){
  emits('update:modelValue', item.ID)
  emits('currencyName', item.Name)
}
</script>

<template>
  <div class="m-2 flex flex-col gap-2 p-2">
    <!-- header -->
    <div v-if="header" class="text-center">
      货币列表
    </div>
    <!-- instances list -->
    <div class="flex flex-col">
      <div class="min-h-120 flex flex-col gap-1">
        <UButton
          v-for="item in list" :key="item.ID"
          color="gray" block variant="ghost" size="xl"
          @click="currencyChange(item)"
        >
          <div class="w-full flex items-center gap-1 text-left text-base">
            <!-- icon -->
            <img class="inline-block h-4 w-4" :src="base + item.Icon">
            <!-- name -->
            <div class="flex-grow truncate" :title="item.Name">
              {{ item.Name }}
            </div>
          </div>
          <template v-if="props.modelValue === item.ID" #trailing>
            <UIcon name="i-heroicons-check" />
          </template>
        </UButton>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
