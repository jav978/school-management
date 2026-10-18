<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <th class="py-3.5 px-4 sm:px-6">Estudiante</th>
          <th class="py-3.5 px-4 text-center">Estado de Asistencia</th>
          <th class="py-3.5 px-4 hidden md:table-cell">Detalle / Tardanza</th>
          <th class="py-3.5 px-4 sm:px-6">Observación</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
        <tr
          v-for="student in students"
          :key="student.id"
          class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
        >
          <!-- Student Profile -->
          <td class="py-3.5 px-4 sm:px-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {{ getInitials(student) }}
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                  {{ student.last_name }}, {{ student.first_name }}
                </p>
                <p class="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {{ student.student_id || 'SIN-COD' }} • {{ student.gender === 'female' ? 'F' : 'M' }}
                </p>
              </div>
            </div>
          </td>

          <!-- Attendance Status Toggle Buttons -->
          <td class="py-3.5 px-4">
            <!-- Read-only View for Parents or Students -->
            <div v-if="!canManage" class="flex justify-center">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border"
                :class="{
                  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30': student.attendance_status === 'present',
                  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30': student.attendance_status === 'late',
                  'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30': student.attendance_status === 'absent',
                  'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30': student.attendance_status === 'excused'
                }"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="{
                  'bg-emerald-500': student.attendance_status === 'present',
                  'bg-amber-500': student.attendance_status === 'late',
                  'bg-rose-500': student.attendance_status === 'absent',
                  'bg-sky-500': student.attendance_status === 'excused'
                }"></span>
                {{ student.attendance_status === 'present' ? 'Presente' : student.attendance_status === 'late' ? 'Tarde' : student.attendance_status === 'absent' ? 'Ausente' : 'Justificado' }}
              </span>
            </div>

            <!-- Management Buttons for Teachers / Admins -->
            <div v-else class="flex items-center justify-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/60 dark:border-white/10 max-w-fit mx-auto">
              <!-- Present -->
              <button
                data-testid="status-present"
                @click="$emit('status-change', student, 'present')"
                type="button"
                :class="student.attendance_status === 'present' 
                  ? 'bg-emerald-500 text-white shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                title="Presente"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span class="hidden sm:inline">Presente</span>
              </button>

              <!-- Late -->
              <button
                data-testid="status-late"
                @click="$emit('status-change', student, 'late')"
                type="button"
                :class="student.attendance_status === 'late' 
                  ? 'bg-amber-500 text-white shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                title="Tardanza"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="hidden sm:inline">Tarde</span>
              </button>

              <!-- Absent -->
              <button
                data-testid="status-absent"
                @click="$emit('status-change', student, 'absent')"
                type="button"
                :class="student.attendance_status === 'absent' 
                  ? 'bg-rose-500 text-white shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                title="Ausente"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="hidden sm:inline">Ausente</span>
              </button>

              <!-- Excused / Justified -->
              <button
                data-testid="status-excused"
                @click="$emit('justify', student, $event)"
                type="button"
                :class="student.attendance_status === 'excused' 
                  ? 'bg-sky-500 text-white shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                title="Justificada"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="hidden sm:inline">Justif.</span>
              </button>
            </div>
          </td>

          <!-- Details / Minutes Late -->
          <td class="py-3.5 px-4 hidden md:table-cell">
            <div v-if="student.attendance_status === 'late' && canManage" class="flex items-center gap-1.5">
              <select
                v-model="student.minutes_late"
                class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 focus:outline-none"
              >
                <option :value="5">5 min</option>
                <option :value="10">10 min</option>
                <option :value="15">15 min</option>
                <option :value="20">20 min</option>
                <option :value="30">30 min</option>
                <option :value="45">45 min</option>
              </select>
            </div>
            <div v-else-if="student.attendance_status === 'excused'" class="text-xs text-sky-600 dark:text-sky-400 font-medium truncate max-w-[150px]" :title="student.excuse_reason">
              📄 {{ student.excuse_reason || 'Justificación registrada' }}
            </div>
            <span v-else class="text-xs text-slate-300 dark:text-slate-600">—</span>
          </td>

          <!-- Observation / Notes Input -->
          <td class="py-3.5 px-4 sm:px-6">
            <span v-if="!canManage" class="text-xs text-slate-500 dark:text-slate-400">
              {{ student.notes || 'Sin observaciones' }}
            </span>
            <input
              v-else
              v-model="student.notes"
              type="text"
              placeholder="Observación..."
              class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            />
          </td>
        </tr>
      </tbody>
    </table>
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
