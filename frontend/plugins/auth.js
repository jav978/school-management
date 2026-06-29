export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  
  nuxtApp.hook('app:created', () => {
    authStore.checkAuth()
  })
})
