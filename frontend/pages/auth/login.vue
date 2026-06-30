<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/80 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute w-[40rem] h-[40rem] rounded-full bg-emerald-500/10 blur-[120px] -top-40 -left-40"></div>
    <div class="absolute w-[30rem] h-[30rem] rounded-full bg-teal-500/10 blur-[100px] -bottom-40 -right-40"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Card Container with rich glassmorphism -->
      <div class="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 sm:p-10 transition-all duration-300">
        <!-- Logo and Heading -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-4">
            <!-- Apollo-style Glowing Emblem -->
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 relative group">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <span class="relative z-10 font-display">GE</span>
            </div>
            <span class="text-2xl font-black text-white tracking-wider font-display bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Gestión Escolar</span>
          </div>
          <h2 class="text-xl font-extrabold text-white">¡Bienvenido de nuevo!</h2>
          <p class="text-slate-400 text-xs mt-1.5">Introduce tus credenciales para acceder a la plataforma</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username / Email Field -->
          <div>
            <label class="block text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Contraseña</label>
            </div>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
              >
                <!-- Eye open icon (show) -->
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye closed icon (hide) -->
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Extra Options -->
          <div class="flex items-center justify-between text-xs font-semibold">
            <label class="flex items-center text-slate-400 cursor-pointer hover:text-slate-300">
              <input type="checkbox" class="rounded border-slate-800 bg-slate-950/60 text-emerald-500 focus:ring-emerald-500/20 mr-2" />
              Recordarme
            </label>
            <a href="#" class="text-emerald-400 hover:text-emerald-300 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Error Alert message -->
          <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-4 px-6 rounded-2xl text-sm shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
            >
              <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full mr-2"></span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    navigateTo('/dashboard')
  } catch (err) {
    error.value = 'Credenciales inválidas. Por favor intente de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
