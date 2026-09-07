<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            📚
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Gestión de Materias y Cátedras
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Plan de estudios, departamentos curriculares, carga horaria y docentes
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- New Subject Button -->
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Materia</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Materias -->
      <!-- Total Materias -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Materias</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ totalSubjects }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <!-- Departamentos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Departamentos</p>
          <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 mt-1 leading-tight tracking-tight">{{ totalDepartments }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <!-- Profesores Asignados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profesores Asignados</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ assignedTeachersCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Niveles Académicos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Niveles Académicos</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ academicLevelsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter Bar Card -->
    <div class="glass-card rounded-2xl p-4 shadow-sm">
      <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[240px]">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar materia por nombre o código..." 
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
        </div>

        <!-- Filters Group -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Department Select -->
          <select 
            v-model="filterDepartment"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los departamentos</option>
            <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <!-- Teacher Select -->
          <select 
            v-model="filterTeacher"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los profesores</option>
            <option v-for="t in teachersList" :key="t" :value="t">{{ t }}</option>
          </select>

          <!-- Level Select / Student indicator -->
          <div v-if="isStudent" class="px-3 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
            <span>🎓 3er Año (Media General)</span>
          </div>
          <select 
            v-else
            v-model="filterLevel"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-medium"
          >
            <option value="">Todos los niveles</option>
            <option value="media">Media / Bachillerato</option>
            <option value="primaria">Primaria</option>
            <option value="inicial">Educación Inicial</option>
          </select>

          <!-- View Mode Toggle (Grid / Table) -->
          <div class="flex items-center bg-slate-100 dark:bg-[#110926] p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button 
              @click="switchViewMode('grid')" 
              :class="[viewMode === 'grid' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all cursor-pointer']"
              title="Vista en cuadrícula"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="switchViewMode('table')" 
              :class="[viewMode === 'table' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all cursor-pointer']"
              title="Vista en lista / tabla"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredSubjects.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-3xl mb-3">
        📚
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron materias</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba cambiando los filtros de búsqueda o agrega una nueva materia con el botón superior.
      </p>
      <button 
        v-if="canManage"
        @click="openCreateModal($event)"
        class="mt-4 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-purple text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
      >
        + Registrar Materia
      </button>
    </div>

    <!-- GRID VIEW: Subject Cards (Clean Institutional Glass-Card Standard) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div 
        v-for="subject in filteredSubjects" 
        :key="subject.id"
        class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all"
        :class="!subject.is_active ? 'opacity-85 border-amber-500/30' : ''"
      >
        <div>
          <!-- Top Row: Subject Code (left) & Department with Outline Icon (right) -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 rounded-xl font-black text-xs font-mono">
              {{ subject.code }}
            </span>

            <!-- Department with Clean Outline Icon (No background box, stroke-only SVG) -->
            <div v-if="subject.category_name" class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span class="font-medium truncate max-w-[160px] text-right">{{ subject.category_name }}</span>
              <svg v-if="isScience(subject.category_name)" class="w-4 h-4 text-slate-400 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <svg v-else-if="isMath(subject.category_name)" class="w-4 h-4 text-slate-400 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="isLanguage(subject.category_name)" class="w-4 h-4 text-slate-400 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <svg v-else class="w-4 h-4 text-slate-400 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <!-- Fallback if no department -->
            <span 
              v-else
              :class="getStatusBadgeClass(subject.is_active)"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border"
            >
              {{ subject.is_active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>

          <!-- Subject Title & Status / Credits -->
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {{ subject.name }}
            </h3>
            <span 
              :class="getStatusBadgeClass(subject.is_active)"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border shrink-0 mt-0.5"
            >
              {{ subject.is_active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mt-2.5 min-h-[36px]">
            {{ subject.description || 'Sin descripción curricular asignada.' }}
          </p>

          <!-- Attributes list -->
          <div class="mt-4 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
            <!-- Level -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-brand-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="font-medium capitalize truncate text-slate-700 dark:text-slate-300">{{ formatGradeLevel(subject.grade_level) }}</span>
            </div>

            <!-- Assigned Teacher -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-medium truncate" :class="subject.teacher_name ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 italic'">
                {{ subject.teacher_name || 'No asignado' }}
              </span>
            </div>

            <!-- Credits & Hours -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate text-slate-700 dark:text-slate-300">{{ subject.hours_per_week || 4 }} horas semanales ({{ subject.credits || 0 }} créditos)</span>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions (Consistent with classrooms/staff) -->
        <div class="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-white/10">
          <span class="text-[10px] text-slate-400 font-medium">U.E Santa Luisa</span>
          <div class="flex items-center gap-1">
            <button 
              @click="openEditModal(subject, $event)"
              class="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-amber-500/30"
              title="Editar materia curricular"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              v-if="canManage"
              @click="promptDeleteSubject(subject, $event)"
              class="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
              title="Eliminar materia curricular"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else-if="viewMode === 'table'" class="glass-card rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50/80 dark:bg-[#110926] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-white/10">
            <tr>
              <th class="py-3.5 px-4 sm:px-6">Código / Materia</th>
              <th class="py-3.5 px-4">Departamento</th>
              <th class="py-3.5 px-4">Nivel</th>
              <th class="py-3.5 px-4">Profesor Asignado</th>
              <th class="py-3.5 px-4 text-center">Horas / Créditos</th>
              <th class="py-3.5 px-4 text-center">Estado</th>
              <th class="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/5">
            <tr 
              v-for="s in filteredSubjects" 
              :key="s.id"
              class="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
            >
              <td class="py-3.5 px-4 sm:px-6">
                <div>
                  <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{{ s.name }}</p>
                  <p class="font-mono text-[10px] text-brand-purple dark:text-brand-secondary font-bold">{{ s.code }}</p>
                </div>
              </td>
              <td class="py-3.5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                {{ s.category_name || 'General' }}
              </td>
              <td class="py-3.5 px-4 text-xs capitalize text-slate-600 dark:text-slate-400">
                {{ s.grade_level }}
              </td>
              <td class="py-3.5 px-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                {{ s.teacher_name || 'No asignado' }}
              </td>
              <td class="py-3.5 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
                {{ s.hours_per_week || 4 }}h / {{ s.credits || 0 }} CR
              </td>
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border" :class="getStatusBadgeClass(s.is_active)">
                  {{ s.is_active ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td class="py-3.5 px-4 sm:px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button 
                    @click="openEditModal(s, $event)"
                    class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    v-if="canManage"
                    @click="promptDeleteSubject(s, $event)"
                    class="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <!-- STANDARDIZED MODAL: 3 NUMBERED SECTIONS & INSTITUTIONAL HEADER -->
    <Teleport to="body">
      <div 
        v-if="showModal" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeModal"
      >
        <div 
          class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Institutional Header Banner -->
          <div class="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary border-b border-brand-gold/30 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 border border-brand-gold/50 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                📚
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ editingSubject ? 'Editar Materia Curricular' : 'Nueva Materia Curricular' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Plan de Estudios y Asignación de Cátedra
                </p>
              </div>
            </div>

            <button 
              @click="closeModal" 
              type="button" 
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Form Wrapping Body & Fixed Footer -->
          <form @submit.prevent="saveSubject" class="flex-1 flex flex-col min-h-0">
            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Datos Curriculares Básicos -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Datos Curriculares Básicos</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Code -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código de Materia *
                    </label>
                    <input 
                      v-model="form.code" 
                      type="text" 
                      placeholder="Ej: MAT-M, CNAT-M" 
                      :class="[
                        formErrors.code ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono uppercase transition-all'
                      ]"
                    />
                    <p v-if="formErrors.code" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.code }}
                    </p>
                  </div>

                  <!-- Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre de la Asignatura *
                    </label>
                    <input 
                      v-model="form.name" 
                      type="text" 
                      placeholder="Ej: Matemática, Ciencias Naturales" 
                      :class="[
                        formErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.name" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.name }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Grade Level -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nivel Académico *
                    </label>
                    <select 
                      v-model="form.grade_level" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="media">Media / Bachillerato</option>
                      <option value="primaria">Primaria</option>
                      <option value="inicial">Educación Inicial</option>
                    </select>
                  </div>

                  <!-- Status Toggle Segmented -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Estado de la Asignatura
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        @click="form.is_active = true"
                        :class="[
                          form.is_active 
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' 
                            : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                          'p-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                        ]"
                      >
                        <span>✓ Activa</span>
                      </button>
                      <button
                        type="button"
                        @click="form.is_active = false"
                        :class="[
                          !form.is_active 
                            ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 font-bold shadow-xs' 
                            : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                          'p-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                        ]"
                      >
                        <span>⚠️ Inactiva</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Cátedra, Departamento y Docente -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Cátedra, Departamento y Asignación Docente</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Department -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Departamento Curricular *
                    </label>
                    <input 
                      v-model="form.category_name" 
                      type="text" 
                      placeholder="Ej: Ciencias Naturales y Exactas" 
                      list="departments-datalist"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                    <datalist id="departments-datalist">
                      <option v-for="d in departmentsList" :key="d" :value="d" />
                    </datalist>
                  </div>

                  <!-- Teacher Assigned -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Profesor Titular Asignado
                    </label>
                    <select 
                      v-model="form.teacher_name" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer font-medium"
                    >
                      <option value="">Seleccionar profesor (Opcional)</option>
                      <option v-for="teacher in teachersList" :key="teacher" :value="teacher">{{ teacher }}</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Hours per week -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Horas Semanales de Clase
                    </label>
                    <input 
                      v-model.number="form.hours_per_week" 
                      type="number" 
                      min="1" 
                      max="30"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Credits -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Unidades de Crédito
                    </label>
                    <input 
                      v-model.number="form.credits" 
                      type="number" 
                      min="0"
                      max="20"
                      placeholder="0" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 3: Requisitos y Contenido Programático -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Requisitos y Contenido Programático</span>
                </div>

                <!-- Prerequisites -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Materias Prerrequisito
                  </label>
                  <input 
                    v-model="form.prerequisites" 
                    type="text" 
                    placeholder="Ej: Matemática I, Física Básica (Opcional)" 
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Descripción y Objetivos Pedagógicos
                  </label>
                  <textarea 
                    v-model="form.description" 
                    rows="3" 
                    placeholder="Descripción curricular y propósitos formativos de la asignatura en la U.E Santa Luisa..." 
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

            </div>

            <!-- Sticky Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 border border-brand-primary/30 cursor-pointer"
              >
                <span v-if="isSubmitting">Guardando...</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ editingSubject ? 'Actualizar Materia' : 'Crear Materia' }}</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Confirmar Eliminación Segura -->
    <Teleport to="body">
      <div 
        v-if="showDeleteModal" 
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="closeDeleteModal"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md p-6 text-center animate-scale-up">
          <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/40 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
            ⚠️
          </div>

          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">
            ¿Eliminar Materia?
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Estás a punto de eliminar <strong class="text-slate-900 dark:text-white">"{{ subjectToDelete?.name }}"</strong> ({{ subjectToDelete?.code }}).
          </p>

          <div class="mt-3 p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 text-left">
            ℹ️ <strong>Nota Institucional:</strong> Se recomienda mantener la materia como "Inactiva" si existen calificaciones históricas o evaluaciones vinculadas.
          </div>

          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              type="button" 
              @click="closeDeleteModal" 
              class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button 
              type="button" 
              @click="confirmDeleteSubject"
              :disabled="isDeleting"
              class="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              {{ isDeleting ? 'Eliminando...' : 'Sí, Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3031'
const authStore = useAuthStore()
const toast = useToast()

const currentRole = computed(() => authStore.userRole || authStore.user?.role || 'admin')
const isStudent = computed(() => currentRole.value === 'student')

// Role-based authorization
const canManage = computed(() => {
  const role = currentRole.value
  return ['admin', 'control_estudio', 'coordinator'].includes(role)
})

const viewMode = ref('grid') // 'grid' | 'table'

const search = ref('')
const filterDepartment = ref('')
const filterTeacher = ref('')
const filterLevel = ref('')

const switchViewMode = (mode) => {
  viewMode.value = mode
}

// Modal State
const showModal = ref(false)
const editingSubject = ref(null)
const isSubmitting = ref(false)
const formErrors = ref({})

// Delete Modal State
const showDeleteModal = ref(false)
const subjectToDelete = ref(null)
const isDeleting = ref(false)

const form = ref({
  code: '',
  name: '',
  grade_level: 'media',
  credits: 0,
  hours_per_week: 4,
  teacher_name: '',
  category_name: 'Ciencias Naturales y Exactas',
  prerequisites: '',
  description: '',
  is_active: true
})

// Subjects State
const subjects = ref([])

// Demo Teachers list matching reference
const teachersList = [
  'José Antonio Vásquez',
  'Roberto Gómez',
  'Laura Méndez',
  'Miguel Silva',
  'Carmen Domínguez'
]

// Departments list
const departmentsList = [
  'Ciencias Naturales y Exactas',
  'Lengua, Humanidades y Arte',
  'Matemática y Lógica',
  'Formación Integral y Valores'
]

// Computed KPI metrics
const totalSubjects = computed(() => subjects.value.length)
const totalDepartments = computed(() => {
  const depts = new Set(subjects.value.map(s => s.category_name).filter(Boolean))
  return depts.size > 0 ? depts.size : 4
})
const assignedTeachersCount = computed(() => {
  const teachers = new Set(subjects.value.map(s => s.teacher_name).filter(Boolean))
  return teachers.size > 0 ? teachers.size : 3
})
const academicLevelsCount = computed(() => {
  const levels = new Set(subjects.value.map(s => s.grade_level).filter(Boolean))
  return levels.size > 0 ? levels.size : 2
})

// Filtered Subjects
const filteredSubjects = computed(() => {
  return subjects.value.filter(s => {
    const q = search.value.trim().toLowerCase()
    const matchesSearch = !q || 
      (s.name && s.name.toLowerCase().includes(q)) || 
      (s.code && s.code.toLowerCase().includes(q)) || 
      (s.description && s.description.toLowerCase().includes(q))

    const matchesDept = !filterDepartment.value || (s.category_name === filterDepartment.value)
    const matchesTeacher = !filterTeacher.value || (s.teacher_name === filterTeacher.value)

    // For student: restrict strictly to media level
    let matchesLevel = true
    if (isStudent.value) {
      matchesLevel = !s.grade_level || s.grade_level.toLowerCase() === 'media'
    } else {
      matchesLevel = !filterLevel.value || (s.grade_level && s.grade_level.toLowerCase() === filterLevel.value.toLowerCase())
    }

    return matchesSearch && matchesDept && matchesTeacher && matchesLevel
  })
})

const getStatusBadgeClass = (isActive) => {
  if (isActive) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  }
  return 'bg-amber-500/10 text-amber-600 dark:text-brand-gold border-amber-500/30'
}

