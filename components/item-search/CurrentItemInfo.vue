<script lang="ts" setup>
import { useItemExternalLink } from '~/composables/useItemExternalLink'

const props = defineProps<{
  item: {
    id: string
    name: string
    dataSource: 'en' | 'cn'
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
    toast.add({ title: '已复制', duration: 2000 })
}

const links = reactive(useItemExternalLink(item))
const failedIcons = useFailedIcons()
const base = computed(() => failedIcons.value.has(props.item.iconID) ? BASE_EN : null)
const iconUrl = computed(() => itemIconUrl(item.value.iconID, base.value ?? undefined).value)
</script>

<template>
  <div class="my-2 flex items-center">
    <UniImage class="min-h-8 min-w-8 inline-block" :src="iconUrl" alt="item icon" @error="failedIcons.add(props.item.iconID);base = BASE_EN" />
    <UButton
      class="mx-2 cursor-pointer"
      color="neutral" size="xl" variant="ghost" @click="copyText(item.id)"
    >
      ID: {{ item.id }}
    </UButton>
    <!-- hover:bg-gray-50 -->
    <UButton
      class="mx-2 cursor-pointer" trailing-icon="i-heroicons-clipboard-document-list-20-solid"
      color="neutral" size="xl" variant="ghost" @click="copyText(item.name)"
    >
      {{ item.name }}
    </UButton>
    <div class="text-blue-7 dark:text-blue-3 underline children:mx-2">
      <UButton
        color="info" :trailing-icon="item.dataSource === 'en' ? '' : 'i-heroicons-arrow-top-right-on-square-20-solid'"
        :to="links.huiji" target="_blank" variant="link"
        :disabled="item.dataSource === 'en'"
      >
        灰机Wiki{{ item.dataSource === 'en' ? '(国际服数据)' : '' }}
      </UButton>
      <UButton
        color="info" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
        :to="links.universalis" target="_blank" variant="link"
      >
        Universalis
      </UButton>
      <UButton
        color="info" trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
        :to="links.garlandData" target="_blank" variant="link"
      >
        GarlandData
      </UButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
