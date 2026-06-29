export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isLoggedIn && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }
  
  if (authStore.isLoggedIn) {
    if (to.path === '/auth/login') {
      return navigateTo('/dashboard')
    }

    // Role-based route guard
    const userRole = authStore.userRole
    const routeRoles = {
      '/students': ['admin', 'teacher'],
      '/teachers': ['admin'],
      '/finance': ['admin'],
      '/reports': ['admin']
    }

    for (const [route, allowedRoles] of Object.entries(routeRoles)) {
      if (to.path.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          return navigateTo('/dashboard')
        }
      }
    }
  }
})

