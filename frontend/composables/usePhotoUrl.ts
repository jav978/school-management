export const resolvePhotoUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url
  }
  const config = useRuntimeConfig()
  const base = config.public.apiBase || 'http://localhost:3031'
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}
