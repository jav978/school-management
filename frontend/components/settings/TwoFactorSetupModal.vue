<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 w-full max-w-lg border border-slate-100 dark:border-slate-800"
      >
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
              🔐
            </div>
            <div>
              <h3 class="text-base font-black text-slate-850 dark:text-white font-display">
                {{ isConfigured ? 'Gestionar Autenticación en Dos Pasos' : 'Activar Verificación en Dos Pasos (2FA)' }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Protección criptográfica TOTP (RFC 6238)
              </p>
            </div>
          </div>
          <button 
            @click="closeModal" 
            type="button" 
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">

          <!-- IF ALREADY CONFIGURED -> DEACTIVATE VIEW -->
          <div v-if="isConfigured && !isStartingSetup" class="space-y-5">
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3.5">
              <div class="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                ✓
              </div>
              <div class="text-xs">
                <p class="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Tu cuenta está protegida con 2FA</p>
                <p class="text-emerald-700/80 dark:text-emerald-400/80 mt-1 leading-relaxed">
                  Cada inicio de sesión requiere tu contraseña habitual más el código de 6 dígitos generado por tu app autenticadora.
                </p>
              </div>
            </div>

            <div class="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 class="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-2">Desactivar 2FA</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Si desactivas la autenticación en dos pasos, tu cuenta quedará protegida únicamente con tu contraseña.
              </p>

              <div class="space-y-3">
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  Ingrese código actual de 6 dígitos o su contraseña para confirmar:
                </label>
                <input
                  v-model="disableConfirmation"
                  type="password"
                  placeholder="Código de la app o contraseña"
                  class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div v-if="errorMessage" class="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {{ errorMessage }}
              </div>
            </div>
          </div>

          <!-- SETUP WIZARD (STEP 1 & 2) -->
          <div v-else class="space-y-5">
            <!-- Loading setup state -->
            <div v-if="loadingSetup" class="p-8 text-center">
              <div class="inline-block w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p class="text-xs text-slate-500 font-semibold">Generando clave segura y código QR...</p>
            </div>

            <template v-else>
              <!-- STEP 1: Scan QR -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">1</span>
                  <h4 class="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">
                    Escanear código QR en tu aplicación autenticadora
                  </h4>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Abre <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> o <strong>Aegis</strong> en tu celular y pulsa <strong>"Escanear código QR"</strong>.
                </p>

                <!-- QR Code Box -->
                <div class="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                  <div class="w-36 h-36 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 flex items-center justify-center">
                    <img v-if="setupData.qrCode" :src="setupData.qrCode" alt="Código QR 2FA" class="w-full h-full object-contain" />
                  </div>
                  <div class="space-y-2 text-center sm:text-left flex-1 min-w-0">
                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">¿No puedes escanear el QR?</p>
                    <p class="text-xs text-slate-600 dark:text-slate-300">Introduce esta clave secreta manualmente:</p>
                    <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-xl">
                      <code class="text-xs font-mono font-bold text-orange-600 dark:text-brand-gold truncate flex-1 select-all">{{ setupData.secret }}</code>
                      <button 
                        @click="copyToClipboard(setupData.secret, 'Clave secreta copiada')" 
                        type="button" 
                        class="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 2: Verify 6-digit Code -->
              <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">2</span>
                  <h4 class="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">
                    Confirmar con el código de 6 dígitos
                  </h4>
                </div>
                <div class="relative">
                  <input
                    v-model="verificationCode"
                    type="tel"
                    maxlength="6"
                    placeholder="000000"
                    class="w-full text-center tracking-[0.3em] text-xl font-mono font-black py-2.5 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-850 dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <!-- STEP 3: Emergency Backup Codes -->
              <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">3</span>
                    <h4 class="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">
                      Códigos de Respaldo de Emergencia
                    </h4>
                  </div>
                  <button 
                    @click="downloadBackupCodes" 
                    type="button" 
                    class="text-[11px] font-bold text-orange-600 dark:text-brand-gold hover:underline"
                  >
                    ⬇ Descargar .txt
                  </button>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Guarda estos 8 códigos en un lugar seguro. Cada uno sirve para acceder una sola vez si pierdes tu celular.
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center font-mono font-bold text-xs text-slate-700 dark:text-slate-200">
                  <div v-for="(bc, idx) in setupData.backupCodes" :key="idx" class="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-2xs">
                    {{ bc }}
                  </div>
                </div>
              </div>

              <!-- Error Display -->
              <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {{ errorMessage }}
              </div>
            </template>
          </div>

        </div>

        <!-- Modal Footer Actions -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            @click="closeModal"
            type="button"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancelar</span>
          </button>

          <!-- Action for Enabled State (Deactivate) -->
          <button
            v-if="isConfigured && !isStartingSetup"
            @click="handleDisable"
            :disabled="loadingAction || !disableConfirmation.trim()"
            type="button"
            class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {{ loadingAction ? 'Desactivando...' : 'Confirmar Desactivación' }}
          </button>

          <!-- Action for Setup State (Enable) -->
          <button
            v-else
            @click="handleEnable"
            :disabled="loadingAction || !verificationCode || verificationCode.length !== 6"
            type="button"
            class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {{ loadingAction ? 'Verificando...' : 'Activar 2FA Ahora' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isConfigured: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'status-changed'])

const nuxtApp = useNuxtApp()
const isStartingSetup = ref(false)
const loadingSetup = ref(false)
const loadingAction = ref(false)
const errorMessage = ref('')
const verificationCode = ref('')
const disableConfirmation = ref('')

const setupData = ref({
  secret: '',
  qrCode: '',
  backupCodes: []
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    errorMessage.value = ''
    verificationCode.value = ''
    disableConfirmation.value = ''
    if (!props.isConfigured) {
      startSetup()
    }
  }
})

