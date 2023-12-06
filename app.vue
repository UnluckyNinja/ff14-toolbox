<script lang="ts" setup>
const route = useRoute()

const colorMode = useColorMode()

if (colorMode.preference === 'system')
  colorMode.preference = 'light'

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const { $pwa } = useNuxtApp()

const toast = useToast()

onMounted(() => {
  if (!$pwa) {
    return
  }
  let handle = watch(() => $pwa.offlineReady, (ready) => {
    if (!ready) return
    toast.add({
      id: 'update_pwa',
      title: '网站内容有变化，点击刷新按钮以更新',
      timeout: 0,
      actions: [{
        label: '刷新',
        click: () => {
          $pwa.updateServiceWorker()
        }
      }]
    })
    handle()
  })
})
</script>

<template>
  <div class="md:px-2">
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications class="sm:w-96" />
  </div>
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
