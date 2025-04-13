<!--
 * @Author: undefined 2143511430@qq.com
 * @Date: 2025-04-13 18:38:24
 * @LastEditors: undefined 2143511430@qq.com
 * @LastEditTime: 2025-04-13 19:06:10
 * @FilePath: \nuxtship-template-ai\components\CssLoading.client.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">

</script>
<template>
    <div class="loader absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
</template>
<style>
/* HTML: <div class="loader"></div> */
.loader {
    width: 50px;
    aspect-ratio: 1;
    display: grid;
    z-index: 9999;
}

.loader::before,
.loader::after {
    content: "";
    grid-area: 1/1;
    --c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
    background:
        var(--c) 50% 0,
        var(--c) 50% 100%,
        var(--c) 100% 50%,
        var(--c) 0 50%;
    background-size: 12px 12px;
    animation: l12 1s infinite;
}

.loader::before {
    margin: 4px;
    filter: hue-rotate(45deg);
    background-size: 8px 8px;
    animation-timing-function: linear
}

@keyframes l12 {
    100% {
        transform: rotate(.5turn)
    }
}
</style>