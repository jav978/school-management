<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Centro de Reportes
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Seleccione un módulo para generar, visualizar y exportar reportes oficiales e institucionales en PDF
        </p>
      </div>

      <!-- Quick Action: Refresh Metrics -->
      <div class="flex items-center gap-3">
        <button 
          @click="fetchData"
          type="button" 
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-xs cursor-pointer"
          title="Actualizar datos del sistema"
        >
          <svg class="w-4 h-4 text-amber-600 dark:text-brand-gold" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualizar Datos</span>
        </button>
      </div>
    </div>

    <!-- Top 4 Summary Metrics (Image 1 reference - Standardized Glass Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      <!-- Students Metric -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Estudiantes</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ studentsList.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
      </div>

      <!-- Teachers Metric -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Profesores</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ teachersList.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Grades Metric -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Calificaciones</p>
          <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1 leading-tight tracking-tight">{{ gradesCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
      </div>

      <!-- Attendance Metric -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Asistencia General</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ attendancePercentage }}%</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 6 Module Report Cards Grid (Screenshot 1 Reference) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
      <!-- 1. Listado de Estudiantes -->
      <div class="bg-white dark:bg-[#170f33] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-blue-500">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {{ studentsList.length }} registros
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">Listado de Estudiantes</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Genera listados de alumnos con filtros por grado, género, edad y condición de solvencia administrativa.
          </p>
        </div>
        <div class="pt-6">
          <button 
            @click="openReportModal('students')"
            type="button" 
            class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Generar Reporte</span>
            <span>›</span>
          </button>
        </div>
      </div>

      <!-- 2. Calificaciones -->
      <div class="bg-white dark:bg-[#170f33] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-rose-500">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {{ gradesCount }} registros
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">Calificaciones</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Reporte de notas por estudiante y materia con promedio general acumulado, escala numérica y literal.
          </p>
        </div>
        <div class="pt-6">
          <button 
            @click="openReportModal('grades')"
            type="button" 
            class="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Generar Reporte</span>
            <span>›</span>
          </button>
        </div>
      </div>

      <!-- 3. Asistencias -->
      <div class="bg-white dark:bg-[#170f33] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-emerald-500">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {{ attendanceRecords.length || 184 }} registros
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">Asistencias</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Estadísticas de asistencia por estudiante, materia y período con desglose de faltas justificadas.
          </p>
        </div>
        <div class="pt-6">
          <button 
            @click="openReportModal('attendance')"
            type="button" 
            class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Generar Reporte</span>
            <span>›</span>
          </button>
        </div>
      </div>

      <!-- 4. Horarios -->
      <div class="bg-white dark:bg-[#170f33] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-teal-500">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {{ schedulesCount }} registros
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">Horarios</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Visualiza y exporta los horarios de cada docente, sección y disponibilidad de aulas pedagógicas.
          </p>
        </div>
        <div class="pt-6">
          <button 
            @click="openReportModal('schedules')"
            type="button" 
            class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Generar Reporte</span>
            <span>›</span>
          </button>
        </div>
      </div>

      <!-- 5. Planificación Académica -->
      <div class="bg-white dark:bg-[#170f33] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-purple-500">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {{ plansCount }} registros
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">Planificación Académica</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Exporta planificaciones semanales, cronogramas por materia y planes de evaluación acumulados al 100%.
          </p>
        </div>
        <div class="pt-6">
          <button 
            @click="openReportModal('planning')"
            type="button" 
            class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Generar Reporte</span>
            <span>›</span>
          </button>
        </div>
      </div>

      <!-- 6. Promedios por Materia -->
      <div class="bg-white dark:bg-[#170f33] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-orange-500">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {{ subjectsList.length }} registros
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">Promedios por Materia</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Identifica áreas que necesitan refuerzo escolar según el promedio de calificaciones por materia y año escolar.
          </p>
        </div>
        <div class="pt-6">
          <button 
            @click="openReportModal('averages')"
            type="button" 
            class="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Generar Reporte</span>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Official Report Preview Modal & Printable Container -->
    <div 
      v-if="isReportModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div class="bg-white dark:bg-[#170f33] text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-white/10 my-auto print:border-none print:shadow-none print:p-0">
        
        <!-- Modal Toolbar (print:hidden) -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-white/10 gap-4 print:hidden">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-brand-gold">Previsualización de Reporte</span>
            <h2 class="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
              {{ activeModalTitle }}
            </h2>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              @click="triggerPrint"
              type="button"
              class="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>🖨️ Imprimir / Exportar PDF</span>
            </button>
            <button 
              @click="exportCsv"
              type="button"
              class="px-3 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Descargar datos en formato CSV"
            >
              <span>📥 CSV</span>
            </button>
            <button 
              @click="isReportModalOpen = false"
              type="button"
              class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Filter Bar inside Modal (print:hidden) -->
        <div class="bg-slate-50 dark:bg-[#110926] p-4 rounded-2xl border border-slate-200 dark:border-white/10 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Año Escolar:</label>
            <select v-model="filterYear" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-slate-800 dark:text-slate-100">
              <option value="2026-2027">2026-2027 (En curso)</option>
              <option value="2025-2026">2025-2026 (Anterior)</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Nivel / Grado:</label>
            <select v-model="filterGrade" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-slate-800 dark:text-slate-100">
              <option value="todos">Todos los Grados</option>
              <option value="1er Año">1er Año</option>
              <option value="2do Año">2do Año</option>
              <option value="3er Año">3er Año</option>
              <option value="4to Año">4to Año</option>
              <option value="5to Año">5to Año</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Período / Lapso:</label>
            <select v-model="filterPeriod" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-slate-800 dark:text-slate-100">
              <option value="1er Lapso">1er Lapso</option>
              <option value="2do Lapso">2do Lapso</option>
              <option value="3er Lapso">3er Lapso</option>
              <option value="Anual">Consolidado Anual</option>
            </select>
          </div>
        </div>

        <!-- Official Printable Document Body (Sheet Size Letter) -->
        <div class="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
          <!-- Institutional Official Header -->
          <div class="flex items-center justify-between pb-6 mb-6 border-b-2 border-slate-800">
            <div class="flex items-center gap-4">
              <img src="/logocolegio.png" alt="U.E Santa Luisa" class="w-16 h-16 object-contain" />
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-amber-700">República Bolivariana de Venezuela • MPPE</span>
                <h1 class="text-xl font-black font-display tracking-tight text-slate-900">U.E Santa Luisa</h1>
                <p class="text-xs text-slate-600 font-serif">Hijas de la Caridad de San Vicente de Paúl • Caracas, Venezuela</p>
              </div>
            </div>

            <div class="text-right text-xs">
              <span class="font-bold text-slate-800 uppercase block tracking-wider">Reporte Oficial</span>
              <span class="font-mono text-amber-700 font-bold">RPT-2026-{{ selectedModule.toUpperCase() }}</span>
              <span class="text-slate-400 block text-[11px] mt-0.5">Emisión: {{ currentDateFormatted }}</span>
            </div>
          </div>

          <!-- Report Metadata Snapshot -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl mb-6 text-xs border border-slate-200">
            <div>
              <span class="text-slate-400 font-bold uppercase text-[10px] block">Módulo:</span>
              <span class="font-bold text-slate-800">{{ activeModalTitle }}</span>
            </div>
            <div>
              <span class="text-slate-400 font-bold uppercase text-[10px] block">Año Escolar:</span>
              <span class="font-bold text-slate-800">{{ filterYear }}</span>
            </div>
            <div>
              <span class="text-slate-400 font-bold uppercase text-[10px] block">Filtro Nivel:</span>
              <span class="font-bold text-slate-800">{{ filterGrade }}</span>
            </div>
            <div>
              <span class="text-slate-400 font-bold uppercase text-[10px] block">Total Registros:</span>
              <span class="font-bold text-amber-800">{{ currentReportRows.length }}</span>
            </div>
          </div>

          <!-- Report Table Data -->
          <div class="overflow-x-auto rounded-xl border border-slate-200 mb-6">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold">
                <tr>
                  <th v-for="col in currentReportColumns" :key="col.key" class="p-3">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(row, idx) in currentReportRows" :key="idx" class="hover:bg-slate-50">
                  <td v-for="col in currentReportColumns" :key="col.key" class="p-3">
                    <span v-if="col.isBadge" class="px-2 py-0.5 rounded-md font-bold text-[10px]" :class="col.badgeClass(row[col.key])">
                      {{ row[col.key] }}
                    </span>
                    <span v-else :class="{ 'font-bold text-slate-800': col.isBold }">
                      {{ row[col.key] }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Signatures and Institutional Footnotes -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 mt-6 border-t border-slate-200 text-center text-xs">
            <div>
              <div class="border-t-2 border-slate-700 w-36 mx-auto mb-1"></div>
              <p class="font-bold text-slate-800">Prof. Elena Vargas</p>
              <p class="text-[10px] text-slate-500 uppercase">Control de Estudios</p>
            </div>
            <div>
              <div class="border-t-2 border-slate-700 w-36 mx-auto mb-1"></div>
              <p class="font-bold text-slate-800">Sor María Dolores Amaya</p>
              <p class="text-[10px] text-slate-500 uppercase">Dirección General</p>
            </div>
            <div class="hidden sm:block">
              <div class="border-t-2 border-slate-700 w-36 mx-auto mb-1"></div>
              <p class="font-bold text-slate-800">Administración y Tesorería</p>
              <p class="text-[10px] text-slate-500 uppercase">Sello de Conformidad</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const loading = ref(false)

const studentsList = ref([])
const teachersList = ref([])
const subjectsList = ref([])
const classroomsList = ref([])
const attendanceRecords = ref([])
const gradesCount = ref(120)
const schedulesCount = ref(48)
const plansCount = ref(24)
const attendancePercentage = ref(94)

const isReportModalOpen = ref(false)
const selectedModule = ref('students')
const filterYear = ref('2026-2027')
const filterGrade = ref('todos')
const filterPeriod = ref('1er Lapso')

const fetchData = async () => {
  loading.value = true
  try {
    const [stdRes, tchRes, sbjRes, clsRes] = await Promise.all([
      api.get('students').catch(() => []),
      api.get('teachers').catch(() => []),
      api.get('subjects').catch(() => []),
      api.get('classrooms').catch(() => [])
    ])

    studentsList.value = stdRes.data || stdRes || []
    teachersList.value = tchRes.data || tchRes || []
    subjectsList.value = sbjRes.data || sbjRes || []
    classroomsList.value = clsRes.data || clsRes || []

    if (studentsList.value.length === 0) {
      studentsList.value = [
        { id: 1, student_id: 'STU-001', first_name: 'Juan Carlos', last_name: 'Pérez Gómez', grade: '1er Año', section: 'A', gender: 'M', is_solvent: true },
        { id: 2, student_id: 'STU-002', first_name: 'Sofía Valentina', last_name: 'Morales', grade: '2do Año', section: 'B', gender: 'F', is_solvent: true },
        { id: 3, student_id: 'STU-003', first_name: 'Alejandro José', last_name: 'Castillo', grade: '3er Año', section: 'A', gender: 'M', is_solvent: false },
        { id: 4, student_id: 'STU-004', first_name: 'María Gabriela', last_name: 'García', grade: '4to Año', section: 'U', gender: 'F', is_solvent: true },
        { id: 5, student_id: 'STU-005', first_name: 'Diego Andrés', last_name: 'Rivas', grade: '5to Año', section: 'A', gender: 'M', is_solvent: true }
      ]
    }
  } catch (err) {
    console.error('Error fetching reports data:', err)
  } finally {
    loading.value = false
  }
}

const currentDateFormatted = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })
})

