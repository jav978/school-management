export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const getHeaders = (customHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (import.meta.client) {
      const token =
        sessionStorage.getItem('token') ||
        sessionStorage.getItem('feathers-jwt') ||
        sessionStorage.getItem('school_jwt')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  const apiService = (serviceName: string) => ({
    find: async (params: any = {}) => {
      const query = params?.query || {}
      return await $fetch(`${config.public.apiBase}/${serviceName}`, {
        method: 'GET',
        headers: getHeaders(params?.headers),
        params: query
      })
    },
    get: async (id: string | number, params: any = {}) => {
      const query = params?.query || {}
      return await $fetch(`${config.public.apiBase}/${serviceName}/${id}`, {
        method: 'GET',
        headers: getHeaders(params?.headers),
        params: query
      })
    },
    create: async (data: any, params: any = {}) => {
      return await $fetch(`${config.public.apiBase}/${serviceName}`, {
        method: 'POST',
        headers: getHeaders(params?.headers),
        body: data
      })
    },
    patch: async (id: string | number, data: any, params: any = {}) => {
      return await $fetch(`${config.public.apiBase}/${serviceName}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(params?.headers),
        body: data
      })
    },
    update: async (id: string | number, data: any, params: any = {}) => {
      return await $fetch(`${config.public.apiBase}/${serviceName}/${id}`, {
        method: 'PUT',
        headers: getHeaders(params?.headers),
        body: data
      })
    },
    remove: async (id: string | number, params: any = {}) => {
      return await $fetch(`${config.public.apiBase}/${serviceName}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(params?.headers)
      })
    }
  })

  return {
    provide: {
      api: {
        service: apiService
      }
    }
  }
})
