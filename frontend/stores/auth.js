import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    twoFactorPending: false,
    tempToken: null,
    tempUser: null
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
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
        this.user = response.user
        this.isAuthenticated = true
        this.twoFactorPending = false
        this.tempToken = null
        this.tempUser = null

        if (import.meta.client) {
          sessionStorage.setItem('token', response.accessToken)
          sessionStorage.setItem('user', JSON.stringify(response.user))
          sessionStorage.removeItem('temp_2fa_token')
          sessionStorage.removeItem('temp_2fa_user')
          // Limpiar residuo histórico de localStorage para evitar bypass
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('simulated_role')
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
        this.user = response.user
        this.isAuthenticated = true
        this.twoFactorPending = false
        this.tempToken = null
        this.tempUser = null

        if (import.meta.client) {
          sessionStorage.setItem('token', response.accessToken)
          sessionStorage.setItem('user', JSON.stringify(response.user))
          sessionStorage.removeItem('temp_2fa_token')
          sessionStorage.removeItem('temp_2fa_user')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('simulated_role')
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
      this.token = null
      this.user = null
      this.isAuthenticated = false
      this.twoFactorPending = false
      this.tempToken = null
      this.tempUser = null

      if (import.meta.client) {
        sessionStorage.removeItem('token')
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
    },

    setRole(role) {
      if (!this.user) {
        this.user = { id: 1, role, first_name: 'Usuario', last_name: role, email: `${role}@colegio.edu` }
      } else {
        this.user.role = role
        this.user.user_type = role
      }
      if (import.meta.client) {
        sessionStorage.setItem('user', JSON.stringify(this.user))
        sessionStorage.setItem('simulated_role', role)
      }
    },

    async checkAuth() {
      if (import.meta.client) {
        // Defensive cleanup of legacy persistent localStorage tokens
        if (localStorage.getItem('token') || localStorage.getItem('user')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('simulated_role')
          localStorage.removeItem('feathers-jwt')
          localStorage.removeItem('school_jwt')
        }

        // Enforce strict session: read exclusively from sessionStorage
        const token = sessionStorage.getItem('token')
        const user = sessionStorage.getItem('user')

        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          const simRole = sessionStorage.getItem('simulated_role')
          if (simRole && this.user) {
            this.user.role = simRole
            this.user.user_type = simRole
          }
          this.isAuthenticated = true
        } else {
          this.token = null
          this.user = null
          this.isAuthenticated = false
        }

        // Restore pending 2FA state if page was refreshed during 2FA challenge
        const tempToken = sessionStorage.getItem('temp_2fa_token')
        const tempUser = sessionStorage.getItem('temp_2fa_user')
        if (tempToken && !this.isAuthenticated) {
          this.twoFactorPending = true
          this.tempToken = tempToken
          this.tempUser = tempUser ? JSON.parse(tempUser) : null
        }
      }
    }
  }
})
