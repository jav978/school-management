<template>
  <div class="space-y-6">
    <ui-page-header 
      :title="t('institutionalSettings', 'Configuración Institucional')" 
      :subtitle="t('settingsSubtitle', 'Administra la identidad del plantel, registros oficiales MPPE, datos fiscales SENIAT y seguridad del sistema')" 
    />

    <ui-tabs :tabs="tabs">
      <!-- Tab 1: General -->
      <template #general>
        <div class="space-y-6">
          <!-- Card 1: Identidad Institucional y Logotipo -->
          <ui-card :title="t('institutionalIdentity', 'Identidad Institucional y Logotipo')">
            <div class="space-y-6">
              <!-- Live Preview Simulator Banner -->
              <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-primary/10 via-brand-purple/10 to-transparent border border-brand-primary/20 dark:border-white/10">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-brand-primary/20 text-brand-primary text-xs font-bold">✨</span>
                    <span class="text-xs font-black uppercase tracking-wider text-brand-primary dark:text-brand-gold">
                      {{ t('liveSimulator', 'Simulador de Barra Lateral / Banner') }}
                    </span>
                  </div>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {{ t('realTime', 'En Tiempo Real') }}
                  </span>
                </div>

                <!-- Mini Sidebar Header Mockup -->
                <div class="p-3.5 bg-white dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-white dark:bg-[#1a0f3d] p-1 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      :src="resolvePhotoUrl(form.logo_url) || '/logocolegio.png'"
                      alt="Logo preview"
                      class="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="font-display font-black text-sm text-slate-850 dark:text-white truncate">
                      {{ form.name || 'U.E Colegio "Santa Luisa"' }}
                    </h4>
                    <p class="text-xs font-bold text-brand-primary dark:text-brand-gold uppercase tracking-wider truncate">
                      {{ form.system_subtitle || 'Gestión Escolar' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Logo controls -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-2xl bg-white dark:bg-[#1a0f3d] p-1.5 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      :src="resolvePhotoUrl(form.logo_url) || '/logocolegio.png'"
                      alt="Logo de la Institución"
                      class="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 class="text-sm font-bold text-slate-850 dark:text-white">Insignia / Logotipo Oficial</h5>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                      Formatos admitidos: PNG, JPG, WEBP o SVG. Tamaño recomendado 512x512px. Máximo 3MB.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-wrap">
                  <input
                    ref="logoFileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    class="hidden"
                    @change="onLogoSelected"
                  />
                  <button
                    type="button"
                    @click="triggerLogoUpload"
                    :disabled="isUploadingLogo"
                    data-testid="btn-upload-logo"
                    class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-purple text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <span>📷</span>
                    <span>{{ isUploadingLogo ? t('saving', 'Cargando...') : t('changeLogo', 'Cambiar Logo') }}</span>
                  </button>
                  <button
                    type="button"
                    @click="restoreDefaultLogo"
                    data-testid="btn-restore-logo"
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  >
                    <span>↺</span>
                    <span>{{ t('restoreDefault', 'Restaurar Predeterminado') }}</span>
                  </button>
                </div>
              </div>

              <!-- Name & Subtitle inputs -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('schoolName', 'Nombre Oficial del Colegio') }} *
                  </label>
                  <input
                    v-model="form.name"
                    data-testid="settings-school-name"
                    type="text"
                    placeholder="Ej. U.E Colegio Santa Luisa"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('systemSubtitle', 'Subtítulo del Sistema / Texto del Banner') }}
                  </label>
                  <input
                    v-model="form.system_subtitle"
                    data-testid="settings-system-subtitle"
                    type="text"
                    placeholder="Ej. Gestión Escolar, Campus Virtual..."
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </ui-card>

          <!-- Card 2: Registro Oficial MPPE y Datos Fiscales -->
          <ui-card :title="t('mppeOfficialData', 'Registro Oficial MPPE y Datos Fiscales')">
            <div class="space-y-5">
              <!-- Notice box -->
              <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <span class="text-base flex-shrink-0">🏛️</span>
                <div>
                  <p class="font-bold">{{ t('mppeNotice', 'Normativa del MPPE y SENIAT (Venezuela)') }}</p>
                  <p class="mt-0.5 text-amber-800/85 dark:text-amber-300/85">
                    {{ t('mppeNoticeDesc', 'Estos identificadores son requeridos obligatoriamente para la emisión de títulos, boletines de calificaciones, constancias de estudio y documentación tributaria oficial.') }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- RIF -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('rif', 'RIF Institucional (SENIAT)') }} *
                  </label>
                  <input
                    v-model="form.rif"
                    data-testid="settings-school-rif"
                    type="text"
                    placeholder="Ej. J-315628015"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-semibold uppercase"
                  />
                </div>

                <!-- Codigo DEA -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('deaCode', 'Código DEA del Plantel') }} *
                  </label>
                  <input
                    v-model="form.dea_code"
                    data-testid="settings-school-dea"
                    type="text"
                    placeholder="Ej. S0098D0101"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-semibold uppercase"
                  />
                </div>

                <!-- Codigo Estadistico -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('statisticalCode', 'Código Estadístico MPPE') }}
                  </label>
                  <input
                    v-model="form.statistical_code"
                    data-testid="settings-school-stats-code"
                    type="text"
                    placeholder="Ej. 10845"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                  />
                </div>

                <!-- Zona Educativa -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('educationalZone', 'Zona Educativa') }}
                  </label>
                  <input
                    v-model="form.educational_zone"
                    data-testid="settings-school-zone"
                    type="text"
                    placeholder="Ej. DISTRITO CAPITAL"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium uppercase"
                  />
                </div>

                <!-- Dependencia -->
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ t('dependency', 'Tipo de Dependencia Educativa') }}
                  </label>
                  <input
                    v-model="form.dependency"
                    data-testid="settings-school-dependency"
                    type="text"
                    placeholder="Ej. Privada Subvencionada por MPPE"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </ui-card>

          <!-- Card 3: Canales de Contacto y Ubicación -->
          <ui-card :title="t('contactChannels', 'Canales de Contacto y Ubicación')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t('email', 'Correo Electrónico Institucional') }}
                </label>
                <input
                  v-model="form.email"
                  data-testid="settings-school-email"
                  type="email"
                  placeholder="contacto@santaluisa.edu.ve"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t('phone', 'Teléfono Principal') }}
                </label>
                <input
                  v-model="form.phone_primary"
                  data-testid="settings-school-phone"
                  type="text"
                  placeholder="+58 212 123 4567"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {{ t('address', 'Dirección Fiscal y Sede') }}
                </label>
                <input
                  v-model="form.address_line1"
                  data-testid="settings-school-address"
                  type="text"
                  placeholder="Calle Real del Prado de María, Caracas, Venezuela"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all font-medium"
                />
              </div>
            </div>
          </ui-card>

          <!-- Action bar -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="saveSettings"
              :disabled="isSaving || isUploadingLogo"
              data-testid="settings-save-button"
              class="btn-primary inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>💾</span>
              <span>{{ isSaving ? t('saving', 'Guardando...') : t('saveGeneralSettings', 'Guardar Configuración General') }}</span>
            </button>
          </div>
        </div>
      </template>

      <!-- Tab: Signatures & Seals -->
      <template #signatures>
        <SignaturesAndSealsTab
          :initial-seal-url="form.official_seal_url"
          :initial-seal-style="form.seal_style"
          :initial-signatures="form.signatures"
          @saved="onSignaturesSaved"
        />
      </template>

      <!-- Tab 2: Notifications -->
      <template #notifications>
        <ui-card :title="t('notificationSettings', 'Configuración de Notificaciones')">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl">
              <div>
                <p class="font-bold text-slate-800 dark:text-white text-sm">{{ t('emailNotifications', 'Notificaciones por Email') }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Recibir notificaciones por correo electrónico</p>
              </div>
              <button
                @click="notificationSettings.emailNotifications = !notificationSettings.emailNotifications"
                :class="notificationSettings.emailNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
              >
                <span
                  :class="notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl">
              <div>
                <p class="font-bold text-slate-800 dark:text-white text-sm">{{ t('pushNotifications', 'Notificaciones Push') }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Recibir notificaciones en el navegador</p>
              </div>
              <button
                @click="notificationSettings.pushNotifications = !notificationSettings.pushNotifications"
                :class="notificationSettings.pushNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
              >
                <span
                  :class="notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
          </div>
        </ui-card>
      </template>

      <!-- Tab 3: Security -->
      <template #security>
        <ui-card :title="t('securitySettings', 'Seguridad y Protección de Cuenta')">
          <div class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl gap-4">
              <div class="flex items-start gap-3.5">
                <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-brand-gold flex items-center justify-center font-bold text-lg flex-shrink-0">
                  🛡️
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-slate-850 dark:text-white text-sm">{{ t('twoFactorAuth', 'Autenticación en Dos Pasos (2FA / TOTP)') }}</p>
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
import { ref, computed, onMounted } from 'vue'
import TwoFactorSetupModal from '~/components/settings/TwoFactorSetupModal.vue'
import SignaturesAndSealsTab from '~/components/settings/SignaturesAndSealsTab.vue'
import { useInstitution } from '~/composables/useInstitution'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import { resolvePhotoUrl } from '~/composables/usePhotoUrl'
import { useLanguage } from '~/composables/useLanguage'

const nuxtApp = useNuxtApp()
const toast = useToast()
const api = useApi()
const { t } = useLanguage()
const { institution, fetchInstitution, updateInstitution } = useInstitution()

const tabs = computed(() => [
  { id: 'general', label: t('general', 'General') },
  { id: 'signatures', label: t('signaturesAndSeals', 'Firmas y Sellos') },
  { id: 'notifications', label: t('notifications', 'Notificaciones') },
  { id: 'security', label: t('security', 'Seguridad') }
])

// Form State
const form = ref({
  name: '',
  system_subtitle: 'Gestión Escolar',
  rif: '',
  dea_code: '',
  statistical_code: '',
  educational_zone: '',
  dependency: '',
  email: '',
  phone_primary: '',
  address_line1: '',
  logo_url: null,
  official_seal_url: null,
  seal_style: 'golden_ceremonial',
  signatures: []
})

const logoFileInput = ref(null)
const isUploadingLogo = ref(false)
const isSaving = ref(false)

// Notifications State
const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: true
})

