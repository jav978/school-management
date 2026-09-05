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
                U.E Santa Luisa
              </h1>
              <span class="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                Comunidad Educativa Vicenciana
              </span>
            </div>
          </div>
          <h2 class="text-lg font-bold text-slate-850 dark:text-white">¡Bienvenido de nuevo!</h2>
          <p class="text-slate-400 text-xs mt-1 font-medium">Sistema de Gestión y Administración Escolar</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username / Email Field -->
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                placeholder="admin@colegiosanmartin.edu"
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
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>

        <!-- Quick Fill Helper Buttons for Testing -->
        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Acceso Rápido de Prueba</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="quickLogin('admin@colegiosanmartin.edu', 'password123')"
              class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-600 dark:text-slate-300 hover:text-orange-600 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60 transition-all text-left"
            >
              👑 Admin
            </button>
            <button
              type="button"
              @click="quickLogin('roberto@colegiosanmartin.edu', 'password123')"
              class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-600 dark:text-slate-300 hover:text-orange-600 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60 transition-all text-left"
            >
              👨‍🏫 Profesor
            </button>
            <button
              type="button"
              @click="quickLogin('lucia@colegiosanmartin.edu', 'password123')"
              class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-600 dark:text-slate-300 hover:text-orange-600 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60 transition-all text-left"
            >
              👩‍🎓 Estudiante
            </button>
            <button
              type="button"
              @click="quickLogin('carlos.perez@email.com', 'password123')"
              class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-600 dark:text-slate-300 hover:text-orange-600 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60 transition-all text-left"
            >
              👨‍👧 Padre
            </button>
          </div>
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

const authStore = useAuthStore()
const email = ref('admin@colegiosanmartin.edu')
const password = ref('password123')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const quickLogin = (userEmail, userPass) => {
  email.value = userEmail
  password.value = userPass
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    navigateTo('/dashboard')
  } catch (err) {
    error.value = 'Credenciales inválidas. Por favor verifique sus datos.'
  } finally {
    loading.value = false
  }
}
</script>

