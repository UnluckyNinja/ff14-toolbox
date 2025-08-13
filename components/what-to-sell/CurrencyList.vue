<script lang="ts" setup>
import { notNullish } from '@vueuse/core'
import { tokens } from '~/data/tokens'
import { fallbackItems } from '~/data/xivapiFallback'

const props = withDefaults(defineProps<{
  modelValue: number
  header?: boolean
}>(), {
  header: true,
})

const emits = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'currencyName', value: string): void
}>()

async function fetchCurrency() {
  if (tokens.length === 0)
    return []

  const items = await fetchItems(tokens)
  return tokens.map((id) => {
    let item: { ID: number, Name: string, Icon: string } | undefined = items.find(it => it.ID === id)
    if (!item || !item.Name) {
      item = fallbackItems[id]
    }
    return item
  }).filter(notNullish)
}

const { base } = useXABase()
const list = await fetchCurrency()

emits('currencyName', list.find(it => it.ID === props.modelValue)?.Name ?? '')

const overwrites: Record<number, string> = {
  6688: '采集宝图',
}

function currencyChange(item: { ID: number, Name: string }) {
  emits('update:modelValue', item.ID)
  const name = overwrites[item.ID] ?? item.Name
  emits('currencyName', name)
}
</script>

<template>
  <div class="border-muted m-2 p-2 border rounded-xl flex flex-col gap-2">
    <!-- header -->
    <div v-if="header" class="text-center">
      货币列表
    </div>
    <!-- instances list -->
    <div class="flex flex-col">
      <div class="flex flex-col gap-1 min-h-120">
        <UButton
          v-for="item in list" :key="item.ID"
          color="neutral" block variant="subtle" size="xl"
          @click="currencyChange(item)"
        >
          <div class="text-base text-left flex gap-1 w-full items-center">
            <!-- icon -->
            <img class="h-4 w-4 inline-block" :src="base.icon + item.Icon">
            <!-- name -->
            <div class="flex-grow truncate" :title="item.Name">
              {{ overwrites[item.ID] ?? item.Name }}
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
