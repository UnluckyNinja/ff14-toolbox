<script lang="ts" setup>
const props = defineProps<{
  item: any
}>()

const failedIcons = useFailedIcons()
const base = ref(failedIcons.value.has(props.item.iconID) ? BASE_EN : null)
const iconUrl = computed(() => itemIconUrl(props.item.iconID, base.value ?? undefined).value)

const isUntradable = computed(() => {
  return props.item.isUntradable === 'True'
})
</script>

<template>
  <div class="border-muted shadow-inset mx-1 my-auto px-1 border rounded-lg grid col-span-1 grid-auto-rows-54px grid-cols-7 place-items-center relative">
    <div>{{ props.item.itemLevel }}</div>
    <UniImage class="mr-4 h-10 w-10" :src="iconUrl" alt="item icon" lazy @error="failedIcons.add(props.item.iconID);base = BASE_EN" />
    <!-- <img class="mr-4" :src="iconUrl" alt="item icon" lazy @error="base = BASE_EN"> -->
    <div class="text-sm col-span-5 max-w-full justify-self-start line-clamp-2">
      <div v-if="'isUntradable' in item && isUntradable" class="text-xs text-red-400 left-1 top-1px absolute">
        不可交易
      </div>
      {{ props.item.name }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
