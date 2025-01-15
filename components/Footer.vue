<script setup lang="ts">
const year = computed(() => {
    return (new Date()).getFullYear()
})
</script>

<template>
    <div class="w-full flex justify-center flex-col items-center gap-2 py-5 text-gray-500 text-sm">
        <div class="text-center">Copyright © {{ year }} Nuxtship. All rights reserved.</div>
        <div class="text-center text-xs">Made by Gr33nW33n with attribution to Web3Templates</div>
    </div>
</template>

<style lang="scss" scoped></style>