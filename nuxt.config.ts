// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-10",
  devtools: { enabled: false },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  runtimeConfig: {
    apiSecret: "jjfa85093fjKFJ_42)(_",
    public: {
      baseUrl: "",
    },
  },
  imports: {
    dirs: ["composables/**"],
  },
  modules: ['@nuxt/ui', [
    '@pinia/nuxt',
    {
      autoImports: [
        'defineStore',
      ],
    },
  ], "@nuxtjs/i18n"],
  i18n: {
    vueI18n: "./lang/i18n.config.ts",
    locales: ["en", "zh"],
    defaultLocale: "en",
  },
  plugins: [], // 添加插件扫描层
  css: ["~/assets/sass/main.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
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
});