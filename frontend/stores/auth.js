import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
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

        this.token = response.accessToken
        this.user = response.user
        this.isAuthenticated = true

        if (import.meta.client) {
          localStorage.setItem('token', response.accessToken)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    async checkAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')

        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    }
  }
})
