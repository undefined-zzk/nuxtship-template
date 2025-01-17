<script setup lang="ts">
useHead({
    title:"pricing"
})
const pricing = [
    {
        name: "Personal",
        zhname: "个人的",
        price: "Free",
        zhprice: "免费的",
        popular: false,
        features: [
            "Lifetime free",
            "Up to 3 users",
            "Unlimited Pages",
            "Nuxt Sub domain",
            "Basic Integrations",
            "Community Support",
        ],
        zhfeatures: [
            '终身免费',
            '最多 3 位用户',
            '无限页面',
            'Nuxt 子域名',
            '基本集成',
            '社区支持'
        ],
        button: {
            text: "Get Started",
            type: 'start',
            link: "/",
        },
    },
    {
        name: "Startup",
        zhname: "启动",
        zhprice: '',
        price: {
            monthly: "$19",
            zmonthly: '19美元',
            annual: "$16",
            discount: "10%",
            original: "$24",
        },
        popular: true,
        features: [
            "All Free Features",
            "Up to 20 users",
            "20 Custom domains",
            "Unlimited Collaborators",
            "Advanced Integrations",
            "Priority Support",
        ],
        zhfeatures: [
            '所有免费功能',
            '最多 20 个用户',
            '20 个自定义域名',
            '无限合作者',
            '高级集成',
            '优先支持'
        ],
        button: {
            text: "Get Started",
            type: 'start',
            link: "#",
        },
    },
    {
        name: "Enterprise",
        zhname: '企业',
        price: "Custom",
        zhprice: '风俗',
        popular: false,
        features: [
            "All Pro Features",
            "Unlimited Custom domains",
            "99.99% Uptime SLA",
            "SAML & SSO Integration",
            "Dedicated Account Manager",
            "24/7 Phone Support",
        ],
        zhfeatures: [
            '所有专业功能',
            '无限自定义域名',
            '99.99% 正常运行时间 SLA',
            'SAML 和 SSO 集成',
            '专属客户经理',
            '24/7 电话支持'
        ],
        button: {
            text: "Contact us",
            type: 'contactus',
            link: "/contact",
        },
    },
];
const { locale } = useI18n()
const localePath = useLocalePath()

</script>

<template>
    <div class="pt-10">
        <top title="Pricing" zhtitle="价格" zhdesc="定价简单且可预测。没有意外。" desc="Simple & Predictable pricing. No Surprises.">
        </top>
        <div class="md:flex gap-10 justify-center flex-wrap">
            <div class="border-2 md:m-0 m-auto md:mb-0 mb-10 w-80 border-[#D8DEE9] border-opacity-50 rounded-md p-5"
                :key="idx" v-for="(item, idx) in pricing">
                <div class="text-center text-gray-400 mb-5">{{ $t('price.itemname', {
                    name: locale === 'en' ? item.name :
                        item.zhname
                }) }}
                </div>
                <div class="text-center font-bold mb-5 text-black text-3xl" v-if="typeof item.price === 'object'">
                    {{ $t('price.itemprice', { price: locale === 'en' ? item.price.monthly : item.price.zmonthly }) }}
                </div>
                <div class="text-center font-bold mb-5 text-black text-3xl" v-else>{{
                    $t('price.itemprice', { price: locale === 'en' ? item.price : item.zhprice }) }}</div>
                <div class="flex gap-3 items-center mb-4" :key="ix" v-for="(text, ix) in item.features">
                    <Icon name="uil:sign-out-alt" class="text-xl"></Icon>
                    <span class="break-all text-ellipsis whitespace-nowrap">{{
                        $t('price.feature', { feature: locale === 'en' ? text : item.zhfeatures[ix]}) }}</span>
                </div>
                <nuxt-link :to="localePath(item.button.link)" :class="{ 'bg-gray-900 text-white': item.popular }"
                    class="block mt-10 rounded-md w-full text-center py-3 border-gray-950 border-2 cursor-pointer">
                    {{ $t(`btn.${item.button.type}`) }}</nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>