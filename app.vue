<script lang="ts" setup>
useSeoMeta({
  title: 'Nuxt Todos',
  description: 'A hosted demo showcasing Nuxt',
  ogSiteName: 'Nuxt Todos',
  ogType: 'website',
  ogImage: 'https://nuxt-todos-kv.deno.dev/social-image.png',
  twitterImage: 'https://nuxt-guestbook.pages.dev/social-image.png',
  twitterCard: 'summary_large_image'
})
</script>
<template>
  <UHeader
    :ui="{ container: 'bg-gray-400/5 md:rounded-full border-b md:border dark:border-gray-800', wrapper: 'border-0' }">
    <template #left>
      <div class="font-bold text-black dark:text-white">Nuxt Todos</div>
    </template>
    <template #right>
      <UColorModeButton />
      <UButton to="https://github.com/atinux/nuxt-deno-kv" target="_blank" icon="i-simple-icons-github" color="gray"
        variant="ghost" />
    </template>
  </UHeader>
  <UContainer>
    <UMain>
      <NuxtPage />
    </UMain>
  </UContainer>
  <UFooter class="md:pb-4"
    :ui="{ bottom: { container: 'bg-gray-400/5 md:rounded-full border-t md:border dark:border-gray-800' } }">
    <template #left>
      <div class="text-black dark:text-white">Published under MIT License.</div>
    </template>
    <template #right>
      <UButton to="https://x.com/Atinux" target="_blank" icon="i-simple-icons-x" color="gray" variant="ghost" />
      <UButton to="https://github.com/atinux/nuxt-deno-kv" target="_blank" icon="i-simple-icons-github" color="gray"
        variant="ghost" />
    </template>
  </UFooter>
  <UNotifications />
</template>

<style lang="scss">
@import url('normalize.css');

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

:root {
  font-family: 'Roboto';
}
</style>
