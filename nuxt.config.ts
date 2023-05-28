// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxthq/ui',
  ],

  vite: {
    assetsInclude: ['**/*.wasm'],
  },

  nitro: {
    preset: 'cloudflare-pages',
  },

  devtools: {
    enabled: true,
  },

  ui: {
    icons: ['carbon', 'mdi'],
  },
})
