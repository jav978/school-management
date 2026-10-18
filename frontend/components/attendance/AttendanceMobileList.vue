<template>
  <div class="divide-y divide-slate-100 dark:divide-white/10">
    <div
      v-for="student in students"
      :key="'mob-att-' + student.id"
      class="p-4 space-y-3 bg-white dark:bg-[#170f33] transition-colors"
    >
      <!-- Student Header -->
      <div class="flex items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
            {{ getInitials(student) }}
          </div>
          <div class="min-w-0">
            <p class="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
              {{ student.last_name }}, {{ student.first_name }}
            </p>
            <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {{ student.student_id || 'SIN-COD' }} • {{ student.gender === 'female' ? 'F' : 'M' }}
            </p>
          </div>
        </div>

        <!-- Current Status Badge (When parent or view only) -->
        <span
          v-if="!canManage"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border flex-shrink-0"
          :class="{
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30': student.attendance_status === 'present',
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30': student.attendance_status === 'late',
            'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30': student.attendance_status === 'absent',
            'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30': student.attendance_status === 'excused'
          }"
        >
          {{ student.attendance_status === 'present' ? 'Presente' : student.attendance_status === 'late' ? 'Tarde' : student.attendance_status === 'absent' ? 'Ausente' : 'Justificado' }}
        </span>
      </div>

      <!-- Quick Touch Action Buttons (min-h-[44px]) -->
      <div v-if="canManage" class="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/60 dark:border-white/10">
        <!-- Presente -->
        <button
          @click="$emit('status-change', student, 'present')"
          type="button"
          class="min-h-[44px] rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all cursor-pointer active:scale-95"
          :class="student.attendance_status === 'present'
            ? 'bg-emerald-500 text-white shadow-xs font-black'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
        >
          <svg class="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Presente</span>
        </button>

        <!-- Ausente -->
        <button
          @click="$emit('status-change', student, 'absent')"
          type="button"
          class="min-h-[44px] rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all cursor-pointer active:scale-95"
          :class="student.attendance_status === 'absent'
            ? 'bg-rose-500 text-white shadow-xs font-black'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
        >
          <svg class="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Ausente</span>
        </button>

        <!-- Tarde -->
        <button
          @click="$emit('status-change', student, 'late')"
          type="button"
          class="min-h-[44px] rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all cursor-pointer active:scale-95"
          :class="student.attendance_status === 'late'
            ? 'bg-amber-500 text-white shadow-xs font-black'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
        >
          <svg class="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Tarde</span>
        </button>

        <!-- Justificado -->
        <button
          @click="$emit('justify', student, $event)"
          type="button"
          class="min-h-[44px] rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all cursor-pointer active:scale-95"
          :class="student.attendance_status === 'excused'
            ? 'bg-sky-500 text-white shadow-xs font-black'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
        >
          <svg class="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Justif.</span>
        </button>
      </div>

      <!-- Extra Late Minutes if late -->
      <div v-if="canManage && student.attendance_status === 'late'" class="flex items-center gap-2 pt-1">
        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Demora:</span>
        <select
          v-model="student.minutes_late"
          class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 focus:outline-none"
        >
          <option :value="5">5 minutos</option>
          <option :value="10">10 minutos</option>
          <option :value="15">15 minutos</option>
          <option :value="20">20 minutos</option>
          <option :value="30">30 minutos</option>
          <option :value="45">45 minutos</option>
        </select>
      </div>

      <!-- Note Input on Mobile -->
      <div v-if="canManage">
        <input
          v-model="student.notes"
          type="text"
          placeholder="Observación opcional..."
          class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  students: { type: Array, default: () => [] },
  canManage: { type: Boolean, default: false }
})

defineEmits(['status-change', 'justify'])

const getInitials = (student) => {
  const f = student?.first_name ? student.first_name[0] : ''
  const l = student?.last_name ? student.last_name[0] : ''
  return (f + l).toUpperCase() || 'AL'
}
</script>
