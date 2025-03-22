// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-01-10',
  devtools: { enabled: false },
  features: {
    inlineStyles: false,
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
    dirs: ['composables/**'],
  },
  modules: [
    '@nuxt/ui',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore'],
      },
    ],
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],
  i18n: {
    vueI18n: '~/locales/i18n.config.ts',
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  css: ['~/assets/sass/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Nuxtship营销网站,入门模板',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
          charset: 'utf-8',
        },
        {
          name: 'keywords',
          content: 'Nuxtship营销网站,入门模板',
        },
        {
          name: 'description',
          content:
            '使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/vnd.microsoft.icon', href: '/favicon.ico' },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: [],
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
    optimizeDeps: {
      include: ['vueuc'], // 显式包含 vueuc
    },
    plugins: [AutoImport({}), Components({})],
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        module: 'esnext', // 支持 import.meta
        target: 'esnext', // 目标 ES 版本
        moduleResolution: 'node',
      },
    },
  },
})
