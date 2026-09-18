<template>
  <div class="space-y-6">
    <!-- Card 1: Sello Oficial del Colegio -->
    <ui-card :title="t('officialSeal', 'Sello Oficial del Colegio')">
      <div class="space-y-5">
        <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <span class="text-base flex-shrink-0">🏛️</span>
          <div>
            <p class="font-bold">Validez y Autenticidad Institucional</p>
            <p class="mt-0.5 text-amber-800/85 dark:text-amber-300/85">
              El sello oficial se estampará en los diplomas de honor, constancias y boletas de notas. Al subir un sello escaneado, el sistema elimina automáticamente el fondo blanco del papel para que la tinta quede limpia y transparente.
            </p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-between p-5 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl gap-6">
          <!-- Sello Preview Visualizer -->
          <div class="flex items-center gap-5">
            <div class="relative flex-shrink-0">
              <!-- Sello visual render -->
              <div 
                class="w-24 h-24 rounded-full p-2 flex flex-col items-center justify-center border-2 border-dashed transition-all shadow-sm"
                :class="{
                  'border-amber-500 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 text-amber-800 dark:text-brand-gold': sealStyle === 'golden_ceremonial',
                  'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300': sealStyle === 'blue_ink',
                  'border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300': sealStyle === 'purple_ink'
                }"
              >
                <!-- If uploaded custom seal image -->
                <img 
                  v-if="sealUrl" 
                  :src="resolvePhotoUrl(sealUrl)" 
                  alt="Sello Oficial" 
                  class="w-full h-full object-contain"
                />
                <!-- Vector Default Seal -->
                <div v-else class="flex flex-col items-center justify-center text-center">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span class="text-[9px] font-black uppercase tracking-tighter mt-1 leading-none">
                    SELLO OFICIAL
                  </span>
                </div>
              </div>

              <!-- Transparency Badge -->
              <span class="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white shadow-xs">
                PNG Transp.
              </span>
            </div>

            <div>
              <h4 class="text-sm font-bold text-slate-850 dark:text-white">Estilo y Matriz del Sello</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Selecciona la apariencia deseada o sube el sello físico del plantel escaneado.
              </p>

              <!-- Style selection chips -->
              <div class="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  @click="sealStyle = 'golden_ceremonial'"
                  :class="sealStyle === 'golden_ceremonial' ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-xs' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'"
                  class="px-2.5 py-1 rounded-xl text-[11px] border transition-all cursor-pointer font-bold"
                >
                  🪙 Dorado Ceremonial
                </button>
                <button
                  type="button"
                  @click="sealStyle = 'blue_ink'"
                  :class="sealStyle === 'blue_ink' ? 'bg-blue-600 text-white font-black border-blue-700 shadow-xs' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'"
                  class="px-2.5 py-1 rounded-xl text-[11px] border transition-all cursor-pointer font-bold"
                >
                  🔷 Tinta Azul Húmeda
                </button>
                <button
                  type="button"
                  @click="sealStyle = 'purple_ink'"
                  :class="sealStyle === 'purple_ink' ? 'bg-brand-purple text-white font-black border-brand-purple shadow-xs' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'"
                  class="px-2.5 py-1 rounded-xl text-[11px] border transition-all cursor-pointer font-bold"
                >
                  🟣 Púrpura Institucional
                </button>
              </div>
            </div>
          </div>

          <!-- Controls: Upload & Reset -->
          <div class="flex items-center gap-2 flex-wrap">
            <input 
              ref="sealFileInput" 
              type="file" 
              data-testid="input-official-seal-file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml" 
              class="hidden" 
              @change="onSealSelected"
            />
            <button
              type="button"
              data-testid="btn-upload-seal"
              @click="sealFileInput?.click()"
              :disabled="isProcessingSeal"
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-purple text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span>📷</span>
              <span>{{ isProcessingSeal ? 'Procesando Fondo...' : 'Subir Sello Escaneado' }}</span>
            </button>
            <button
              type="button"
              @click="restoreDefaultSeal"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
            >
              <span>↺</span>
              <span>Restaurar Sello</span>
            </button>
          </div>
        </div>
      </div>
    </ui-card>

    <!-- Card 2: Firmas Digitalizadas de Autoridades -->
    <ui-card :title="t('digitalSignatures', 'Firmas Digitalizadas de Autoridades')">
      <div class="space-y-4">
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Registra las firmas de los directivos y coordinadores que avalan los diplomas y documentos escolares. Puedes subir firmas escaneadas en papel blanco y el sistema removerá el fondo automáticamente.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div 
            v-for="(sig, idx) in signaturesList" 
            :key="idx"
            class="p-4 bg-slate-50 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-2xl flex flex-col justify-between space-y-3"
          >
            <!-- Header of Signer Card -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-gold border border-brand-primary/20">
                  {{ sig.role }}
                </span>
                <span class="text-[11px] font-bold text-slate-400">Firma #{{ idx + 1 }}</span>
              </div>

              <!-- Signature Canvas Preview -->
              <div class="h-20 w-full bg-white dark:bg-[#1a0f3d] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 relative overflow-hidden">
                <!-- Custom Uploaded Signature -->
                <img 
                  v-if="sig.signature_url" 
                  :src="resolvePhotoUrl(sig.signature_url)" 
                  alt="Firma" 
                  class="max-h-full max-w-full object-contain filter drop-shadow-xs"
                />
                <!-- Default Calligraphic SVG Signature -->
                <div v-else class="text-center">
                  <svg class="h-10 w-36 text-indigo-900 dark:text-indigo-300 opacity-70" viewBox="0 0 200 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 40 Q 30 10, 50 35 T 90 25 T 130 40 Q 150 15, 170 30 T 190 20 M40 50 Q 80 55, 160 48" />
                  </svg>
                  <span class="text-[9px] text-slate-400 block font-medium">Firma Predeterminada</span>
                </div>
              </div>
            </div>

            <!-- Signer Metadata Inputs -->
            <div class="space-y-2">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre Completo</label>
                <input 
                  v-model="sig.name" 
                  type="text" 
                  class="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a0f3d] border border-slate-200 dark:border-white/10 rounded-lg text-slate-850 dark:text-white font-medium"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cargo / Título</label>
                <input 
                  v-model="sig.title" 
                  type="text" 
                  class="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a0f3d] border border-slate-200 dark:border-white/10 rounded-lg text-slate-850 dark:text-white font-medium"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cédula de Identidad</label>
                <input 
                  v-model="sig.id_card" 
                  type="text" 
                  class="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a0f3d] border border-slate-200 dark:border-white/10 rounded-lg text-slate-850 dark:text-white font-semibold uppercase"
                />
              </div>
            </div>

            <!-- Upload Signature Action -->
            <div class="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2">
              <input 
                :ref="el => signatureInputs[idx] = el" 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                class="hidden" 
                @change="e => onSignatureSelected(e, idx)"
              />
              <button
                type="button"
                @click="signatureInputs[idx]?.click()"
                class="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center"
              >
                ✍ Subir Firma
              </button>
              <button
                v-if="sig.signature_url"
                type="button"
                @click="sig.signature_url = null"
                class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs transition-colors cursor-pointer"
                title="Restaurar firma predeterminada"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </ui-card>

    <!-- Save Action Bar -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        data-testid="save-signatures-btn"
        @click="saveSignaturesAndSeals"
        :disabled="isSaving"
        class="btn-primary inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
      >
        <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <span v-else>💾</span>
        <span>{{ isSaving ? t('saving', 'Guardando...') : t('saveSignaturesAndSeals', 'Guardar Firmas y Sellos Oficiales') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import { resolvePhotoUrl } from '~/composables/usePhotoUrl'
import { useImageTransparency } from '~/composables/useImageTransparency'

const props = defineProps({
  initialSealUrl: { type: String, default: null },
  initialSealStyle: { type: String, default: 'golden_ceremonial' },
  initialSignatures: { type: Array, default: () => [] }
})

const emit = defineEmits(['saved'])

const { t } = useLanguage()
const toast = useToast()
const api = useApi()
const { makeBackgroundTransparent } = useImageTransparency()

const sealUrl = ref(props.initialSealUrl)
const sealStyle = ref(props.initialSealStyle || 'golden_ceremonial')
const sealFileInput = ref(null)
const isProcessingSeal = ref(false)
const isSaving = ref(false)

const signaturesList = ref([
  { role: 'Directora', name: 'Sor María Dolores Amaya', title: 'Directora General', id_card: 'V-6.241.890', signature_url: null },
  { role: 'Control de Estudios', name: 'Prof. Elena Vargas', title: 'Control de Estudios', id_card: 'V-11.458.789', signature_url: null },
  { role: 'Docente Guía', name: 'Prof. Carlos Mendoza', title: 'Docente Guía', id_card: 'V-14.890.123', signature_url: null }
])

const signatureInputs = ref([])

watch(() => props.initialSealUrl, (val) => { sealUrl.value = val })
watch(() => props.initialSealStyle, (val) => { sealStyle.value = val || 'golden_ceremonial' })
watch(() => props.initialSignatures, (val) => {
  if (Array.isArray(val) && val.length > 0) {
    signaturesList.value = JSON.parse(JSON.stringify(val))
  }
}, { immediate: true })

const onSealSelected = async (e) => {
  const file = e.target?.files?.[0]
  if (!file) return
  isProcessingSeal.value = true

  try {
    const reader = new FileReader()
    reader.onload = async (event) => {
      const rawBase64 = event.target?.result
      // Process transparency cutout on white background
      const transparentBase64 = await makeBackgroundTransparent(rawBase64, 215)

      try {
        const res = await api.post('uploads/avatar', {
          image: transparentBase64,
          filename: `seal_${Date.now()}_${file.name}`
        })
        sealUrl.value = res?.url || transparentBase64
        toast.success('Sello oficial procesado con fondo transparente.', 'Sello Preparado')
      } catch (uploadErr) {
        sealUrl.value = transparentBase64
        toast.info('Sello procesado en vista previa local.', 'Sello Preparado')
      } finally {
        isProcessingSeal.value = false
        if (e.target) e.target.value = ''
      }
    }
    reader.readAsDataURL(file)
  } catch (err) {
    isProcessingSeal.value = false
    toast.error('No se pudo procesar la imagen del sello: ' + err.message, 'Error')
  }
}

const restoreDefaultSeal = () => {
  sealUrl.value = null
  sealStyle.value = 'golden_ceremonial'
  toast.info('Se ha restaurado el sello ceremonial predeterminado.', 'Sello Restablecido')
}

const onSignatureSelected = async (e, idx) => {
  const file = e.target?.files?.[0]
  if (!file) return

  try {
    const reader = new FileReader()
    reader.onload = async (event) => {
      const rawBase64 = event.target?.result
      // Process transparency cutout for ink signature
      const transparentBase64 = await makeBackgroundTransparent(rawBase64, 210)

      try {
        const res = await api.post('uploads/avatar', {
          image: transparentBase64,
          filename: `sig_${Date.now()}_${file.name}`
        })
        signaturesList.value[idx].signature_url = res?.url || transparentBase64
      } catch (err) {
        signaturesList.value[idx].signature_url = transparentBase64
      }
      toast.success('Firma digitalizada con fondo transparente lista.', 'Firma Procesada')
    }
    reader.readAsDataURL(file)
  } catch (err) {
    toast.error('Error al procesar firma: ' + err.message, 'Error')
  }
}

const saveSignaturesAndSeals = async () => {
  isSaving.value = true
  try {
    const payload = {
      official_seal_url: sealUrl.value,
      settings: {
        seal_style: sealStyle.value,
        official_seal_url: sealUrl.value,
        signatures: signaturesList.value
      }
    }
    emit('saved', payload)
  } finally {
    isSaving.value = false
  }
}
</script>
