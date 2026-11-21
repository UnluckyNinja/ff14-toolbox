// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'FF14 杂七杂八工具箱',
      meta: [
        {
          name: 'description',
          content: 'FF14 个人工具站',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
      ],
      htmlAttrs: {
        lang: 'zh-CN',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          type: 'image/x-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
      ],
    },
  },
  modules: [
    '@vite-pwa/nuxt',
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/ui',
  ],

  // css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },

  unocss: {
    autoImport: false,
  },

  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

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
      name: 'FF14 杂七杂八工具箱',
      description: 'FF14 个人工具站',
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
    generateSW: {
      globPatterns: [
        '**/*.{js,css,html,png,svg,ico}',
        '_nuxt\/*.csv',
      ],
    },
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
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
