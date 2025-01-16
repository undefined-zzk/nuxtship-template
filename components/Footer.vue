<script setup lang="ts">
const year = computed(() => {
    return (new Date()).getFullYear()
})
const {locale}=useI18n()
const encopy=`Copyright © ${year.value} Nuxtship. All rights reserved.`
const zhcopy=`版权所有 © ${year.value} Nuxtship。保留所有权利。`
</script>

<template>
    <div class="w-full flex justify-center flex-col items-center gap-2 py-5 text-gray-500 text-sm">
        <div class="text-center">{{$t('footer.btotitle',{copy:locale==='en'?encopy:zhcopy})}}</div>
        <div class="text-center text-xs">{{ $t('footer.btosub') }}</div>
    </div>
</template>

<style lang="scss" scoped></style>