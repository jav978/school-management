<template>
  <div class="space-y-6 animate-fade-in">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">👨‍🏫</span>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Cuerpo Docente
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Gestión de profesores, departamentos, especialidades y cátedras
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Profesor</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Profesores -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Profesores</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ totalTeachers }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Departamentos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Departamentos</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ totalDepartments }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <!-- Tiempo Completo -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Tiempo Completo</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ fullTimeCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Experiencia Promedio -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Exp. Promedio</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ avgExperience }} <span class="text-sm font-bold text-slate-400">años</span></p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            placeholder="Buscar profesor por nombre, código o especialidad..." 
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 focus:border-brand-purple transition-all"
          />
        </div>

        <!-- Filters Group -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Department Select -->
          <select 
            v-model="filterDepartment"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los departamentos</option>
            <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <!-- Status Select -->
          <select 
            v-model="filterStatus"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos (Deshabilitados)</option>
          </select>

          <!-- View Mode Toggle (Grid / Table) -->
          <div class="flex items-center bg-slate-100 dark:bg-[#110926] p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button 
              @click="switchViewMode('grid')" 
              :class="[viewMode === 'grid' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95']"
              title="Vista en cuadrícula"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="switchViewMode('table')" 
              :class="[viewMode === 'table' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all active:scale-95']"
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
    <div v-if="filteredTeachers.length === 0" class="glass-card rounded-2xl p-12 text-center shadow-sm">
      <div class="w-16 h-16 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-secondary/30 flex items-center justify-center mx-auto text-brand-primary dark:text-brand-secondary mb-4">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white">No se encontraron profesores</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba cambiando los filtros de búsqueda o agrega un nuevo docente con el botón superior.
      </p>
      <button 
        v-if="canManage"
        @click="openCreateModal($event)"
        class="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-purple text-white font-bold text-xs transition-all shadow-md active:scale-95"
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
        class="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
      >
        <!-- Card Header Colored Banner -->
        <div 
          class="px-5 py-4 text-white relative transition-colors min-h-[96px] flex flex-col justify-between bg-gradient-to-r from-brand-primary via-brand-purple to-slate-900 border-b border-white/10"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <!-- Avatar or Initials -->
              <div class="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-sm shadow-sm overflow-hidden flex-shrink-0">
                <img 
                  v-if="teacher.photo_url" 
                  :src="teacher.photo_url" 
                  :alt="`${teacher.first_name} ${teacher.last_name}`"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display='none'"
                />
                <span v-else>{{ getInitials(teacher) }}</span>
              </div>

              <div>
                <h3 class="font-display font-extrabold text-base tracking-tight leading-snug text-white">
                  {{ teacher.first_name }} {{ teacher.last_name }}
                </h3>
                <p class="text-[11px] font-semibold text-brand-gold mt-0.5">
                  {{ teacher.position_title || 'Docente de Cátedra' }}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <span 
              :class="[
                teacher.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
                'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold'
              ]"
            >
              {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <div class="flex items-center justify-between mt-2 pt-1 border-t border-white/15 text-[10px] font-bold text-slate-200">
            <span class="font-mono tracking-wider">{{ teacher.employee_id }}</span>
            <span class="text-brand-secondary">{{ teacher.department }}</span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <!-- Specialization -->
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Especialidad:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-100 truncate">{{ teacher.specialization || 'General' }}</span>
            </div>

            <!-- Email -->
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Correo:</span>
              <span class="truncate font-medium text-brand-purple dark:text-brand-secondary">{{ teacher.email_personal || 'Sin correo' }}</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400 font-bold w-20 flex-shrink-0">Teléfono:</span>
              <span class="font-medium text-slate-700 dark:text-slate-200">{{ teacher.phone_mobile || 'No registrado' }}</span>
            </div>

            <!-- Experience & Contract -->
            <div class="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10">
              <span>{{ teacher.contract_type === 'full-time' ? 'Tiempo Completo' : 'Tiempo Parcial' }}</span>
              <span>{{ teacher.years_experience || 0 }} años de exp.</span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <button 
              v-if="teacher.status === 'inactive'"
              @click="reactivateTeacher(teacher)"
              type="button"
              class="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all border border-emerald-500/30"
            >
              ✓ Reactivar
            </button>
            <span v-else class="text-[10px] text-slate-400 italic">Habilitado</span>

            <div class="flex items-center gap-1.5" v-if="canManage">
              <button 
                @click="openEditModal(teacher, $event)"
                class="p-2 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-transparent hover:border-amber-500/30 transition-all cursor-pointer"
                title="Editar registro de profesor"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <button 
                v-if="teacher.status === 'active'"
                @click="promptDeleteTeacher(teacher, $event)"
                class="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                title="Inhabilitar profesor"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else class="glass-card rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              <th class="py-3 px-4">Profesor</th>
              <th class="py-3 px-4">Código</th>
              <th class="py-3 px-4">Departamento</th>
              <th class="py-3 px-4">Especialidad</th>
              <th class="py-3 px-4">Contacto</th>
              <th class="py-3 px-4 text-center">Estado</th>
              <th class="py-3 px-4 text-right" v-if="canManage">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/10">
            <tr 
              v-for="teacher in filteredTeachers" 
              :key="teacher.id"
              class="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary font-bold flex items-center justify-center flex-shrink-0">
                    {{ getInitials(teacher) }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">{{ teacher.first_name }} {{ teacher.last_name }}</p>
                    <p class="text-[10px] text-slate-400">{{ teacher.position_title || 'Docente' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                {{ teacher.employee_id }}
              </td>
              <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-200">
                {{ teacher.department }}
              </td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-300">
                {{ teacher.specialization || 'General' }}
              </td>
              <td class="py-3 px-4">
                <p class="font-medium text-brand-purple dark:text-brand-secondary">{{ teacher.email_personal || 'Sin correo' }}</p>
                <p class="text-[10px] text-slate-400">{{ teacher.phone_mobile || 'Sin teléfono' }}</p>
              </td>
              <td class="py-3 px-4 text-center">
                <span 
                  :class="[
                    teacher.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30',
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize'
                  ]"
                >
                  {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right" v-if="canManage">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    v-if="teacher.status === 'inactive'"
                    @click="reactivateTeacher(teacher)"
                    class="px-2 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all"
                    title="Reactivar Docente"
                  >
                    Reactivar
                  </button>
                  <button 
                    @click="openEditModal(teacher, $event)" 
                    class="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary dark:hover:text-brand-gold hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    v-if="teacher.status === 'active'"
                    @click="promptDeleteTeacher(teacher, $event)" 
                    class="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all"
                    title="Inhabilitar"
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

    <!-- CREATE / EDIT TEACHER MODAL (STANDARDIZED WITH 3 NUMBERED SECTIONS & INSTITUTIONAL HEADER) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeModal"
      >
        <div 
          ref="modalDialogRef"
          :style="modalSpatialStyle"
          class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Institutional Header Banner -->
          <div class="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary border-b border-brand-gold/30 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 border border-brand-gold/50 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                👨‍🏫
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Registro de Profesor' : 'Nuevo Registro de Profesor' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Cuerpo Docente y Asignación Académica
                </p>
              </div>
            </div>

            <button 
              @click="closeModal" 
              type="button" 
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="submitTeacher" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Identificación y Contratación -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Identificación y Contratación</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Employee ID -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código / N° Empleado *
                    </label>
                    <input 
                      v-model="form.employee_id" 
                      type="text" 
                      placeholder="Ej. PROF-001"
                      :class="[
                        formErrors.employee_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all'
                      ]"
                    />
                    <p v-if="formErrors.employee_id" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.employee_id }}
                    </p>
                  </div>

                  <!-- Contract Type -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Contrato *
                    </label>
                    <select 
                      v-model="form.contract_type" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    >
                      <option value="full-time">Tiempo Completo</option>
                      <option value="part-time">Tiempo Parcial</option>
                    </select>
                  </div>
                </div>

                <!-- Status Selector: Active / Inactive -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Estado de Actividad del Docente
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="form.status = 'active'"
                      :class="[
                        form.status === 'active' 
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' 
                          : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                        'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all'
                      ]"
                    >
                      <span>✓ Activo (Docente Activo)</span>
                    </button>
                    <button
                      type="button"
                      @click="form.status = 'inactive'"
                      :class="[
                        form.status === 'inactive' 
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 font-bold shadow-xs' 
                          : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                        'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all'
                      ]"
                    >
                      <span>⚠️ Inactivo (Deshabilitado)</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section 2: Datos Personales del Docente -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Datos Personales del Docente</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        formErrors.first_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
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
                        formErrors.last_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.last_name" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.last_name }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Position / Title -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo / Título
                    </label>
                    <input 
                      v-model="form.position_title" 
                      type="text" 
                      placeholder="Ej. Profesor Titular"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Specialization -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Especialidad *
                    </label>
                    <input 
                      v-model="form.specialization" 
                      type="text" 
                      placeholder="Ej. Matemáticas y Física"
                      :class="[
                        formErrors.specialization ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.specialization" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.specialization }}
                    </p>
                  </div>

                  <!-- Years of experience -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Años de Exp.
                    </label>
                    <input 
                      v-model.number="form.years_experience" 
                      type="number" 
                      min="0" 
                      max="60"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 3: Asignación y Contacto -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Asignación y Contacto</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Department -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Departamento Curricular *
                    </label>
                    <select 
                      v-model="form.department" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    >
                      <option value="Ciencias Exactas">Ciencias Exactas</option>
                      <option value="Humanidades">Humanidades</option>
                      <option value="Ciencias Naturales">Ciencias Naturales</option>
                      <option value="Idiomas">Idiomas</option>
                      <option value="Ciencias Sociales">Ciencias Sociales</option>
                      <option value="Arte">Arte y Cultura</option>
                      <option value="Educación Física">Educación Física</option>
                      <option value="Tecnología">Tecnología y Robótica</option>
                    </select>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Institucional *
                    </label>
                    <input 
                      v-model="form.email_personal" 
                      type="email" 
                      placeholder="profesor@santaluisa.edu.ve"
                      :class="[
                        formErrors.email_personal ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.email_personal" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.email_personal }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Phone -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Móvil
                    </label>
                    <input 
                      v-model="form.phone_mobile" 
                      type="text" 
                      placeholder="+58 412 555 0000"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Photo URL -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      URL de Foto de Perfil (Opcional)
                    </label>
                    <input 
                      v-model="form.photo_url" 
                      type="url" 
                      placeholder="https://..."
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                ✕ Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 border border-brand-primary/30"
              >
                <span v-if="isSubmitting">Guardando...</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isEditing ? 'Actualizar Profesor' : 'Registrar Profesor' }}</span>
                </span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

    <!-- SOFT DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md p-6 text-center animate-scale-up">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-brand-gold flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
            ⚠️
          </div>
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">¿Inhabilitar Profesor?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Se dará de baja pedagógica a <strong>{{ teacherToDelete?.first_name }} {{ teacherToDelete?.last_name }}</strong> ({{ teacherToDelete?.employee_id }}).
          </p>
          <div class="mt-3 p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 text-left">
            ℹ️ <strong>Conservación de Datos:</strong> Las calificaciones, asignaturas y registros históricos se mantendrán intactos en la base de datos. Podrás reactivar este docente en cualquier momento.
          </div>
          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              @click="isDeleteModalOpen = false" 
              class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              @click="confirmDeleteTeacher" 
              class="px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all"
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

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
const formErrors = ref({})

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

