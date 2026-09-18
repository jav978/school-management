<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans relative">
    
    <div class="w-full max-w-md relative z-10">
      <!-- Card Container -->
      <div class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 transition-all duration-300">
        
        <!-- Logo and Heading -->
        <div class="text-center mb-7">
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
                Seguridad de Acceso
              </span>
            </div>
          </div>
          
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 text-amber-700 dark:text-brand-gold text-xs font-bold mb-2">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Verificación en Dos Pasos (2FA)</span>
          </div>

          <h2 class="text-lg font-bold text-slate-850 dark:text-white mt-1">
            {{ isUsingBackupCode ? 'Código de Respaldo' : 'Confirmar Identidad' }}
          </h2>
          <p class="text-slate-400 text-xs mt-1.5 font-medium leading-relaxed">
            <template v-if="!isUsingBackupCode">
              Abra su aplicación autenticadora (Google Authenticator, Microsoft Authenticator o Aegis) e ingrese el código de 6 dígitos.
            </template>
            <template v-else>
              Ingrese uno de sus 8 códigos de respaldo generados al configurar la seguridad (formato XXXX-XXXX).
            </template>
          </p>
        </div>

        <form @submit.prevent="handleVerify" class="space-y-5">
          <!-- Code Input Field -->
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 text-center">
              {{ isUsingBackupCode ? 'Código de Emergencia' : 'Código de 6 Dígitos' }}
            </label>
            <div class="relative">
              <input
                v-model="authCode"
                ref="codeInputRef"
                :type="isUsingBackupCode ? 'text' : 'tel'"
                :maxlength="isUsingBackupCode ? 10 : 6"
                :placeholder="isUsingBackupCode ? 'ABCD-1234' : '000000'"
                required
                autocomplete="one-time-code"
                class="w-full text-center tracking-[0.35em] text-2xl font-mono font-black py-3.5 px-4 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-850 dark:text-white placeholder-slate-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all uppercase"
              />
            </div>
            <p v-if="!isUsingBackupCode" class="text-[11px] text-slate-400 text-center mt-2">
              El código cambia automáticamente cada 30 segundos
            </p>
          </div>

          <!-- Error Alert message -->
          <div v-if="errorMessage" class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading || !authCode.trim()"
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              {{ loading ? 'Verificando...' : 'Verificar y Acceder' }}
            </button>
          </div>
        </form>

        <!-- Toggle between TOTP and Backup Code -->
        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            @click="toggleBackupMode"
            class="text-xs font-bold text-orange-600 dark:text-brand-gold hover:underline transition-all cursor-pointer"
          >
            {{ isUsingBackupCode ? '← Usar código de aplicación (Google / Aegis)' : '¿No tienes acceso a la app? Usar código de respaldo' }}
          </button>

          <button
            type="button"
            @click="handleCancel"
            class="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer mt-1"
          >
            Cancelar y volver al inicio de sesión
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const authCode = ref('')
const isUsingBackupCode = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const codeInputRef = ref(null)

onMounted(() => {
  if (codeInputRef.value) {
    codeInputRef.value.focus()
  }
})

const toggleBackupMode = () => {
  isUsingBackupCode.value = !isUsingBackupCode.value
  authCode.value = ''
  errorMessage.value = ''
  if (codeInputRef.value) {
    codeInputRef.value.focus()
  }
}

const handleVerify = async () => {
  if (!authCode.value.trim()) return
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.verifyTwoFactor(authCode.value.trim())
    navigateTo('/dashboard')
  } catch (err) {
    if (err.statusCode === 429 || err.status === 429 || err.data?.code === 429) {
      errorMessage.value = 'Demasiados intentos fallidos. Por seguridad, su IP ha sido bloqueada temporalmente.'
    } else {
      errorMessage.value = err.data?.message || err.message || 'Código incorrecto o expirado. Verifique e intente nuevamente.'
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  authStore.cancelTwoFactor()
  navigateTo('/auth/login')
}
</script>
