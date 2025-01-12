<script setup lang="ts">
definePageMeta({
    pageTransition: {
        onBeforeEnter(el: any) {
            el.style.backgroundColor = 'red'
        },
        onEnter: (el, done) => {
        },
        onAfterEnter: (el) => {
        }
    },
    middleware: ['named-test']
})
useHead({
    title: '登录'
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