// Spatial origin capture for animation
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
  formErrors.value = {}
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
  formErrors.value = {}
  form.value = { ...teacher }
  activeMenuId.value = null
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
    formErrors.value.specialization = 'La especialidad curricular es obligatoria'
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

  isSubmitting.value = true
  try {
    const nuxtApp = useNuxtApp()
    if (isEditing.value) {
      await nuxtApp.$api.service('teachers').patch(form.value.id, form.value)
      toast.success('Docente actualizado exitosamente')
    } else {
      await nuxtApp.$api.service('teachers').create(form.value)
      toast.success('Nuevo docente registrado en la plantilla escolar')
    }
    await fetchTeachers()
    closeModal()
  } catch (error) {
    toast.error(error.message || 'Error al procesar el docente')
  } finally {
    isSubmitting.value = false
  }
}

// Soft Delete (Inactivation)
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
    await nuxtApp.$api.service('teachers').patch(teacherToDelete.value.id, { status: 'inactive' })
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
    const nuxtApp = useNuxtApp()
    await nuxtApp.$api.service('teachers').patch(teacher.id, { status: 'active' })
    toast.success(`Docente ${teacher.first_name} ${teacher.last_name} reactivado exitosamente`)
    await fetchTeachers()
  } catch (error) {
    toast.error(error.message || 'Error al reactivar el docente')
  }
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

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
