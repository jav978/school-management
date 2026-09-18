<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {{ label || 'Fotografía de Perfil / Carnet' }}
      </label>
      <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
        Carnet Oficial 3:4 • Máx. 3MB (JPG, PNG, WEBP)
      </span>
    </div>

    <!-- Main Container with Preview and Controls -->
    <div class="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 transition-all">
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        
        <!-- Avatar Preview Box (Carnet 3:4 aspect ratio: w-24 h-32 / 96x128px) -->
        <div class="flex flex-col items-center gap-2 flex-shrink-0">
          <div class="relative group">
            <div class="w-24 h-32 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm transition-all group-hover:border-emerald-500/50">
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="Fotografía oficial carnet"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-2 text-center select-none">
                <svg class="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-[10px] font-bold mt-1 uppercase tracking-wider">Sin Foto</span>
                <span class="text-[9px] text-slate-400 dark:text-slate-600 font-mono">3 × 4 cm</span>
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
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Re-center / Adjust button for existing photo -->
          <button
            v-if="previewUrl"
            type="button"
            @click="openRecropWithCurrentPhoto"
            class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            title="Ajustar encuadre o centrado"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Centrar</span>
          </button>
        </div>

        <!-- Mode Tabs & Controls -->
        <div class="flex-1 w-full space-y-2.5">
          <!-- Switch Mode: Subir Archivo vs Cámara en Vivo vs Enlace URL -->
          <div class="grid grid-cols-3 gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl text-xs font-bold w-full">
            <!-- Tab File -->
            <button
              type="button"
              @click="switchMode('file')"
              :class="[
                'w-full px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 text-[11px] sm:text-xs min-w-0',
                mode === 'file' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              ]"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">Subir Archivo</span>
            </button>

            <!-- Tab Camera -->
            <button
              type="button"
              @click="switchMode('camera')"
              :class="[
                'w-full px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 text-[11px] sm:text-xs min-w-0',
                mode === 'camera' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              ]"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">Cámara Web</span>
            </button>

            <!-- Tab URL -->
            <button
              type="button"
              @click="switchMode('url')"
              :class="[
                'w-full px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 text-[11px] sm:text-xs min-w-0',
                mode === 'url' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              ]"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span class="truncate">Enlace URL</span>
            </button>
          </div>

          <!-- Mode 1: File Drag & Drop / File Input -->
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
                'border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all flex items-center justify-center gap-2.5 text-xs font-semibold select-none',
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/70 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
              ]"
            >
              <svg class="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>{{ uploading ? 'Procesando imagen...' : 'Seleccionar o arrastrar fotografía (WhatsApp / Galería)' }}</span>
            </div>
          </div>

          <!-- Mode 2: Live Webcam -->
          <div v-else-if="mode === 'camera'" class="space-y-3">
            <div class="relative w-full max-w-[280px] aspect-[4/3] bg-black rounded-xl overflow-hidden border border-slate-700 mx-auto flex items-center justify-center">
              <video
                ref="videoRef"
                autoplay
                playsinline
                muted
                class="w-full h-full object-cover mirror"
              ></video>

              <!-- Carnet Face Overlay Guide on Camera -->
              <div class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div class="w-24 h-32 rounded-[50%/60%] border-2 border-dashed border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
                  <div class="w-14 border-b border-emerald-400/40 my-auto"></div>
                </div>
              </div>

              <!-- Camera status or error -->
              <div v-if="cameraError" class="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-3 text-center">
                <svg class="w-6 h-6 text-rose-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-[11px] font-bold text-rose-400">{{ cameraError }}</p>
                <button
                  type="button"
                  @click="startCamera"
                  class="mt-2 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[10px] font-bold hover:bg-slate-700"
                >
                  Reintentar Cámara
                </button>
              </div>
            </div>

            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                @click="capturePhotoFromCamera"
                :disabled="!isCameraReady"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                <span>Tomar Foto Carnet</span>
              </button>
            </div>
          </div>

          <!-- Mode 3: Direct URL -->
          <div v-else class="space-y-1">
            <input
              v-model="urlInput"
              @input="onUrlInput"
              type="url"
              placeholder="https://ejemplo.com/foto_carnet.jpg"
              class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
            />
          </div>

          <!-- Error Alert if validation fails -->
          <div v-if="errorMessage" class="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Academic Stage Selector (For Students) -->
          <div v-if="showStageSelector" class="pt-1 flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Etapa Escolar:</span>
            <select
              :value="stage"
              @change="$emit('update:stage', $event.target.value)"
              class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="preescolar_primaria">Preescolar / Primaria (1°-6°)</option>
              <option value="media_general">Media General (1°-3° Año)</option>
              <option value="diversificado">Diversificado (4°-5° Año)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL INTERACTIVO DE ENCUADRE Y RECORTE FACIAL (CARNET 3:4) -->
    <!-- CRITICAL: z-[200] so it ALWAYS sits on top of parent modal dialogs (which are z-[100]) -->
    <Teleport to="body">
      <div 
        v-if="isCropModalOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      >
        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]">
          
          <!-- Modal Header -->
          <div class="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-sm shadow-xs">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-sm text-white tracking-tight">Encuadre de Foto Carnet</h3>
                <p class="text-[10px] text-slate-400">Proporción 3:4 oficial • Centra ojos y barbilla</p>
              </div>
            </div>
            <button 
              type="button" 
              @click="closeCropModal"
              class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs active:scale-95"
            >
              ✕
            </button>
          </div>

          <!-- Canvas Crop Area (3:4 Carnet display: 240x320) -->
          <div class="p-5 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950/70 select-none overflow-y-auto">
            <div 
              class="relative w-[240px] h-[320px] rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/70 bg-black flex items-center justify-center cursor-grab active:cursor-grabbing"
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

              <!-- Face Guide Overlay (Oval / Silhouette Carnet) -->
              <div class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <!-- Silhouette guide -->
                <div class="w-36 h-48 rounded-[50%/60%] border-2 border-dashed border-amber-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.40)] flex flex-col items-center justify-center">
                  <!-- Eye alignment line -->
                  <div class="w-20 border-b border-amber-300/50 my-auto"></div>
                  <!-- Chin alignment line -->
                  <div class="w-12 border-b border-amber-300/50 mb-4"></div>
                </div>
                <span class="absolute bottom-2 text-[9px] font-bold text-amber-300 bg-slate-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                  Alinea ojos y barbilla
                </span>
              </div>
            </div>

            <!-- Controls (Zoom, Rotate, Reset) -->
            <div class="w-full max-w-[280px] mt-4 space-y-3">
              <!-- Zoom Slider with +/- buttons -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="adjustZoom(-0.1)"
                  class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer active:scale-95"
                  title="Reducir zoom"
                >
                  −
                </button>
                <input
                  v-model.number="zoomLevel"
                  @input="renderCanvas"
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  class="flex-1 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <button
                  type="button"
                  @click="adjustZoom(0.1)"
                  class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer active:scale-95"
                  title="Aumentar zoom"
                >
                  +
                </button>
                <span class="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold w-9 text-right">{{ zoomLevel.toFixed(1) }}x</span>
              </div>

              <!-- Action buttons for transform -->
              <div class="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  @click="rotateImage"
                  class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Girar 90 grados a la derecha"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Girar 90°</span>
                </button>
                <button
                  type="button"
                  @click="resetTransform"
                  class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Restablecer posición y zoom al centro"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Centrar</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="closeCropModal"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="applyCropAndUpload"
              :disabled="uploading"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg v-if="uploading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ uploading ? 'Guardando...' : 'Aplicar y Centrar Foto' }}</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onUnmounted } from 'vue'
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

