export default defineNuxtPlugin((nuxtApp) => {
  // console.log('nuxtApp one', nuxtApp)
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      console.log('el', el)
      el.focus()
    },
  })
  return {
    provide: {
      hello: (msg: string) => `hello ${msg}`,
    },
  }
})
