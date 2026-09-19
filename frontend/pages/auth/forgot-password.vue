<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans relative">
    <div class="w-full max-w-md relative z-10">
      <div class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-xl rounded-3xl p-8 sm:p-10 transition-all">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-2 mx-auto mb-4 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-slate-700/60">
            <img src="/logocolegio.png" alt="Logo U.E Santa Luisa" class="w-full h-full object-contain" />
          </div>
          <h1 class="text-xl font-black text-slate-850 dark:text-white tracking-tight font-display">
            Recuperar Contraseña
          </h1>
          <p class="text-slate-400 text-xs mt-1 font-medium">
            U.E Colegio "Santa Luisa" • Gestión Escolar
          </p>
        </div>

        <!-- Estado 1: Formulario de solicitud -->
        <div v-if="!submitted">
          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 text-center leading-relaxed">
            Ingresa tu correo institucional o personal asociado a tu cuenta. Te enviaremos un enlace seguro para restablecer tus credenciales.
          </p>

          <form @submit.prevent="handleRequestReset" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                placeholder="usuario@santaluisa.edu.ve"
              />
            </div>

            <div v-if="error" class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Enviando solicitud...' : 'Enviar Enlace de Recuperación' }}
            </button>
          </form>
        </div>

        <!-- Estado 2: Confirmación enviada -->
        <div v-else class="text-center space-y-4 py-2">
          <div class="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            ✓
          </div>
          <h3 class="text-base font-bold text-slate-850 dark:text-white">Instrucciones Despachadas</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Si el correo <strong class="text-slate-700 dark:text-slate-200">{{ email }}</strong> está registrado en el plantel, se ha generado un token seguro válido por 15 minutos.
          </p>

          <div v-if="generatedToken" class="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Acceso Directo (Prueba / Token):</span>
            <NuxtLink 
              :to="`/auth/reset-password?token=${generatedToken}`"
              class="text-xs font-mono text-orange-600 dark:text-orange-400 hover:underline break-all block"
            >
              Continuar a Restablecer Contraseña →
            </NuxtLink>
          </div>

          <button
            type="button"
            @click="submitted = false"
            class="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
          >
            ¿Probar con otro correo?
          </button>
        </div>

        <!-- Tarjeta de Asistencia Institucional Dual (Presencial / Secretaría) -->
        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div class="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2 text-left">
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
              <span>🏛️</span>
              <span>Asistencia en Control de Estudios</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Si perdiste acceso a tu correo o eres nuevo representante, el personal de Secretaría y Control de Estudios puede emitirte una clave temporal presencialmente.
            </p>
            <div class="text-[10px] font-semibold text-slate-400 pt-1 flex justify-between">
              <span>📍 Edificio Administrativo, Piso 1</span>
              <span>⏰ 7:30 AM - 1:30 PM</span>
            </div>
          </div>
        </div>

        <!-- Back to Login Link -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/auth/login"
            class="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Volver a Inicio de Sesión</span>
          </NuxtLink>
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

const email = ref('')
const error = ref('')
const loading = ref(false)
const submitted = ref(false)
const generatedToken = ref(null)

const handleRequestReset = async () => {
  if (!email.value) return
  loading.value = true
  error.value = ''

  try {
    const res = await authStore.requestPasswordReset(email.value)
    submitted.value = true
    if (res && res.reset_token) {
      generatedToken.value = res.reset_token
    }
  } catch (err) {
    error.value = err.data?.message || err.message || 'Ocurrió un error al procesar la solicitud.'
  } finally {
    loading.value = false
  }
}
</script>
