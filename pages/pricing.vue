<script setup lang="ts">
useSeoMeta({
    title: 'Nuxtship-pricing',
    ogTitle: 'Nuxtship-pricing',
    description: 'price',
    ogDescription: 'price',
})
const { data: pricing } = useFetch('/api/pricing')

const { locale } = useI18n()

const localePath = useLocalePath()

</script>

<template>
    <div class="pt-10">

        <Head>
            <Title>Nuxtship-Pricing</Title>
            <Meta name="description"
                content="使用 Nuxt 完成的营销网站,Nuxtship 是适用于初创公司、营销网站和登录页面的入门模板。使用 Nuxt 和 TailwindCSS 构建。您可以使用此入门模板快速创建任何网站。">
            </Meta>
        </Head>
        <top title="Pricing" zhtitle="价格" zhdesc="定价简单且可预测。没有意外。" desc="Simple & Predictable pricing. No Surprises.">
        </top>
        <div class="md:flex gap-10 justify-center flex-wrap">
            <div class="border-2 md:m-0 m-auto md:mb-0 mb-10 w-80 border-[#D8DEE9] border-opacity-50 rounded-md p-5"
                :key="idx" v-for="(item, idx) in pricing">
                <div class="text-center text-gray-400 dark:text-gray-100 mb-5">{{ $t('price.itemname', {
                    name: locale === 'en' ? item.name :
                        item.zhname
                }) }}
                </div>
                <div class="text-center font-bold mb-5 text-black dark:text-white text-3xl"
                    v-if="typeof item.price === 'object'">
                    {{ $t('price.itemprice', { price: locale === 'en' ? item.price.monthly : item.price.zmonthly }) }}
                </div>
                <div class="text-center font-bold mb-5 text-black dark:text-white text-3xl" v-else>{{
                    $t('price.itemprice', { price: locale === 'en' ? item.price : item.zhprice }) }}</div>
                <div class="flex gap-3 items-center text-color mb-4" :key="ix" v-for="(text, ix) in item.features">
                    <Icon name="uil:sign-out-alt" class="text-xl"></Icon>
                    <span class="break-all text-ellipsis whitespace-nowrap">{{
                        $t('price.feature', { feature: locale === 'en' ? text : item.zhfeatures[ix] }) }}</span>
                </div>
                <nuxt-link :to="localePath(item.button.link)" :class="{ 'bg-gray-900 text-white': item.popular }"
                    class="block dark:border-white mt-10 text-color rounded-md w-full text-center py-3 border-gray-950 border-2 cursor-pointer">
                    {{ $t(`btn.${item.button.type}`) }}</nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>