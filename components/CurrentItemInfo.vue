<script lang="ts" setup>
import { useItemExternalLink } from '~/composables/useItemExternalLink'

const props = defineProps<{
  item: {
    id: string
    name: string
    imageID: string
  }
}>()

const item = computed(() => {
  return props.item
})

// handy nametag
function copyName() {
  if (navigator.clipboard)
    navigator.clipboard.writeText(item.value.name)
}

const links = reactive(useItemExternalLink(item))
</script>

<template>
  <div class="my-2 flex items-center">
    已选择物品：
    <div
      class="flex items-center rounded"
      @click="copyName"
    >
      {{ item.name }}
    </div>
    <UButton class="mx-2" icon="i-heroicons-clipboard-document-list-20-solid" variant="outline" @click="copyName">
      复制
    </UButton>
    <div class="underline children:mx-2 dark:text-blue-3 text-blue-7">
      <UButton
        color="blue" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
        :to="links.huiji" target="_blank" variant="link"
      >
        灰机Wiki
      </UButton>
      <UButton
        color="blue" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
        :to="links.universalis" target="_blank" variant="link"
      >
        Universalis
      </UButton>
      <UButton
        color="blue" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
        :to="links.garlandData" target="_blank" variant="link"
      >
        GarlandData
      </UButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
