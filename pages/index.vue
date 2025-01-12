<script lang="ts" setup>
import { BaseFooTest } from '#components'
definePageMeta({
  middleware: [
    function () {
      console.log('index middleware');
    },
    'auth',
    'named-test'
  ]
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
const list = ref<{ name: string; age: number; }[]>([])

const getList = async () => {
  // 客户端运行
  const res = await $fetch('/api/test')
  console.log('res', res.list);
  list.value = [...list.value, ...res.list]
}
// 服务端运行
// const { data, status, refresh, clear } = await useFetch('/api/test', { lazy: true, pick: ['list'], key: "test" })
// list.value = data.value?.list ?? []
// console.log('data', data.value);

// const { data, refresh, clear, error, status } = await useAsyncData('test', async () => {
//   return await Promise.all([
//     $fetch('/api/test'),
//     $fetch('/api/test')
//   ])
// })
// console.log(data, refresh, clear, error, status);
const num = ref(1)
// const { data, refresh, clear, status } = useFetch(`/api/detail`,
//   { query: { id: num }, watch: [num], immediate: true })
const refreshReq = () => {
  num.value++
}

const { data, status, clear } = useFetch('/api/hello/kkll')

const { data: info } = useFetch('/api/submit', { method: 'post', body: { name: 'zzk', age: 18 } })
const pageTo = () => {
  navigateTo('/login')
}

const counter = useState('counter', () => Math.round(Math.random() * 1000))

const websiteStore = useWebsiteStore()
await callOnce(websiteStore.fetch)

const { $hello } = useNuxtApp()
const config = useRuntimeConfig()
console.log('cofing', config);

</script>
<template>
  <div>
    <h1 class="text-2xl">index--{{ status }} __{{ $hello('class=""') }}</h1>
    <ul>
      {{ data }} -_-{{ num }} -_-{{ info }}
      <li v-for="(item, index) in list" :key="index">{{ item.name }}--{{ item.age }}</li>
    </ul>
    <hr>
    counter:{{ counter }}
    <UButton @click="counter++">counter++</UButton>
    <UButton @click="counter--">counter--</UButton>
    <UButton @click="pageTo">login</UButton>
    <UButton @click="getList">getlist</UButton>
    <UButton @click="refreshReq">refresh</UButton>
    <UButton @click="() => clear()">clear</UButton>
    websiteConfig:{{ websiteStore.websiteConfig }}
    <hr>
    <img src="~/assets/img/bg.png" alt="">
    <component :is="BaseFooTest"></component>
    <LazyArticleBn :count="num" />
    <input type="text" placeholder="search" v-focus>
  </div>
</template>

<style lang="scss" scoped></style>