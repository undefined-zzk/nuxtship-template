export const useLangStore=defineStore('lang',()=>{
     const cacheLocale=ref('en')

     return {
        cacheLocale
     }
})