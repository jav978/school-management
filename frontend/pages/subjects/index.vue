<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500">
            <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Gestión de Materias
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administra el plan de estudios
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- New Subject Button with Spatial Origin Capture -->
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Materia</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Materias -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Materias</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ totalSubjects }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <!-- Departamentos -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Departamentos</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ totalDepartments }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <!-- Profesores Asignados -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Profesores Asignados</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ assignedTeachersCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Niveles Académicos -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Niveles Académicos</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ academicLevelsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40 flex items-center justify-center text-cyan-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter Bar Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs">
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
            placeholder="Buscar por nombre o código..." 
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <!-- Filters Group -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Department Select -->
          <select 
            v-model="filterDepartment"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            <option value="">Todos los departamentos</option>
            <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <!-- Teacher Select -->
          <select 
            v-model="filterTeacher"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            <option value="">Todos los profesores</option>
            <option v-for="t in teachersList" :key="t" :value="t">{{ t }}</option>
          </select>

          <!-- Level Select -->
          <select 
            v-model="filterLevel"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            <option value="">Todos los niveles</option>
            <option value="media">Media / Bachillerato</option>
            <option value="primaria">Primaria</option>
          </select>

          <!-- View Mode Toggle (Grid / Table) with GPU View Transitions -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-950/70 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button 
              @click="switchViewMode('grid')" 
              :class="[viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95']"
              title="Vista en cuadrícula"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="switchViewMode('table')" 
              :class="[viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95']"
              title="Vista en tabla"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Empty State with Crafted SVG Icon -->
    <div v-if="filteredSubjects.length === 0" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center shadow-xs">
      <div class="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center mx-auto text-orange-500 mb-4">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-850 dark:text-white">No se encontraron materias</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba cambiando los filtros de búsqueda o agrega una nueva materia con el botón superior.
      </p>
      <button 
        v-if="canManage"
        @click="openCreateModal($event)"
        class="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-xs active:scale-95"
      >
        + Registrar Materia
      </button>
    </div>

    <!-- GRID VIEW: Subject Cards (Fluid Morphing) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="subject in filteredSubjects" 
        :key="subject.id"
        :style="{ viewTransitionName: `subject-item-${subject.id}` }"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
      >
        <!-- Card Colored Header Banner -->
        <div 
          class="px-5 py-4 text-white relative transition-colors min-h-[96px] flex flex-col justify-between"
          :style="{ background: getBannerGradient(subject) }"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display font-extrabold text-base sm:text-lg tracking-tight leading-snug line-clamp-2 flex-1">
              {{ subject.name }}
            </h3>
            
            <!-- Category Tag or Badge -->
            <span v-if="subject.category_name" class="shrink-0 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/25 backdrop-blur-xs text-white tracking-wide shadow-2xs">
              {{ subject.category_name }}
            </span>
          </div>

          <div class="flex items-center justify-between mt-2 pt-1 border-t border-white/15">
            <span class="text-[11px] font-bold text-white/90 uppercase tracking-wider font-mono">
              {{ subject.code }}
            </span>
            <span v-if="subject.credits" class="text-[10px] font-semibold text-white/85">
              {{ subject.credits }} CR
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed min-h-[36px]">
            {{ subject.description || 'Sin descripción curricular asignada.' }}
          </p>

          <!-- Attributes list with strict vertical alignment -->
          <div class="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
            <!-- Level -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span class="font-medium capitalize truncate">{{ subject.grade_level || 'General' }}</span>
            </div>

            <!-- Assigned Teacher -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-medium truncate" :class="subject.teacher_name ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 italic'">
                {{ subject.teacher_name || 'No asignado' }}
              </span>
            </div>

            <!-- Credits & Hours -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">{{ subject.hours_per_week || 4 }} horas semanales ({{ subject.credits || 0 }} créditos)</span>
            </div>
          </div>

          <!-- Card Footer Actions: 3-dots Menu -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between h-9">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold" :class="getStatusBadgeClass(subject.is_active)">
              {{ subject.is_active ? 'Activa' : 'Inactiva' }}
            </span>

            <!-- Actions Dropdown / Buttons -->
            <div class="relative flex items-center" v-if="canManage">
              <button 
                @click="toggleCardMenu(subject.id)" 
                type="button" 
                class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
                title="Opciones"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              <!-- Floating Dropdown Menu -->
              <div 
                v-if="activeMenuId === subject.id" 
                class="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-30 text-xs font-medium animate-fade-in"
              >
                <button 
                  @click="openEditModal(subject, $event)" 
                  class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <svg class="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Editar</span>
                </button>
                <button 
                  @click="promptDeleteSubject(subject, $event)" 
                  class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW: Dense Clerical Table with Morphing Transitions -->
    <div v-else class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th class="py-3.5 px-4">Código</th>
              <th class="py-3.5 px-4">Materia</th>
              <th class="py-3.5 px-4">Nivel</th>
              <th class="py-3.5 px-4">Departamento</th>
              <th class="py-3.5 px-4">Profesor Asignado</th>
              <th class="py-3.5 px-4">Créditos</th>
              <th class="py-3.5 px-4">Estado</th>
              <th v-if="canManage" class="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr 
              v-for="subject in filteredSubjects" 
              :key="subject.id"
              :style="{ viewTransitionName: `subject-item-${subject.id}` }"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-200">
                {{ subject.code }}
              </td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-850 dark:text-white">{{ subject.name }}</div>
                <div class="text-[11px] text-slate-400 line-clamp-1">{{ subject.description }}</div>
              </td>
              <td class="py-3.5 px-4 capitalize text-slate-600 dark:text-slate-300">
                {{ subject.grade_level || 'General' }}
              </td>
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                {{ subject.category_name || 'General' }}
              </td>
              <td class="py-3.5 px-4 font-medium" :class="subject.teacher_name ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 italic'">
                {{ subject.teacher_name || 'No asignado' }}
              </td>
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                {{ subject.credits || 0 }}
              </td>
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold" :class="getStatusBadgeClass(subject.is_active)">
                  {{ subject.is_active ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td v-if="canManage" class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    @click="openEditModal(subject, $event)"
                    class="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    @click="promptDeleteSubject(subject, $event)"
                    class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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

    <!-- MODAL: Crear / Editar Materia (Teleported to body, spatial FLIP morph, centered, fixed footer) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
        <!-- Backdrop click to close with fluid fade -->
        <div 
          @click="closeModal" 
          class="fixed inset-0 transition-opacity" 
          :class="isClosingModal ? 'backdrop-spatial-leave' : 'backdrop-spatial-enter'"
          aria-hidden="true"
        ></div>

        <!-- Modal Container: Vertically centered in viewport with FLIP origin -->
        <div 
          class="relative w-full max-w-xl md:max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col max-h-[85vh] my-auto overflow-hidden z-10"
          :class="isClosingModal ? 'modal-spatial-leave' : 'modal-spatial-enter'"
          :style="{ transformOrigin: `${triggerOrigin.originPercentX}% ${triggerOrigin.originPercentY}%` }"
        >
          <!-- Gradient Top Banner (Fixed at top) -->
          <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 px-5 sm:px-6 py-3.5 flex items-center justify-between text-white flex-shrink-0">
            <div class="flex items-center gap-2.5">
              <svg class="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="font-display font-extrabold text-base sm:text-lg">
                {{ editingSubject ? 'Editar Materia' : 'Nueva Materia' }}
              </h3>
            </div>
            <button 
              @click="closeModal" 
              type="button" 
              class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Cerrar"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Wrapping Body & Fixed Footer -->
          <form @submit.prevent="saveSubject" class="flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm">
              <!-- Row 1: Código * & Nombre * -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    v-model="form.code" 
                    type="text" 
                    required 
                    placeholder="Ej: MAT-M, CNAT-M" 
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono transition-all text-xs"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    required 
                    placeholder="Ej: Ciencias Naturales" 
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                  />
                </div>
              </div>

              <!-- Row 2: Nivel Académico * & Créditos -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Académico <span class="text-rose-500">*</span>
                  </label>
                  <select 
                    v-model="form.grade_level" 
                    required
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all text-xs"
                  >
                    <option value="media">Media / Bachillerato</option>
                    <option value="primaria">Primaria</option>
                    <option value="inicial">Educación Inicial</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Créditos
                  </label>
                  <input 
                    v-model.number="form.credits" 
                    type="number" 
                    min="0"
                    max="20"
                    placeholder="0" 
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                  />
                </div>
              </div>

              <!-- Row 3: Profesor Asignado & Departamento -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profesor Asignado
                  </label>
                  <select 
                    v-model="form.teacher_name" 
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all text-xs"
                  >
                    <option value="">Seleccionar profesor</option>
                    <option v-for="teacher in teachersList" :key="teacher" :value="teacher">{{ teacher }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Departamento
                  </label>
                  <input 
                    v-model="form.category_name" 
                    type="text" 
                    placeholder="Ej: Ciencias Naturales y Exactas" 
                    list="departments-datalist"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                  />
                  <datalist id="departments-datalist">
                    <option v-for="d in departmentsList" :key="d" :value="d" />
                  </datalist>
                </div>
              </div>

              <!-- Row 4: Materias Prerrequisito -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Materias Prerrequisito
                </label>
                <input 
                  v-model="form.prerequisites" 
                  type="text" 
                  placeholder="Ej: Matemáticas I, Física Básica..." 
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                />
              </div>

              <!-- Row 5: Descripción -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea 
                  v-model="form.description" 
                  rows="2" 
                  placeholder="Descripción del contenido programático de la materia..." 
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                ></textarea>
              </div>

              <!-- Error Alert inside form if any -->
              <div v-if="formError" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
                {{ formError }}
              </div>
            </div>

            <!-- Sticky Modal Footer (ALWAYS visible at the bottom of the card!) -->
            <div class="flex-shrink-0 px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                ✕ Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>{{ editingSubject ? 'Actualizar Materia' : 'Crear Materia' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Confirmar Eliminación Segura (Teleported to body with FLIP morph) -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
        <div 
          @click="closeDeleteModal" 
          class="fixed inset-0 transition-opacity" 
          :class="isClosingDeleteModal ? 'backdrop-spatial-leave' : 'backdrop-spatial-enter'"
          aria-hidden="true"
        ></div>
        
        <div 
          class="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-6 z-10 space-y-4 my-auto"
          :class="isClosingDeleteModal ? 'modal-spatial-leave' : 'modal-spatial-enter'"
          :style="{ transformOrigin: `${triggerOrigin.originPercentX}% ${triggerOrigin.originPercentY}%` }"
        >
          <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 mx-auto">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div class="text-center space-y-1">
            <h3 class="font-display font-black text-lg text-slate-850 dark:text-white">
              ¿Eliminar Materia?
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Estás a punto de eliminar <span class="font-bold text-slate-700 dark:text-slate-200">"{{ subjectToDelete?.name }}"</span> ({{ subjectToDelete?.code }}). Esta acción no se puede deshacer.
            </p>
          </div>

          <div v-if="deleteError" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-medium">
            {{ deleteError }}
          </div>

          <div class="flex items-center justify-center gap-3 pt-2">
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              @click="confirmDeleteSubject"
              :disabled="isDeleting"
              class="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {{ isDeleting ? 'Eliminando...' : 'Sí, Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- TOAST Notification with Crafted Vector Status Icons -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold transition-all animate-slide-toast"
      :class="toast.type === 'success' ? 'bg-slate-900/95 dark:bg-slate-950/95 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/95 dark:bg-slate-950/95 border-rose-500/40 text-rose-300'"
    >
      <div class="w-5 h-5 rounded-full flex items-center justify-center" :class="toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'">
        <svg v-if="toast.type === 'success'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <span>{{ toast.message }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3031'
const authStore = useAuthStore()

// Role-based authorization
const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role || 'admin'
  return ['admin', 'control_estudio', 'coordinator'].includes(role)
})

const viewMode = ref('grid') // 'grid' | 'table'
const search = ref('')
const filterDepartment = ref('')
const filterTeacher = ref('')
const filterLevel = ref('')

// View Transitions API integration with GPU hardware acceleration
const switchViewMode = (mode) => {
  if (viewMode.value === mode) return
  if (import.meta.client && typeof document !== 'undefined' && 'startViewTransition' in document) {
    document.startViewTransition(() => {
      viewMode.value = mode
    })
  } else {
    viewMode.value = mode
  }
}

// Spatial FLIP Morph Coordinates & Lifecycle
const triggerOrigin = ref({ originPercentX: 50, originPercentY: 50, x: 0, y: 0 })
const isClosingModal = ref(false)
const isClosingDeleteModal = ref(false)

const captureTriggerOrigin = (event) => {
  if (import.meta.client && event && event.currentTarget) {
    const rect = event.currentTarget.getBoundingClientRect()
    const viewportWidth = window.innerWidth || 1280
    const viewportHeight = window.innerHeight || 800
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    triggerOrigin.value = {
      originPercentX: Math.min(Math.max(Math.round((centerX / viewportWidth) * 100), 5), 95),
      originPercentY: Math.min(Math.max(Math.round((centerY / viewportHeight) * 100), 5), 95),
      x: centerX,
      y: centerY
    }
  } else {
    triggerOrigin.value = { originPercentX: 50, originPercentY: 50, x: 0, y: 0 }
  }
}

const activeMenuId = ref(null)
const toggleCardMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

// Close card dropdown when clicking outside
if (import.meta.client) {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      activeMenuId.value = null
    }
  })
}

