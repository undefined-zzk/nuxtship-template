<script setup lang="ts">
type Theme = 'dark' | 'light'
const theme = ref<Theme>('light')
const key = 'nuxtship-theme'
const changeTheme = (type: Theme) => {
    document.documentElement.setAttribute('class', type)
    theme.value = type
    sessionStorage.setItem(key, type)
}

watchEffect(() => {
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
})

</script>

<template>
    <Icon name="tabler:moon" v-if="theme === 'dark'" class="cursor-pointer dark:text-white" @click="changeTheme('light')">
    </Icon>
    <Icon name="tabler:sun" v-else class="cursor-pointer" @click="changeTheme('dark')"></Icon>
</template>

<style lang="scss" scoped></style>