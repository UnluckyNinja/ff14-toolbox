<script lang="ts" setup>
import { useItemExternalLink } from '~/composables/useItemExternalLink'

const props = defineProps<{
  item: {
    id: string
    name: string
    iconID: string
  }
}>()

const item = computed(() => {
  return props.item
})
const toast = useToast()
// handy nametag
function copyText(text: string) {
  if (copy(text))
    toast.add({ title: '已复制', timeout: 2000 })
}

const links = reactive(useItemExternalLink(item))
const failedIcons = useFailedIcons()
const base = ref(failedIcons.value.has(props.item.iconID) ? BASE_EN : BASE_ZH)
const iconUrl = computed(()=>itemIconUrl(item.value.iconID, base.value).value)
</script>

<template>
  <div class="my-2 flex items-center">
    <UniImage class="inline-block min-h-8 min-w-8" :src="iconUrl" alt="item icon" @error="failedIcons.add(props.item.iconID);base = BASE_EN" />
    <UButton
      class="mx-2"
      color="gray" size="xl" variant="ghost" @click="copyText(item.id)"
    >
      ID: {{ item.id }}
    </UButton>
    <!-- hover:bg-gray-50 -->
    <UButton
      class="mx-2" trailing-icon="i-heroicons-clipboard-document-list-20-solid"
      color="gray" size="xl" variant="ghost" @click="copyText(item.name)"
    >
      {{ item.name }}
    </UButton>
    <div class="text-blue-7 underline children:mx-2 dark:text-blue-3">
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
