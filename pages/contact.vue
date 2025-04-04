<script setup lang="ts">
useSeoMeta({
    title: 'Nuxtship-contact',
    ogTitle: 'Nuxtship-contact',
    description: '联系我们(contact us)',
    ogDescription: '联系我们(contact us)',
})
</script>

<template>
    <div class="pt-10">

        <Head>
            <Title>Nuxtship-contact</Title>
            <Meta name="description"
                content="使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。">
            </Meta>
        </Head>
        <top zhtitle="接触" title="Contact" zhdesc="我来帮忙。" desc="I am here to help."></top>
        <div class="md:flex gap-10 md:px-32">
            <div class="flex-1 md:mb-0 mb-5">
                <div class="text-2xl text-color">{{ $t('contact.creator') }}</div>
                <div class="mt-3 mb-5 text-xl text-gray-400">
                    {{ $t('contact.tip') }}
                </div>
                <div class="flex items-center gap-4 mb-4 text-color">
                    <Icon name="uil:registered"></Icon>
                    <span>{{ $t('contact.one') }}</span>
                </div>
                <div class="flex items-center gap-4 text-color">
                    <Icon name="uil:envelope-minus"></Icon>
                    <span>{{ $t('contact.emial') }}</span>
                </div>
            </div>
            <div class="flex-1">
                <form action="" class="flex flex-col items-center">
                    <input class="w-full border-2 border-[#D1D5DB] h-10 rounded pl-3" type="text" required
                        :placeholder="$t('contact.form.fullname')">
                    <input class="w-full border-2 border-[#D1D5DB] h-10 rounded pl-3 my-3" type="text" required
                        :placeholder="$t('contact.form.email')">
                    <textarea class="w-full h-36 border-2 border-[#D1D5DB] rounded p-3 mb-3" name="" id=""
                        :placeholder="$t('contact.form.message')"></textarea>
                    <button type="submit"
                        class="text-white dark:border-white dark:border-2 rounded-md w-full text-center py-3 bg-black hover:bg-slate-700 cursor-pointer">{{
                            $t('btn.sendmessage') }}</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>