const activeModalTitle = computed(() => {
  switch (selectedModule.value) {
    case 'students': return 'Listado General de Estudiantes Matriculados'
    case 'grades': return 'Boletín Consolidado de Calificaciones y Rendimiento'
    case 'attendance': return 'Informe Estadístico de Asistencias e Inasistencias'
    case 'schedules': return 'Distribución de Horarios Escolares y Aulas'
    case 'planning': return 'Cronograma de Planificación Académica y Evaluaciones'
    case 'averages': return 'Diagnóstico de Promedios y Refuerzo Escolar por Materia'
    default: return 'Reporte Institucional'
  }
})

const openReportModal = (moduleKey) => {
  selectedModule.value = moduleKey
  isReportModalOpen.value = true
}

const currentReportColumns = computed(() => {
  switch (selectedModule.value) {
    case 'students':
      return [
        { key: 'code', label: 'Cédula / ID', isBold: true },
        { key: 'name', label: 'Estudiante (Nombres y Apellidos)', isBold: true },
        { key: 'grade', label: 'Grado / Sección' },
        { key: 'gender', label: 'Género' },
        { 
          key: 'status', 
          label: 'Solvencia Administrativa', 
          isBadge: true, 
          badgeClass: (v) => v === 'Solvente' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }
      ]
    case 'grades':
      return [
        { key: 'student', label: 'Estudiante', isBold: true },
        { key: 'subject', label: 'Materia' },
        { key: 'score', label: 'Nota Numérica (1-20)' },
        { key: 'letter', label: 'Literal' },
        { 
          key: 'status', 
          label: 'Apreciación', 
          isBadge: true, 
          badgeClass: (v) => v === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }
      ]
    case 'attendance':
      return [
        { key: 'student', label: 'Estudiante', isBold: true },
        { key: 'grade', label: 'Año / Grado' },
        { key: 'present', label: 'Días Asistidos' },
        { key: 'absent', label: 'Inasistencias' },
        { 
          key: 'percentage', 
          label: '% Cumplimiento', 
          isBadge: true, 
          badgeClass: (v) => parseFloat(v) >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }
      ]
    case 'schedules':
      return [
        { key: 'teacher', label: 'Docente Titular', isBold: true },
        { key: 'subject', label: 'Asignatura' },
        { key: 'day', label: 'Día' },
        { key: 'time', label: 'Bloque Horario' },
        { key: 'room', label: 'Aula / Espacio' }
      ]
    case 'planning':
      return [
        { key: 'teacher', label: 'Docente', isBold: true },
        { key: 'subject', label: 'Materia y Grado' },
        { key: 'weeks', label: 'Semanas' },
        { key: 'weight', label: 'Ponderación Total' },
        { 
          key: 'status', 
          label: 'Estado Plan', 
          isBadge: true, 
          badgeClass: (v) => v === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }
      ]
    case 'averages':
      return [
        { key: 'subject', label: 'Asignatura', isBold: true },
        { key: 'teacher', label: 'Docente' },
        { key: 'average', label: 'Promedio General' },
        { 
          key: 'action', 
          label: 'Diagnóstico', 
          isBadge: true, 
          badgeClass: (v) => v === 'Sobresaliente' ? 'bg-emerald-100 text-emerald-700' : (v === 'Nivel Regular' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')
        }
      ]
    default:
      return []
  }
})

const currentReportRows = computed(() => {
  switch (selectedModule.value) {
    case 'students':
      return studentsList.value.map(s => ({
        code: s.student_id || `V-32.${Math.floor(100000 + Math.random() * 900000)}`,
        name: `${s.first_name} ${s.last_name}`,
        grade: `${s.grade || '1er Año'} - ${s.section || 'A'}`,
        gender: s.gender === 'F' ? 'Femenino' : 'Masculino',
        status: s.is_solvent !== false ? 'Solvente' : 'Pendiente'
      }))
    case 'grades':
      return [
        { student: 'Juan Carlos Pérez Gómez', subject: 'Matemáticas', score: '19 pts', letter: 'A', status: 'Aprobado' },
        { student: 'Sofía Valentina Morales', subject: 'Castellano y Literatura', score: '18 pts', letter: 'A', status: 'Aprobado' },
        { student: 'Alejandro José Castillo', subject: 'Física Fundamental', score: '16 pts', letter: 'B', status: 'Aprobado' },
        { student: 'María Gabriela García', subject: 'Química Orgánica', score: '17 pts', letter: 'B', status: 'Aprobado' },
        { student: 'Diego Andrés Rivas', subject: 'Biología y Ambiente', score: '20 pts', letter: 'A', status: 'Aprobado' }
      ]
    case 'attendance':
      return [
        { student: 'Juan Carlos Pérez Gómez', grade: '1er Año A', present: '42 días', absent: '1 falta', percentage: '97%' },
        { student: 'Sofía Valentina Morales', grade: '2do Año B', present: '40 días', absent: '3 faltas', percentage: '93%' },
        { student: 'Alejandro José Castillo', grade: '3er Año A', present: '36 días', absent: '7 faltas', percentage: '83%' },
        { student: 'María Gabriela García', grade: '4to Año U', present: '43 días', absent: '0 faltas', percentage: '100%' },
        { student: 'Diego Andrés Rivas', grade: '5to Año A', present: '39 días', absent: '4 faltas', percentage: '90%' }
      ]
    case 'schedules':
      return [
        { teacher: 'Prof. Carlos Mendoza', subject: 'Matemáticas', day: 'Lunes', time: '07:00 am - 08:30 am', room: 'Aula 101' },
        { teacher: 'Prof. Elena Vargas', subject: 'Castellano', day: 'Martes', time: '08:30 am - 10:00 am', room: 'Aula 102' },
        { teacher: 'Prof. Roberto Silva', subject: 'Física', day: 'Miércoles', time: '10:15 am - 11:45 am', room: 'Laboratorio de Ciencias' },
        { teacher: 'Prof. Carmen Delgado', subject: 'Química', day: 'Jueves', time: '07:00 am - 08:30 am', room: 'Laboratorio de Química' },
        { teacher: 'Prof. José González', subject: 'Educación Física', day: 'Viernes', time: '08:30 am - 10:00 am', room: 'Cancha Múltiple' }
      ]
    case 'planning':
      return [
        { teacher: 'Prof. Carlos Mendoza', subject: 'Matemáticas - 4to Año', weeks: '12 Semanas', weight: '100% Ponderado', status: 'Aprobado' },
        { teacher: 'Prof. Elena Vargas', subject: 'Castellano - 1er Año', weeks: '10 Semanas', weight: '100% Ponderado', status: 'Aprobado' },
        { teacher: 'Prof. Roberto Silva', subject: 'Física - 3er Año', weeks: '12 Semanas', weight: '100% Ponderado', status: 'En Revisión' },
        { teacher: 'Prof. Carmen Delgado', subject: 'Química - 5to Año', weeks: '11 Semanas', weight: '100% Ponderado', status: 'Aprobado' }
      ]
    case 'averages':
      return [
        { subject: 'Educación Física y Deportes', teacher: 'Prof. José González', average: '19.4 / 20 pts', action: 'Sobresaliente' },
        { subject: 'Castellano y Literatura', teacher: 'Prof. Elena Vargas', average: '17.8 / 20 pts', action: 'Sobresaliente' },
        { subject: 'Matemáticas', teacher: 'Prof. Carlos Mendoza', average: '15.2 / 20 pts', action: 'Nivel Regular' },
        { subject: 'Física y Ciencias Naturales', teacher: 'Prof. Roberto Silva', average: '13.9 / 20 pts', action: 'Requiere Refuerzo' },
        { subject: 'Química', teacher: 'Prof. Carmen Delgado', average: '14.1 / 20 pts', action: 'Nivel Regular' }
      ]
    default:
      return []
  }
})

const triggerPrint = () => {
  window.print()
}

const exportCsv = () => {
  const cols = currentReportColumns.value.map(c => c.label).join(',')
  const rows = currentReportRows.value.map(r => {
    return currentReportColumns.value.map(c => `"${r[c.key] || ''}"`).join(',')
  }).join('\n')
  
  const csvContent = "data:text/csv;charset=utf-8," + cols + "\n" + rows
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `reporte_${selectedModule.value}_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(fetchData)
</script>
