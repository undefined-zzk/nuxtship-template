export const useWebsiteStore = defineStore('website', () => {
  const websiteConfig = ref('NUXT3')
  const fetch = async () => {
    websiteConfig.value = await $fetch('/api/hello/HELLO NUXT3')
  }
  return { websiteConfig, fetch }
})