const startSetup = async () => {
  isStartingSetup.value = true
  loadingSetup.value = true
  errorMessage.value = ''
  try {
    const res = await nuxtApp.$api.service('two-factor').create({ action: 'setup' })
    setupData.value = res
  } catch (err) {
    errorMessage.value = err.message || 'Error al inicializar la configuración de 2FA'
  } finally {
    loadingSetup.value = false
  }
}

const handleEnable = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) return
  loadingAction.value = true
  errorMessage.value = ''

  try {
    await nuxtApp.$api.service('two-factor').create({
      action: 'enable',
      code: verificationCode.value,
      backupCodes: setupData.value.backupCodes
    })
    emit('status-changed', true)
    closeModal()
  } catch (err) {
    errorMessage.value = err.message || 'Código de verificación inválido. Revise la hora de su dispositivo.'
  } finally {
    loadingAction.value = false
  }
}

const handleDisable = async () => {
  if (!disableConfirmation.value.trim()) return
  loadingAction.value = true
  errorMessage.value = ''

  try {
    await nuxtApp.$api.service('two-factor').create({
      action: 'disable',
      code: disableConfirmation.value.trim(),
      password: disableConfirmation.value.trim()
    })
    emit('status-changed', false)
    closeModal()
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo desactivar el 2FA. Verifique sus credenciales.'
  } finally {
    loadingAction.value = false
  }
}

const copyToClipboard = (text, msg) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    alert(msg)
  }
}

const downloadBackupCodes = () => {
  const content = `U.E COLEGIO SANTA LUISA - CÓDIGOS DE RESPALDO 2FA\nFecha: ${new Date().toLocaleDateString()}\n\nGuarde estos códigos en un lugar seguro. Cada código solo puede ser usado una vez.\n\n${setupData.value.backupCodes.join('\n')}\n`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'santa-luisa-codigos-respaldo-2fa.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const closeModal = () => {
  emit('close')
}
</script>
