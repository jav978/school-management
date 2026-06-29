import { defineStore } from 'pinia'

export const useTeachersStore = defineStore('teachers', {
  state: () => ({
    teachers: [],
    currentTeacher: null,
    loading: false,
    error: null
  }),

  getters: {
    getTeachers: (state) => state.teachers,
    getCurrentTeacher: (state) => state.currentTeacher,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchTeachers(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('teachers', params)
        this.teachers = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTeacher(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get(`teachers/${id}`)
        this.currentTeacher = response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTeacher(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('teachers', data)
        this.teachers.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTeacher(id, data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.patch(`teachers/${id}`, data)
        const index = this.teachers.findIndex(t => t.id === id)
        if (index !== -1) {
          this.teachers[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTeacher(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        await api.remove(`teachers/${id}`)
        this.teachers = this.teachers.filter(t => t.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
