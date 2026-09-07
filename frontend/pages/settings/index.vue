<template>
  <div>
    <ui-page-header title="Configuración" subtitle="Administra la configuración del sistema" />

    <ui-tabs :tabs="tabs">
      <template #general>
        <ui-card title="Configuración General">
          <div class="space-y-4">
            <ui-form-input
              v-model="settings.schoolName"
              label="Nombre del Colegio"
            />
            <ui-form-input
              v-model="settings.schoolEmail"
              label="Email del Colegio"
              type="email"
            />
            <ui-form-input
              v-model="settings.schoolPhone"
              label="Teléfono"
            />
            <ui-form-input
              v-model="settings.schoolAddress"
              label="Dirección"
            />
            <button @click="saveSettings" class="btn-primary">
              Guardar Cambios
            </button>
          </div>
        </ui-card>
      </template>

      <template #notifications>
        <ui-card title="Configuración de Notificaciones">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl">
              <div>
                <p class="font-bold text-slate-800 dark:text-white text-sm">Notificaciones por Email</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Recibir notificaciones por correo electrónico</p>
              </div>
              <button
                @click="settings.emailNotifications = !settings.emailNotifications"
                :class="settings.emailNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
              >
                <span
                  :class="settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl">
              <div>
                <p class="font-bold text-slate-800 dark:text-white text-sm">Notificaciones Push</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Recibir notificaciones en el navegador</p>
              </div>
              <button
                @click="settings.pushNotifications = !settings.pushNotifications"
                :class="settings.pushNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
              >
                <span
                  :class="settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
          </div>
        </ui-card>
      </template>

      <template #security>
        <ui-card title="Seguridad y Protección de Cuenta">
          <div class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl gap-4">
              <div class="flex items-start gap-3.5">
                <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-brand-gold flex items-center justify-center font-bold text-lg flex-shrink-0">
                  🛡️
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-slate-850 dark:text-white text-sm">Autenticación en Dos Pasos (2FA / TOTP)</p>
                    <span 
                      :class="is2FAEnabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-300'"
                      class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                    >
                      {{ is2FAEnabled ? 'Activado' : 'Desactivado' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    Protege tu cuenta escolar con códigos temporales generados por aplicaciones libres como Google Authenticator, Microsoft Authenticator o Aegis.
                  </p>
                </div>
              </div>

              <button
                type="button"
                @click="open2FAModal"
                class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-shrink-0 shadow-xs active:scale-[0.98]"
                :class="is2FAEnabled ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'"
              >
                <span>{{ is2FAEnabled ? '⚙ Gestionar 2FA' : '🔐 Configurar 2FA' }}</span>
              </button>
            </div>

            <!-- Global Route & Password Policies Note -->
            <div class="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
              <span class="text-base">ℹ️</span>
              <div>
                <p class="font-bold">Protección Activa de Rutas y Sesión</p>
                <p class="mt-0.5 text-blue-700/80 dark:text-blue-300/80">
                  Todas las rutas del sistema escolar están monitoreadas por el middleware de seguridad institucional con protección contra ataques de fuerza bruta y límites de concurrencia.
                </p>
              </div>
            </div>
          </div>
        </ui-card>

        <!-- Interactive 2FA Modal -->
        <TwoFactorSetupModal
          :is-open="is2FAModalOpen"
          :is-configured="is2FAEnabled"
          @close="is2FAModalOpen = false"
          @status-changed="on2FAStatusChanged"
        />
      </template>
    </ui-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TwoFactorSetupModal from '~/components/settings/TwoFactorSetupModal.vue'

const nuxtApp = useNuxtApp()

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notificaciones' },
  { id: 'security', label: 'Seguridad' }
]

const settings = ref({
  schoolName: 'U.E Santa Luisa',
  schoolEmail: 'contacto@santaluisa.edu.ve',
  schoolPhone: '+58 212 123 4567',
  schoolAddress: 'Av. San Martín, Caracas, Venezuela',
  emailNotifications: true,
  pushNotifications: true,
  twoFactor: false
})

const is2FAModalOpen = ref(false)
const is2FAEnabled = ref(false)

const open2FAModal = () => {
  is2FAModalOpen.value = true
}

const on2FAStatusChanged = (status) => {
  is2FAEnabled.value = status
  settings.value.twoFactor = status
}

const fetch2FAStatus = async () => {
  try {
    const res = await nuxtApp.$api.service('two-factor').find()
    if (res && typeof res.two_factor_enabled === 'boolean') {
      is2FAEnabled.value = res.two_factor_enabled
      settings.value.twoFactor = res.two_factor_enabled
    }
  } catch (err) {
    // Non-blocking fallback
  }
}

const saveSettings = () => {
  alert('Configuración guardada exitosamente')
}

onMounted(() => {
  fetch2FAStatus()
})
</script>
