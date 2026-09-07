<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
          Calificaciones y Evaluaciones
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Registro de notas, desempeño curricular y control de rendimiento estudiantil
        </p>
      </div>

      <!-- Action Button / Contextual Badge -->
      <div class="flex items-center gap-2.5">
        <!-- Active child indicator for parents -->
        <div v-if="isParent" class="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-xs">
          <span class="text-base">{{ isCarlos ? '👦' : '👧' }}</span>
          <div>
            <span class="font-extrabold text-slate-800 dark:text-slate-100">{{ activeStudent.full_name }}</span>
            <span class="text-[10px] text-amber-700 dark:text-brand-gold font-bold ml-1.5">{{ activeStudent.grade }}</span>
          </div>
        </div>

        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Calificación</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Promedio General -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Promedio General</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-slate-850 dark:text-white leading-tight tracking-tight">{{ averageScore }}</p>
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">/ 20 pts</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      <!-- Tasa de Aprobación -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tasa Aprobación</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">{{ passRate }}%</p>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
              {{ passedCount }} aprobados
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- En Recuperación / Reprobados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">En Recuperación</p>
          <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1 leading-tight tracking-tight">{{ failedCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <!-- Total Registros -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Notas Registradas</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ grades.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 min-w-[240px]">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por estudiante, código o evaluación..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Class Filter -->
        <select
          v-model="selectedClassFilter"
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todas las clases</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
        </select>

        <!-- Status Filter -->
        <select
          v-model="selectedStatusFilter"
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todos los estados</option>
          <option value="passed">Aprobados (≥ 10)</option>
          <option value="failed">Reprobados (&lt; 10)</option>
        </select>

        <!-- View Mode Toggle -->
        <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
          <button
            @click="switchViewMode('table')"
            type="button"
            :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            class="p-1.5 rounded-lg text-xs transition-all"
            title="Vista de Tabla"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            @click="switchViewMode('grid')"
            type="button"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            class="p-1.5 rounded-lg text-xs transition-all"
            title="Vista de Cuadrícula"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 mb-3 animate-spin">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando calificaciones...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredGrades.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-750 dark:text-white">No se encontraron calificaciones</h3>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
        No hay registros que coincidan con los filtros aplicados.
      </p>
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th class="py-3.5 px-4 sm:px-6">Estudiante</th>
              <th class="py-3.5 px-4">Materia / Evaluación</th>
              <th class="py-3.5 px-4">Aula</th>
              <th class="py-3.5 px-4 text-center">Nota</th>
              <th class="py-3.5 px-4 text-center">Rendimiento</th>
              <th v-if="canManage" class="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="grade in filteredGrades"
              :key="grade.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <!-- Student -->
              <td class="py-3.5 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {{ getInitials(grade.student_first_name, grade.student_last_name) }}
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-bold text-slate-850 dark:text-white">
                      {{ grade.student_last_name }}, {{ grade.student_first_name }}
                    </p>
                    <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                      {{ grade.student_code || 'ALU-COD' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Subject & Exam Title -->
              <td class="py-3.5 px-4">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span 
                      class="w-2 h-2 rounded-full flex-shrink-0" 
                      :style="{ backgroundColor: grade.subject_color || '#F97316' }"
                    ></span>
                    <span class="text-xs font-bold text-slate-750 dark:text-slate-200">
                      {{ grade.subject_name }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">
                    {{ grade.exam_title }}
                  </p>
                </div>
              </td>

              <!-- Class -->
              <td class="py-3.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                {{ grade.class_name }}
              </td>

              <!-- Score -->
              <td class="py-3.5 px-4 text-center">
                <span 
                  :class="getScoreBadgeClass(grade.marks_obtained)"
                  class="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black"
                >
                  {{ formatScore(grade.marks_obtained) }} / {{ formatScore(grade.total_marks) }}
                </span>
              </td>

              <!-- Status / Performance Pill -->
              <td class="py-3.5 px-4 text-center">
                <span
                  :class="grade.is_passed 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' 
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="grade.is_passed ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ grade.is_passed ? 'Aprobado' : 'Reprobado' }}
                  <span class="text-[10px] opacity-75">({{ grade.grade_letter }})</span>
                </span>
              </td>

              <!-- Actions -->
              <td v-if="canManage" class="py-3.5 px-4 sm:px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    @click="openEditModal(grade, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Editar Nota"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="promptDeleteGrade(grade, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar Registro"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View of Grade Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="grade in filteredGrades"
        :key="grade.id"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
      >
        <div>
          <!-- Header: Subject & Date -->
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span 
                class="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                :style="{ backgroundColor: grade.subject_color || '#F97316' }"
              ></span>
              <span class="text-xs font-bold text-slate-850 dark:text-white truncate">
                {{ grade.subject_name }}
              </span>
            </div>
            <span
              :class="grade.is_passed ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' : 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'"
              class="text-[11px] font-black px-2 py-0.5 rounded-md"
            >
              {{ grade.grade_letter }}
            </span>
          </div>

          <!-- Student & Exam Details -->
          <div class="mt-3">
            <h4 class="text-sm font-bold text-slate-850 dark:text-white">
              {{ grade.student_last_name }}, {{ grade.student_first_name }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {{ grade.exam_title }}
            </p>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {{ grade.class_name }}
            </p>
          </div>

          <!-- Remarks -->
          <div v-if="grade.remarks" class="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 italic">
            "{{ grade.remarks }}"
          </div>
        </div>

        <!-- Footer: Score and Actions -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span 
            :class="getScoreBadgeClass(grade.marks_obtained)"
            class="text-xs font-black px-2.5 py-1 rounded-xl"
          >
            {{ formatScore(grade.marks_obtained) }} / {{ formatScore(grade.total_marks) }} pts
          </span>

          <div class="flex items-center gap-1">
            <button
              @click="openEditModal(grade, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="promptDeleteGrade(grade, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Standardized Modal: Registrar / Editar Calificación -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        @click.self="closeModal"
      >
        <div 
          class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transition-all transform duration-300 animate-in fade-in zoom-in-95"
          :style="modalSpatialStyle"
        >
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-100 dark:border-orange-900/50 flex items-center justify-center text-orange-500">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                  {{ isEditing ? 'Editar Calificación' : 'Registrar Calificación' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ isEditing ? 'Modifique la nota o comentarios del estudiante' : 'Complete los datos de la evaluación' }}
                </p>
              </div>
            </div>
            <button 
              @click="closeModal" 
              type="button"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Scrollable Content -->
          <form @submit.prevent="submitGrade" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Exam Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Evaluación / Examen *
              </label>
              <select
                v-model="form.exam_id"
                :disabled="isEditing"
                required
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
              >
                <option v-for="exam in examsList" :key="exam.id" :value="exam.id">
                  {{ exam.title }} ({{ exam.subject_name || 'Materia' }})
                </option>
              </select>
            </div>

            <!-- Student Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Estudiante *
              </label>
              <select
                v-model="form.student_id"
                :disabled="isEditing"
                required
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
              >
                <option v-for="student in studentsList" :key="student.id" :value="student.id">
                  {{ student.last_name }}, {{ student.first_name }} ({{ student.student_id || 'ALU' }})
                </option>
              </select>
            </div>

            <!-- Marks Obtained & Total Marks -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nota Obtenida *
                </label>
                <input
                  v-model.number="form.marks_obtained"
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  required
                  placeholder="Ej. 18.5"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Escala Máxima
                </label>
                <input
                  v-model.number="form.total_marks"
                  type="number"
                  min="1"
                  max="100"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <!-- Remarks / Qualitative Notes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Observaciones Pedagógicas
              </label>
              <textarea
                v-model="form.remarks"
                rows="3"
                placeholder="Comentarios sobre fortalezas o aspectos por reforzar..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              ></textarea>
            </div>
          </form>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="closeModal"
              type="button"
              class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              @click="submitGrade"
              :disabled="isSubmitting"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Calificación' : 'Guardar Calificación') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Eliminar Calificación -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        @click.self="isDeleteModalOpen = false"
      >
        <div 
          class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in fade-in zoom-in-95"
          :style="modalSpatialStyle"
        >
          <div class="p-6">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 mb-4">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
              ¿Eliminar esta calificación?
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Esta acción eliminará el registro de evaluación del estudiante 
              <strong class="text-slate-700 dark:text-slate-200">{{ gradeToDelete?.student_last_name }}, {{ gradeToDelete?.student_first_name }}</strong>.
            </p>
          </div>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="isDeleteModalOpen = false"
              type="button"
              class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              @click="confirmDeleteGrade"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 active:scale-[0.98] transition-all"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Floating Feedback Toast -->
    <Teleport to="body">
      <div 
        v-if="toastMessage" 
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-5 duration-200"
      >
        <span class="w-2 h-2 rounded-full bg-orange-500"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useActiveStudent } from '~/composables/useActiveStudent'

const nuxtApp = useNuxtApp()
const authStore = useAuthStore()
const { activeStudent, isCarlos, isMaria } = useActiveStudent()

const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role || ''
  return ['admin', 'control_estudio', 'coordinator', 'teacher'].includes(role)
})

const isStudent = computed(() => (authStore.userRole || authStore.user?.role) === 'student')
const isParent = computed(() => (authStore.userRole || authStore.user?.role) === 'parent')

// State
const grades = ref([])
const classes = ref([])
const examsList = ref([])
const studentsList = ref([])
const search = ref('')
const selectedClassFilter = ref('')
const selectedStatusFilter = ref('')
const viewMode = ref('table') // 'table' | 'grid'
const isLoading = ref(false)
const isSubmitting = ref(false)
const toastMessage = ref('')

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const gradeToDelete = ref(null)

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  id: null,
  exam_id: null,
  student_id: null,
  marks_obtained: 18,
  total_marks: 20,
  remarks: ''
})

// KPIs
const averageScore = computed(() => {
  if (filteredGrades.value.length === 0) return '0.0'
  const sum = filteredGrades.value.reduce((acc, g) => acc + Number(g.marks_obtained || 0), 0)
  return (sum / filteredGrades.value.length).toFixed(1)
})

const passedCount = computed(() => filteredGrades.value.filter(g => g.is_passed).length)
const failedCount = computed(() => filteredGrades.value.filter(g => !g.is_passed).length)

const passRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  return Math.round((passedCount.value / filteredGrades.value.length) * 100)
})

