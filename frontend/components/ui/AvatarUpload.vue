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
                  ? 'border-brand-purple dark:border-brand-gold bg-purple-50/50 dark:bg-purple-950/20 text-brand-purple dark:text-brand-gold'
                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-purple/60 text-slate-600 dark:text-slate-300'
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
              class="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
            />
          </div>

          <!-- Error Alert if validation fails -->
          <div v-if="errorMessage" class="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Academic Stage Selector (For Students) -->
          <div v-if="showStageSelector" class="pt-1 flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Etapa Escolar:</span>
            <select
              :value="stage"
              @change="$emit('update:stage', $event.target.value)"
              class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-purple cursor-pointer"
            >
              <option value="preescolar_primaria">Preescolar / Primaria (1°-6°)</option>
              <option value="media_general">Media General (1°-3° Año)</option>
              <option value="diversificado">Diversificado (4°-5° Año)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL INTERACTIVO DE ENCUADRE Y RECORTE FACIAL -->
    <Teleport to="body">
      <div 
        v-if="isCropModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      >
        <div class="relative w-full max-w-md bg-white dark:bg-[#160d33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[95vh]">
          
          <!-- Modal Header -->
          <div class="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-gold flex items-center justify-center text-white text-sm shadow-md">
                ✂️
              </div>
              <div>
                <h3 class="font-black text-sm text-white tracking-tight">Encuadre y Recorte de Foto</h3>
                <p class="text-[10px] text-slate-300">Centra el rostro en la guía tipo carnet (3:4)</p>
              </div>
            </div>
            <button 
              type="button" 
              @click="closeCropModal"
              class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>

          <!-- Canvas Crop Area -->
          <div class="p-5 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0c071d]/60 select-none">
            <div 
              class="relative w-[240px] h-[320px] rounded-2xl overflow-hidden shadow-xl border-2 border-brand-purple dark:border-brand-gold bg-black flex items-center justify-center cursor-grab active:cursor-grabbing"
              @mousedown="startPan"
              @mousemove="doPan"
              @mouseup="endPan"
              @mouseleave="endPan"
              @touchstart="startTouchPan"
              @touchmove="doTouchPan"
              @touchend="endPan"
              @wheel.prevent="onWheelZoom"
            >
              <!-- Drawing Canvas -->
              <canvas
                ref="cropCanvas"
                width="240"
                height="320"
                class="w-full h-full object-contain pointer-events-none"
              ></canvas>

              <!-- Face Guide Overlay (Oval / Silhouette) -->
              <div class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <!-- Silhouette guide -->
                <div class="w-36 h-48 rounded-[50%/60%] border-2 border-dashed border-amber-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
                  <!-- Eye alignment line -->
                  <div class="w-20 border-b border-amber-300/40 my-auto"></div>
                  <!-- Chin alignment line -->
                  <div class="w-12 border-b border-amber-300/40 mb-4"></div>
                </div>
                <span class="absolute bottom-2 text-[9px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full tracking-wider uppercase">
                  Alinea ojos y barbilla
                </span>
              </div>
            </div>

            <!-- Controls (Zoom, Rotate, Reset) -->
            <div class="w-full max-w-[280px] mt-4 space-y-3">
              <!-- Zoom Slider -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500 font-bold">🔍</span>
                <input
                  v-model.number="zoomLevel"
                  @input="renderCanvas"
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  class="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-purple dark:accent-brand-gold"
                />
                <span class="text-[11px] font-mono text-slate-500 font-bold w-9 text-right">{{ zoomLevel.toFixed(1) }}x</span>
              </div>

              <!-- Action buttons for transform -->
              <div class="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  @click="rotateImage"
                  class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Girar 90 grados"
                >
                  <span>🔄</span>
                  <span>Girar 90°</span>
                </button>
                <button
                  type="button"
                  @click="resetTransform"
                  class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Restablecer posición"
                >
                  <span>↺</span>
                  <span>Centrar</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-5 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="closeCropModal"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="applyCropAndUpload"
              :disabled="uploading"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-brand-purple hover:bg-brand-purple/90 text-white dark:bg-brand-gold dark:text-slate-950 dark:hover:bg-brand-gold/90 shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span v-if="uploading">⏳ Subiendo...</span>
              <span v-else>✂️ Aplicar Recorte</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useApi } from '~/composables/useApi'

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
const api = useApi()

const mode = ref('file')
const isDragging = ref(false)
const uploading = ref(false)
const errorMessage = ref('')
const fileInput = ref(null)
const urlInput = ref(props.modelValue || '')

