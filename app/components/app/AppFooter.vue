<script setup lang="ts">
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/UnluckyNinja/ff14-toolbox"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
