<script lang="ts" setup>
const props = defineProps<{
  item: any
}>()

const base = 'https://cafemaker.wakingsands.com/i/'
const imgUrl = computed(() => {
  const id = `${props.item.iconID}`.padStart(6, '0')
  const folder = id.substring(0, 3).padEnd(6, '0')
  return `${base}${folder}/${id}.png`
})
</script>

<template>
  <div class="grid col-span-1 grid-auto-rows-54px grid-cols-6 mx-1 my-auto place-items-center border border-dark rounded-lg px-1 shadow-inset">
    <div>{{ props.item.itemLevel }}</div>
    <img class="mr-4" :src="imgUrl" alt="item icon" lazy>
    <div class="line-clamp-2 col-span-4 max-w-full justify-self-start text-sm">
      {{ props.item.name }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
