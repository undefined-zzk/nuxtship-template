// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-10',
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_BASE_URL,
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
  modules: ['@nuxtjs/fontaine', '@nuxt/ui', '@pinia/nuxt'],
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