// Filtered grades list
const filteredGrades = computed(() => {
  let list = grades.value

  // If student persona, only show their own records
  if (isStudent.value) {
    list = list.filter(g => 
      g.student_id === 1 || 
      `${g.student_first_name} ${g.student_last_name}`.toLowerCase().includes('gabriel') ||
      `${g.student_first_name} ${g.student_last_name}`.toLowerCase().includes('carlos')
    )
  }

  // If parent persona, filter records strictly for the active child (Carlos or Maria)
  if (isParent.value && activeStudent.value) {
    const targetName = isCarlos.value ? 'carlos' : 'maría'
    const targetCode = activeStudent.value.student_code.toLowerCase()
    list = list.filter(g => {
      const studentFullName = `${g.student_first_name || ''} ${g.student_last_name || ''}`.toLowerCase()
      const studentCode = (g.student_code || '').toLowerCase()
      return studentFullName.includes(targetName) || studentCode === targetCode || g.student_id === activeStudent.value.id
    })
  }

  if (selectedClassFilter.value) {
    list = list.filter(g => String(g.class_id) === String(selectedClassFilter.value))
  }

  if (selectedStatusFilter.value === 'passed') {
    list = list.filter(g => g.is_passed)
  } else if (selectedStatusFilter.value === 'failed') {
    list = list.filter(g => !g.is_passed)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(g => 
      `${g.student_first_name} ${g.student_last_name}`.toLowerCase().includes(q) ||
      (g.student_code && g.student_code.toLowerCase().includes(q)) ||
      (g.subject_name && g.subject_name.toLowerCase().includes(q)) ||
      (g.exam_title && g.exam_title.toLowerCase().includes(q))
    )
  }

  return list
})