// Camera states
const videoRef = ref(null)
const mediaStream = ref(null)
const isCameraReady = ref(false)
const cameraError = ref('')

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

// Resolve full preview URL (accounting for relative /uploads path or base64)
const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  if (
    props.modelValue.startsWith('http://') ||
    props.modelValue.startsWith('https://') ||
    props.modelValue.startsWith('data:') ||
    props.modelValue.startsWith('blob:')
  ) {
    return props.modelValue
  }
  return `${config.public.apiBase}${props.modelValue}`
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== urlInput.value) {
    urlInput.value = newVal
  }
})

const switchMode = (newMode) => {
  mode.value = newMode
  errorMessage.value = ''
  if (newMode === 'camera') {
    startCamera()
  } else {
    stopCamera()
  }
}

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
  const file = event.dataTransfer?.files?.[0]
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

  const reader = new FileReader()
  reader.onload = (e) => {
    loadImageForCropping(e.target.result)
  }
  reader.readAsDataURL(file)
}

const loadImageForCropping = (src) => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    loadedImage.value = img
    resetTransform()
    isCropModalOpen.value = true
    nextTick(() => {
      renderCanvas()
    })
  }
  img.onerror = () => {
    errorMessage.value = 'No se pudo cargar la imagen para encuadre.'
  }
  img.src = src
}

