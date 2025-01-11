<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})
useHead({
  title: '首页',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [{ innerHTML: '' }]
})
const list = ref<{ name: string; age: number; }[] | undefined>([])
const getList = async () => {
  // const res = await $fetch('/api/test')
  // console.log('res', res.list);
  // list.value = res.list
  // console.log(useNuxtApp().payload);
}
const { data } = await useFetch('/api/test')
console.log('data', data.value);
list.value = data.value?.list
const pageTo = () => {
  navigateTo('/login')
}
</script>
<template>
  <div>
    <h1 class="text-2xl">index</h1>
    <ul>
      <li v-for="(item, index) in list" :key="index">{{ item.name }}--{{ item.age }}</li>
    </ul>
    <UButton @click="pageTo">login</UButton>
    <UButton @click="getList">getlist</UButton>
  </div>
</template>

<style lang="scss" scoped></style>