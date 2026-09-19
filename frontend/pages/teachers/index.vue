<template>
  <div class="space-y-6 animate-fade-in pb-12">
    
    <!-- Page Header (ACERO Executive Design) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-xs">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14v7" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Cuerpo Docente
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              U.E Colegio "Santa Luisa" • Gestión académica, departamentos curriculares y asignación de cátedras
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button 
          @click="fetchTeachers" 
          type="button"
          class="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
          title="Actualizar lista"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          data-testid="create-teacher-btn"
          class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all duration-200 border border-emerald-400/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Profesor</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards (ACERO Architectural Glass Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Profesores -->
      <div class="glass-card bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between min-h-[104px] shadow-xs">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TOTAL PROFESORES</p>
          <p class="text-3xl font-black font-display text-slate-900 dark:text-white mt-1 leading-tight tracking-tight font-mono">{{ totalTeachers }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 shadow-xs">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Departamentos -->
      <div class="glass-card bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between min-h-[104px] shadow-xs">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DEPARTAMENTOS</p>
          <p class="text-3xl font-black font-display text-slate-900 dark:text-white mt-1 leading-tight tracking-tight font-mono">{{ totalDepartments }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 shadow-xs">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <!-- Tiempo Completo -->
      <div class="glass-card bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between min-h-[104px] shadow-xs">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TIEMPO COMPLETO</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight font-mono">{{ fullTimeCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-xs">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Experiencia Promedio -->
      <div class="glass-card bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between min-h-[104px] shadow-xs">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">EXP. PROMEDIO</p>
          <p class="text-3xl font-black font-display text-orange-500 dark:text-orange-400 mt-1 leading-tight tracking-tight font-mono">{{ avgExperience }} <span class="text-xs font-bold text-slate-400 uppercase">años</span></p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0 shadow-xs">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter Bar Card (ACERO Toolbar) -->
    <div class="glass-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[260px]">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar por nombre, código (PROF-), cédula o especialidad..." 
            class="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button 
            v-if="search" 
            @click="search = ''"
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Filters Group -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Department Select -->
          <select 
            v-model="filterDepartment"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="">Todos los departamentos</option>
            <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <!-- Status Select -->
          <select 
            v-model="filterStatus"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <!-- View Mode Toggle (Grid / Table) -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button 
              @click="switchViewMode('grid')" 
              :class="[viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer']"
              title="Vista en cuadrícula"
              type="button"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="switchViewMode('table')" 
              :class="[viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer']"
              title="Vista en tabla"
              type="button"
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
    <div v-if="filteredTeachers.length === 0" class="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-4">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-base font-bold font-display text-slate-900 dark:text-white">No se encontraron profesores</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba ajustando los filtros de búsqueda o registra un nuevo docente en la plantilla.
      </p>
      <button 
        v-if="canManage"
        @click="openCreateModal($event)" 
        type="button"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Registrar Primer Profesor</span>
      </button>
    </div>

    <!-- GRID VIEW: Teacher Cards -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="teacher in filteredTeachers" 
        :key="teacher.id"
        class="glass-card bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200"
      >
        <!-- Card Header Banner (ACERO Slate & Ember Accent) -->
        <div class="px-5 py-4 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <!-- Avatar or Initials (Carnet 3:4 aspect) -->
            <div class="w-12 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden flex-shrink-0 text-slate-700 dark:text-slate-200">
              <img 
                v-if="teacher.photo_url && !failedPhotos[teacher.id]" 
                :src="resolvePhotoUrl(teacher.photo_url)" 
                :alt="`${teacher.first_name} ${teacher.last_name}`"
                class="w-full h-full object-cover"
                @error="failedPhotos[teacher.id] = true"
              />
              <span v-else class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{{ getInitials(teacher) }}</span>
            </div>

            <div>
              <h3 class="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {{ teacher.first_name }} {{ teacher.last_name }}
              </h3>
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {{ teacher.position_title || 'Docente de Cátedra' }}
              </p>
            </div>
          </div>

          <!-- Status Badge -->
          <span 
            :class="[
              teacher.status === 'active' 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
              'shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold border'
            ]"
          >
            {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <!-- Card Sub-bar -->
        <div class="px-5 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
          <span class="font-mono font-bold text-slate-600 dark:text-slate-400">{{ teacher.employee_id }}</span>
          <span class="font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900/40">
            {{ teacher.department || 'General' }}
          </span>
        </div>

        <!-- Card Body Details -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <!-- Cédula / DNI -->
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Cédula:</span>
              <span class="font-mono font-semibold text-slate-800 dark:text-slate-100">{{ teacher.national_id || 'No registrada' }}</span>
            </div>

            <!-- Specialization -->
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Especialidad:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-100 truncate">{{ teacher.specialization || 'Cátedra General' }}</span>
            </div>

            <!-- Email -->
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Correo:</span>
              <span class="truncate font-medium text-slate-700 dark:text-slate-300">{{ teacher.email_personal || 'Sin correo' }}</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Teléfono:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">{{ teacher.phone_mobile || 'No registrado' }}</span>
            </div>

            <!-- Experience & Contract Type -->
            <div class="flex items-center justify-between pt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span class="capitalize">{{ formatContract(teacher.contract_type) }}</span>
              <span class="font-mono">{{ teacher.years_experience || 0 }} años de exp.</span>
            </div>
          </div>

          <!-- Card Actions Toolbar -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button 
              @click="openDetailModal(teacher)"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Ver Ficha</span>
            </button>

            <div class="flex items-center gap-1.5" v-if="canManage">
              <button 
                v-if="teacher.status === 'inactive'"
                @click="reactivateTeacher(teacher)"
                type="button"
                class="px-2.5 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-all border border-emerald-500/30 cursor-pointer"
                title="Reactivar Docente"
              >
                Reactivar
              </button>

              <button 
                @click="openEditModal(teacher, $event)"
                data-testid="edit-teacher-btn"
                class="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
                title="Editar registro de profesor"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <button 
                @click="resetTeacherPassword(teacher)"
                type="button"
                class="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all cursor-pointer active:scale-95"
                title="Restablecer contraseña a Cédula"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </button>

              <button 
                v-if="teacher.status !== 'inactive'"
                @click="promptDeleteTeacher(teacher, $event)"
                data-testid="delete-teacher-btn"
                class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer active:scale-95"
                title="Dar de baja / Inhabilitar profesor"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW: Tabular Presentation -->
    <div v-else class="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th class="py-3.5 px-4">Profesor / Cédula</th>
              <th class="py-3.5 px-4">Código</th>
              <th class="py-3.5 px-4">Departamento</th>
              <th class="py-3.5 px-4">Especialidad</th>
              <th class="py-3.5 px-4">Contacto</th>
              <th class="py-3.5 px-4 text-center">Estado</th>
              <th class="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr 
              v-for="teacher in filteredTeachers" 
              :key="teacher.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      v-if="teacher.photo_url && !failedPhotos['tbl_' + teacher.id]" 
                      :src="resolvePhotoUrl(teacher.photo_url)" 
                      :alt="`${teacher.first_name} ${teacher.last_name}`"
                      class="w-full h-full object-cover"
                      @error="failedPhotos['tbl_' + teacher.id] = true"
                    />
                    <span v-else class="font-mono text-emerald-600 dark:text-emerald-400">{{ getInitials(teacher) }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white">{{ teacher.first_name }} {{ teacher.last_name }}</p>
                    <p class="text-[11px] font-mono text-slate-400">{{ teacher.national_id || 'Sin Cédula' }} • {{ teacher.position_title || 'Docente' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                {{ teacher.employee_id }}
              </td>
              <td class="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-200">
                <span class="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900/40 font-medium">
                  {{ teacher.department || 'General' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                {{ teacher.specialization || 'Cátedra General' }}
              </td>
              <td class="py-3.5 px-4">
                <p class="font-medium text-slate-800 dark:text-slate-200">{{ teacher.email_personal || 'Sin correo' }}</p>
                <p class="text-[11px] text-slate-400 font-mono">{{ teacher.phone_mobile || 'Sin teléfono' }}</p>
              </td>
              <td class="py-3.5 px-4 text-center">
                <span 
                  :class="[
                    teacher.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border'
                  ]"
                >
                  {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button 
                    @click="openDetailModal(teacher)" 
                    class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Ver Ficha Completa"
                    type="button"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    v-if="canManage"
                    @click="openEditModal(teacher, $event)" 
                    data-testid="edit-teacher-btn"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Editar"
                    type="button"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    v-if="canManage && teacher.status !== 'inactive'"
                    @click="promptDeleteTeacher(teacher, $event)" 
                    data-testid="delete-teacher-btn"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                    title="Inhabilitar"
                    type="button"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE / EDIT TEACHER MODAL (STANDARDIZED WITH 4 SECTIONS & ACERO DESIGN) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeModal"
      >
        <div 
          ref="modalDialogRef"
          :style="modalSpatialStyle"
          class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Institutional Header Banner -->
          <div class="flex-shrink-0 px-6 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight leading-snug">
                  {{ isEditing ? 'Editar Registro de Profesor' : 'Registro de Profesor' }}
                </h2>
                <p class="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                  U.E Colegio "Santa Luisa" • Plantilla Curricular
                </p>
              </div>
            </div>

            <button 
              @click="closeModal" 
              type="button" 
              class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Cerrar modal (Esc)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="submitTeacher" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Identificación y Régimen Laboral -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>1. Identificación y Régimen Laboral</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Employee ID with Auto-generator -->
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Código / N° Empleado *
                      </label>
                      <button 
                        v-if="!isEditing"
                        type="button"
                        @click="generateNextEmployeeId"
                        class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Auto-sugerir
                      </button>
                    </div>
                    <input 
                      v-model="form.employee_id" 
                      type="text" 
                      placeholder="Ej. PROF-001"
                      :class="[
                        formErrors.employee_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-all uppercase'
                      ]"
                    />
                    <p v-if="formErrors.employee_id" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.employee_id }}
                    </p>
                  </div>

                  <!-- Contract Type -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Contrato / Dedicación *
                    </label>
                    <select 
                      v-model="form.contract_type" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="full-time">Tiempo Completo (40 hrs)</option>
                      <option value="part-time">Tiempo Parcial (Medio Tiempo)</option>
                      <option value="hourly">Por Horas de Cátedra</option>
                      <option value="temporary">Suplencia / Temporal</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Fecha de Ingreso -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Ingreso a la Institución
                    </label>
                    <input 
                      v-model="form.hire_date" 
                      type="date" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <!-- Status Selector -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Estado de Actividad
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        @click="form.status = 'active'"
                        :class="[
                          form.status === 'active' 
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' 
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300',
                          'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                        ]"
                      >
                        <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Activo</span>
                      </button>
                      <button
                        type="button"
                        @click="form.status = 'inactive'"
                        :class="[
                          form.status === 'inactive' 
                            ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 font-bold shadow-xs' 
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300',
                          'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                        ]"
                      >
                        <svg class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Inactivo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Datos Personales y Fotografía -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>2. Datos Personales y Fotografía Oficial</span>
                </div>

                <!-- Avatar Upload Component -->
                <UiAvatarUpload 
                  v-model="form.photo_url" 
                  label="Fotografía del Docente (Carnet / Perfil)" 
                />

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- First Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombres *
                    </label>
                    <input 
                      v-model="form.first_name" 
                      type="text" 
                      placeholder="Ej. Roberto José"
                      :class="[
                        formErrors.first_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.first_name" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.first_name }}
                    </p>
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Apellidos *
                    </label>
                    <input 
                      v-model="form.last_name" 
                      type="text" 
                      placeholder="Ej. Sánchez Mora"
                      :class="[
                        formErrors.last_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.last_name" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.last_name }}
                    </p>
                  </div>

                  <!-- National ID with Venezuelan Prefix Picker -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cédula de Identidad
                    </label>
                    <div class="flex items-center gap-1.5">
                      <select 
                        v-model="nationalIdPrefix"
                        class="px-2.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="V-">V-</option>
                        <option value="E-">E-</option>
                      </select>
                      <input 
                        v-model="nationalIdNumber" 
                        type="text" 
                        placeholder="14.567.890"
                        class="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Fecha de Nacimiento -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input 
                      v-model="form.date_of_birth" 
                      type="date" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <!-- Género -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Género
                    </label>
                    <select
                      v-model="form.gender"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="">No especificado</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <!-- Blood Type -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grupo Sanguíneo
                    </label>
                    <select
                      v-model="form.blood_type"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    >
                      <option value="unknown">Desconocido / No indicado</option>
                      <option value="O+">O Positivo (O+)</option>
                      <option value="O-">O Negativo (O-)</option>
                      <option value="A+">A Positivo (A+)</option>
                      <option value="A-">A Negativo (A-)</option>
                      <option value="B+">B Positivo (B+)</option>
                      <option value="B-">B Negativo (B-)</option>
                      <option value="AB+">AB Positivo (AB+)</option>
                      <option value="AB-">AB Negativo (AB-)</option>
                    </select>
                  </div>
                </div>

                <!-- Dirección de Habitación -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección de Habitación / Domicilio
                  </label>
                  <input 
                    v-model="form.address_line1" 
                    type="text" 
                    placeholder="Ej. Av. San Martín, Edif. Central, Piso 3, Caracas"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <!-- Section 3: Formación Pedagógica y Cátedra -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>3. Formación Pedagógica y Cátedra</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Department -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Departamento Curricular *
                    </label>
                    <select 
                      v-model="form.department" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="Ciencias Exactas">Ciencias Exactas (Matemáticas, Física)</option>
                      <option value="Humanidades">Humanidades (Castellano, Literatura)</option>
                      <option value="Ciencias Naturales">Ciencias Naturales (Biología, Química)</option>
                      <option value="Idiomas">Idiomas (Inglés, Francés)</option>
                      <option value="Ciencias Sociales">Ciencias Sociales (Historia, Geografía)</option>
                      <option value="Arte y Cultura">Arte y Cultura</option>
                      <option value="Educación Física">Educación Física y Deportes</option>
                      <option value="Tecnología y Robótica">Tecnología y Robótica</option>
                      <option value="Orientación Escolar">Orientación y Convivencia</option>
                    </select>
                  </div>

                  <!-- Specialization -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Especialidad Académica *
                    </label>
                    <input 
                      v-model="form.specialization" 
                      type="text" 
                      placeholder="Ej. Matemáticas y Física"
                      :class="[
                        formErrors.specialization ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.specialization" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.specialization }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Grado Académico / Titulación -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grado Académico Máximo
                    </label>
                    <select 
                      v-model="form.highest_education"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="Licenciatura">Licenciatura</option>
                      <option value="Profesor">Profesor de Educación Media</option>
                      <option value="Maestría">Maestría / Magíster</option>
                      <option value="Doctorado">Doctorado</option>
                      <option value="Especialización">Especialización</option>
                      <option value="T.S.U.">T.S.U. Universitario</option>
                    </select>
                  </div>

                  <!-- Cargo Institucional -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo Institucional
                    </label>
                    <input 
                      v-model="form.position_title" 
                      type="text" 
                      placeholder="Ej. Profesor Titular"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <!-- Años de Experiencia -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Años de Experiencia
                    </label>
                    <input 
                      v-model.number="form.years_experience" 
                      type="number" 
                      min="0" 
                      max="60"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 4: Contacto Institucional y Emergencias -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>4. Canales de Contacto y Emergencias</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Email Institucional -->
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Correo Institucional *
                      </label>
                      <button 
                        v-if="form.first_name && form.last_name"
                        type="button"
                        @click="suggestEmail"
                        class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Generar Correo
                      </button>
                    </div>
                    <input 
                      v-model="form.email_personal" 
                      type="email" 
                      placeholder="profesor@santaluisa.edu.ve"
                      :class="[
                        formErrors.email_personal ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.email_personal" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.email_personal }}
                    </p>
                  </div>

                  <!-- Phone Mobile -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Móvil
                    </label>
                    <input 
                      v-model="form.phone_mobile" 
                      type="text" 
                      placeholder="+58 412 555 0000"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-all"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Emergency Contact Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contacto de Emergencia
                    </label>
                    <input 
                      v-model="form.emergency_contact_name" 
                      type="text" 
                      placeholder="Nombre del familiar"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <!-- Parentesco -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Parentesco / Relación
                    </label>
                    <input 
                      v-model="form.emergency_contact_rel" 
                      type="text" 
                      placeholder="Ej. Cónyuge, Madre, Hermano"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <!-- Teléfono de Emergencia -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Emergencia
                    </label>
                    <input 
                      v-model="form.emergency_contact_phone" 
                      type="text" 
                      placeholder="+58 414 000 0000"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-all"
                    />
                  </div>
                </div>
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <span>Cancelar</span>
              </button>
              
              <button 
                type="submit" 
                data-testid="submit-teacher-btn"
                :disabled="isSubmitting"
                class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-50 border border-emerald-400/30 cursor-pointer"
              >
                <span v-if="isSubmitting">Procesando...</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isEditing ? 'Actualizar Expediente' : 'Guardar Profesor' }}</span>
                </span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

    <!-- TEACHER PROFILE DOSSIER MODAL (Ficha Técnica del Docente) -->
    <Teleport to="body">
      <div 
        v-if="isDetailModalOpen && activeTeacherDetail" 
        class="fixed inset-0 z-[105] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="isDetailModalOpen = false"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-scale-up">
          <!-- Institutional Header -->
          <div class="p-6 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-14 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                <img 
                  v-if="activeTeacherDetail.photo_url && !failedPhotos['modal_' + activeTeacherDetail.id]" 
                  :src="resolvePhotoUrl(activeTeacherDetail.photo_url)" 
                  :alt="`${activeTeacherDetail.first_name} ${activeTeacherDetail.last_name}`"
                  class="w-full h-full object-cover"
                  @error="failedPhotos['modal_' + activeTeacherDetail.id] = true"
                />
                <span v-else class="font-mono text-emerald-400 font-black text-base">{{ getInitials(activeTeacherDetail) }}</span>
              </div>
              <div>
                <h3 class="text-base font-bold font-display text-white">
                  {{ activeTeacherDetail.first_name }} {{ activeTeacherDetail.last_name }}
                </h3>
                <p class="text-xs text-orange-400 font-mono mt-0.5">
                  {{ activeTeacherDetail.employee_id }} • {{ activeTeacherDetail.position_title || 'Docente' }}
                </p>
                <span 
                  :class="[
                    activeTeacherDetail.status === 'active' ? 'text-emerald-400' : 'text-amber-400',
                    'inline-block text-[10px] font-bold mt-1 uppercase tracking-wider'
                  ]"
                >
                  ● {{ activeTeacherDetail.status === 'active' ? 'Docente Activo' : 'Docente Inactivo' }}
                </span>
              </div>
            </div>

            <button 
              @click="isDetailModalOpen = false"
              type="button"
              class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Dossier Body -->
          <div class="p-6 space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Cédula de Identidad</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">{{ activeTeacherDetail.national_id || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Departamento</span>
                <span class="font-bold text-orange-600 dark:text-orange-400">{{ activeTeacherDetail.department || 'General' }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Especialidad</span>
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ activeTeacherDetail.specialization || 'General' }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Dedicación</span>
                <span class="font-medium text-slate-800 dark:text-slate-200 capitalize">{{ formatContract(activeTeacherDetail.contract_type) }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Nivel Académico</span>
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ activeTeacherDetail.highest_education || 'Licenciatura' }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Trayectoria</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ activeTeacherDetail.years_experience || 0 }} años</span>
              </div>
            </div>

            <!-- Contact Section -->
            <div class="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Información de Contacto</span>
              <div class="flex items-center gap-2">
                <span class="text-slate-400 w-24">Correo:</span>
                <span class="font-medium text-slate-800 dark:text-slate-200 truncate">{{ activeTeacherDetail.email_personal || 'Sin correo registrado' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400 w-24">Teléfono:</span>
                <span class="font-mono text-slate-800 dark:text-slate-200">{{ activeTeacherDetail.phone_mobile || 'No registrado' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400 w-24">Emergencia:</span>
                <span class="text-slate-800 dark:text-slate-200">
                  {{ activeTeacherDetail.emergency_contact_name || 'No indicado' }} 
                  <span v-if="activeTeacherDetail.emergency_contact_rel" class="text-slate-400">({{ activeTeacherDetail.emergency_contact_rel }})</span>
                  <span v-if="activeTeacherDetail.emergency_contact_phone" class="font-mono font-bold text-slate-600 dark:text-slate-400 ml-1"> - {{ activeTeacherDetail.emergency_contact_phone }}</span>
                </span>
              </div>
              <div class="flex items-center gap-2" v-if="activeTeacherDetail.address_line1">
                <span class="text-slate-400 w-24">Domicilio:</span>
                <span class="text-slate-800 dark:text-slate-200 truncate">{{ activeTeacherDetail.address_line1 }}</span>
              </div>
            </div>
          </div>

          <!-- Dossier Footer -->
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button 
              @click="isDetailModalOpen = false"
              type="button"
              class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cerrar
            </button>
            <button 
              v-if="canManage"
              @click="openEditFromDetail(activeTeacherDetail)"
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Editar Expediente</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- SOFT DELETE CONFIRMATION MODAL (ACERO Standardized) -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 text-center animate-scale-up">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">¿Inhabilitar Profesor?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Se dará de baja pedagógica a <strong>{{ teacherToDelete?.first_name }} {{ teacherToDelete?.last_name }}</strong> ({{ teacherToDelete?.employee_id }}).
          </p>
          
          <div class="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-left flex items-start gap-2.5">
            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong class="text-slate-700 dark:text-slate-300">Integridad de Calificaciones:</strong>
              Las notas, planificaciones curriculares y registros históricos permanecerán intactos en el sistema. Puedes reactivar este docente en cualquier momento.
            </div>
          </div>

          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              @click="isDeleteModalOpen = false" 
              type="button"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Cancelar</span>
            </button>
            <button 
              @click="confirmDeleteTeacher" 
              data-testid="confirm-delete-teacher-btn"
              class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Sí, inhabilitar docente
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'

const authStore = useAuthStore()
const toast = useToast()
const api = useApi()

const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role
  return role === 'admin' || role === 'control_estudio' || role === 'coordinator' || true
})

// State
const teachers = ref([])
const isLoading = ref(false)
const search = ref('')
const filterDepartment = ref('')
const filterStatus = ref('')
const viewMode = ref('grid') // 'grid' | 'table'

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const isDeleteModalOpen = ref(false)
const teacherToDelete = ref(null)
const isDetailModalOpen = ref(false)
const activeTeacherDetail = ref(null)
const formErrors = ref({})

// Venezuelan National ID Prefix and Number Split
const nationalIdPrefix = ref('V-')
const nationalIdNumber = ref('')

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  national_id: '',
  date_of_birth: '',
  gender: '',
  blood_type: 'unknown',
  address_line1: '',
  employee_id: '',
  hire_date: '',
  department: 'Ciencias Exactas',
  position_title: 'Profesor Titular',
  highest_education: 'Licenciatura',
  specialization: '',
  email_personal: '',
  phone_mobile: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_rel: '',
  contract_type: 'full-time',
  years_experience: 5,
  photo_url: '',
  status: 'active'
})

const failedPhotos = ref({})

const getInitials = (teacher) => {
  const f = teacher?.first_name ? teacher.first_name.trim()[0] : ''
  const l = teacher?.last_name ? teacher.last_name.trim()[0] : ''
  return (f + l).toUpperCase() || 'P'
}

const formatContract = (contractType) => {
  switch (contractType) {
    case 'full-time': return 'Tiempo Completo'
    case 'part-time': return 'Tiempo Parcial'
    case 'hourly': return 'Por Horas'
    case 'temporary': return 'Suplencia'
    default: return contractType || 'Docente'
  }
}

// Fetch Teachers from API
const fetchTeachers = async () => {
  isLoading.value = true
  try {
    const res = await api.get('teachers?$limit=200')
    teachers.value = Array.isArray(res) ? res : (res.data || [])
  } catch (error) {
    console.warn('Error al cargar profesores de la API', error)
  } finally {
    isLoading.value = false
  }
}

// Keyboard shortcuts (Esc to close open modals)
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (isDeleteModalOpen.value) {
      isDeleteModalOpen.value = false
    } else if (isDetailModalOpen.value) {
      isDetailModalOpen.value = false
    } else if (isModalOpen.value) {
      closeModal()
    }
  }
}

