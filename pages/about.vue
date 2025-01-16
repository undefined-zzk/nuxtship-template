<script setup lang="ts">
const TeamImg1 = "https://source.unsplash.com/IF9TK5Uy-KI";
const TeamImg2 = "https://source.unsplash.com/iEEBWgY_6lA";
const TeamImg3 = "https://source.unsplash.com/ZHvM3XIOHoE";

const team = [
  {
    name: "Janette Lynch",
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
    avatar: {
      src: TeamImg2,
      width: 580,
      height: 580,
    },
  },
  {
    name: "Robert Palmer",
    title: "Marketing Engineer",
    avatar: {
      src: TeamImg3,
      width: 580,
      height: 580,
    },
  },
];
</script>

<template>
  <div class="pt-10">
    <top zhtitle="关于" title="About" zhdesc="我们是一个充满激情的小团队。" desc="We are a small passionate team."></top>
    <div>
      <div class="font-bold text-3xl mb-5">Empowering the world with Nuxt.</div>
      <div class="text-xl text-gray-400">
        We're a multi-cultural team from around the world! We come from diverse backgrounds, bringing different
        personalities, experiences and skills to the job. This is what makes our team so special.
      </div>
    </div>
    <div class="md:flex gap-10 mt-10 justify-center">
      <div v-for="(item, idx) in team" :key="idx" class="md:m-0 m-auto md:mb-0 mb-5 flex items-center flex-col">
        <div class="w-[272px] h-[272px] mb-5 hover:shadow-xl rounded-sm overflow-hidden">
          <img :src="item.avatar.src" alt="" class="w-full h-full object-cover">
        </div>
        <div class="text-center text-xl">{{ item.name }}</div>
        <div class="text-center text-gray-400">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>