// Category and Level Helpers for Clean Outline Icons
const isScience = (dept) => {
  if (!dept) return false
  const d = dept.toLowerCase()
  return d.includes('ciencia') || d.includes('física') || d.includes('fisica') || d.includes('química') || d.includes('quimica') || d.includes('biología') || d.includes('biologia')
}

const isMath = (dept) => {
  if (!dept) return false
  const d = dept.toLowerCase()
  return d.includes('matemática') || d.includes('matematica') || d.includes('lógica') || d.includes('logica')
}

const isLanguage = (dept) => {
  if (!dept) return false
  const d = dept.toLowerCase()
  return d.includes('lengua') || d.includes('humanidad') || d.includes('arte') || d.includes('castellano') || d.includes('literatura') || d.includes('inglés') || d.includes('ingles')
}

const formatGradeLevel = (level) => {
  if (!level) return 'Media / Bachillerato'
  if (level.toLowerCase() === 'media') return 'Media / Bachillerato'
  if (level.toLowerCase() === 'primaria') return 'Primaria'
  if (level.toLowerCase() === 'inicial') return 'Educación Inicial'
  return level
}

// Fetch Subjects from Backend API
const fetchSubjects = async () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await $fetch(`${apiBase}/subjects`, { headers }).catch(() => null)
    
    if (res && res.data && res.data.length > 0) {
      subjects.value = res.data.map(mapSubject)
    } else if (subjects.value.length === 0) {
      loadFallbackReferenceData()
    }
  } catch (err) {
    if (subjects.value.length === 0) loadFallbackReferenceData()
  }
}

