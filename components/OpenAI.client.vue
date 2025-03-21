<script setup lang="ts">
const aiRef = ref<HTMLElement>()
const { style } = useDraggable(aiRef, {
    initialValue: {
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
    },
})

</script>

<template>
    <div ref="aiRef" :style="style"
        class="fixed text-xs cursor-pointer  z-50 flex justify-center items-center w-16 h-16 bg-slate-100 shadow-lg dark:bg-slate-800 rounded-full">
        <span>AI助手</span>
    </div>
</template>

<style lang="scss" scoped></style>