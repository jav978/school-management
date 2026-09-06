<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
          Control de Asistencia
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Registro diario de asistencia, tardanzas e inasistencias justificadas por aula
        </p>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <!-- QR Attendance Scanner Button -->
        <button
          @click="openQrScannerModal"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 active:scale-[0.98]"
        >
          <span>📷 Escanear QR</span>
        </button>

        <!-- Printable Student QR Cards Button -->
        <button
          v-if="students.length > 0"
          @click="openPrintableQrModal"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200"
        >
          <span>🪪 Tarjetas QR</span>
        </button>

        <!-- Mark all present -->
        <button
          v-if="students.length > 0"
          @click="markAllPresent"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 active:scale-[0.98]"
        >
          <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Todos Presentes</span>
        </button>

        <!-- Save Button -->
        <button
          @click="saveAttendance"
          :disabled="isSaving || students.length === 0"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
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
      </div>
    </div>

    <!-- Controls Bar: Classroom & Date Selection -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <!-- Class Selector -->
        <div class="flex-1 min-w-[240px]">
          <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Aula / Clase
          </label>
          <div class="relative">
            <select
              v-model="selectedClassId"
              @change="onClassChange"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none pr-9 cursor-pointer transition-all"
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
              v-model="selectedDate"
              @change="onDateChange"
              type="date"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Quick Date Jump Buttons -->
      <div class="flex items-center gap-1.5 self-end md:self-center pt-2 md:pt-4">
        <button
          @click="setDateToday"
          type="button"
          :class="isToday ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
        >
          Hoy
        </button>
        <button
          @click="setDateYesterday"
          type="button"
          :class="isYesterday ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
        >
          Ayer
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Alumnos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Matrícula Total</p>
          <p class="text-3xl font-black font-display text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">{{ students.length }}</p>
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
            <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">{{ presentCount }}</p>
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
          <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1 leading-tight tracking-tight">{{ absentCount }}</p>
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
            <p class="text-3xl font-black font-display text-amber-500 leading-tight tracking-tight">{{ lateCount }}</p>
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

    <!-- Student Attendance Roster Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
      <!-- Card Subheader with Filter and Search -->
      <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por estudiante o código..."
            class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>

        <!-- Filter Status Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            v-for="statusFilter in statusFilters"
            :key="statusFilter.value"
            @click="activeStatusFilter = statusFilter.value"
            type="button"
            :class="activeStatusFilter === statusFilter.value 
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700/80'"
            class="px-2.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors"
          >
            {{ statusFilter.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 mb-3 animate-spin">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando lista de estudiantes...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredStudents.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-750 dark:text-white">No se encontraron estudiantes</h3>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
          No hay estudiantes matriculados en esta sección o no coinciden con los filtros aplicados.
        </p>
      </div>

      <!-- Table of Students -->
      <div v-else class="overflow-x-auto">
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
              v-for="student in filteredStudents"
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
                    <p class="text-xs sm:text-sm font-bold text-slate-850 dark:text-white truncate">
                      {{ student.last_name }}, {{ student.first_name }}
                    </p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        {{ student.student_id || 'SIN-COD' }}
                      </span>
                      <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span class="text-[10px] text-slate-400 dark:text-slate-500">
                        {{ student.gender === 'female' ? 'Femenino' : 'Masculino' }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Attendance State Selector Buttons -->
              <td class="py-3.5 px-4 text-center">
                <div class="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
                  <!-- Presente -->
                  <button
                    @click="setStudentStatus(student, 'present')"
                    type="button"
                    :class="student.attendance_status === 'present' 
                      ? 'bg-emerald-500 text-white font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1"
                    title="Presente"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="hidden sm:inline">Presente</span>
                  </button>

                  <!-- Ausente -->
                  <button
                    @click="setStudentStatus(student, 'absent')"
                    type="button"
                    :class="student.attendance_status === 'absent' 
                      ? 'bg-rose-500 text-white font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1"
                    title="Ausente"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span class="hidden sm:inline">Ausente</span>
                  </button>

                  <!-- Tardanza -->
                  <button
                    @click="setStudentStatus(student, 'late')"
                    type="button"
                    :class="student.attendance_status === 'late' 
                      ? 'bg-amber-500 text-white font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1"
                    title="Tardanza"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="hidden sm:inline">Tarde</span>
                  </button>

                  <!-- Justificado -->
                  <button
                    @click="openJustifyModal(student, $event)"
                    type="button"
                    :class="student.attendance_status === 'excused' 
                      ? 'bg-sky-500 text-white font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1"
                    title="Justificado"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="hidden sm:inline">Justificado</span>
                  </button>
                </div>
              </td>

              <!-- Delay minutes or status detail -->
              <td class="py-3.5 px-4 hidden md:table-cell">
                <div v-if="student.attendance_status === 'late'" class="flex items-center gap-1.5">
                  <span class="text-xs text-slate-500">Demora:</span>
                  <select
                    v-model="student.minutes_late"
                    class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-lg px-2 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 focus:outline-none"
                  >
                    <option :value="5">5 min</option>
                    <option :value="10">10 min</option>
                    <option :value="15">15 min</option>
                    <option :value="20">20 min</option>
                    <option :value="30">30 min</option>
                    <option :value="45">45 min</option>
                  </select>
                </div>
                <div v-else-if="student.attendance_status === 'excused'" class="flex items-center gap-1">
                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ student.excuse_reason ? student.excuse_reason.slice(0, 18) : 'Justificado' }}
                  </span>
                </div>
                <div v-else-if="student.attendance_status === 'absent'" class="text-xs text-rose-500 font-semibold">
                  Sin justificar
                </div>
                <div v-else class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  A tiempo
                </div>
              </td>

              <!-- Notes Input -->
              <td class="py-3.5 px-4 sm:px-6">
                <input
                  v-model="student.notes"
                  type="text"
                  placeholder="Nota u observación opcional..."
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Standardized Modal: Justificación de Inasistencia -->
    <Teleport to="body">
      <div 
        v-if="isJustifyModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        @click.self="closeJustifyModal"
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
                  {{ justifyingStudent ? `${justifyingStudent.first_name} ${justifyingStudent.last_name}` : '' }}
                </p>
              </div>
            </div>
            <button 
              @click="closeJustifyModal" 
              type="button"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Scrollable Content -->
          <form @submit.prevent="saveJustification" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Reason Type -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Motivo de Inasistencia *
              </label>
              <select
                v-model="justifyForm.reasonType"
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
                v-model="justifyForm.reason"
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
                v-model="justifyForm.document"
                type="text"
                placeholder="Ej. Certificado Médico N° 48291"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </form>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="closeJustifyModal"
              type="button"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              ✕ Cancelar
            </button>
            <button
              @click="saveJustification"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/20 active:scale-[0.98] transition-all"
            >
              Aplicar Justificación
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- QR Attendance Scanner Modal -->
    <Teleport to="body">
      <div 
        v-if="isQrScannerOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl mx-auto">
            📷
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-850 dark:text-white">Escáner de Asistencia QR</h3>
            <p class="text-xs text-slate-400 mt-1">Escanea el código QR del carnet o ingresa el código del estudiante.</p>
          </div>

          <div class="relative">
            <input 
              v-model="qrInput" 
              @keyup.enter="processQrInput"
              ref="qrInputRef"
              placeholder="Ej: STU-001 o V-32456789..."
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center font-mono text-sm font-bold focus:ring-2 focus:ring-indigo-500 text-slate-850 dark:text-white"
            />
            <button 
              @click="processQrInput"
              class="absolute right-2 top-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Registrar
            </button>
          </div>

          <div v-if="lastScannedStudent" class="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
            ✓ {{ lastScannedStudent.first_name }} {{ lastScannedStudent.last_name }} registrado como PRESENTE
          </div>

          <div class="flex justify-end pt-2">
            <button 
              @click="isQrScannerOpen = false"
              class="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cerrar Escáner
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Printable QR Badges Modal -->
    <Teleport to="body">
      <div 
        v-if="isPrintableQrOpen"
        class="fixed inset-0 z-50 bg-white dark:bg-slate-950 overflow-y-auto p-6 sm:p-12 print:p-0"
      >
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="flex justify-between items-center print:hidden border-b pb-4">
            <div>
              <h2 class="text-xl font-bold text-slate-850 dark:text-white">Credenciales QR de Asistencia para el Aula</h2>
              <p class="text-xs text-slate-400">Listas para imprimir y recortar para el control de asistencia diario</p>
            </div>
            <div class="flex items-center gap-3">
              <button 
                @click="windowPrint" 
                class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Imprimir Tarjetas
              </button>
              <button 
                @click="isPrintableQrOpen = false" 
                class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const nuxtApp = useNuxtApp()

// State
const classes = ref([])
const selectedClassId = ref(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const students = ref([])
const search = ref('')
const activeStatusFilter = ref('all') // 'all' | 'present' | 'absent' | 'late' | 'excused'
const isLoading = ref(false)
const isSaving = ref(false)
const toastMessage = ref('')

// Modal state
const isJustifyModalOpen = ref(false)
const justifyingStudent = ref(null)
const justifyForm = ref({
  reasonType: 'Motivo de Salud / Médico',
  reason: '',
  document: ''
})

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const statusFilters = [
  { label: 'Todos', value: 'all' },
  { label: 'Presentes', value: 'present' },
  { label: 'Ausentes', value: 'absent' },
  { label: 'Tardanzas', value: 'late' },
  { label: 'Justificados', value: 'excused' }
]

// Date helpers
const todayStr = new Date().toISOString().split('T')[0]
const isToday = computed(() => selectedDate.value === todayStr)

const yesterdayDate = new Date()
yesterdayDate.setDate(yesterdayDate.getDate() - 1)
const yesterdayStr = yesterdayDate.toISOString().split('T')[0]
const isYesterday = computed(() => selectedDate.value === yesterdayStr)

const setDateToday = () => {
  selectedDate.value = todayStr
  onDateChange()
}

const setDateYesterday = () => {
  selectedDate.value = yesterdayStr
  onDateChange()
}

// KPI Computeds
const presentCount = computed(() => students.value.filter(s => s.attendance_status === 'present').length)
const absentCount = computed(() => students.value.filter(s => s.attendance_status === 'absent').length)
const lateCount = computed(() => students.value.filter(s => s.attendance_status === 'late').length)
const excusedCount = computed(() => students.value.filter(s => s.attendance_status === 'excused').length)

const attendanceRate = computed(() => {
  if (students.value.length === 0) return 0
  const rate = ((presentCount.value + lateCount.value) / students.value.length) * 100
  return Math.round(rate)
})

// Filtered student roster
const filteredStudents = computed(() => {
  let list = students.value

  if (activeStatusFilter.value !== 'all') {
    list = list.filter(s => s.attendance_status === activeStatusFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(s => 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
      (s.student_id && s.student_id.toLowerCase().includes(q))
    )
  }

  return list
})

const getInitials = (student) => {
  const f = student.first_name ? student.first_name[0] : ''
  const l = student.last_name ? student.last_name[0] : ''
  return (f + l).toUpperCase() || 'AL'
}

// Student Status Switcher
const setStudentStatus = (student, status) => {
  student.attendance_status = status
  if (status === 'present') {
    student.minutes_late = 0
  } else if (status === 'late' && (!student.minutes_late || student.minutes_late === 0)) {
    student.minutes_late = 15
  }
}

const markAllPresent = () => {
  students.value.forEach(s => {
    s.attendance_status = 'present'
    s.minutes_late = 0
  })
  showToast('Todos los estudiantes marcados como presentes')
}

// Justification Modal
const openJustifyModal = (student, event) => {
  if (event && event.clientX && event.clientY) {
    triggerOrigin.value = {
      x: Math.round((event.clientX / window.innerWidth) * 100),
      y: Math.round((event.clientY / window.innerHeight) * 100)
    }
  } else {
    triggerOrigin.value = { x: 50, y: 50 }
  }

  justifyingStudent.value = student
  justifyForm.value = {
    reasonType: 'Motivo de Salud / Médico',
    reason: student.excuse_reason || '',
    document: student.excuse_document || ''
  }
  isJustifyModalOpen.value = true
}

const closeJustifyModal = () => {
  isJustifyModalOpen.value = false
  justifyingStudent.value = null
}

const saveJustification = () => {
  if (!justifyingStudent.value) return
  const fullReason = `${justifyForm.value.reasonType}: ${justifyForm.value.reason}`
  justifyingStudent.value.attendance_status = 'excused'
  justifyingStudent.value.excuse_reason = fullReason
  justifyingStudent.value.excuse_document = justifyForm.value.document
  justifyingStudent.value.is_excused = true
  closeJustifyModal()
  showToast('Justificación aplicada')
}

// API Data Fetching
const fetchClasses = async () => {
  try {
    const res = await nuxtApp.$api.service('classes').find({
      query: {
        is_deleted: false,
        $sort: { id: 1 },
        $limit: 50
      }
    })
    classes.value = res.data || res || []
    if (classes.value.length > 0 && !selectedClassId.value) {
      selectedClassId.value = classes.value[0].id
    }
  } catch (error) {
    console.error('Error fetching classes:', error)
  }
}

const fetchStudentsAndAttendance = async () => {
  if (!selectedClassId.value) return
  isLoading.value = true
  try {
    // 1. Fetch Students in class
    const studentsRes = await nuxtApp.$api.service('students').find({
      query: {
        current_class_id: selectedClassId.value,
        is_deleted: false,
        $sort: { last_name: 1, first_name: 1 },
        $limit: 100
      }
    })
    const loadedStudents = studentsRes.data || studentsRes || []

    // 2. Fetch existing attendance for this class and date
    let existingAttendance = []
    try {
      const attendRes = await nuxtApp.$api.service('attendance').find({
        query: {
          class_id: selectedClassId.value,
          attendance_date: selectedDate.value,
          is_deleted: false,
          $limit: 100
        }
      })
      existingAttendance = attendRes.data || attendRes || []
    } catch (e) {
      console.warn('Attendance query fallback:', e)
    }

    // Map existing attendance onto students
    const attendMap = new Map()
    existingAttendance.forEach(a => {
      attendMap.set(Number(a.student_id), a)
    })

    students.value = loadedStudents.map(s => {
      const record = attendMap.get(Number(s.id))
      return {
        ...s,
        attendance_status: record ? record.status : 'present',
        notes: record ? (record.notes || '') : '',
        minutes_late: record ? (record.minutes_late || 0) : 0,
        excuse_reason: record ? (record.excuse_reason || '') : '',
        excuse_document: record ? (record.excuse_document || '') : '',
        attendance_id: record ? record.id : null
      }
    })
  } catch (error) {
    console.error('Error fetching attendance roster:', error)
    showToast('Error al cargar la lista de estudiantes')
  } finally {
    isLoading.value = false
  }
}

const onClassChange = () => {
  fetchStudentsAndAttendance()
}

const onDateChange = () => {
  fetchStudentsAndAttendance()
}

// Save Attendance Batch
const saveAttendance = async () => {
  if (!selectedClassId.value || students.value.length === 0) return
  isSaving.value = true
  try {
    const payload = {
      records: students.value.map(s => ({
        student_id: s.id,
        class_id: selectedClassId.value,
        attendance_date: selectedDate.value,
        status: s.attendance_status,
        minutes_late: s.attendance_status === 'late' ? (s.minutes_late || 15) : 0,
        notes: s.notes || null,
        excuse_reason: s.attendance_status === 'excused' ? s.excuse_reason : null,
        excuse_document: s.attendance_status === 'excused' ? s.excuse_document : null,
        is_excused: s.attendance_status === 'excused'
      }))
    }

    await nuxtApp.$api.service('attendance').create(payload)
    showToast('Asistencia guardada exitosamente')
    await fetchStudentsAndAttendance()
  } catch (error) {
    console.error('Error saving attendance:', error)
    showToast(error.message || 'Error al guardar la asistencia')
  } finally {
    isSaving.value = false
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// QR Attendance Scanner Logic
const isQrScannerOpen = ref(false)
const qrInput = ref('')
const qrInputRef = ref(null)
const lastScannedStudent = ref(null)

const openQrScannerModal = () => {
  qrInput.value = ''
  lastScannedStudent.value = null
  isQrScannerOpen.value = true
  setTimeout(() => {
    if (qrInputRef.value) qrInputRef.value.focus()
  }, 150)
}

const processQrInput = () => {
  const query = qrInput.value.trim().toLowerCase()
  if (!query) return

  const student = students.value.find(s => 
    (s.student_id && s.student_id.toLowerCase().includes(query)) ||
    (s.national_id && s.national_id.toLowerCase().includes(query)) ||
    (s.id_card && s.id_card.toLowerCase().includes(query)) ||
    (`${s.first_name} ${s.last_name}`).toLowerCase().includes(query) ||
    String(s.id) === query
  )

  if (student) {
    student.attendance_status = 'present'
    lastScannedStudent.value = student
    showToast(`Asistencia registrada: ${student.first_name} ${student.last_name}`)
    qrInput.value = ''
  } else {
    showToast('Estudiante no encontrado en esta sección')
  }
}

// Printable Student QR Cards Logic
const isPrintableQrOpen = ref(false)
const openPrintableQrModal = () => {
  isPrintableQrOpen.value = true
}

const windowPrint = () => {
  window.print()
}

onMounted(async () => {
  await fetchClasses()
  await fetchStudentsAndAttendance()
})
</script>