const getInitials = (first, last) => {
  const f = first ? first[0] : ''
  const l = last ? last[0] : ''
  return (f + l).toUpperCase() || 'AL'
}

const formatScore = (val) => {
  if (val === null || val === undefined) return '0'
  return Number(val).toString()
}

const getScoreBadgeClass = (marks) => {
  const m = Number(marks)
  if (m >= 16) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  if (m >= 10) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
}

const switchViewMode = (mode) => {
  viewMode.value = mode
}

// Modal actions
const captureTriggerOrigin = (event) => {
  if (event && event.clientX && event.clientY) {
    triggerOrigin.value = {
      x: Math.round((event.clientX / window.innerWidth) * 100),
      y: Math.round((event.clientY / window.innerHeight) * 100)
    }
  } else {
    triggerOrigin.value = { x: 50, y: 50 }
  }
}

const openCreateModal = (event) => {
  captureTriggerOrigin(event)
  isEditing.value = false
  form.value = {
    id: null,
    exam_id: examsList.value[0]?.id || null,
    student_id: studentsList.value[0]?.id || null,
    marks_obtained: 18,
    total_marks: 20,
    remarks: ''
  }
  isModalOpen.value = true
}

const openEditModal = (grade, event) => {
  captureTriggerOrigin(event)
  isEditing.value = true
  form.value = {
    id: grade.id,
    exam_id: grade.exam_id,
    student_id: grade.student_id,
    marks_obtained: Number(grade.marks_obtained),
    total_marks: Number(grade.total_marks || 20),
    remarks: grade.remarks || ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Save or Update Grade
const submitGrade = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await nuxtApp.$api.service('grades').patch(form.value.id, {
        marks_obtained: form.value.marks_obtained,
        total_marks: form.value.total_marks,
        remarks: form.value.remarks
      })
      showToast('Calificación actualizada exitosamente')
    } else {
      await nuxtApp.$api.service('grades').create(form.value)
      showToast('Calificación registrada exitosamente')
    }
    await fetchGrades()
    closeModal()
  } catch (error) {
    console.error('Error saving grade:', error)
    showToast(error.message || 'Error al guardar la calificación')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Grade
const promptDeleteGrade = (grade, event) => {
  captureTriggerOrigin(event)
  gradeToDelete.value = grade
  isDeleteModalOpen.value = true
}

const confirmDeleteGrade = async () => {
  if (!gradeToDelete.value) return
  try {
    await nuxtApp.$api.service('grades').remove(gradeToDelete.value.id)
    showToast('Calificación eliminada')
    await fetchGrades()
  } catch (error) {
    console.error('Error removing grade:', error)
    showToast(error.message || 'Error al eliminar la calificación')
  } finally {
    isDeleteModalOpen.value = false
    gradeToDelete.value = null
  }
}

// Fetch Data
const fetchGrades = async () => {
  isLoading.value = true
  try {
    const res = await nuxtApp.$api.service('grades').find({
      query: {
        $limit: 100
      }
    })
    grades.value = res.data || res || []
  } catch (error) {
    console.error('Error fetching grades:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchAuxiliaryData = async () => {
  try {
    const [clsRes, exRes, stdRes] = await Promise.all([
      nuxtApp.$api.service('classes').find({ query: { is_deleted: false, $limit: 50 } }),
      nuxtApp.$api.service('exams').find({ query: { is_deleted: false, $limit: 50 } }),
      nuxtApp.$api.service('students').find({ query: { is_deleted: false, $limit: 100 } })
    ])
    classes.value = clsRes.data || clsRes || []
    examsList.value = exRes.data || exRes || []
    studentsList.value = stdRes.data || stdRes || []
  } catch (e) {
    console.error('Error fetching auxiliary data:', e)
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

onMounted(async () => {
  await fetchAuxiliaryData()
  await fetchGrades()
})
</script>
