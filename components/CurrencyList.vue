<script lang="ts" setup>
import { tokens } from '~/data/tokens'

const props = defineProps<{
  modelValue: number
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

async function fetchCurrency() {
  if (tokens.length === 0)
    return

  return await fetchItems(tokens)
}

const base = EndPoint.base()
const list = await fetchCurrency()
</script>

<template>
  <div class="m-2 flex flex-col gap-2 border rounded p-2">
    <!-- header -->
    <div class="text-center">
      货币列表
    </div>
    <!-- instances list -->
    <div class="flex flex-col overflow-hidden">
      <div class="min-h-120 flex flex-col gap-1">
        <UButton
          v-for="item in list" :key="item.ID"
          color="gray" block variant="ghost" size="xl"
          @click="emits('update:modelValue', item.ID)"
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
