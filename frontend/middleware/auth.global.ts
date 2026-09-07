import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Ensure state is restored from localStorage/sessionStorage on initial client navigation
  if (import.meta.client && !authStore.isLoggedIn && !authStore.is2FAPending) {
    await authStore.checkAuth()
  }

  const isPublicRoute = 
    to.path === '/auth/login' || 
    to.path === '/auth/2fa-challenge' || 
    to.path === '/404' || 
    to.path.startsWith('/verificar-boleta')

  // 1. If 2FA challenge is currently pending, lock user exclusively to the 2FA challenge page
  if (authStore.is2FAPending) {
    if (to.path !== '/auth/2fa-challenge') {
      return navigateTo('/auth/2fa-challenge')
    }
    return
  }

  // 2. If user is NOT logged in and attempts to access any private route, redirect to login
  if (!authStore.isLoggedIn) {
    if (!isPublicRoute) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    return
  }

  // 3. If user IS logged in and tries to go to login or 2FA challenge, send to dashboard
  if (authStore.isLoggedIn) {
    if (to.path === '/auth/login' || to.path === '/auth/2fa-challenge') {
      return navigateTo('/dashboard')
    }

    // 4. Role-Based Access Control (RBAC) Matrix
    const userRole = authStore.userRole || 'student'

    const restrictedRoutes = {
      '/teachers': ['admin', 'coordinator'],
      '/staff': ['admin', 'coordinator'],
      '/reports': ['admin', 'coordinator', 'control_estudio'],
      '/academic-planning': ['admin', 'coordinator', 'teacher'],
      '/classes': ['admin', 'coordinator', 'control_estudio', 'teacher']
    }

    for (const [routePrefix, allowedRoles] of Object.entries(restrictedRoutes)) {
      if (to.path.startsWith(routePrefix)) {
        if (!allowedRoles.includes(userRole)) {
          // Unauthorized role: redirect to safe dashboard
          return navigateTo('/dashboard')
        }
      }
    }
  }
})