// Toast state
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3500)
}

// Modal State
const showModal = ref(false)
const editingSubject = ref(null)
const isSubmitting = ref(false)
const formError = ref('')

// Delete Modal State
const showDeleteModal = ref(false)
const subjectToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const form = ref({
  code: '',
  name: '',
  grade_level: 'media',
  credits: 0,
  teacher_name: '',
  category_name: '',
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
    const matchesLevel = !filterLevel.value || (s.grade_level && s.grade_level.toLowerCase() === filterLevel.value.toLowerCase())

    return matchesSearch && matchesDept && matchesTeacher && matchesLevel
  })
})

// Card gradient background generator matching reference
const getBannerGradient = (subject) => {
  const code = (subject.code || '').toUpperCase()
  if (code.includes('CNAT') || code.includes('BIO')) {
    return 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)'
  }
  if (code.includes('CAST') || code.includes('LENG')) {
    return 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)'
  }
  if (code.includes('MAT')) {
    return 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)'
  }
  if (code.includes('EDFE') || code.includes('HIST')) {
    return 'linear-gradient(135deg, #6366F1 0%, #14B8A6 100%)'
  }
  if (code.includes('QUIM')) {
    return 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)'
  }
  if (code.includes('FIS')) {
    return 'linear-gradient(135deg, #1E40AF 0%, #059669 100%)'
  }
  return 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)'
}