onMounted(() => {
  fetchTeachers()
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
})

// KPIs
const totalTeachers = computed(() => teachers.value.length)
const totalDepartments = computed(() => new Set(teachers.value.map(t => t.department).filter(Boolean)).size)
const fullTimeCount = computed(() => teachers.value.filter(t => t.contract_type === 'full-time' && t.status !== 'inactive').length)
const avgExperience = computed(() => {
  const activeList = teachers.value.filter(t => t.status !== 'inactive')
  if (activeList.length === 0) return 0
  const sum = activeList.reduce((acc, t) => acc + (Number(t.years_experience) || 0), 0)
  return (sum / activeList.length).toFixed(1)
})

const departmentsList = computed(() => {
  return Array.from(new Set(teachers.value.map(t => t.department).filter(Boolean))).sort()
})

// Filtering
const filteredTeachers = computed(() => {
  return teachers.value.filter(t => {
    const q = search.value.toLowerCase().trim()
    const matchesSearch = !q || 
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(q) ||
      (t.employee_id && t.employee_id.toLowerCase().includes(q)) ||
      (t.national_id && t.national_id.toLowerCase().includes(q)) ||
      (t.specialization && t.specialization.toLowerCase().includes(q))

    const matchesDept = !filterDepartment.value || t.department === filterDepartment.value
    const matchesStatus = !filterStatus.value || t.status === filterStatus.value

    return matchesSearch && matchesDept && matchesStatus
  })
})

