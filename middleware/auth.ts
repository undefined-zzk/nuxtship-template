export default defineNuxtRouteMiddleware((to, from) => {
  console.log('auth middleware')
  const a = 1
  if (a !== 1) {
    return navigateTo('/login')
  }
})
