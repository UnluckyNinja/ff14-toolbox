<script lang="ts" setup>
const route = useRoute()

const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div>
    <nav>
      <UContainer class="flex items-center mt-4 py-2 border rounded-lg shadow dark:bg-gray-800 bg-gray-200">
        <NuxtLink to="/">
          <UButton icon="i-heroicons-home" size="lg" variant="ghost" />
        </NuxtLink>
        <h1 class="inline mx-2">
          {{ route.meta.title }}
        </h1>
        <UButton class="ml-auto" :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun' " @click="toggle" />
      </UContainer>
    </nav>
    <NuxtPage />
    <footer class="flex justify-center py-10 border-t mt-10 container mx-auto text-2xl">
      <UButton size="xl" variant="link" color="white" to="https://github.com/UnluckyNinja/ff14-toolbox" target="_blank" icon="i-carbon-logo-github" />
    </footer>
  </div>
</template>

<style>
body {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji", FFXIV_Lodestone_SSF;
}

@font-face {
  font-family: FFXIV_Lodestone_SSF;
  font-style: normal;
  font-weight: 400;
  src: url('/FFXIV_Lodestone_SSF.woff');
  src: url('/FFXIV_Lodestone_SSF.woff') format("woff");
}
</style>
