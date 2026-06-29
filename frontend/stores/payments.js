import { defineStore } from 'pinia'

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    payments: [],
    currentPayment: null,
    loading: false,
    error: null
  }),

  getters: {
    getPayments: (state) => state.payments,
    getCurrentPayment: (state) => state.currentPayment,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchPayments(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('payments', params)
        this.payments = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPayment(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('payments', data)
        this.payments.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePayment(id, data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.patch(`payments/${id}`, data)
        const index = this.payments.findIndex(p => p.id === id)
        if (index !== -1) {
          this.payments[index] = response
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
