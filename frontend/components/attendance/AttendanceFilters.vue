<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
      <!-- Class Selector -->
      <div class="flex-1 min-w-[240px]">
        <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          Aula / Clase
        </label>
        <div class="relative">
          <select
            :value="selectedClassId"
            data-testid="select-attendance-class"
            @change="$emit('update:class-id', Number($event.target.value))"
            :disabled="isParent"
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none pr-9 transition-all"
            :class="isParent ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'"
          >
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }} (Sección {{ cls.section || 'A' }})
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Date Picker -->
      <div class="min-w-[190px]">
        <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          Fecha de Registro
        </label>
        <div class="relative">
          <input
            :value="selectedDate"
            data-testid="input-attendance-date"
            @change="$emit('update:date', $event.target.value)"
            type="date"
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Quick Date Jump Buttons -->
    <div class="flex items-center gap-1.5 self-end md:self-center pt-2 md:pt-4">
      <button
        @click="$emit('set-today')"
        type="button"
        :class="isToday ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
      >
        Hoy
      </button>
      <button
        @click="$emit('set-yesterday')"
        type="button"
        :class="isYesterday ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
      >
        Ayer
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  classes: { type: Array, default: () => [] },
  selectedClassId: { type: [Number, String], default: null },
  selectedDate: { type: String, default: '' },
  isParent: { type: Boolean, default: false },
  isToday: { type: Boolean, default: false },
  isYesterday: { type: Boolean, default: false }
})

defineEmits(['update:class-id', 'update:date', 'set-today', 'set-yesterday'])
</script>
