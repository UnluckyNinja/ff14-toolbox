<script lang="ts" setup>

</script>

<template>
  <div class="p-2 grid grid-rows-2 place-content-center items-center gap-4 text-center text-3xl">
    <div class="row-span-1">
      加载数据中，请稍候<br>
      <span class="text-base">
        （下载5MB左右的数据库，视网络情况可能需要几分钟）<br>
        如果加载较慢，建议后续查询保持页面开启
      </span>
    </div>
    <div class="row-span-1">
      <UIcon name="i-heroicons-arrow-path" class="mx-auto animate-spin text-3xl" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
