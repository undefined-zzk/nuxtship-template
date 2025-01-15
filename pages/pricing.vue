<script setup lang="ts">
const pricing = [
    {
        name: "Personal",
        price: "Free",
        popular: false,
        features: [
            "Lifetime free",
            "Up to 3 users",
            "Unlimited Pages",
            "Nuxt Sub domain",
            "Basic Integrations",
            "Community Support",
        ],
        button: {
            text: "Get Started",
            link: "/",
        },
    },
    {
        name: "Startup",
        price: {
            monthly: "$19",
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
        button: {
            text: "Get Started",
            link: "#",
        },
    },
    {
        name: "Enterprise",
        price: "Custom",
        popular: false,
        features: [
            "All Pro Features",
            "Unlimited Custom domains",
            "99.99% Uptime SLA",
            "SAML & SSO Integration",
            "Dedicated Account Manager",
            "24/7 Phone Support",
        ],
        button: {
            text: "Contact us",
            link: "/contact",
        },
    },
];
</script>

<template>
    <div class="pt-10">
        <top title="Pricing" desc="Simple & Predictable pricing. No Surprises."></top>
        <div class="md:flex gap-10 justify-center flex-wrap">
            <div class="border-2 md:m-0 m-auto md:mb-0 mb-10 w-80 border-[#D8DEE9] border-opacity-50 rounded-md p-5"
                :key="idx" v-for="(item, idx) in pricing">
                <div class="text-center text-gray-400 mb-5">{{ item.name }}</div>
                <div class="text-center font-bold mb-5 text-black text-3xl">{{ typeof item.price === 'object' ?
                    item.price.monthly : item.price }}</div>
                <div class="flex gap-3 items-center mb-4" :key="ix" v-for="(text, ix) in item.features">
                    <Icon name="uil:sign-out-alt" class="text-xl"></Icon>
                    <span class="break-all text-ellipsis whitespace-nowrap">{{ text }}</span>
                </div>
                <nuxt-link :to="item.button.link" :class="{ 'bg-gray-900 text-white': item.popular }"
                    class="block mt-10 rounded-md w-full text-center py-3 border-gray-950 border-2 cursor-pointer">{{
                        item.button.text }}</nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>