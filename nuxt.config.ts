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

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
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

  pwa: {
    registerType: 'prompt',
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
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  compatibilityDate: '2024-09-21',
})
