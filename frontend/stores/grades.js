import { defineStore } from 'pinia'

export const useGradesStore = defineStore('grades', {
  state: () => ({
    grades: [],
    currentGrade: null,
    loading: false,
    error: null
  }),

  getters: {
    getGrades: (state) => state.grades,
    getCurrentGrade: (state) => state.currentGrade,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchGrades(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('grades', params)
        this.grades = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchGrade(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get(`grades/${id}`)
        this.currentGrade = response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createGrade(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('grades', data)
        this.grades.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateGrade(id, data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.patch(`grades/${id}`, data)
        const index = this.grades.findIndex(g => g.id === id)
        if (index !== -1) {
          this.grades[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteGrade(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        await api.remove(`grades/${id}`)
        this.grades = this.grades.filter(g => g.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
