<script setup lang="ts">
// definePageMeta({
//     layout: false
// })
useHead({
    title:'登录'
})
const changeLayout = () => {
    setPageLayout('custom')
}
</script>

<template>
    <div>
        <div class="text-3xl text-center text-orange-400">
            <span>login</span>
            <UButton @click="changeLayout">change layout</UButton>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>