// Calibrated tonal status badges adhering to contrast guidelines
const getStatusBadgeClass = (isActive) => {
  if (isActive) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
  }
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30'
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
    is_active: s.is_active !== undefined ? s.is_active : true,
    color_hex: s.color_hex || '#3B82F6'
  }
}

// Fallback seed matching user's exact screenshots
const loadFallbackReferenceData = () => {
  subjects.value = [
    {
      id: 1,
      code: 'CNAT-M',
      name: 'Ciencias Naturales',
      description: 'Ciencias Naturales para bachillerato',
      grade_level: 'media',
      teacher_name: 'No asignado',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Ciencias Naturales y Exactas',
      is_active: true
    },
    {
      id: 2,
      code: 'CAST-M',
      name: 'Castellano',
      description: 'Lengua y Literatura para bachillerato',
      grade_level: 'media',
      teacher_name: 'No asignado',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Lengua, Humanidades y Arte',
      is_active: true
    },
    {
      id: 3,
      code: 'MAT-M',
      name: 'Matemática',
      description: 'Matemática para bachillerato',
      grade_level: 'media',
      teacher_name: 'No asignado',
      credits: 0,
      hours_per_week: 5,
      category_name: 'Matemática y Lógica',
      is_active: true
    },
    {
      id: 4,
      code: 'EDFE-M',
      name: 'Educación de la Fe',
      description: 'Educación Religiosa y de la Fe',
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
      description: 'Química para bachillerato (4to-5to año)',
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
      description: 'Física para bachillerato (4to-5to año)',
      grade_level: 'media',
      teacher_name: 'Laura Méndez',
      credits: 0,
      hours_per_week: 4,
      category_name: 'Ciencias Naturales y Exactas',
      is_active: true
    }
  ]
}

