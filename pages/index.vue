<script lang="ts" setup>
definePageMeta({
   middleware:'auth'
})
useHead({
  title: '首页',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
const pageTo=()=>{
   navigateTo('/login')
}
</script>
<template>
  <div>
    <h1 class="text-2xl">index</h1>
    <UButton @click="pageTo">login</UButton>
  </div>
</template>

<style lang="scss" scoped>

</style>