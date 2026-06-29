export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      const response = await $fetch(`${config.public.apiBase}/${endpoint}`, {
        ...options,
        headers
      })
      return response
    } catch (error) {
      if (error.statusCode === 401) {
        authStore.logout()
        navigateTo('/auth/login')
      }
      throw error
    }
  }

  const get = (endpoint, params = {}) => {
    return apiFetch(endpoint, { method: 'GET', params })
  }

  const post = (endpoint, body = {}) => {
    return apiFetch(endpoint, { method: 'POST', body })
  }

  const patch = (endpoint, body = {}) => {
    return apiFetch(endpoint, { method: 'PATCH', body })
  }

  const remove = (endpoint) => {
    return apiFetch(endpoint, { method: 'DELETE' })
  }

  return {
    get,
    post,
    patch,
    remove
  }
}