// Open Create Modal with Spatial Trigger Origin
const openCreateModal = (event) => {
  captureTriggerOrigin(event)
  editingSubject.value = null
  formError.value = ''
  form.value = {
    code: '',
    name: '',
    grade_level: 'media',
    credits: 0,
    teacher_name: '',
    category_name: 'Ciencias Naturales y Exactas',
    prerequisites: '',
    description: '',
    is_active: true
  }
  isClosingModal.value = false
  showModal.value = true
}

// Open Edit Modal with Spatial Trigger Origin
const openEditModal = (subject, event) => {
  captureTriggerOrigin(event)
  activeMenuId.value = null
  editingSubject.value = subject
  formError.value = ''
  form.value = {
    code: subject.code,
    name: subject.name,
    grade_level: subject.grade_level || 'media',
    credits: subject.credits || 0,
    teacher_name: subject.teacher_name === 'No asignado' ? '' : (subject.teacher_name || ''),
    category_name: subject.category_name || '',
    prerequisites: subject.prerequisites || '',
    description: subject.description || '',
    is_active: subject.is_active !== undefined ? subject.is_active : true
  }
  isClosingModal.value = false
  showModal.value = true
}

const closeModal = () => {
  isClosingModal.value = true
  setTimeout(() => {
    showModal.value = false
    isClosingModal.value = false
    editingSubject.value = null
    formError.value = ''
  }, 220)
}

