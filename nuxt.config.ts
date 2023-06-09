// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  ssr: false,
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
    enabled: false,
  },

  ui: {
    icons: ['carbon', 'mdi'],
  },
})
