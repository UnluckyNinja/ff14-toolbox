<script lang="ts" setup>
const props = defineProps<{
  item: any
}>()

const base = `https://cafemaker.wakingsands.com/i/`
const imgUrl = computed(()=>{
  const id = `${props.item.iconID}`.padStart(6, '0')
  const folder = id.substring(0, 3).padEnd(6, '0')
  return `${base}${folder}/${id}.png`
})
</script>

<template>
  <div class="col-span-1 border my-auto mx-1 px-1 border-dark shadow-inset rounded-lg grid grid-cols-6 place-items-center grid-auto-rows-54px">
    <div>{{ props.item.itemLevel }}</div>
    <img class="mr-4" :src="imgUrl" alt="item icon" lazy/>
    <div class="max-w-full text-sm col-span-4 justify-self-start line-clamp-2">{{ props.item.name }}</div>
  </div>
</template>

<style lang="postcss" scoped>

</style>