<script setup lang="ts">
import TeamImg1 from "~/assets/img/team1.avif";
import TeamImg2 from "~/assets/img/team2.avif";
import TeamImg3 from "~/assets/img/team3.avif";

useSeoMeta({
  title: 'Nuxtship-about',
  ogTitle: 'Nuxtship-about',
  description: '关于我们(about us)',
  ogDescription: '关于我们(about us)',
})

const team = [
  {
    name: "Janette Lynch",
    zhname: "珍妮特·林奇",
    zhtitle: "高级总监",
    title: "Senior Director",
    avatar: {
      src: TeamImg1,
      width: 480,
      height: 560,
    },
  },
  {
    name: "Marcell Ziemann",
    title: "Principal Strategist",
    zhname: "马塞尔·齐曼",
    zhtitle: "首席策略师",
    avatar: {
      src: TeamImg2,
      width: 580,
      height: 580,
    },
  },
  {
    name: "Robert Palmer",
    title: "Marketing Engineer",
    zhname: "罗伯特帕尔默",
    zhtitle: "营销工程师",
    avatar: {
      src: TeamImg3,
      width: 580,
      height: 580,
    },
  },
];

const { locale } = useI18n()
</script>

<template>
  <div class="pt-10">

    <Head>
      <Title>Nuxtship-about</Title>
      <Meta name="description"
        content="使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。">
      </Meta>
    </Head>
    <top zhtitle="关于" title="About" zhdesc="我们是一个充满激情的小团队。" desc="We are a small passionate team."></top>
    <div>
      <div class="font-bold text-3xl text-color mb-5">{{ $t('about.title') }}</div>
      <div class="text-xl text-gray-400">{{ $t('about.subtitle') }}</div>
    </div>
    <div class="md:flex gap-10 mt-10 justify-center">
      <div v-for="(item, idx) in team" :key="idx" class="md:m-0 m-auto md:mb-0 mb-5 flex items-center flex-col">
        <div class="w-[272px] h-[272px] mb-5 hover:shadow-xl rounded-sm overflow-hidden">
          <img :src="item.avatar.src" alt="team(团队)" class="w-full h-full object-cover">
        </div>
        <div class="text-center text-xl text-color">{{ $t('about.teamname', {
          name: locale === 'en' ? item.name :
            item.zhname
        }) }}
        </div>
        <div class="text-center text-gray-400">{{ $t('about.teamtitle', {
          title: locale === 'en' ? item.title :
            item.zhtitle
        }) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>