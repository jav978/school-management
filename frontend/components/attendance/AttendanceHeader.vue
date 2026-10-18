<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-brand-purple/20 flex items-center justify-center text-indigo-600 dark:text-brand-gold border border-indigo-500/20 dark:border-brand-purple/40 text-xl shadow-xs">
          📋
        </div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Control de Asistencia
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Registro diario de asistencia, tardanzas e inasistencias justificadas por aula
      </p>
    </div>

    <div class="flex items-center gap-2.5 flex-wrap">
      <!-- Active child indicator for parents -->
      <div v-if="isParent && activeStudent" class="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-xs">
        <span class="text-base">{{ isCarlos ? '👦' : '👧' }}</span>
        <div>
          <span class="font-extrabold text-slate-800 dark:text-slate-100">{{ activeStudent.full_name }}</span>
          <span class="text-[10px] text-amber-700 dark:text-brand-gold font-bold ml-1.5">{{ activeStudent.grade }}</span>
        </div>
      </div>

      <template v-if="canManage">
        <!-- QR Attendance Scanner Button -->
        <button
          @click="$emit('scan-qr')"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>📷 Escanear QR</span>
        </button>

        <!-- Printable Student QR Cards Button -->
        <button
          v-if="studentsCount > 0"
          @click="$emit('print-qr')"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 cursor-pointer"
        >
          <span>🪪 Tarjetas QR</span>
        </button>

        <!-- Mark all present -->
        <button
          v-if="studentsCount > 0"
          data-testid="btn-mark-all-present"
          @click="$emit('mark-all-present')"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Todos Presentes</span>
        </button>

        <!-- Save Button -->
        <button
          data-testid="btn-save-attendance"
          @click="$emit('save')"
          :disabled="isSaving || studentsCount === 0"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>{{ isSaving ? 'Guardando...' : 'Guardar Asistencia' }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  canManage: { type: Boolean, default: false },
  isParent: { type: Boolean, default: false },
  activeStudent: { type: Object, default: null },
  isCarlos: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  studentsCount: { type: Number, default: 0 }
})

defineEmits(['scan-qr', 'print-qr', 'mark-all-present', 'save'])
</script>
