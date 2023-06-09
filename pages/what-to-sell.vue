<script lang="ts" setup>
definePageMeta({
  title: '💰艾欧泽亚什么值得卖',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})
</script>

<template>
  <div class="mx-auto mt-10 container">
    <OptionsPanel :display="{ hq: false }" />
  </div>
</template>

<style lang="postcss" scoped>

</style>
