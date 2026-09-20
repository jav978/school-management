import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const targetHost = process.env.BACKEND_HOST || 'school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev'
  const targetProtocol = targetHost.includes('localhost') ? 'http' : 'https'
  const slug = event.context.params?.slug || ''
  const target = `${targetProtocol}://${targetHost}/uploads/${slug}`
  
  return proxyRequest(event, target, {
    headers: {
      host: targetHost
    }
  })
})
