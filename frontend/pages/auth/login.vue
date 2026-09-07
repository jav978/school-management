<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans relative">
    
    <div class="w-full max-w-md relative z-10">
      <!-- Card Container -->
      <div class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-xl rounded-3xl p-8 sm:p-10 transition-all duration-300">
        
        <!-- Logo and Heading -->
        <div class="text-center mb-8">
          <div class="flex flex-col items-center justify-center gap-3 mb-4">
            <div class="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-slate-700/60 transition-transform hover:scale-105">
              <img 
                src="/logocolegio.png" 
                alt="Logo U.E Santa Luisa" 
                class="w-full h-full object-contain" 
              />
            </div>
            <div class="text-center">
              <h1 class="text-2xl font-black text-slate-850 dark:text-white tracking-tight font-display">
                U.E Colegio "Santa Luisa"
              </h1>
              <span class="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                Comunidad Educativa Vicenciana
              </span>
            </div>
          </div>
          <h2 class="text-lg font-bold text-slate-850 dark:text-white">¡Bienvenido de nuevo!</h2>
          <p class="text-slate-400 text-xs mt-1 font-medium">Sistema de Gestión y Administración Escolar</p>
        </div>

        <!-- Google OAuth 2.0 Button -->
        <div class="mb-5">
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="googleLoading"
            class="w-full py-3 px-4 bg-white hover:bg-slate-50 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            <!-- Official Google "G" Icon -->
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span v-if="googleLoading" class="animate-spin inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full"></span>
            <span>{{ googleLoading ? 'Conectando con Google...' : 'Continuar con Google' }}</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="relative flex py-2 items-center mb-5">
          <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span class="flex-shrink mx-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            o con credenciales
          </span>
          <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <!-- Google Notice Banner if Not Configured -->
        <div v-if="googleNotice" class="mb-5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <span class="font-bold">Google OAuth en Modo Configurable:</span>
            <p class="mt-0.5 text-[11px] text-amber-700/90 dark:text-amber-300/80">
              Para vincular con Google Workspace, configure <code class="font-mono font-semibold">GOOGLE_CLIENT_ID</code> y <code class="font-mono font-semibold">GOOGLE_CLIENT_SECRET</code> en el archivo <code class="font-mono font-semibold">.env</code> del backend. Puede continuar accediendo con el Administrador local.
            </p>
          </div>
          <button @click="googleNotice = false" class="text-amber-500 hover:text-amber-700 text-sm font-bold">✕</button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username / Email Field -->
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Correo Institucional</label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                placeholder="admin@santaluisa.edu.ve"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Contraseña</label>
            </div>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors focus:outline-none"
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
          <div v-if="error" class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>

        <!-- Quick Fill Helper Buttons for Testing (Clean-Slate Environment) -->
        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div class="flex items-center justify-between mb-3">
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Entorno en Frío (Test)
            </p>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              0 Alumnos | 1 Admin
            </span>
          </div>
          
          <button
            type="button"
            @click="quickLogin('admin@santaluisa.edu.ve', 'admin123')"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-700 dark:text-slate-200 hover:text-orange-600 text-xs font-semibold border border-slate-200/70 dark:border-slate-700/60 transition-all flex items-center justify-between cursor-pointer"
          >
            <span class="flex items-center gap-2">
              <span>👑</span>
              <span class="font-bold">Administrador General</span>
              <span class="text-slate-400 dark:text-slate-500 font-normal">admin@santaluisa.edu.ve</span>
            </span>
            <span class="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Cargar</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()
const authStore = useAuthStore()

const email = ref('admin@santaluisa.edu.ve')
const password = ref('admin123')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const googleNotice = ref(false)

const quickLogin = (userEmail, userPass) => {
  email.value = userEmail
  password.value = userPass
}

const handleGoogleLogin = async () => {
  googleLoading.value = true
  googleNotice.value = false
  error.value = ''

  try {
    const status = await $fetch(`${config.public.apiBase}/oauth/status`).catch(() => ({ google: false }))
    if (status && status.google) {
      // Redirect to Feathers Google OAuth strategy
      window.location.href = `${config.public.apiBase}/oauth/google`
    } else {
      googleNotice.value = true
    }
  } catch (err) {
    googleNotice.value = true
  } finally {
    googleLoading.value = false
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await authStore.login(email.value, password.value)
    if (res && res.two_factor_required) {
      navigateTo('/auth/2fa-challenge')
    } else {
      navigateTo('/dashboard')
    }
  } catch (err) {
    if (err.statusCode === 429 || err.status === 429 || err.data?.code === 429) {
      error.value = 'Demasiados intentos de acceso. Por seguridad, su IP ha sido bloqueada temporalmente.'
    } else {
      error.value = err.data?.message || err.message || 'Credenciales inválidas. Por favor verifique sus datos.'
    }
  } finally {
    loading.value = false
  }
}
</script>
