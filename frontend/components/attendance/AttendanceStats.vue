<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Alumnos -->
    <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
      <div class="flex flex-col justify-center">
        <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Matrícula Total</p>
        <p class="text-3xl font-black font-display text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">
          {{ totalStudents }}
        </p>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    </div>

    <!-- Presentes -->
    <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
      <div class="flex flex-col justify-center">
        <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Presentes</p>
        <div class="flex items-baseline gap-2 mt-1">
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">
            {{ presentCount }}
          </p>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
            {{ attendanceRate }}%
          </span>
        </div>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <!-- Ausentes -->
    <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
      <div class="flex flex-col justify-center">
        <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ausencias</p>
        <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1 leading-tight tracking-tight">
          {{ absentCount }}
        </p>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <!-- Tardanzas y Justificados -->
    <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
      <div class="flex flex-col justify-center">
        <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tardanzas / Justif.</p>
        <div class="flex items-baseline gap-2 mt-1">
          <p class="text-3xl font-black font-display text-amber-500 leading-tight tracking-tight">
            {{ lateCount }}
          </p>
          <span class="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md">
            {{ excusedCount }} Just.
          </span>
        </div>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalStudents: { type: Number, default: 0 },
  presentCount: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 0 },
  absentCount: { type: Number, default: 0 },
  lateCount: { type: Number, default: 0 },
  excusedCount: { type: Number, default: 0 }
})
</script>
