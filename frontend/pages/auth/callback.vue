<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
      <div v-if="loading" class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl animate-pulse">
          🏫
        </div>
        <h2 class="text-base font-bold text-white">Autenticando con Google</h2>
        <p class="text-xs text-slate-400">Verificando credenciales institucionales...</p>
        <div class="flex justify-center pt-2">
          <span class="animate-spin inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></span>
        </div>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <h2 class="text-base font-bold text-white">Error de Autenticación</h2>
        <p class="text-xs text-rose-400 leading-relaxed">{{ error }}</p>
        <NuxtLink
          to="/auth/login"
          class="inline-block w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
        >
          Regresar al Inicio de Sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    let token = null

    // 1. Extraer token de fragmento hash (#access_token=...)
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      token = hashParams.get('access_token')
      const hashError = hashParams.get('error') || hashParams.get('error_description')
      if (hashError) {
        throw new Error(decodeURIComponent(hashError))
      }
    }

    // 2. Extraer de query params (?access_token=...) como fallback
    if (!token && route.query.access_token) {
      token = route.query.access_token
    }

    if (route.query.error) {
      throw new Error(String(route.query.error_description || route.query.error))
    }

    if (!token) {
      throw new Error('No se recibió el token de autenticación de Google.')
    }

    // 3. Persistir sesión
    const sessionCookie = useCookie('session_token', { sameSite: 'lax', secure: false })
    sessionCookie.value = token
    sessionStorage.setItem('token', token)

    // 4. Validar contra el backend
    const isValid = await authStore.checkAuth()
    if (!isValid || !authStore.user) {
      throw new Error('No se pudo verificar la sesión institucional con el servidor.')
    }

    const user = authStore.user

    // 5. Determinar siguiente pantalla: Onboarding si falta rol/cédula, o Dashboard
    const prefs = typeof user.preferences === 'string' ? JSON.parse(user.preferences || '{}') : (user.preferences || {})
    const needsOnboarding = !prefs.onboarding_completed && (!user.phone || !prefs.id_number)

    if (needsOnboarding) {
      navigateTo(`/auth/onboarding?email=${encodeURIComponent(user.email || '')}`)
    } else if (user.status === 'pending') {
      navigateTo('/auth/onboarding')
    } else {
      navigateTo('/dashboard')
    }
  } catch (err) {
    loading.value = false
    error.value = err.message || 'Error inesperado durante la autenticación.'
  }
})
</script>
