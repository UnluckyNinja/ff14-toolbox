<script lang="ts" setup>
import 'virtual:uno.css'
import '~/assets/css/main.css'

const { $pwa } = useNuxtApp()

const toast = useToast()

onMounted(() => {
  if (!$pwa) {
    return
  }
  watch(() => $pwa.needRefresh, (ready) => {
    if (!ready) return
    toast.add({
      id: 'update_pwa',
      title: '网站内容有变化，点击刷新按钮以更新',
      duration: 0,
      actions: [{
        label: '刷新',
        onClick: () => {
          $pwa.updateServiceWorker()
        },
      }],
    })
  })
})
</script>

<template>
  <UApp class="md:px-2 dark:bg-slate-900">
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
body {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji", FFXIV_Lodestone_SSF;
  overflow-y: scroll;
}

@font-face {
  font-family: FFXIV_Lodestone_SSF;
  font-style: normal;
  font-weight: 400;
  src: url('/FFXIV_Lodestone_SSF.woff');
  src: url('/FFXIV_Lodestone_SSF.woff') format("woff");
}
</style>
