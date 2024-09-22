<script lang="ts" setup>
const props = defineProps<{
  src: string
  title?: string
}>()

const [isLoaded, setLoaded] = useToggle(false)
watch(() => props.src, () => {
  setLoaded(false)
})
</script>

<template>
  <img v-show="isLoaded" :src="props.src" :title="props.title" v-bind="$attrs" @load="setLoaded(true)">
  <USkeleton v-if="!isLoaded" v-bind="$attrs" class="rounded-lg" />
</template>

<style lang="postcss" scoped>

</style>
