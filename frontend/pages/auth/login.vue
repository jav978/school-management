<template>
  <div class="min-h-[100dvh] w-full bg-[#f8fafc] dark:bg-[#0c081e] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-x-hidden font-sans transition-colors duration-300">
    
    <!-- Ambient Glow in Dark Mode -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/20 dark:bg-brand-purple/30 rounded-full blur-3xl opacity-70"></div>
      <div class="absolute -bottom-40 right-10 w-[400px] h-[400px] bg-sky-500/10 dark:bg-brand-secondary/15 rounded-full blur-3xl"></div>
    </div>

    <!-- Top Bar: School Badge & Theme Toggle -->
    <header class="w-full max-w-5xl mx-auto flex items-center justify-between relative z-10 py-2">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-white dark:bg-white/10 p-1 border border-slate-200 dark:border-white/15 flex items-center justify-center shadow-xs">
          <img src="/logocolegio.png" alt="Logo U.E Santa Luisa" class="w-full h-full object-contain" />
        </div>
        <span class="font-display font-black text-xs sm:text-sm text-brand-primary dark:text-white tracking-tight">
          U.E Colegio "Santa Luisa"
        </span>
      </div>

      <!-- Theme Switcher Button -->
      <button 
        @click="toggleTheme" 
        type="button" 
        class="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10 active:scale-95 transition-all border border-slate-200/80 dark:border-white/10 shadow-xs cursor-pointer bg-white/80 dark:bg-[#170f33]/80 backdrop-blur-md"
        :title="colorMode.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <svg v-if="colorMode.value === 'dark'" class="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </header>

    <!-- Main Content Container -->
    <main class="w-full max-w-md mx-auto my-auto relative z-10 py-6">
      <!-- Card Container -->
      <div class="glass-card rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-200/80 dark:border-white/10 transition-all duration-300">
        
        <!-- Logo and Heading -->
        <div class="text-center mb-6">
          <div class="flex flex-col items-center justify-center gap-2 mb-3">
            <div class="w-20 h-20 rounded-2xl bg-white dark:bg-white/10 p-2 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-white/15 transition-transform hover:scale-105">
              <img 
                src="/logocolegio.png" 
                alt="Logo U.E Santa Luisa" 
                class="w-full h-full object-contain" 
              />
            </div>
            <div class="text-center mt-1">
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                Portal Institucional
              </h1>
              <span class="text-[10.5px] font-bold text-amber-600 dark:text-brand-gold uppercase tracking-widest block mt-0.5">
                Comunidad Educativa Vicenciana
              </span>
            </div>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-xs font-medium">
            Gestión Académica, Control de Estudio y Calificaciones
          </p>
        </div>

        <form @submit.prevent="handleLogin" onsubmit="return false;" class="space-y-4">
          <!-- Username / Email Field -->
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Correo Institucional
            </label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                autocomplete="username"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple text-sm transition-all shadow-inner"
                placeholder="ejemplo@santaluisa.edu.ve"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Contraseña
              </label>
              <NuxtLink 
                to="/auth/forgot-password" 
                class="text-xs text-amber-700 dark:text-brand-gold hover:underline font-semibold transition-colors"
              >
                ¿Olvidaste tu clave?
              </NuxtLink>
            </div>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple text-sm transition-all pr-12 shadow-inner"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
                title="Mostrar/ocultar contraseña"
              >
                <svg v-if="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Alert message -->
          <div v-if="error" class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold animate-fade-in">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-lg shadow-brand-primary/25 border border-brand-primary/40 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer min-h-[48px]"
            >
              <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>

      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full max-w-5xl mx-auto text-center relative z-10 py-3 text-[11px] text-slate-400">
      <p>© 2026 U.E Colegio "Santa Luisa" • Caracas, Venezuela</p>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useColorMode } from '#imports'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const colorMode = useColorMode()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const route = useRoute()

const toggleTheme = () => {
  const nextTheme = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = nextTheme
  if (typeof document !== 'undefined') {
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }
}

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''

  try {
    const res = await authStore.login(email.value, password.value)
    if (res && res.two_factor_required) {
      await navigateTo('/auth/2fa-challenge')
    } else {
      const user = authStore.user || res.user
      if (user && user.status === 'pending') {
        error.value = 'Su cuenta ha sido registrada y está en proceso de verificación por la Dirección del Plantel.'
      } else {
        const rawRedirect = route.query.redirect ? String(route.query.redirect) : '/dashboard'
        const redirectPath = rawRedirect.startsWith('/') ? decodeURIComponent(rawRedirect) : '/dashboard'
        await navigateTo(redirectPath)
      }
    }
  } catch (err) {
    console.error('Error during login:', err)
    if (err.statusCode === 429 || err.status === 429 || err.data?.code === 429) {
      error.value = 'Demasiados intentos de acceso. Por seguridad, su IP ha sido bloqueada temporalmente.'
    } else if (
      err.name === 'AbortError' ||
      err.name === 'FetchError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('Network') ||
      err.message?.includes('timeout') ||
      err.statusCode === 502 ||
      err.statusCode === 504 ||
      (typeof navigator !== 'undefined' && !navigator.onLine)
    ) {
      error.value = 'No se pudo establecer conexión con el servidor. Verifique su conexión a internet e intente nuevamente.'
    } else {
      error.value = err.data?.message || err.message || 'Credenciales inválidas. Por favor verifique sus datos.'
    }
  } finally {
    loading.value = false
  }
}
</script>
