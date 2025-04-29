<script setup lang="ts">
type Theme = 'dark' | 'light'
const theme = ref<Theme>('light')
const key = 'nuxtship-theme'
const changeTheme = (type: Theme) => {
    document.documentElement.setAttribute('class', type)
    theme.value = type
    if (import.meta.client) {
        sessionStorage.setItem(key, type)
    }
}

watchEffect(() => {
    if (import.meta.client) {
        const systemTheme = matchMedia('(prefers-color-scheme):dark').matches
        const cacheTheme = sessionStorage.getItem(key)
        if (cacheTheme) {
            changeTheme(cacheTheme as Theme)
            return
        }
        if (systemTheme) {
            changeTheme('dark')
            theme.value = 'dark'
        } else {
            changeTheme('light')
            theme.value = 'light'
        }
    }

})

const openUrl = () => {
    window.location.href = 'https://github.com/undefined-zzk/nuxtship-template-ai'
}

</script>

<template>
    <div class="flex items-center gap-x-2" id="theme-github">
        <Icon name="tabler:moon" v-if="theme === 'dark'" class="cursor-pointer dark:text-white"
            @click="changeTheme('light')">
        </Icon>
        <Icon name="tabler:sun" v-else class="cursor-pointer" @click="changeTheme('dark')"></Icon>
        <Icon name="tabler:brand-github-filled" class="cursor-pointer dark:text-white" @click="openUrl">
        </Icon>
    </div>
</template>

<style lang="scss" scoped></style>