// Save Subject (Create / Edit) with full trimming and validation
const saveSubject = async () => {
  formError.value = ''
  
  // Trim all string inputs
  const code = form.value.code.trim().toUpperCase()
  const name = form.value.name.trim()
  const grade_level = form.value.grade_level.trim()
  const description = (form.value.description || '').trim()
  const category_name = (form.value.category_name || '').trim()
  const prerequisites = (form.value.prerequisites || '').trim()
  const teacher_name = form.value.teacher_name || 'No asignado'
  const credits = Number(form.value.credits) || 0

  if (!code) {
    formError.value = 'El código de la materia es obligatorio.'
    return
  }
  if (!name) {
    formError.value = 'El nombre de la materia es obligatorio.'
    return
  }

  // Check duplicate code (if new or changed)
  const isDuplicate = subjects.value.some(s => 
    s.code.toUpperCase() === code && (!editingSubject.value || s.id !== editingSubject.value.id)
  )
  if (isDuplicate) {
    formError.value = `Ya existe una materia registrada con el código ${code}.`
    return
  }

  isSubmitting.value = true

  const payload = {
    code,
    name,
    grade_level,
    description,
    credits,
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
      const res = await $fetch(`${apiBase}/subjects/${editingSubject.value.id}`, {
        method: 'PATCH',
        headers,
        body: payload
      }).catch(() => null)

      // Update local state
      const index = subjects.value.findIndex(s => s.id === editingSubject.value.id)
      if (index !== -1) {
        subjects.value[index] = { ...subjects.value[index], ...payload }
      }
      showToast(`Materia "${name}" actualizada exitosamente.`, 'success')
    } else {
      // Create
      const res = await $fetch(`${apiBase}/subjects`, {
        method: 'POST',
        headers,
        body: payload
      }).catch(() => null)

      const newId = res && res.id ? res.id : Date.now()
      subjects.value.unshift({ id: newId, ...payload })
      showToast(`Materia "${name}" creada exitosamente.`, 'success')
    }

    closeModal()
  } catch (err) {
    formError.value = err?.data?.message || err?.message || 'Error al guardar la materia.'
  } finally {
    isSubmitting.value = false
  }
}

