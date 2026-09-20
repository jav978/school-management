import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Bypass middleware for server API routes and uploads
  if (to.path.startsWith('/api') || to.path.startsWith('/uploads')) {
    return
  }

  // Ensure state is restored and verified against backend on both SSR and client
  if (!authStore.isLoggedIn || !authStore.user) {
    await authStore.checkAuth()
  }

  const isPublicRoute = 
    to.path === '/auth/login' || 
    to.path === '/auth/forgot-password' ||
    to.path === '/auth/reset-password' ||
    to.path === '/auth/onboarding' ||
    to.path === '/auth/callback' ||
    to.path === '/auth/2fa-challenge' || 
    to.path === '/404' || 
    to.path.startsWith('/verificar-boleta') ||
    to.path.startsWith('/supplies')

  // Root redirect: '/' -> '/dashboard' if logged in, else '/auth/login'
  if (to.path === '/') {
    if (authStore.isLoggedIn) {
      return navigateTo('/dashboard')
    }
    return navigateTo('/auth/login')
  }

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

    const restrictedRoutes: Record<string, string[]> = {
      '/teachers': ['admin', 'coordinator', 'control_estudio'],
      '/staff': ['admin', 'coordinator', 'control_estudio'],
      '/reports': ['admin', 'coordinator', 'control_estudio'],
      '/academic-planning': ['admin', 'coordinator', 'teacher'],
      '/classes': ['admin', 'coordinator', 'control_estudio', 'teacher'],
      '/feedback': ['admin', 'coordinator', 'control_estudio'],
      '/settings': ['admin']
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

