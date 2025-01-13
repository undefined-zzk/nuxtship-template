export default defineNuxtPlugin((nuxtApp) => {
  // 添加全局中间件
  addRouteMiddleware(
    'global-test',
    () => {
      // console.log('globaltest middleware')
    },
    { global: true }
  )
  // 添加命名中间件
  addRouteMiddleware('named-test', () => {
    // console.log('named-test middleware')
  })
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {}
  nuxtApp.hook('app:rendered', () => {
    // console.log('app:rendered')
  })
})
