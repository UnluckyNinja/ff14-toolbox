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
  <div class="relative grid col-span-1 grid-auto-rows-54px grid-cols-7 mx-1 my-auto place-items-center border border-dark rounded-lg px-1 shadow-inset">
    <div>{{ props.item.itemLevel }}</div>
    <UniImage class="mr-4 h-10 w-10" :src="iconUrl" alt="item icon" lazy @error="failedIcons.add(props.item.iconID);base = BASE_EN" />
    <!-- <img class="mr-4" :src="iconUrl" alt="item icon" lazy @error="base = BASE_EN"> -->
    <div class="line-clamp-2 col-span-5 max-w-full justify-self-start text-sm">
      <div v-if="'isUntradable' in item && isUntradable" class="absolute left-1 top-1px text-xs text-red-400">
        不可交易
      </div>
      {{ props.item.name }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
