import { defineStore } from 'pinia'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendance: [],
    currentRecord: null,
    loading: false,
    error: null
  }),

  getters: {
    getAttendance: (state) => state.attendance,
    getCurrentRecord: (state) => state.currentRecord,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchAttendance(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('attendance', params)
        this.attendance = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAttendance(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('attendance', data)
        this.attendance.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAttendance(id, data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.patch(`attendance/${id}`, data)
        const index = this.attendance.findIndex(a => a.id === id)
        if (index !== -1) {
          this.attendance[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
