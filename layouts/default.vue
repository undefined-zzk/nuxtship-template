<script setup lang="ts">

</script>

<template>
    <div class="bg-color min-h-screen max-w-screen-xl mx-auto bg-white flex flex-col justify-between">
        <Header></Header>
         <div class="bg-color flex-1 px-4">
            <slot></slot>
         </div>
        <Footer></Footer>    
    </div>
</template>

<style lang="scss" scoped>

</style>