// Cropper States
const isCropModalOpen = ref(false)
const cropCanvas = ref(null)
const selectedFile = ref(null)
const loadedImage = ref(null)
const zoomLevel = ref(1.0)
const rotationAngle = ref(0)
const panOffset = ref({ x: 0, y: 0 })
const isPanning = ref(false)
const dragStart = ref({ x: 0, y: 0 })

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

  selectedFile.value = file

  // Read file into image element for cropping
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      loadedImage.value = img
      resetTransform()
      isCropModalOpen.value = true
      nextTick(() => {
        renderCanvas()
      })
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const resetTransform = () => {
  zoomLevel.value = 1.0
  rotationAngle.value = 0
  panOffset.value = { x: 0, y: 0 }
  renderCanvas()
}

const rotateImage = () => {
  rotationAngle.value = (rotationAngle.value + 90) % 360
  renderCanvas()
}

const onWheelZoom = (event) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  zoomLevel.value = Math.min(Math.max(zoomLevel.value + delta, 0.5), 3.0)
  renderCanvas()
}

const startPan = (e) => {
  isPanning.value = true
  dragStart.value = { x: e.clientX - panOffset.value.x, y: e.clientY - panOffset.value.y }
}

const doPan = (e) => {
  if (!isPanning.value) return
  panOffset.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
  renderCanvas()
}

const startTouchPan = (e) => {
  if (!e.touches.length) return
  isPanning.value = true
  const touch = e.touches[0]
  dragStart.value = { x: touch.clientX - panOffset.value.x, y: touch.clientY - panOffset.value.y }
}

const doTouchPan = (e) => {
  if (!isPanning.value || !e.touches.length) return
  const touch = e.touches[0]
  panOffset.value = {
    x: touch.clientX - dragStart.value.x,
    y: touch.clientY - dragStart.value.y
  }
  renderCanvas()
}

const endPan = () => {
  isPanning.value = false
}

const renderCanvas = () => {
  if (!cropCanvas.value || !loadedImage.value) return
  const canvas = cropCanvas.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Save context state
  ctx.save()

  // Translate to center + user pan
  ctx.translate(width / 2 + panOffset.value.x, height / 2 + panOffset.value.y)
  ctx.rotate((rotationAngle.value * Math.PI) / 180)
  ctx.scale(zoomLevel.value, zoomLevel.value)

  // Draw image centered
  const img = loadedImage.value
  const aspect = img.width / img.height
  let drawW = width
  let drawH = width / aspect

  if (drawH < height) {
    drawH = height
    drawW = height * aspect
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)

  ctx.restore()
}

const closeCropModal = () => {
  isCropModalOpen.value = false
  selectedFile.value = null
  loadedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const applyCropAndUpload = async () => {
  if (!loadedImage.value) return

  // Create high-res offscreen canvas (480 x 640, 3:4 portrait)
  const offscreen = document.createElement('canvas')
  offscreen.width = 480
  offscreen.height = 640
  const ctx = offscreen.getContext('2d')

  const scaleFactor = 480 / 240 // 2x resolution

  ctx.save()
  ctx.translate(offscreen.width / 2 + panOffset.value.x * scaleFactor, offscreen.height / 2 + panOffset.value.y * scaleFactor)
  ctx.rotate((rotationAngle.value * Math.PI) / 180)
  ctx.scale(zoomLevel.value * scaleFactor, zoomLevel.value * scaleFactor)

  const img = loadedImage.value
  const aspect = img.width / img.height
  let drawW = 240
  let drawH = 240 / aspect

  if (drawH < 320) {
    drawH = 320
    drawW = 320 * aspect
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
  ctx.restore()

  const base64Data = offscreen.toDataURL('image/jpeg', 0.92)
  const filename = selectedFile.value?.name ? `cropped_${selectedFile.value.name.replace(/\.[^/.]+$/, '')}.jpg` : 'avatar_cropped.jpg'

  isCropModalOpen.value = false
  await uploadBase64Image(base64Data, filename)
}

const uploadBase64Image = async (base64Data, originalName) => {
  uploading.value = true
  errorMessage.value = ''

  try {
    // Authenticated API request with Bearer token via useApi()
    const response = await api.post('uploads/avatar', {
      image: base64Data,
      filename: originalName
    })

    if (response && response.url) {
      emit('update:modelValue', response.url)
    } else {
      throw new Error('Respuesta inesperada del servidor.')
    }
  } catch (err) {
    console.error('Upload avatar error:', err)
    errorMessage.value = err.data?.error || err.message || 'Error al subir la imagen al servidor.'
  } finally {
    uploading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
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
