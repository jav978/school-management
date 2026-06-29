import { defineStore } from 'pinia'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    students: [],
    currentStudent: null,
    loading: false,
    error: null
  }),

  getters: {
    getStudents: (state) => state.students,
    getCurrentStudent: (state) => state.currentStudent,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchStudents(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('students', params)
        this.students = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStudent(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get(`students/${id}`)
        this.currentStudent = response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createStudent(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('students', data)
        this.students.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateStudent(id, data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.patch(`students/${id}`, data)
        const index = this.students.findIndex(s => s.id === id)
        if (index !== -1) {
          this.students[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteStudent(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        await api.remove(`students/${id}`)
        this.students = this.students.filter(s => s.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
