<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {{ label || 'Fotografía de Perfil / Carnet' }}
      </label>
      <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
        Máx. 3MB (JPG, PNG, WEBP)
      </span>
    </div>

    <!-- Main Container with Preview and Controls -->
    <div class="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <!-- Avatar Preview Box -->
        <div class="relative group flex-shrink-0">
          <div class="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-xs transition-all">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Vista previa de foto"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-2 text-center">
              <svg class="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-[10px] font-bold mt-1 uppercase tracking-wider">Sin Foto</span>
            </div>
          </div>

          <!-- Quick Remove Button if photo exists -->
          <button
            v-if="previewUrl"
            type="button"
            @click="clearPhoto"
            title="Eliminar foto"
            class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <!-- Mode Tabs & Inputs -->
        <div class="flex-1 w-full space-y-2.5">
          <!-- Switch Mode: Subir Archivo vs Pegar URL -->
          <div class="inline-flex p-1 bg-slate-200/70 dark:bg-slate-900/60 rounded-xl text-xs font-bold w-full sm:w-auto">
            <button
              type="button"
              @click="mode = 'file'"
              :class="[
                'flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5',
                mode === 'file' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              ]"
            >
              <span>📁</span>
              <span>Subir Archivo</span>
            </button>
            <button
              type="button"
              @click="mode = 'url'"
              :class="[
                'flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5',
                mode === 'url' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              ]"
            >
              <span>🌐</span>
              <span>Enlace URL</span>
            </button>
          </div>

          <!-- Mode File: Drag & Drop / File Input -->
          <div v-if="mode === 'file'" class="space-y-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="onFileSelected"
              class="hidden"
            />
            <div
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onFileDrop"
              :class="[
                'border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold',
                isDragging
                  ? 'border-brand-primary bg-emerald-50/50 dark:bg-emerald-950/20 text-brand-primary'
                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-primary/60 text-slate-600 dark:text-slate-300'
              ]"
            >
              <svg class="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>{{ uploading ? 'Subiendo imagen...' : 'Seleccionar o arrastrar imagen (WhatsApp / Galería)' }}</span>
            </div>
          </div>

          <!-- Mode URL: Direct text link -->
          <div v-else class="space-y-1">
            <input
              v-model="urlInput"
              @input="onUrlInput"
              type="url"
              placeholder="https://ejemplo.com/foto.jpg"
              class="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>

          <!-- Error Alert if validation fails -->
          <div v-if="errorMessage" class="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Academic Stage Selector (For Students) -->
          <div v-if="showStageSelector" class="pt-1 flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Etapa Escolar:</span>
            <select
              :value="stage"
              @change="$emit('update:stage', $event.target.value)"
              class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
            >
              <option value="preescolar_primaria">Preescolar / Primaria (1°-6°)</option>
              <option value="media_general">Media General (1°-3° Año)</option>
              <option value="diversificado">Diversificado (4°-5° Año)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  stage: {
    type: String,
    default: 'preescolar_primaria'
  },
  showStageSelector: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:stage'])

const config = useRuntimeConfig()
const mode = ref('file')
const isDragging = ref(false)
const uploading = ref(false)
const errorMessage = ref('')
const fileInput = ref(null)
const urlInput = ref(props.modelValue || '')

// Resolve full preview URL (accounting for relative /uploads path)
const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  if (props.modelValue.startsWith('http://') || props.modelValue.startsWith('https://') || props.modelValue.startsWith('data:')) {
    return props.modelValue
  }
  // Relative path from backend
  return `${config.public.apiBase}${props.modelValue}`
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== urlInput.value) {
    urlInput.value = newVal
  }
})

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const onFileSelected = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const onFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  errorMessage.value = ''

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Formato no compatible. Seleccione una imagen JPG, PNG o WEBP.'
    return
  }

  // Validate size <= 3MB
  const MAX_SIZE = 3 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
    errorMessage.value = `La imagen pesa ${sizeMb}MB. El límite máximo permitido es de 3.00MB.`
    return
  }

  // Read as Data-URI
  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64Image = e.target.result
    await uploadBase64Image(base64Image, file.name)
  }
  reader.readAsDataURL(file)
}

const uploadBase64Image = async (base64Data, originalName) => {
  uploading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch(`${config.public.apiBase}/uploads/avatar`, {
      method: 'POST',
      body: {
        image: base64Data,
        filename: originalName
      }
    })

    if (response && response.url) {
      emit('update:modelValue', response.url)
    } else {
      throw new Error('Respuesta inesperada del servidor.')
    }
  } catch (err) {
    errorMessage.value = err.data?.error || err.message || 'Error al subir la imagen al servidor.'
  } finally {
    uploading.value = false
  }
}

const onUrlInput = () => {
  errorMessage.value = ''
  emit('update:modelValue', urlInput.value.trim())
}

const clearPhoto = () => {
  errorMessage.value = ''
  urlInput.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleImageError = () => {
  errorMessage.value = 'No se pudo cargar la imagen desde la URL especificada.'
}
</script>
