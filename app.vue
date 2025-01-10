<script lang="ts" setup>
useSeoMeta({
  title:'nuxt 测试练习',
  ogTitle:'nuxt 练习',
  description:'这个一个个人学习nuxt、tailwindcss的练习网站',
  ogDescription:'这个一个个人学习nuxt、tailwindcss的练习网站',
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<style lang="scss">
@import url('normalize.css');

:root {
  font-family: 'Roboto';
}
</style>
