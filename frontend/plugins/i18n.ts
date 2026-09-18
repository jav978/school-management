import { defineNuxtPlugin } from '#imports'
import { useLanguage } from '~/composables/useLanguage'

export default defineNuxtPlugin((nuxtApp) => {
  const { t, currentLang, setLanguage, toggleLanguage } = useLanguage()

  // Make $t and language utilities available globally in templates and scripts
  nuxtApp.vueApp.config.globalProperties.$t = t
  nuxtApp.vueApp.config.globalProperties.$currentLang = currentLang

  return {
    provide: {
      t,
      currentLang,
      setLanguage,
      toggleLanguage
    }
  }
})