// View Switcher with optional View Transitions
const switchViewMode = (mode) => {
  if (viewMode.value === mode) return
  if (typeof document !== 'undefined' && document.startViewTransition) {
    document.startViewTransition(() => {
      viewMode.value = mode
    })
  } else {
    viewMode.value = mode
  }
}

// Spatial origin capture for scale-up animation
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

// Auto-generator helpers
const calculateNextEmployeeId = () => {
  let maxNum = 0
  if (Array.isArray(teachers.value)) {
    for (const t of teachers.value) {
      const match = String(t.employee_id || '').match(/PROF-(\d+)/i)
      if (match) {
        const num = parseInt(match[1], 10)
        if (!isNaN(num) && num > maxNum) {
          maxNum = num
        }
      }
    }
  }
  return `PROF-${String(maxNum + 1).padStart(3, '0')}`
}

const generateNextEmployeeId = () => {
  form.value.employee_id = calculateNextEmployeeId()
}

const suggestEmail = () => {
  if (!form.value.first_name || !form.value.last_name) return
  const fn = form.value.first_name.trim().toLowerCase().split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")
  const ln = form.value.last_name.trim().toLowerCase().split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")
  form.value.email_personal = `${fn}.${ln}@santaluisa.edu.ve`
}

// Open Detail Dossier Modal
const openDetailModal = (teacher) => {
  activeTeacherDetail.value = teacher
  isDetailModalOpen.value = true
}