// 2FA State
const is2FAModalOpen = ref(false)
const is2FAEnabled = ref(false)

const open2FAModal = () => {
  is2FAModalOpen.value = true
}

const on2FAStatusChanged = (status) => {
  is2FAEnabled.value = status
}

const syncFormWithInstitution = () => {
  if (institution.value) {
    const inst = institution.value
    const st = inst.settings || {}
    form.value = {
      name: inst.name || 'U.E Colegio "Santa Luisa"',
      system_subtitle: inst.system_subtitle || st.system_subtitle || 'Gestión Escolar',
      rif: inst.rif || inst.tax_id || '',
      dea_code: inst.dea_code || inst.accreditation_no || st.dea_code || '',
      statistical_code: inst.statistical_code || st.statistical_code || '',
      educational_zone: inst.educational_zone || st.educational_zone || '',
      dependency: inst.dependency || st.dependency || '',
      email: inst.email || '',
      phone_primary: inst.phone_primary || '',
      address_line1: inst.address_line1 || '',
      logo_url: inst.logo_url || null,
      official_seal_url: inst.official_seal_url || st.official_seal_url || null,
      seal_style: st.seal_style || 'golden_ceremonial',
      signatures: Array.isArray(inst.signatures) && inst.signatures.length > 0 ? inst.signatures : (st.signatures || [
        { role: 'Directora', name: 'Sor María Dolores Amaya', title: 'Directora General', id_card: 'V-6.241.890', signature_url: null },
        { role: 'Control de Estudios', name: 'Prof. Elena Vargas', title: 'Control de Estudios', id_card: 'V-11.458.789', signature_url: null },
        { role: 'Docente Guía', name: 'Prof. Carlos Mendoza', title: 'Docente Guía', id_card: 'V-14.890.123', signature_url: null }
      ])
    }
  }
}

