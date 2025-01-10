export default defineNuxtRouteMiddleware((to,from)=>{
    const a=1
    if(a!==1){
       return  navigateTo('/login')
    }
}) 