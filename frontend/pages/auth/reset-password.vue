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
            Nueva Contraseña
          </h1>
          <p class="text-slate-400 text-xs mt-1 font-medium">
            U.E Colegio "Santa Luisa" • Seguridad Escolar
          </p>
        </div>

        <!-- Cargando / Verificando Token -->
        <div v-if="verifying" class="text-center py-8 space-y-3">
          <div class="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-500">Verificando enlace de seguridad...</p>
        </div>

        <!-- Token Inválido o Expirado -->
        <div v-else-if="tokenError" class="text-center space-y-5 py-4">
          <div class="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            ✕
          </div>
          <h3 class="text-base font-bold text-slate-850 dark:text-white">Enlace Inválido o Expirado</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ tokenError }}
          </p>
          <div class="pt-2">
            <NuxtLink
              to="/auth/forgot-password"
              class="w-full inline-block py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
            >
              Solicitar un nuevo enlace
            </NuxtLink>
          </div>
        </div>

        <!-- Éxito al actualizar -->
        <div v-else-if="success" class="text-center space-y-5 py-4">
          <div class="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            ✓
          </div>
          <h3 class="text-base font-bold text-slate-850 dark:text-white">¡Contraseña Actualizada!</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tu clave ha sido redefinida con éxito y todas las sesiones previas fueron cerradas por seguridad.
          </p>
          <div class="pt-2">
            <NuxtLink
              to="/auth/login"
              class="w-full inline-block py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
            >
              Iniciar Sesión Ahora
            </NuxtLink>
          </div>
        </div>

        <!-- Formulario para definir nueva contraseña -->
        <div v-else>
          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 text-center leading-relaxed">
            Hola <strong class="text-slate-850 dark:text-white">{{ userEmail }}</strong>, define una nueva contraseña segura para tu cuenta.
          </p>

          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nueva Contraseña
              </label>
              <input
                v-model="newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Confirmar Contraseña
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                placeholder="Repite la contraseña"
              />
            </div>

            <div v-if="submitError" class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold">
              {{ submitError }}
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              <span v-if="submitting" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ submitting ? 'Guardando nueva clave...' : 'Guardar Nueva Contraseña' }}
            </button>
          </form>
        </div>

        <div class="mt-6 text-center">
          <NuxtLink
            to="/auth/login"
            class="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            ← Cancelar y volver al login
          </NuxtLink>
        </div>

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

const token = ref(route.query.token || '')
const verifying = ref(true)
const tokenError = ref('')
const userEmail = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const submitting = ref(false)
const submitError = ref('')
const success = ref(false)

onMounted(async () => {
  if (!token.value) {
    verifying.value = false
    tokenError.value = 'No se proporcionó ningún token de recuperación en el enlace.'
    return
  }

  try {
    const res = await authStore.verifyResetToken(token.value)
    if (res && res.valid) {
      userEmail.value = res.email
    } else {
      tokenError.value = 'El enlace de recuperación es inválido o ha expirado.'
    }
  } catch (err) {
    tokenError.value = err.data?.message || err.message || 'El enlace de recuperación es inválido o ha expirado.'
  } finally {
    verifying.value = false
  }
})

const handleResetPassword = async () => {
  submitError.value = ''

  if (newPassword.value !== confirmPassword.value) {
    submitError.value = 'Las contraseñas no coinciden. Por favor verifíquelas.'
    return
  }

  if (newPassword.value.length < 6) {
    submitError.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  submitting.value = true

  try {
    await authStore.resetPassword(token.value, newPassword.value)
    success.value = true
  } catch (err) {
    submitError.value = err.data?.message || err.message || 'Error al actualizar la contraseña.'
  } finally {
    submitting.value = false
  }
}
</script>