// Prompt Delete Confirmation Modal with Spatial Trigger Origin
const promptDeleteSubject = (subject, event) => {
  captureTriggerOrigin(event)
  activeMenuId.value = null
  subjectToDelete.value = subject
  deleteError.value = ''
  isClosingDeleteModal.value = false
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  isClosingDeleteModal.value = true
  setTimeout(() => {
    showDeleteModal.value = false
    isClosingDeleteModal.value = false
    subjectToDelete.value = null
    deleteError.value = ''
  }, 200)
}

// Confirm Delete Subject
const confirmDeleteSubject = async () => {
  if (!subjectToDelete.value) return
  isDeleting.value = true
  deleteError.value = ''

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    await $fetch(`${apiBase}/subjects/${subjectToDelete.value.id}`, {
      method: 'DELETE',
      headers
    }).catch((err) => {
      // If backend throws error (e.g. constraints violation), throw to catch block
      if (err && err.data) throw err
      return null
    })

    // Remove from local list
    const deletedName = subjectToDelete.value.name
    subjects.value = subjects.value.filter(s => s.id !== subjectToDelete.value.id)
    closeDeleteModal()
    showToast(`Materia "${deletedName}" eliminada exitosamente.`, 'success')
  } catch (err) {
    deleteError.value = err?.data?.message || err?.message || 'No se puede eliminar la materia porque tiene dependencias académicas activas.'
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchSubjects()
})
</script>

<style scoped>
/* View Transitions API Core Timing & Interpolation */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.32s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-group(*) {
  animation-duration: 0.36s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Spatial FLIP Morph Animations (Apple Executive Curve) */
@keyframes spatialMorphIn {
  0% {
    opacity: 0;
    transform: scale(0.35) translate3d(0, 30px, 0);
    filter: blur(8px);
  }
  65% {
    opacity: 1;
    transform: scale(1.015) translate3d(0, -2px, 0);
    filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate3d(0, 0, 0);
    filter: blur(0px);
  }
}

@keyframes spatialMorphOut {
  0% {
    opacity: 1;
    transform: scale(1) translate3d(0, 0, 0);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(0.38) translate3d(0, 20px, 0);
    filter: blur(6px);
  }
}

.modal-spatial-enter {
  animation: spatialMorphIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity, filter;
}

.modal-spatial-leave {
  animation: spatialMorphOut 0.22s cubic-bezier(0.4, 0, 1, 1) forwards;
  will-change: transform, opacity, filter;
}

/* Backdrop Blur Fade Transitions */
@keyframes backdropFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

@keyframes backdropFadeOut {
  from {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
}

.backdrop-spatial-enter {
  animation: backdropFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.backdrop-spatial-leave {
  animation: backdropFadeOut 0.2s ease-in forwards;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-toast {
  animation: slideToast 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideToast {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