const mapSubject = (s) => {
  return {
    id: s.id,
    code: s.code || '',
    name: s.name || '',
    grade_level: s.grade_level || 'media',
    credits: s.credits !== undefined ? s.credits : 0,
    hours_per_week: s.hours_per_week || 4,
    description: s.description || '',
    prerequisites: s.prerequisites || '',
    category_name: s.category_name || (s.grade_level === 'primaria' ? 'Primaria' : 'Ciencias Naturales y Exactas'),
    teacher_name: s.teacher_name || '',
    is_active: s.is_active !== undefined ? s.is_active : true
  }
}

// Fallback seed
const loadFallbackReferenceData = () => {
  subjects.value = [
    {
      id: 1,
      code: 'CNAT-M',
      name: 'Ciencias Naturales',
      description: 'Ciencias Naturales y Biología para bachillerato',
      grade_level: 'media',
      teacher_name: 'Laura Méndez',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Ciencias Naturales y Exactas',
      is_active: true
    },
    {
      id: 2,
      code: 'CAST-M',
      name: 'Castellano y Literatura',
      description: 'Lengua, Literatura y Comunicación para bachillerato',
      grade_level: 'media',
      teacher_name: 'Carmen Domínguez',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Lengua, Humanidades y Arte',
      is_active: true
    },
    {
      id: 3,
      code: 'MAT-M',
      name: 'Matemática',
      description: 'Álgebra, Geometría y Razonamiento Lógico',
      grade_level: 'media',
      teacher_name: 'Miguel Silva',
      credits: 0,
      hours_per_week: 5,
      category_name: 'Matemática y Lógica',
      is_active: true
    },
    {
      id: 4,
      code: 'EDFE-M',
      name: 'Educación de la Fe',
      description: 'Formación Ética, Ciudadana y Valores Cristianos',
      grade_level: 'media',
      teacher_name: 'José Antonio Vásquez',
      credits: 0,
      hours_per_week: 2,
      category_name: 'Formación Integral y Valores',
      is_active: true
    },
    {
      id: 5,
      code: 'QUIM-M',
      name: 'Química',
      description: 'Química General y Orgánica de Educación Media',
      grade_level: 'media',
      teacher_name: 'Roberto Gómez',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Ciencias Naturales y Exactas',
      is_active: true
    },
    {
      id: 6,
      code: 'FIS-M',
      name: 'Física',
      description: 'Mecánica clásica, cinemática y leyes de Newton',
      grade_level: 'media',
      teacher_name: 'Laura Méndez',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Ciencias Naturales y Exactas',
      is_active: true
    }
  ]
}

