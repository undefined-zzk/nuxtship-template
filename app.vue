<script lang="ts" setup>
useSeoMeta({
  title: 'nuxt 测试练习',
  ogTitle: 'nuxt 练习',
  description: '这个一个个人学习nuxt、tailwindcss的练习网站',
  ogDescription: '这个一个个人学习nuxt、tailwindcss的练习网站',
})
</script>
<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<style lang="scss">
@import url('normalize.css');

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

:root {
  font-family: 'Roboto';
}
</style>
