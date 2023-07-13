<script lang="ts" setup>
const props = defineProps<{
  item: any
}>()

const base = ref(failedIcons.value.has(props.item.iconID) ? BASE_EN : BASE_ZH)
const iconUrl = computed(() => {
  return itemIconUrl(props.item.iconID, base.value)
})
</script>

<template>
  <div class="grid col-span-1 grid-auto-rows-54px grid-cols-6 mx-1 my-auto place-items-center border border-dark rounded-lg px-1 shadow-inset">
    <div>{{ props.item.itemLevel }}</div>
    <UniImage class="mr-4 h-10 w-10" :src="iconUrl" alt="item icon" lazy @error="failedIcons.add(props.item.iconID);base = BASE_EN" />
    <!-- <img class="mr-4" :src="iconUrl" alt="item icon" lazy @error="base = BASE_EN"> -->
    <div class="line-clamp-2 col-span-4 max-w-full justify-self-start text-sm">
      {{ props.item.name }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
