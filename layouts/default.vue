<script lang="ts" setup>
const route = useRoute()
const colorMode = useColorMode()

if (colorMode.preference === 'system')
  colorMode.preference = 'light'

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
<template>
  <div class="min-h-screen">
    <header>
      <nav class="md:pt-4">
        <UContainer class="
          py-2
          flex items-center
          bg-gray-200 dark:bg-gray-800
          md:(border rounded-lg shadow)
        ">
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
    </header>
    <main>
      <slot />
    </main>
    <footer class="
      container sticky top-100vh
      mx-auto mt-10 py-2 border-t
        md:(py-6)
      flex justify-center
      text-2xl
    ">
      <UButton size="xl" variant="link" color="white" to="https://github.com/UnluckyNinja/ff14-toolbox" target="_blank"
        icon="i-carbon-logo-github" />
    </footer>
  </div>
</template>