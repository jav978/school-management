import { defineEventHandler, proxyRequest, getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const targetBase = process.env.API_PROXY_TARGET || (process.env.NODE_ENV === 'production' && !process.env.LOCAL_TEST ? 'https://school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev' : 'http://localhost:3031')
  const slug = event.context.params?.slug || ''
  
  const requestUrl = getRequestURL(event)
  const target = `${targetBase}/${slug}${requestUrl.search}`

  return proxyRequest(event, target)
})
