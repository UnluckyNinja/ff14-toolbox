<script lang="ts" setup>
import { useDuckDBStatus } from '~/lib/duckDB'

const { msg } = useDuckDBStatus()
</script>

<template>
  <div class="text-3xl p-2 text-center gap-4 grid grid-rows-2 items-center place-content-center">
    <div class="row-span-1">
      当前进度：{{ msg }}<br>
      <span class="text-base">
        本页面首次打开需要下载预计10MB左右的资源<br>
        加载数据需要10秒左右<br>
        如果加载较慢，建议后续查询保持页面开启
      </span>
    </div>
    <div class="row-span-1">
      <UIcon name="i-heroicons-arrow-path" class="text-3xl mx-auto animate-spin" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