const openRecropWithCurrentPhoto = () => {
  if (!previewUrl.value) return
  loadImageForCropping(previewUrl.value)
}

// Camera Controls
const startCamera = async () => {
  stopCamera()
  cameraError.value = ''
  isCameraReady.value = false

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Tu navegador o dispositivo no soporta acceso directo a cámara web.')
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })
    mediaStream.value = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.onloadedmetadata = () => {
        videoRef.value.play().catch(() => {})
        isCameraReady.value = true
      }
    }
  } catch (err) {
    console.warn('Camera access error:', err)
    cameraError.value = err.name === 'NotAllowedError'
      ? 'Permiso de cámara denegado en el navegador.'
      : 'No se detectó cámara disponible o hubo un error al iniciarla.'
  }
}

const stopCamera = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }
  isCameraReady.value = false
  cameraError.value = ''
}

const capturePhotoFromCamera = () => {
  if (!videoRef.value) return
  const video = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth || 640
  canvas.height = video.videoHeight || 480
  const ctx = canvas.getContext('2d')
  
  // Mirror capture to match user view
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
  stopCamera()
  mode.value = 'file'
  loadImageForCropping(dataUrl)
}

// Canvas & Transformation logic
const resetTransform = () => {
  zoomLevel.value = 1.0
  rotationAngle.value = 0
  panOffset.value = { x: 0, y: 0 }
  renderCanvas()
}

const adjustZoom = (delta) => {
  zoomLevel.value = Math.min(Math.max(parseFloat((zoomLevel.value + delta).toFixed(2)), 0.5), 3.0)
  renderCanvas()
}

const rotateImage = () => {
  rotationAngle.value = (rotationAngle.value + 90) % 360
  renderCanvas()
}

const onWheelZoom = (event) => {
  const delta = event.deltaY > 0 ? -0.08 : 0.08
  adjustZoom(delta)
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

  ctx.save()
  ctx.translate(width / 2 + panOffset.value.x, height / 2 + panOffset.value.y)
  ctx.rotate((rotationAngle.value * Math.PI) / 180)
  ctx.scale(zoomLevel.value, zoomLevel.value)

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

// 480x640 portrait carnet (3:4) output
const applyCropAndUpload = async () => {
  if (!loadedImage.value) return

  const offscreen = document.createElement('canvas')
  offscreen.width = 480
  offscreen.height = 640
  const ctx = offscreen.getContext('2d')

  const scaleFactor = 480 / 240 // 2x crisp resolution

  ctx.save()
  ctx.translate(
    offscreen.width / 2 + panOffset.value.x * scaleFactor,
    offscreen.height / 2 + panOffset.value.y * scaleFactor
  )
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
  const filename = selectedFile.value?.name
    ? `carnet_${selectedFile.value.name.replace(/\.[^/.]+$/, '')}.jpg`
    : `carnet_${Date.now()}.jpg`

  isCropModalOpen.value = false
  await uploadBase64Image(base64Data, filename)
}

const uploadBase64Image = async (base64Data, originalName) => {
  uploading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('uploads/avatar', {
      image: base64Data,
      filename: originalName
    })

    if (response && response.url) {
      emit('update:modelValue', response.url)
    } else {
      // Fallback directly to base64Data if response lacks URL
      emit('update:modelValue', base64Data)
    }
  } catch (err) {
    console.warn('Upload to server endpoint failed, falling back to Base64:', err)
    // Seamless fallback to base64 Data URL so the user is never blocked
    emit('update:modelValue', base64Data)
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
  errorMessage.value = 'No se pudo cargar la imagen desde la dirección especificada.'
}

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.mirror {
  transform: scaleX(-1);
}
</style>
