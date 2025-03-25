<script setup lang="ts">
interface Props {
    title: string,
    zhtitle: string
    desc: string
    zhdesc: string
}
withDefaults(defineProps<Props>(), { title: '', desc: '', zhtitle: '', zhdesc: '' })
const { locale } = useI18n()
</script>

<template>
    <div class="mb-10 flex flex-col items-center gap-4">
        <div class="md:text-5xl text-center text-4xl font-bold text-color">{{ $t('top.title', {
            title: locale === 'en' ?
                title : zhtitle
        })
        }}</div>
        <div class="text-gray-500 text-xl text-center ">{{ $t('top.subtitle', {
            subtitle: locale === 'en' ? desc :
                zhdesc
        }) }}</div>
    </div>
</template>

<style lang="scss" scoped></style>