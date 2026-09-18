import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:3031'
  const slug = event.context.params?.slug || ''
  const target = `${apiBase}/uploads/${slug}`
  return proxyRequest(event, target)
})
