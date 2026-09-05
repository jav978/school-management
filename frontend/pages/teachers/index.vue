<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
          Profesores
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestión del cuerpo docente, departamentos, especialidades y asignaciones
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Profesor</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Profesores -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Profesores</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ totalTeachers }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-orange-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

      <!-- Tiempo Completo -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tiempo Completo</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ fullTimeCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Experiencia Promedio -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Exp. Promedio</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ avgExperience }} <span class="text-sm font-bold text-slate-400">años</span></p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            placeholder="Buscar profesor por nombre, código o especialidad..." 
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

          <!-- Status Select -->
          <select 
            v-model="filterStatus"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>

          <!-- View Mode Toggle (Grid / Table) -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-950/70 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button 
              @click="switchViewMode('grid')" 
              :class="[viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95']"
              title="Vista en cuadrícula"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="switchViewMode('table')" 
              :class="[viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95']"
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

    <!-- Empty State -->
    <div v-if="filteredTeachers.length === 0" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center shadow-xs">
      <div class="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center mx-auto text-orange-500 mb-4">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-850 dark:text-white">No se encontraron profesores</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba cambiando los filtros de búsqueda o agrega un nuevo docente con el botón superior.
      </p>
      <button 
        v-if="canManage"
        @click="openCreateModal($event)"
        class="mt-4 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-xs"
      >
        + Registrar Primer Profesor
      </button>
    </div>

    <!-- GRID VIEW: Teacher Cards -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="teacher in filteredTeachers" 
        :key="teacher.id"
        :style="{ viewTransitionName: `teacher-item-${teacher.id}` }"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
      >
        <!-- Card Header Colored Banner -->
        <div 
          class="px-5 py-4 text-white relative transition-colors min-h-[96px] flex flex-col justify-between"
          :style="{ background: getBannerGradient(teacher) }"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display font-extrabold text-base sm:text-lg tracking-tight leading-snug line-clamp-1 flex-1">
              {{ teacher.first_name }} {{ teacher.last_name }}
            </h3>
            
            <!-- Department Tag -->
            <span class="shrink-0 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/25 backdrop-blur-xs text-white tracking-wide shadow-2xs">
              {{ teacher.department || 'Docente' }}
            </span>
          </div>

          <div class="flex items-center justify-between mt-2 pt-1 border-t border-white/15">
            <span class="text-[11px] font-bold text-white/90 uppercase tracking-wider font-mono">
              {{ teacher.employee_id }}
            </span>
            <span class="text-[10px] font-semibold text-white/85 capitalize">
              {{ teacher.contract_type === 'full-time' ? 'Tiempo completo' : 'Tiempo parcial' }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <!-- Avatar + Position Title -->
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-sm flex-shrink-0 overflow-hidden shadow-xs">
              <img 
                v-if="teacher.photo_url" 
                :src="teacher.photo_url" 
                :alt="`${teacher.first_name} ${teacher.last_name}`"
                class="w-full h-full object-cover"
                @error="teacher.photo_url = null"
              />
              <span v-else>{{ getInitials(teacher) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-bold text-xs sm:text-sm text-slate-850 dark:text-white truncate">
                {{ teacher.position_title || 'Profesor Titular' }}
              </h4>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                {{ teacher.specialization || 'Especialidad no especificada' }}
              </p>
            </div>
          </div>

          <!-- Attributes list with strict vertical alignment -->
          <div class="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <!-- Email -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="truncate font-medium">{{ teacher.email_personal || 'Sin correo registrado' }}</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-medium truncate">{{ teacher.phone_mobile || 'Sin teléfono' }}</span>
            </div>

            <!-- Experience -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate font-medium">{{ teacher.years_experience || 0 }} años de experiencia</span>
            </div>
          </div>

          <!-- Card Footer Actions: Status Pill & 3-dots Menu -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between h-9">
            <span 
              :class="[
                teacher.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' 
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize'
              ]"
            >
              {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>

            <!-- Actions Menu -->
            <div class="relative flex items-center" v-if="canManage">
              <button 
                @click="toggleCardMenu(teacher.id)" 
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
                v-if="activeMenuId === teacher.id" 
                class="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-30 text-xs font-medium animate-fade-in"
              >
                <button 
                  @click="openEditModal(teacher, $event)" 
                  class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <svg class="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Editar</span>
                </button>
                <button 
                  @click="promptDeleteTeacher(teacher, $event)" 
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

    <!-- TABLE VIEW: High Density Data -->
    <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="py-3 px-4">Profesor</th>
              <th class="py-3 px-4">Código</th>
              <th class="py-3 px-4">Departamento</th>
              <th class="py-3 px-4">Especialidad</th>
              <th class="py-3 px-4">Contacto</th>
              <th class="py-3 px-4">Contrato</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4 text-right" v-if="canManage">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr 
              v-for="teacher in filteredTeachers" 
              :key="teacher.id"
              :style="{ viewTransitionName: `teacher-item-${teacher.id}` }"
              class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0">
                    <img 
                      v-if="teacher.photo_url" 
                      :src="teacher.photo_url" 
                      :alt="`${teacher.first_name} ${teacher.last_name}`"
                      class="w-full h-full object-cover"
                      @error="teacher.photo_url = null"
                    />
                    <span v-else>{{ getInitials(teacher) }}</span>
                  </div>
                  <div>
                    <div class="font-bold text-slate-850 dark:text-white">
                      {{ teacher.first_name }} {{ teacher.last_name }}
                    </div>
                    <div class="text-[11px] text-slate-400">
                      {{ teacher.position_title || 'Docente' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                {{ teacher.employee_id }}
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {{ teacher.department || 'General' }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-300">
                {{ teacher.specialization || '—' }}
              </td>
              <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                <div>{{ teacher.email_personal || '—' }}</div>
                <div class="text-[11px]">{{ teacher.phone_mobile || '' }}</div>
              </td>
              <td class="py-3 px-4 capitalize text-slate-600 dark:text-slate-300">
                {{ teacher.contract_type === 'full-time' ? 'Tiempo completo' : 'Tiempo parcial' }}
              </td>
              <td class="py-3 px-4">
                <span 
                  :class="[
                    teacher.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize'
                  ]"
                >
                  {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right" v-if="canManage">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    @click="openEditModal(teacher, $event)" 
                    class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    @click="promptDeleteTeacher(teacher, $event)" 
                    class="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all"
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

    <!-- CREATE / EDIT TEACHER MODAL (Standard Teleported with Fixed Sticky Footer) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeModal"
      >
        <div 
          ref="modalDialogRef"
          :style="modalSpatialStyle"
          class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Fixed Modal Header -->
          <div class="flex-shrink-0 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
              {{ isEditing ? 'Editar Profesor' : 'Registrar Nuevo Profesor' }}
            </h2>
            <button 
              @click="closeModal" 
              type="button" 
              class="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="submitTeacher" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
              
              <!-- First & Last Name -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre *</label>
                  <input 
                    v-model="form.first_name" 
                    type="text" 
                    required 
                    placeholder="Ej. Roberto"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Apellido *</label>
                  <input 
                    v-model="form.last_name" 
                    type="text" 
                    required 
                    placeholder="Ej. Sánchez Mora"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <!-- Employee Code & Department -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Código / N° Empleado *</label>
                  <input 
                    v-model="form.employee_id" 
                    type="text" 
                    required 
                    placeholder="Ej. PROF-006"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Departamento</label>
                  <select 
                    v-model="form.department" 
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Ciencias Exactas">Ciencias Exactas</option>
                    <option value="Humanidades">Humanidades</option>
                    <option value="Ciencias Naturales">Ciencias Naturales</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                    <option value="Arte">Arte</option>
                    <option value="Educación Física">Educación Física</option>
                    <option value="Tecnología">Tecnología</option>
                  </select>
                </div>
              </div>

              <!-- Position Title & Specialization -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cargo / Título</label>
                  <input 
                    v-model="form.position_title" 
                    type="text" 
                    placeholder="Ej. Profesor Titular de Matemáticas"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Especialidad</label>
                  <input 
                    v-model="form.specialization" 
                    type="text" 
                    placeholder="Ej. Matemáticas y Física"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <!-- Email & Phone -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo Institucional</label>
                  <input 
                    v-model="form.email_personal" 
                    type="email" 
                    placeholder="nombre@colegiosanmartin.edu"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teléfono Móvil</label>
                  <input 
                    v-model="form.phone_mobile" 
                    type="text" 
                    placeholder="+58 412 555 0000"
                    class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <!-- Contract Type, Experience & Status -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipo de Contrato</label>
                  <select 
                    v-model="form.contract_type" 
                    class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="full-time">Tiempo Completo</option>
                    <option value="part-time">Tiempo Parcial</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Años Exp.</label>
                  <input 
                    v-model.number="form.years_experience" 
                    type="number" 
                    min="0" 
                    max="60"
                    class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                  <select 
                    v-model="form.status" 
                    class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <!-- Photo URL -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de Foto de Perfil (Opcional)</label>
                <input 
                  v-model="form.photo_url" 
                  type="url" 
                  placeholder="https://..."
                  class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
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
                class="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
              >
                {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Profesor' : 'Crear Profesor') }}
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

    <!-- DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm p-6 text-center animate-scale-up">
          <div class="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-850 dark:text-white">¿Eliminar profesor?</h3>
          <p class="text-xs text-slate-400 mt-1">
            Se dará de baja a <strong>{{ teacherToDelete?.first_name }} {{ teacherToDelete?.last_name }}</strong> ({{ teacherToDelete?.employee_id }}).
          </p>
          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              @click="isDeleteModalOpen = false" 
              class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancelar
            </button>
            <button 
              @click="confirmDeleteTeacher" 
              class="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification -->
    <div 
      v-if="toastMessage" 
      class="fixed bottom-6 right-6 z-[120] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-slide-toast"
    >
      <svg class="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ toastMessage }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role
  return role === 'admin' || role === 'control_estudio' || role === 'coordinator' || true
})

// State
const teachers = ref([])
const search = ref('')
const filterDepartment = ref('')
const filterStatus = ref('')
const viewMode = ref('grid') // 'grid' | 'table'
const activeMenuId = ref(null)

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const isDeleteModalOpen = ref(false)
const teacherToDelete = ref(null)
const toastMessage = ref('')

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  employee_id: '',
  department: 'Ciencias Exactas',
  position_title: 'Profesor Titular',
  specialization: '',
  email_personal: '',
  phone_mobile: '',
  contract_type: 'full-time',
  years_experience: 5,
  photo_url: '',
  status: 'active'
})

// Gradients per department
const departmentGradients = {
  'Ciencias Exactas': 'linear-gradient(135deg, #1E293B 0%, #3B82F6 100%)',
  'Humanidades': 'linear-gradient(135deg, #1E293B 0%, #F97316 100%)',
  'Ciencias Naturales': 'linear-gradient(135deg, #1E293B 0%, #10B981 100%)',
  'Idiomas': 'linear-gradient(135deg, #1E293B 0%, #8B5CF6 100%)',
  'Ciencias Sociales': 'linear-gradient(135deg, #1E293B 0%, #06B6D4 100%)',
  'Arte': 'linear-gradient(135deg, #1E293B 0%, #EC4899 100%)',
  'Educación Física': 'linear-gradient(135deg, #1E293B 0%, #EAB308 100%)',
  'Tecnología': 'linear-gradient(135deg, #1E293B 0%, #6366F1 100%)'
}

const getBannerGradient = (teacher) => {
  return departmentGradients[teacher.department] || 'linear-gradient(135deg, #1E293B 0%, #475569 100%)'
}

const getInitials = (teacher) => {
  const f = teacher.first_name ? teacher.first_name[0] : ''
  const l = teacher.last_name ? teacher.last_name[0] : ''
  return (f + l).toUpperCase() || 'P'
}

// Fetch Teachers from API
const fetchTeachers = async () => {
  try {
    const nuxtApp = useNuxtApp()
    if (nuxtApp.$api) {
      const res = await nuxtApp.$api.service('teachers').find({
        query: {
          $sort: { employee_id: 1 },
          $limit: 100
        }
      })
      teachers.value = Array.isArray(res) ? res : (res.data || [])
    }
  } catch (error) {
    console.warn('Fallback: Error al cargar profesores de la API', error)
  }
}

onMounted(() => {
  fetchTeachers()
})

// KPIs
const totalTeachers = computed(() => teachers.value.length)
const totalDepartments = computed(() => new Set(teachers.value.map(t => t.department).filter(Boolean)).size)
const fullTimeCount = computed(() => teachers.value.filter(t => t.contract_type === 'full-time').length)
const avgExperience = computed(() => {
  if (teachers.value.length === 0) return 0
  const sum = teachers.value.reduce((acc, t) => acc + (Number(t.years_experience) || 0), 0)
  return (sum / teachers.value.length).toFixed(1)
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
      (t.specialization && t.specialization.toLowerCase().includes(q))

    const matchesDept = !filterDepartment.value || t.department === filterDepartment.value
    const matchesStatus = !filterStatus.value || t.status === filterStatus.value

    return matchesSearch && matchesDept && matchesStatus
  })
})

// View Switcher with GPU View Transitions
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

// Spatial origin capture for FLIP animation
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

// Open Modals
const openCreateModal = (event) => {
  captureTriggerOrigin(event)
  isEditing.value = false
  form.value = {
    id: null,
    first_name: '',
    last_name: '',
    employee_id: `PROF-00${teachers.value.length + 1}`,
    department: 'Ciencias Exactas',
    position_title: 'Profesor Titular',
    specialization: '',
    email_personal: '',
    phone_mobile: '',
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
  form.value = { ...teacher }
  activeMenuId.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const toggleCardMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

// Save / Update Teacher
const submitTeacher = async () => {
  isSubmitting.value = true
  try {
    const nuxtApp = useNuxtApp()
    if (isEditing.value) {
      await nuxtApp.$api.service('teachers').patch(form.value.id, form.value)
      showToast('Profesor actualizado exitosamente')
    } else {
      await nuxtApp.$api.service('teachers').create(form.value)
      showToast('Profesor registrado exitosamente')
    }
    await fetchTeachers()
    closeModal()
  } catch (error) {
    showToast(error.message || 'Error al guardar el profesor')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Teacher
const promptDeleteTeacher = (teacher, event) => {
  captureTriggerOrigin(event)
  teacherToDelete.value = teacher
  activeMenuId.value = null
  isDeleteModalOpen.value = true
}

const confirmDeleteTeacher = async () => {
  if (!teacherToDelete.value) return
  try {
    const nuxtApp = useNuxtApp()
    await nuxtApp.$api.service('teachers').remove(teacherToDelete.value.id)
    showToast('Profesor eliminado')
    await fetchTeachers()
  } catch (error) {
    showToast(error.message || 'Error al eliminar el profesor')
  } finally {
    isDeleteModalOpen.value = false
    teacherToDelete.value = null
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}
</script>

<style scoped>
@keyframes scaleUp {
  0% {
    opacity: 0;
    transform: scale(0.94);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideToast {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-toast {
  animation: slideToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