const onSignaturesSaved = async (payload) => {
  try {
    await updateInstitution(payload)
    toast.success('Firmas y sellos oficiales actualizados correctamente.', 'Guardado Exitoso')
    await fetchInstitution(true)
    syncFormWithInstitution()
  } catch (err) {
    toast.error('No se pudieron guardar las firmas y sellos: ' + (err.message || err), 'Error')
  }
}

const triggerLogoUpload = () => {
  logoFileInput.value?.click()
}

const onLogoSelected = async (event) => {
  const target = event.target
  const file = target?.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Por favor seleccione un archivo de imagen válido (PNG, JPG, WEBP, SVG).', 'Formato Inválido')
    return
  }

  if (file.size > 3 * 1024 * 1024) {
    toast.error('La imagen no debe superar los 3MB.', 'Archivo muy grande')
    return
  }

  isUploadingLogo.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target?.result
      try {
        const res = await api.post('uploads/avatar', {
          image: base64Data,
          filename: `logo_${Date.now()}_${file.name}`
        })
        if (res && res.url) {
          form.value.logo_url = res.url
        } else {
          form.value.logo_url = base64Data
        }
        toast.success('Logotipo cargado en la vista previa. Haga clic en Guardar para aplicar cambios.', 'Logotipo Preparado')
      } catch (err) {
        console.warn('Fallback to base64 for logo:', err)
        form.value.logo_url = base64Data
        toast.info('Logotipo cargado en vista previa local. Haga clic en Guardar para confirmar.', 'Vista Previa')
      } finally {
        isUploadingLogo.value = false
        if (target) target.value = ''
      }
    }
    reader.readAsDataURL(file)
  } catch (err) {
    isUploadingLogo.value = false
    toast.error('Ocurrió un error al procesar la imagen.', 'Error de carga')
  }
}

