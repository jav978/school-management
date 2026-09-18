export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    let token = authStore.token
    if (!token) {
      try {
        const sessionCookie = useCookie('session_token')
        token = sessionCookie.value || null
      } catch (_) {}
    }
    if (!token && import.meta.client) {
      token = sessionStorage.getItem('token')
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
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

  const service = (name) => ({
    find: (params = {}) => get(name, params?.query || params),
    get: (id, params = {}) => get(`${name}/${id}`, params?.query || params),
    create: (data = {}) => post(name, data),
    patch: (id, data = {}) => patch(`${name}/${id}`, data),
    remove: (id) => remove(`${name}/${id}`)
  })

  return {
    get,
    post,
    patch,
    remove,
    service
  }
}