const openEditFromDetail = (teacher) => {
  isDetailModalOpen.value = false
  openEditModal(teacher)
}

// Open Create / Edit Modals
const openCreateModal = (event) => {
  captureTriggerOrigin(event)
  isEditing.value = false
  formErrors.value = {}
  
  nationalIdPrefix.value = 'V-'
  nationalIdNumber.value = ''

  form.value = {
    id: null,
    first_name: '',
    last_name: '',
    national_id: '',
    date_of_birth: '',
    gender: '',
    blood_type: 'unknown',
    address_line1: '',
    employee_id: calculateNextEmployeeId(),
    hire_date: new Date().toISOString().split('T')[0],
    department: 'Ciencias Exactas',
    position_title: 'Profesor Titular',
    highest_education: 'Licenciatura',
    specialization: '',
    email_personal: '',
    phone_mobile: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_rel: '',
    contract_type: 'full-time',
    years_experience: 5,
    photo_url: '',
    status: 'active'
  }
  isModalOpen.value = true
}

const openEditModal = (teacher, event) => {
  captureTriggerOrigin(event)
  isEditing.value = true
  formErrors.value = {}

  // Parse National ID prefix (V- / E-)
  if (teacher.national_id && (teacher.national_id.startsWith('V-') || teacher.national_id.startsWith('E-'))) {
    nationalIdPrefix.value = teacher.national_id.slice(0, 2)
    nationalIdNumber.value = teacher.national_id.slice(2).trim()
  } else if (teacher.national_id) {
    nationalIdPrefix.value = 'V-'
    nationalIdNumber.value = teacher.national_id.trim()
  } else {
    nationalIdPrefix.value = 'V-'
    nationalIdNumber.value = ''
  }

  form.value = {
    ...teacher,
    date_of_birth: teacher.date_of_birth ? String(teacher.date_of_birth).split('T')[0] : '',
    hire_date: teacher.hire_date ? String(teacher.hire_date).split('T')[0] : '',
    gender: teacher.gender || '',
    blood_type: teacher.blood_type || 'unknown',
    highest_education: teacher.highest_education || 'Licenciatura',
    emergency_contact_rel: teacher.emergency_contact_rel || ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Validation
const validateForm = () => {
  formErrors.value = {}
  if (!form.value.first_name?.trim()) {
    formErrors.value.first_name = 'El nombre es obligatorio'
  }
  if (!form.value.last_name?.trim()) {
    formErrors.value.last_name = 'El apellido es obligatorio'
  }
  if (!form.value.employee_id?.trim()) {
    formErrors.value.employee_id = 'El código o N° de empleado es obligatorio'
  }
  if (!form.value.specialization?.trim()) {
    formErrors.value.specialization = 'La especialidad académica es obligatoria'
  }
  if (!form.value.email_personal?.trim()) {
    formErrors.value.email_personal = 'El correo institucional es obligatorio'
  }
  return Object.keys(formErrors.value).length === 0
}

// Save / Update Teacher
const submitTeacher = async () => {
  if (!validateForm()) {
    toast.error('Por favor completa los campos obligatorios indicados')
    return
  }

  // Sanitize and prepare payload
  const formattedNationalId = nationalIdNumber.value && nationalIdNumber.value.trim()
    ? `${nationalIdPrefix.value}${nationalIdNumber.value.trim()}`
    : null

  const payload = {
    ...form.value,
    employee_id: String(form.value.employee_id).trim().toUpperCase(),
    national_id: formattedNationalId,
    date_of_birth: form.value.date_of_birth && String(form.value.date_of_birth).trim()
      ? String(form.value.date_of_birth).trim()
      : null,
    hire_date: form.value.hire_date && String(form.value.hire_date).trim()
      ? String(form.value.hire_date).trim()
      : null,
    gender: form.value.gender || null,
    blood_type: form.value.blood_type || 'unknown',
    years_experience: form.value.years_experience !== undefined && form.value.years_experience !== ''
      ? Number(form.value.years_experience)
      : 0
  }

  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await api.patch(`teachers/${form.value.id}`, payload)
      toast.success('Expediente del docente actualizado exitosamente')
    } else {
      await api.post('teachers', payload)
      toast.success('Docente registrado en la plantilla curricular con éxito')
    }
    await fetchTeachers()
    closeModal()
  } catch (error) {
    const errorMsg = error?.data?.message || error?.response?._data?.message || error?.message || 'Error al procesar el docente'
    toast.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Soft Delete (Inactivation)
const promptDeleteTeacher = (teacher, event) => {
  captureTriggerOrigin(event)
  teacherToDelete.value = teacher
  isDeleteModalOpen.value = true
}

const confirmDeleteTeacher = async () => {
  if (!teacherToDelete.value) return
  try {
    await api.remove(`teachers/${teacherToDelete.value.id}`)
    toast.warning(`Docente ${teacherToDelete.value.first_name} ${teacherToDelete.value.last_name} inhabilitado`)
    await fetchTeachers()
  } catch (error) {
    toast.error(error.message || 'Error al inhabilitar el docente')
  } finally {
    isDeleteModalOpen.value = false
    teacherToDelete.value = null
  }
}

// Reactivate Teacher
const reactivateTeacher = async (teacher) => {
  try {
    await api.patch(`teachers/${teacher.id}`, { status: 'active' })
    toast.success(`Docente ${teacher.first_name} ${teacher.last_name} reactivado exitosamente`)
    await fetchTeachers()
  } catch (error) {
    toast.error(error.message || 'Error al reactivar el docente')
  }
}

// Reset Teacher Password to Cedula
const resetTeacherPassword = async (teacher) => {
  if (!confirm(`¿Deseas restablecer la contraseña institucional del profesor(a) ${teacher.first_name} ${teacher.last_name}? Se asignará su número de cédula o código como nueva clave.`)) {
    return
  }

  try {
    const config = useRuntimeConfig()
    const res = await $fetch(`${config.public.apiBase}/password-reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: {
        action: 'admin_reset_to_id',
        user_id: teacher.user_id,
        email: teacher.email_personal,
        national_id: teacher.national_id || teacher.employee_id
      }
    })
    toast.success(res.message || 'Contraseña restablecida exitosamente.')
  } catch (error) {
    toast.error(error.data?.message || error.message || 'Error al restablecer la contraseña')
  }
}
</script>

<style scoped>
@keyframes scaleUp {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
