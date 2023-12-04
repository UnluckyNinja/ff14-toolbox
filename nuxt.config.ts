// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  ssr: false,
  modules: [
    '@vite-pwa/nuxt',
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/ui',
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
  
  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    manifest: {
      name: 'FF14 速查',
      short_name: 'FF14速查',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: [
        '**/*.{js,css,html,png,svg,ico}',
        '_nuxt\/*.csv',
        // '_nuxt\/*.wasm' // too large, "Configure maximumFileSizeToCacheInBytes to change this limit."
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})
