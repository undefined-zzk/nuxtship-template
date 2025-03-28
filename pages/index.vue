<script lang="ts" setup>
useSeoMeta({
  title: 'Nuxtship-features',
  ogTitle: 'Nuxtship-features',
  description: '使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。',
  ogDescription: '使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。',
})
interface Home {
  title: string
  titlezh: string
  description: string
  desczh: string
  icon: string

}
const { locale } = useI18n()
const { data: weblist } = useFetch<Home[]>('/api/home')

const icons = computed(() => {
  return weblist.value?.map((item: any) => item.icon)
})
</script>
<template>
  <div class="min-h-screen bg-color">

    <Head>
      <Title>Nuxtship</Title>
      <Meta name="description"
        content="使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。">
      </Meta>
    </Head>
    <div class="lg:flex block lg:gap-x-10">
      <div class="flex-1 lg:pt-24 pt-10">
        <div class="font-bold text-5xl lg:text-6xl xl:text-7xl lg:-tracking-tight text-color">{{ $t('home.webtype') }}
        </div>
        <div class=" my-6 text-gray-500 text-xl">
          {{ $t('home.webdesc') }}
        </div>
        <div class="md:flex block items-center gap-3">
          <div
            class="lg:w-32 md:mb-0 mb-3 rounded-md md:w-1/2 text-center py-3 border-2 border-gray-950 bg-text-color hover:bg-slate-700 hover:text-white bg-btn w-full cursor-pointer">
            {{ $t('btn.start') }}</div>
          <div
            class="lg:w-32 rounded-md md:w-1/2 w-full text-center py-3 text-color border-gray-950 dark:border-white border-2 cursor-pointer">
            {{ $t('btn.viewrepo') }}</div>
        </div>
      </div>
      <div class="md:flex-1 hidden md:flex items-center justify-center">
        <div class="w-full h-full md:p-40 lg:p-24">
          <img class="rounded-full transition-transform hover:scale-125 w-full h-full" src="~/assets/img/hero.jpg"
            alt="Starship starts the engine" loading="eager" format="avif" width="512" height="512">
        </div>
      </div>
    </div>
    <div class="mb-5 lg:mt-0 mt-5">
      <div class="font-bold lg:text-5xl text-3xl -tracking-tight text-color">
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
          <div class="mb-3 text-xl text-black dark:text-white -tracking-tight font-bold">{{
            $t('home.webitemtitle', { title: locale === 'en' ? item.title : item.titlezh }) }}</div>
          <div class="text-gray-400">{{ $t('home.webitemdesc', {
            desc: locale === 'en' ? item.description : item.desczh
          }) }}
          </div>
        </div>
      </div>
    </div>
    <div class="text-gray-400 text-center mt-20 mb-10">{{ $t('home.webitemsub') }}</div>
    <div class="flex items-center justify-center gap-10 flex-wrap">
      <Icon class="md:text-6xl text-5xl text-color" :name="icon" :key="idx" v-for="(icon, idx) in icons"></Icon>
    </div>
    <div class="bg-slate-800 rounded-md flex flex-col items-center md:p-20 p-10 gap-5 my-10">
      <div class="text-white text-2xl lg:text-6xl">{{ $t('home.btotitle') }}</div>
      <div class="md:text-xl text-base break-all md:p-0 px-10 text-gray-400">{{ $t('home.btodesc') }}</div>
      <div class="text-black bg-white rounded-md p-4 cursor-pointer">{{ $t('btn.start') }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>