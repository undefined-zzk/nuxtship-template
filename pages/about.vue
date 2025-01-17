<script setup lang="ts">
useHead({
    title:"about"
})
const TeamImg1 = "https://source.unsplash.com/IF9TK5Uy-KI";
const TeamImg2 = "https://source.unsplash.com/iEEBWgY_6lA";
const TeamImg3 = "https://source.unsplash.com/ZHvM3XIOHoE";

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
    <top zhtitle="关于" title="About" zhdesc="我们是一个充满激情的小团队。" desc="We are a small passionate team."></top>
    <div>
      <div class="font-bold text-3xl mb-5">{{ $t('about.title') }}</div>
      <div class="text-xl text-gray-400">{{ $t('about.subtitle') }}</div>
    </div>
    <div class="md:flex gap-10 mt-10 justify-center">
      <div v-for="(item, idx) in team" :key="idx" class="md:m-0 m-auto md:mb-0 mb-5 flex items-center flex-col">
        <div class="w-[272px] h-[272px] mb-5 hover:shadow-xl rounded-sm overflow-hidden">
          <img :src="item.avatar.src" alt="" class="w-full h-full object-cover">
        </div>
        <div class="text-center text-xl">{{ $t('about.teamname', { name: locale === 'en' ? item.name : item.zhname }) }}
        </div>
        <div class="text-center text-gray-400">{{ $t('about.teamname', {
          title: locale === 'en' ? item.title :
            item.zhtitle}) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>