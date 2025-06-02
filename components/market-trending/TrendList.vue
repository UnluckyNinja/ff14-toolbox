<script lang="ts" setup>
import { data } from '~/data/trending-items'

const emits = defineEmits<{
  'update:items': [readonly number[]]
}>()

const list = data
const sublistIndex = ref(0)
</script>

<template>
  <div class="border-muted p-2 border rounded flex flex-col overflow-hidden">
    <div v-for="item, i in list" :key="item.name" class="flex flex-col">
      <!-- collapse toggle -->
      <UButton color="secondary" variant="outline" block @click="sublistIndex = i">
        {{ item.name }}
      </UButton>
      <!-- sublist -->
      <div class="flex flex-col transition-all duration-500 ease-out overflow-auto" :class="sublistIndex === i ? 'h-120' : 'h-0'">
        <UButton
          v-for="child, j in item.children" :key="j"
          color="neutral" variant="ghost" block
          @click="emits('update:items', child.items)"
        >
          {{ child.name }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
