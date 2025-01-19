// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-10',
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  hooks: {
    'pages:extend'(pages) {},
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  runtimeConfig: {
    apiSecret: 'jjfa85093fjKFJ_42)(_',
    public: {
      baseUrl: '',
    },
  },
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      },
    ],
    dirs: ['composables/**'],
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxthub/core'],
  hub: {
    database: true,
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  plugins: ['~/plugins/one/one'], // 添加插件扫描层
  css: ['~/assets/sass/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  colorMode: {
    preference: 'light',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  nitro: {
    prerender: {
      routes: [],
      // ignore: ['/login'],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/const/index.scss" as *;',
        },
      },
    },
  },
})
