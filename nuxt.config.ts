import { presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  modules: [
    '@vueuse/nuxt',
    '@anu-vue/nuxt',
    '@unocss/nuxt',
  ],
  vite: {
    assetsInclude: ['**/*.wasm']
  },
  nitro: {
    preset: 'cloudflare-pages'
  }
})
