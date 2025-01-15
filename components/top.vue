<script setup lang="ts">
interface Props {
    title: string,
    desc: string
}
withDefaults(defineProps<Props>(), { title: '', desc: '' })
</script>

<template>
    <div class="mb-10 flex flex-col items-center gap-4">
        <div class="md:text-5xl text-center text-4xl font-bold">{{ title }}</div>
        <div class="text-gray-500 text-xl text-center">{{ desc }}</div>
    </div>
</template>

<style lang="scss" scoped></style>