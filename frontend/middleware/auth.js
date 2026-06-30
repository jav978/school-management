export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (import.meta.client) {
    authStore.checkAuth()
  }
  
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
      '/students': ['admin', 'teacher', 'planner', 'teacher_coordinator'],
      '/teachers': ['admin', 'teacher_coordinator'],
      '/finance': ['admin'],
      '/reports': ['admin', 'planner', 'teacher_coordinator']
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

