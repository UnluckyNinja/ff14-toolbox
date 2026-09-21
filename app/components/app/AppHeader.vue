<script lang="ts" setup>
const route = useRoute()
const { baseSetting, toggleBase } = useXABase()

function toggleIcon() {
  toggleBase('icon')
}
function toggleItem() {
  toggleBase('item')
}
</script>

<template>
  <UHeader :title="route.meta.title">
    <template #left>
      <div class="text-2xl flex items-center">
        <UButton class="text-2xl" to="/" icon="i-heroicons-home" size="xl" variant="link" />
        <div class="i-heroicons:chevron-right" />
        <UButton class="text-2xl" :to="route.path" size="xl" variant="link">
          <h1>
            {{ route.meta.title }}
          </h1>
        </UButton>
      </div>
    </template>
    <template #right>
      <UTooltip :text="`图标：${baseSetting.icon === 'en' ? 'xivapi' : 'ffcafe'}`">
        <UButton class="ml-auto" variant="soft" color="neutral" @click="toggleIcon">
          <div class="i-carbon:image" />{{ baseSetting.icon === 'en' ? 'EN' : 'CN' }}
        </UButton>
      </UTooltip>
      <UTooltip :text="`数据：${baseSetting.item === 'en' ? 'xivapi' : 'ffcafe'}（需刷新页面）`">
        <UButton class="ml-2" variant="soft" color="neutral" @click="toggleItem">
          <div class="i-mdi:server-network" />{{ baseSetting.item === 'en' ? 'EN' : 'CN' }}
        </UButton>
      </UTooltip>
      <UColorModeButton />
      <UButton
        color="neutral"
        variant="ghost"
        to="https://github.com/UnluckyNinja/ff14-toolbox"
        target="_blank"
        icon="i-mdi:github"
        aria-label="GitHub"
      />
    </template>
  </UHeader>
</template>
