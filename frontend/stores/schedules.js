import { defineStore } from 'pinia'

export const useSchedulesStore = defineStore('schedules', {
  state: () => ({
    schedules: [],
    currentSchedule: null,
    loading: false,
    error: null
  }),

  getters: {
    getSchedules: (state) => state.schedules,
    getCurrentSchedule: (state) => state.currentSchedule,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchSchedules(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('schedules', params)
        this.schedules = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSchedule(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('schedules', data)
        this.schedules.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSchedule(id, data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.patch(`schedules/${id}`, data)
        const index = this.schedules.findIndex(s => s.id === id)
        if (index !== -1) {
          this.schedules[index] = response
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
