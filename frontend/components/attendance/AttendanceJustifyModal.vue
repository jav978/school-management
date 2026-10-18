<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transition-all transform duration-300 animate-in fade-in zoom-in-95"
        :style="modalSpatialStyle"
      >
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center text-sky-500">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                Justificar Inasistencia
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ student ? `${student.first_name} ${student.last_name}` : '' }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            type="button"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Scrollable Content -->
        <form @submit.prevent="handleConfirm" class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Reason Type -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Motivo de Inasistencia *
            </label>
            <select
              v-model="form.reasonType"
              required
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="Motivo de Salud / Médico">Motivo de Salud / Cita Médica</option>
              <option value="Calamidad Familiar">Calamidad Familiar / Emergencia</option>
              <option value="Permiso Institucional">Permiso Institucional o Deportivo</option>
              <option value="Viaje Programado">Viaje Programado de Fuerza Mayor</option>
              <option value="Otro Motivo">Otro Motivo Justificado</option>
            </select>
          </div>

          <!-- Detailed Explanation -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detalles de la Justificación *
            </label>
            <textarea
              v-model="form.reason"
              required
              rows="3"
              placeholder="Indique el diagnóstico o la razón expuesta por el representante..."
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            ></textarea>
          </div>

          <!-- Document Reference / Note -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Comprobante / N° de Constancia (Opcional)
            </label>
            <input
              v-model="form.document"
              type="text"
              placeholder="Ej. Certificado Médico N° 48291"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </form>

        <!-- Permanent Sticky Footer -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            @click="$emit('close')"
            type="button"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancelar</span>
          </button>
          <button
            @click="handleConfirm"
            type="button"
            class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Aplicar Justificación
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  student: { type: Object, default: null },
  triggerOrigin: { type: Object, default: () => ({ x: 50, y: 50 }) }
})

const emit = defineEmits(['close', 'confirm'])

const form = ref({
  reasonType: 'Motivo de Salud / Médico',
  reason: '',
  document: ''
})

watch(() => props.student, (newVal) => {
  if (newVal) {
    form.value = {
      reasonType: 'Motivo de Salud / Médico',
      reason: newVal.excuse_reason || '',
      document: newVal.excuse_document || ''
    }
  }
}, { immediate: true })

const modalSpatialStyle = computed(() => ({
  transformOrigin: `${props.triggerOrigin?.x ?? 50}% ${props.triggerOrigin?.y ?? 50}%`
}))

const handleConfirm = () => {
  emit('confirm', {
    student: props.student,
    reasonType: form.value.reasonType,
    reason: form.value.reason,
    document: form.value.document
  })
}
</script>
