import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [],
    contacts: [],
    currentContact: null,
    loading: false,
    error: null
  }),

  getters: {
    getMessages: (state) => state.messages,
    getContacts: (state) => state.contacts,
    getCurrentContact: (state) => state.currentContact,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchContacts() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('users')
        this.contacts = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMessages(contactId) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.get('messages', {
          query: {
            $or: [
              { senderId: contactId },
              { receiverId: contactId }
            ]
          }
        })
        this.messages = response.data || response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(data) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const response = await api.post('messages', data)
        this.messages.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentContact(contact) {
      this.currentContact = contact
    }
  }
})