const validateForm = () => {
  const errors = {}
  if (!form.value.code?.trim()) errors.code = 'El código de la materia es obligatorio'
  if (!form.value.name?.trim()) errors.name = 'El nombre de la materia es obligatorio'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const openCreateModal = () => {
  editingSubject.value = null
  formErrors.value = {}
  form.value = {
    code: '',
    name: '',
    grade_level: 'media',
    credits: 0,
    hours_per_week: 4,
    teacher_name: '',
    category_name: 'Ciencias Naturales y Exactas',
    prerequisites: '',
    description: '',
    is_active: true
  }
  showModal.value = true
}

const openEditModal = (subject) => {
  editingSubject.value = subject
  formErrors.value = {}
  form.value = {
    code: subject.code,
    name: subject.name,
    grade_level: subject.grade_level || 'media',
    credits: subject.credits || 0,
    hours_per_week: subject.hours_per_week || 4,
    teacher_name: subject.teacher_name === 'No asignado' ? '' : (subject.teacher_name || ''),
    category_name: subject.category_name || '',
    prerequisites: subject.prerequisites || '',
    description: subject.description || '',
    is_active: subject.is_active !== undefined ? subject.is_active : true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingSubject.value = null
  formErrors.value = {}
}

const saveSubject = async () => {
  if (!validateForm()) {
    toast.warning('Por favor completa los campos requeridos (*)')
    return
  }

  const code = form.value.code.trim().toUpperCase()
  const name = form.value.name.trim()
  const grade_level = form.value.grade_level.trim()
  const description = (form.value.description || '').trim()
  const category_name = (form.value.category_name || '').trim() || 'General'
  const prerequisites = (form.value.prerequisites || '').trim()
  const teacher_name = form.value.teacher_name || 'No asignado'
  const credits = Number(form.value.credits) || 0
  const hours_per_week = Number(form.value.hours_per_week) || 4

  // Check duplicate code
  const isDuplicate = subjects.value.some(s => 
    s.code.toUpperCase() === code && (!editingSubject.value || s.id !== editingSubject.value.id)
  )
  if (isDuplicate) {
    toast.error(`Ya existe una materia registrada con el código ${code}.`)
    return
  }

  isSubmitting.value = true

  const payload = {
    code,
    name,
    grade_level,
    description,
    credits,
    hours_per_week,
    category_name,
    prerequisites,
    teacher_name,
    is_active: form.value.is_active
  }

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    if (editingSubject.value) {
      // Update
      await $fetch(`${apiBase}/subjects/${editingSubject.value.id}`, {
        method: 'PATCH',
        headers,
        body: payload
      }).catch(() => null)

      const index = subjects.value.findIndex(s => s.id === editingSubject.value.id)
      if (index !== -1) {
        subjects.value[index] = { ...subjects.value[index], ...payload }
      }
      toast.success(`Materia "${name}" actualizada exitosamente.`)
    } else {
      // Create
      const res = await $fetch(`${apiBase}/subjects`, {
        method: 'POST',
        headers,
        body: payload
      }).catch(() => null)

      const newId = res && res.id ? res.id : Date.now()
      subjects.value.unshift({ id: newId, ...payload })
      toast.success(`Materia "${name}" creada exitosamente.`)
    }

    closeModal()
  } catch (err) {
    toast.error(err?.data?.message || err?.message || 'Error al guardar la materia.')
  } finally {
    isSubmitting.value = false
  }
}

const promptDeleteSubject = (subject) => {
  subjectToDelete.value = subject
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  subjectToDelete.value = null
}

const confirmDeleteSubject = async () => {
  if (!subjectToDelete.value) return
  isDeleting.value = true

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    await $fetch(`${apiBase}/subjects/${subjectToDelete.value.id}`, {
      method: 'DELETE',
      headers
    }).catch((err) => {
      if (err && err.data) throw err
      return null
    })

    const deletedName = subjectToDelete.value.name
    subjects.value = subjects.value.filter(s => s.id !== subjectToDelete.value.id)
    closeDeleteModal()
    toast.warning(`Materia "${deletedName}" eliminada del plan de estudios.`)
  } catch (err) {
    toast.error(err?.data?.message || err?.message || 'No se puede eliminar la materia debido a dependencias académicas.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchSubjects()
})
</script>
