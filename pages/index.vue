<script lang="ts" setup>
const {locale }= useI18n()
const weblist = ref([
  {
    title: "Bring Your Own Framework",
    titlezh:'带来自己的框架',
    description:
      "Build your site using Vue, web components, or just plain ol' HTML + JavaScript.",
     desczh:'使用 Vue、Web 组件或普通的 HTML + JavaScript 构建您的网站。', 
    icon: "uil:circle-layer",
  },
  {
    title: "100% Static HTML, No JS",
    titlezh:'100％静态 HTML，无 JS',
    desczh:'Nuxt 将你的整个页面呈现为静态 HTML，默认从最终构建中删除所有 JavaScript。',
    description:
      "Nuxt renders your entire page to static HTML, removing all JavaScript from your final build by default.",
    icon: "uil:hospital-symbol",
  },
  {
    title: "On-Demand Components",
    titlezh:'按需组件',
    desczh:'需要一些 JS？当交互组件在页面上可见时，Nuxt 可以自动补充它们。',
    description:
      "Need some JS? Nuxt can automatically hydrate interactive components when they become visible on the page.",
    icon: "uil:google-play",
  },
  {
    title: "Broad Integration",
    titlezh:'广泛整合',
    desczh:'Nuxt 支持 TypeScript、Scoped CSS、CSS Modules、Sass、Tailwind、Markdown、MDX 以及任何其他 npm 包。',
    description:
      "Nuxt supports TypeScript, Scoped CSS, CSS Modules, Sass, Tailwind, Markdown, MDX, and any other npm packages.",
    icon: "uil:instagram-alt",
  },
  {
    title: "SEO Enabled",
    titlezh:'已启用 SEO',
    desczh:'自动站点地图、RSS 源、分页和集合让 SEO 和联合变得轻松无比。它真的有效！',
    description:
      "Automatic sitemaps, RSS feeds, pagination and collections take the pain out of SEO and syndication. It just works!",
    icon: "uil:raindrops-alt",
  },
  {
    title: "Community",
    titlezh:'社区',
    desczh:'Nuxt 是一个开源项目，由数百名贡献者提供支持，并做出了数千项个人贡献。',
    description:
      "Nuxt is an open source project powered by hundreds of contributors making thousands of individual contributions.",
    icon: "uil:slack-alt",
  },
])

const icons = computed(() => {
  return weblist.value.map(item => item.icon)
})
</script>
<template>
  <div class="min-h-screen">
    <div class="lg:flex block lg:gap-x-10">
      <div class="flex-1 lg:pt-24 pt-10">
        <div class="font-bold text-5xl lg:text-6xl xl:text-7xl lg:-tracking-tight">{{ $t('home.webtype') }}
        </div>
        <div class=" my-6 text-gray-500 text-xl">
          {{ $t('home.webdesc') }}
        </div>
        <div class="md:flex block items-center gap-3">
          <div
            class="lg:w-32 md:mb-0 mb-3 rounded-md md:w-1/2 text-center py-3 border-2 border-gray-950 text-white bg-black hover:bg-gray-800 w-full cursor-pointer">
            {{ $t('btn.start') }}</div>
          <div class="lg:w-32 rounded-md md:w-1/2 w-full text-center py-3 border-gray-950 border-2 cursor-pointer">{{ $t('btn.viewrepo') }}</div>
        </div>
      </div>
      <div class="md:flex-1 hidden md:flex items-center justify-center">
        <img class="rounded-full md:p-40 transition-transform hover:scale-125 lg:p-24 w-full h-full"
          src="~/assets/img/hero.jpg" alt="Starship starts the engine" loading="eager" format="avif" width="512"
          height="512">
      </div>
    </div>
    <div class="mb-5 lg:mt-0 mt-5">
      <div class="font-bold lg:text-5xl text-3xl -tracking-tight">
       {{ $t('home.webfn') }}
      </div>
      <div class="text-gray-400 mt-5 text-lg">
        {{ $t('home.webfndesc') }}
      </div>
    </div>
    <div class="mt-20 md:grid-cols-3 sm:grid-cols-2 grid gap-16">
      <div class="flex gap-x-3" v-for="(item, idx) in weblist" :key="idx">
        <div>
          <div class="rounded-full overflow-hidden flex items-center justify-center p-2 bg-black">
            <Icon :name="item.icon" class="text-white"></Icon>
          </div>
        </div>
        <div>
          <div class="mb-3 text-xl text-black -tracking-tight font-bold">{{ $t('home.webitemtitle',{title:locale==='en'? item.title:item.titlezh}) }}</div>
          <div class="text-gray-400">{{ $t('home.webitemdesc',{desc:locale==='en'? item.description:item.desczh}) }}</div>
        </div>
      </div>
    </div>
    <div class="text-gray-400 text-center mt-20 mb-10">{{ $t('home.webitemsub') }}</div>
    <div class="flex items-center justify-center gap-10 flex-wrap">
      <Icon class="md:text-6xl text-5xl" :name="icon" :key="idx" v-for="(icon, idx) in icons"></Icon>
    </div>
    <div class="bg-slate-800 rounded-md flex flex-col items-center md:p-20 p-10 gap-5 my-10">
       <div class="text-white text-2xl lg:text-6xl">{{ $t('home.btotitle') }}</div>
       <div class="md:text-xl text-base break-all md:p-0 px-10 text-gray-400">{{ $t('home.btodesc') }}</div>
       <div class="text-black bg-white rounded-md p-4 cursor-pointer">{{ $t('btn.start') }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>