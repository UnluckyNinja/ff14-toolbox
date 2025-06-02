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
    <header class="bg-default md:top-0 md:sticky md:z-100">
      <nav class="md:pt-4">
        <UContainer
          class="py-4 flex items-center"
        >
          <UButton class="text-2xl" to="/" icon="i-heroicons-home" size="xl" variant="link">
            <h1 class="ml-2">
              {{ route.meta.title }}
            </h1>
          </UButton>
          <UButton class="ml-auto" variant="subtle" color="neutral" @click="toggleIcon">
            图标：{{ baseSetting.icon === 'en' ? 'xivapi' : 'ffcafe' }}
          </UButton>
          <UButton class="ml-2" variant="subtle" color="neutral" @click="toggleItem">
            物品：{{ baseSetting.item === 'en' ? 'xivapi' : 'ffcafe' }}（需刷新页面）
          </UButton>
          <UButton
            class="ml-2" variant="subtle" color="neutral" :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggle"
          />
        </UContainer>
        <USeparator />
      </nav>
    </header>
    <main class="md:mt-10">
      <slot />
    </main>
    <footer
      class="border-default text-2xl mx-auto mt-10 py-2 border-t flex top-100vh justify-center sticky md:(py-6) container"
    >
      <UButton
        size="xl" variant="link" color="neutral" to="https://github.com/UnluckyNinja/ff14-toolbox" target="_blank"
        icon="i-carbon-logo-github"
      />
    </footer>
  </div>
</template>
