<script lang="ts" setup>
const route = useRoute()
const colorMode = useColorMode()

if (colorMode.preference === 'system')
  colorMode.preference = 'light'

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const { baseSetting, toggleBase } = useXABase()

function toggleIcon() {
  toggleBase('icon')
}
function toggleItem() {
  toggleBase('item')
}
</script>

<template>
  <div class="min-h-screen">
    <header class="md:sticky md:top-0 md:z-100">
      <nav class="md:pt-4">
        <UContainer
          class="flex items-center bg-slate-100 py-2 md:(border rounded-lg shadow) dark:bg-slate-800"
        >
          <NuxtLink to="/">
            <UButton icon="i-heroicons-home" size="lg" variant="ghost" />
          </NuxtLink>
          <h1 class="mx-2 inline">
            {{ route.meta.title }}
          </h1>
          <UButton class="ml-auto" @click="toggleIcon">
            图标：{{ baseSetting.icon === 'en' ? 'xivapi' : 'ffcafe' }}
          </UButton>
          <UButton class="ml-2" @click="toggleItem">
            物品：{{ baseSetting.item === 'en' ? 'xivapi' : 'ffcafe' }}（需刷新页面）
          </UButton>
          <UButton
            class="ml-2" :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggle"
          />
        </UContainer>
      </nav>
    </header>
    <main class="md:mt-10">
      <slot />
    </main>
    <footer
      class="sticky top-100vh mx-auto mt-10 flex justify-center border-t py-2 text-2xl container md:(py-6)"
    >
      <UButton
        size="xl" variant="link" color="white" to="https://github.com/UnluckyNinja/ff14-toolbox" target="_blank"
        icon="i-carbon-logo-github"
      />
    </footer>
  </div>
</template>
