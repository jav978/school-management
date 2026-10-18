<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-white dark:bg-slate-950 overflow-y-auto p-6 sm:p-12 print:p-0"
    >
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-center print:hidden border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-850 dark:text-white">Credenciales QR de Asistencia para el Aula</h2>
            <p class="text-xs text-slate-400">Listas para imprimir y recortar para el control de asistencia diario</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="handlePrint"
              type="button"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Imprimir Tarjetas
            </button>
            <button
              @click="$emit('close')"
              type="button"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        <!-- Sheet Grid of QR Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div
            v-for="s in students"
            :key="s.id"
            class="p-4 bg-white text-slate-900 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-between text-center print:border-slate-400"
          >
            <div class="flex items-center gap-2 mb-2">
              <img src="/logocolegio.png" alt="Logo" class="w-6 h-6 object-contain" />
              <span class="text-[10px] font-black uppercase">U.E Santa Luisa</span>
            </div>
            <h4 class="font-bold text-xs leading-tight mb-1">{{ s.first_name }} {{ s.last_name }}</h4>
            <p class="text-[10px] text-slate-500 font-mono mb-2">Cód: {{ s.student_id || `EST-${s.id}` }}</p>

            <ui-qr-code
              :value="s.student_id || `EST-${s.id}`"
              :size="80"
            />
            <span class="text-[9px] font-semibold text-slate-400 mt-2">Control Asistencia QR</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  students: { type: Array, default: () => [] }
})

defineEmits(['close'])

const handlePrint = () => {
  window.print()
}
</script>
