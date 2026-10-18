<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      @click.self="$emit('close')"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl mx-auto shadow-xs">
          📷
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white">Escáner de Asistencia QR</h3>
          <p class="text-xs text-slate-400 mt-1">Escanea el código QR del carnet o ingresa el código del estudiante.</p>
        </div>

        <div class="relative">
          <input
            v-model="inputCode"
            @keyup.enter="handleScan"
            ref="inputRef"
            placeholder="Ej: STU-001 o V-32456789..."
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center font-mono text-sm font-bold focus:ring-2 focus:ring-indigo-500 text-slate-850 dark:text-white transition-all shadow-inner"
          />
          <button
            @click="handleScan"
            type="button"
            class="absolute right-2 top-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Registrar
          </button>
        </div>

        <div v-if="lastScannedStudent" class="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
          ✓ {{ lastScannedStudent.first_name }} {{ lastScannedStudent.last_name }} registrado como PRESENTE
        </div>

        <div class="flex justify-end pt-2">
          <button
            @click="$emit('close')"
            type="button"
            class="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  lastScannedStudent: { type: Object, default: null }
})

const emit = defineEmits(['close', 'scan'])

const inputCode = ref('')
const inputRef = ref(null)

watch(() => props.isOpen, (open) => {
  if (open) {
    inputCode.value = ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

const handleScan = () => {
  if (!inputCode.value.trim()) return
  emit('scan', inputCode.value)
  inputCode.value = ''
}
</script>
