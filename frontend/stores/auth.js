import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    sessionId: null,
    isAuthenticated: false,
    twoFactorPending: false,
    tempToken: null,
    tempUser: null
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getSessionId: (state) => state.sessionId,
    isLoggedIn: (state) => state.isAuthenticated,
    is2FAPending: (state) => state.twoFactorPending,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(email, password) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiBase}/authentication`, {
          method: 'POST',
          body: {
            strategy: 'local',
            email,
            password
          }
        })

        if (response.two_factor_required) {
          this.twoFactorPending = true
          this.tempToken = response.temp_token
          this.tempUser = response.user
          this.isAuthenticated = false
          if (import.meta.client) {
            sessionStorage.setItem('temp_2fa_token', response.temp_token)
            sessionStorage.setItem('temp_2fa_user', JSON.stringify(response.user))
          }
          return response
        }

        this.token = response.accessToken
        this.sessionId = response.session_id || null
        this.user = response.user
        this.isAuthenticated = true
        this.twoFactorPending = false
        this.tempToken = null
        this.tempUser = null

        // Cookie efímera de sesión (se destruye automáticamente al cerrar el navegador)
        const sessionCookie = useCookie('session_token', { sameSite: 'lax', secure: false })
        sessionCookie.value = response.accessToken

        const sessionIdCookie = useCookie('session_id', { sameSite: 'lax', secure: false })
        sessionIdCookie.value = response.session_id || ''

        if (import.meta.client) {
          sessionStorage.setItem('token', response.accessToken)
          sessionStorage.setItem('session_id', response.session_id || '')
          sessionStorage.setItem('user', JSON.stringify(response.user))
          sessionStorage.removeItem('temp_2fa_token')
          sessionStorage.removeItem('temp_2fa_user')
          sessionStorage.removeItem('simulated_role')

          // Limpiar residuo histórico de localStorage para evitar bypass
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('simulated_role')
          localStorage.removeItem('feathers-jwt')
          localStorage.removeItem('school_jwt')
        }

        return response
      } catch (error) {
        throw error
      }
    },

    async verifyTwoFactor(code) {
      try {
        const config = useRuntimeConfig()
        const tempToken = this.tempToken || (import.meta.client ? sessionStorage.getItem('temp_2fa_token') : null)
        if (!tempToken) {
          throw new Error('Sesión de verificación 2FA no encontrada o expirada.')
        }

        const response = await $fetch(`${config.public.apiBase}/two-factor`, {
          method: 'POST',
          body: {
            action: 'challenge',
            temp_token: tempToken,
            code
          }
        })

        this.token = response.accessToken
        this.sessionId = response.session_id || null
        this.user = response.user
        this.isAuthenticated = true
        this.twoFactorPending = false
        this.tempToken = null
        this.tempUser = null

        // Cookie efímera de sesión
        const sessionCookie = useCookie('session_token', { sameSite: 'lax', secure: false })
        sessionCookie.value = response.accessToken

        const sessionIdCookie = useCookie('session_id', { sameSite: 'lax', secure: false })
        sessionIdCookie.value = response.session_id || ''

        if (import.meta.client) {
          sessionStorage.setItem('token', response.accessToken)
          sessionStorage.setItem('session_id', response.session_id || '')
          sessionStorage.setItem('user', JSON.stringify(response.user))
          sessionStorage.removeItem('temp_2fa_token')
          sessionStorage.removeItem('temp_2fa_user')
          sessionStorage.removeItem('simulated_role')

          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('simulated_role')
          localStorage.removeItem('feathers-jwt')
          localStorage.removeItem('school_jwt')
        }

        return response
      } catch (error) {
        throw error
      }
    },

    cancelTwoFactor() {
      this.twoFactorPending = false
      this.tempToken = null
      this.tempUser = null
      if (import.meta.client) {
        sessionStorage.removeItem('temp_2fa_token')
        sessionStorage.removeItem('temp_2fa_user')
      }
    },

    async logout() {
      // Limpiar cookies de sesión de forma segura si el contexto Nuxt está disponible
      try {
        const sessionCookie = useCookie('session_token')
        if (sessionCookie) sessionCookie.value = null
        const sessionIdCookie = useCookie('session_id')
        if (sessionIdCookie) sessionIdCookie.value = null
      } catch (_) {
        // En contexto async desvinculado en SSR, ignorar
      }

      const currentToken = this.token || (import.meta.client ? sessionStorage.getItem('token') : null)

      this.token = null
      this.sessionId = null
      this.user = null
      this.isAuthenticated = false
      this.twoFactorPending = false
      this.tempToken = null
      this.tempUser = null

      if (import.meta.client) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('session_id')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('simulated_role')
        sessionStorage.removeItem('temp_2fa_token')
        sessionStorage.removeItem('temp_2fa_user')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('simulated_role')
        localStorage.removeItem('feathers-jwt')
        localStorage.removeItem('school_jwt')
      }

      // Notificar al backend para revocar la sesión en school.user_sessions
      if (currentToken) {
        try {
          const config = useRuntimeConfig()
          await $fetch(`${config.public.apiBase}/authentication`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${currentToken}`
            }
          })
        } catch (_) {
          // Ignorar error de red durante logout
        }
      }
    },

    /**
     * Valida en tiempo real la vigencia y unicidad de la sesión contra el Backend.
     * Si la sesión fue revocada, invalidada por otro login o expirada, limpia el storage.
     */
    async checkAuth() {
      let token = null
      try {
        const sessionCookie = useCookie('session_token')
        token = sessionCookie.value || null
      } catch (_) {}

      if (!token && import.meta.client) {
        token = sessionStorage.getItem('token')
      }

      if (!token) {
        // No hay token ni cookie de sesión: forzar limpieza inmediata
        this.token = null
        this.sessionId = null
        this.user = null
        this.isAuthenticated = false
        if (import.meta.client) {
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('session_id')
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('simulated_role')
        }
        return false
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiBase}/authentication`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response && response.authenticated && response.user) {
          this.token = token
          this.sessionId = response.session_id || null
          this.user = response.user
          this.isAuthenticated = true

          if (import.meta.client) {
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('user', JSON.stringify(response.user))
            if (response.session_id) {
              sessionStorage.setItem('session_id', response.session_id)
            }
          }
          return true
        } else {
          await this.logout()
          return false
        }
      } catch (error) {
        // Token inválido, revocado, o sesión iniciada en otro dispositivo (401)
        await this.logout()
        return false
      }
    }
  }
})
