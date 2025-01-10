<script setup lang="ts">
    
</script>

<template>
    <div class="flex">
        <div class="w-10">left</div>
        <div class="flex-1">
            <slot name="top"></slot>
            <slot></slot>
        </div>
        <div class="w-10">right</div>
    </div>
</template>

<style lang="scss" scoped></style>