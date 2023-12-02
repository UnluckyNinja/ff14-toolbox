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
  if ($pwa?.offlineReady) {
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
  }
})
</script>

<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <nav>
      <UContainer class="mt-4 flex items-center border rounded-lg bg-gray-200 py-2 shadow dark:bg-gray-800">
        <NuxtLink to="/">
          <UButton icon="i-heroicons-home" size="lg" variant="ghost" />
        </NuxtLink>
        <h1 class="mx-2 inline">
          {{ route.meta.title }}
        </h1>
        <UButton class="ml-auto" :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          @click="toggle" />
      </UContainer>
    </nav>
    <NuxtPage />
    <footer class="mx-auto mt-10 flex justify-center border-t py-10 text-2xl container">
      <UButton size="xl" variant="link" color="white" to="https://github.com/UnluckyNinja/ff14-toolbox" target="_blank"
        icon="i-carbon-logo-github" />
    </footer>
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