const restoreDefaultLogo = () => {
  form.value.logo_url = null
  toast.info('Se ha restablecido la vista previa al logotipo predeterminado. Haga clic en Guardar para confirmar.', 'Logo Restablecido')
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    await updateInstitution({
      name: form.value.name,
      system_subtitle: form.value.system_subtitle,
      rif: form.value.rif,
      tax_id: form.value.rif,
      dea_code: form.value.dea_code,
      accreditation_no: form.value.dea_code,
      statistical_code: form.value.statistical_code,
      educational_zone: form.value.educational_zone,
      dependency: form.value.dependency,
      email: form.value.email,
      phone_primary: form.value.phone_primary,
      address_line1: form.value.address_line1,
      logo_url: form.value.logo_url
    })
    toast.success('La configuración institucional y el banner han sido actualizados con éxito.', 'Configuración Guardada')
  } catch (err) {
    console.error('Error saving institution settings:', err)
    toast.error(err?.message || 'No se pudo guardar la configuración institucional.', 'Error al Guardar')
  } finally {
    isSaving.value = false
  }
}

const fetch2FAStatus = async () => {
  try {
    const res = await nuxtApp.$api.service('two-factor').find()
    if (res && typeof res.two_factor_enabled === 'boolean') {
      is2FAEnabled.value = res.two_factor_enabled
    }
  } catch (err) {
    // Non-blocking fallback
  }
}

onMounted(async () => {
  await fetchInstitution(true)
  syncFormWithInstitution()
  fetch2FAStatus()
})
</script>

