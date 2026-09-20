import { defineEventHandler, proxyRequest, getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const targetHost = 'school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev'
  const targetBase = `https://${targetHost}`
  const slug = event.context.params?.slug || ''
  
  const requestUrl = getRequestURL(event)
  const target = `${targetBase}/${slug}${requestUrl.search}`

  return proxyRequest(event, target, {
    headers: {
      host: targetHost
    }
  })
})
