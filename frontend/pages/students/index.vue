<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">🎓</span>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Gestión de Estudiantes
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Matrícula oficial, expedientes y control escolar en tiempo real
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- Printable Enrollment Sheet Button -->
        <button 
          @click="navigateTo('/students/enrollment-form')" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white dark:bg-[#170f33] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xs border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>📄</span>
          <span>Planilla de Matrícula</span>
        </button>

        <!-- New Student Button - Opens Slide-over Drawer -->
        <button 
          @click="openCreateDrawer" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Inscribir Estudiante</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Estudiantes -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Estudiantes</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ totalStudents }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
      </div>

      <!-- Estudiantes Activos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Estudiantes Activos</p>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">{{ activeStudentsCount }}</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Matriculados
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Inactivos / Deshabilitados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Deshabilitados / Inactivos</p>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold leading-tight tracking-tight">{{ inactiveStudentsCount }}</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-brand-gold border border-amber-200 dark:border-amber-800">
              En Reserva
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
      </div>

      <!-- Niveles / Grados Únicos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Años Registrados</p>
          <p class="text-3xl font-black font-display text-slate-700 dark:text-slate-200 mt-1 leading-tight tracking-tight">{{ uniqueGradesCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Search and Filters Bar -->
    <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="search"
          type="text" 
          placeholder="Buscar por nombre, cédula o matrícula..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
        />
      </div>

      <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <!-- Grade Filter -->
        <select 
          v-model="filterGrade"
          class="w-full sm:w-auto px-3 py-2 bg-slate-100 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
        >
          <option value="">Todos los Grados</option>
          <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
        </select>

        <!-- Status Filter -->
        <select 
          v-model="filterStatus"
          class="w-full sm:w-auto px-3 py-2 bg-slate-100 dark:bg-[#110926] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
        >
          <option value="">Todos los Estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <!-- View Switcher -->
        <div class="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start bg-slate-100 dark:bg-[#110926] p-1 rounded-xl border border-slate-200/80 dark:border-white/10">
          <button 
            @click="viewMode = 'grid'" 
            :class="[viewMode === 'grid' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all cursor-pointer flex-1 sm:flex-none flex items-center justify-center']"
            title="Vista en tarjetas"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'table'" 
            :class="[viewMode === 'table' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all cursor-pointer flex-1 sm:flex-none flex items-center justify-center']"
            title="Vista en tabla"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="glass-card rounded-2xl p-16 text-center">
      <div class="w-10 h-10 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto mb-3"></div>
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Consultando matrícula en PostgreSQL...</p>
    </div>

    <!-- Empty State Editorial (Sin datos o filtros sin coincidencias) -->
    <div v-else-if="filteredStudents.length === 0" class="glass-card rounded-3xl p-12 sm:p-16 text-center max-w-2xl mx-auto border border-dashed border-slate-300 dark:border-white/10">
      <div class="w-16 h-16 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center mx-auto text-3xl mb-4 border border-brand-primary/20 dark:border-brand-purple/40 shadow-inner">
        🎓
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display tracking-tight">
        {{ students.length === 0 ? 'Matrícula Escolar sin Registros' : 'No se encontraron coincidencias' }}
      </h3>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
        {{ students.length === 0 
          ? 'No hay estudiantes registrados en la base de datos oficial. Inicie la inscripción de su primer alumno para comenzar a gestionar expedientes académicos reales.' 
          : 'No hay ningún estudiante que coincida con los criterios de búsqueda o filtros aplicados actualmente.' 
        }}
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <button 
          v-if="students.length > 0"
          @click="search = ''; filterGrade = ''; filterStatus = ''" 
          type="button"
          class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
        >
          Limpiar Filtros
        </button>
        <button 
          @click="openCreateDrawer"
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-brand-primary/25 active:scale-[0.98] border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Inscribir Primer Estudiante</span>
        </button>
      </div>
    </div>

    <!-- GRID VIEW: Student Cards with Resting Elevation and Clear Borders -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="student in filteredStudents" 
        :key="student.id"
        class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between"
      >
        <div>
          <!-- Card Header: Avatar, Name, ID, action buttons -->
          <div class="flex items-start justify-between min-h-[52px]">
            <div class="flex items-center gap-3 min-w-0 flex-1 mr-2">
              <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-secondary/30 flex items-center justify-center text-brand-primary dark:text-brand-secondary font-bold text-sm flex-shrink-0 shadow-inner">
                <img 
                  v-if="student.photo_url" 
                  :src="resolvePhotoUrl(student.photo_url)" 
                  :alt="student.full_name"
                  class="w-full h-full object-cover rounded-2xl"
                  @error="student.photo_url = null"
                />
                <span v-else>{{ student.initials }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug truncate font-display">
                  {{ student.full_name }}
                </h3>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs font-semibold text-slate-400">
                    ID: {{ student.student_id }}
                  </span>
                  <span 
                    v-if="student.status === 'inactive'"
                    class="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-brand-gold border border-amber-300 dark:border-amber-800"
                  >
                    Inactivo
                  </span>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- Ficha Oficial de Inscripción Button -->
              <button 
                @click="navigateTo(`/students/enrollment-form?student_id=${student.id}`)" 
                class="w-8 h-8 rounded-xl text-brand-purple hover:text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-purple/30 border border-transparent hover:border-brand-primary/20 flex items-center justify-center transition-all cursor-pointer"
                title="Ficha Oficial de Inscripción (2026-2027)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <!-- Edit Student Button -->
              <button 
                @click="openEditDrawer(student)" 
                class="w-8 h-8 rounded-xl text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer" 
                title="Editar Expediente"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <!-- Soft-delete or Reactivate -->
              <button 
                v-if="student.status === 'active'"
                @click="confirmDisableStudent(student)" 
                class="w-8 h-8 rounded-xl text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-center transition-all cursor-pointer" 
                title="Deshabilitar estudiante"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>
              <button 
                v-else
                @click="reactivateStudent(student)" 
                class="w-8 h-8 rounded-xl text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center transition-all cursor-pointer" 
                title="Reactivar estudiante"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Body: Details list -->
          <div class="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <!-- Grade & Section -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-brand-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span class="font-medium truncate">{{ student.grade || 'Grado no asignado' }} - Sección {{ student.section || 'A' }}</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="truncate">{{ student.phone_mobile || 'Sin teléfono' }}</span>
            </div>

            <!-- Admission Date -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-brand-purple flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">Inscrito: {{ student.formatted_admission_date }}</span>
            </div>

            <!-- Address -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-brand-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ student.address_line1 || 'Sin dirección registrada' }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer: Status chip & Age -->
        <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between h-9">
          <span 
            :class="[
              student.status === 'active' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' 
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-brand-gold border border-amber-200 dark:border-amber-800/40',
              'px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize'
            ]"
          >
            {{ student.status === 'active' ? 'activo' : 'deshabilitado' }}
          </span>

          <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {{ student.age ? `${student.age} años` : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW (High density alternative) -->
    <div v-else class="glass-card rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#110926] text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="py-3.5 pl-5">Estudiante</th>
              <th class="py-3.5 px-4">Matrícula ID</th>
              <th class="py-3.5 px-4">Grado & Sección</th>
              <th class="py-3.5 px-4">Teléfono</th>
              <th class="py-3.5 px-4">Inscripción</th>
              <th class="py-3.5 px-4">Estado</th>
              <th class="py-3.5 pr-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
              <td class="py-3.5 pl-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center font-bold text-xs text-brand-primary dark:text-brand-secondary border border-brand-primary/20">
                    {{ student.initials }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white leading-tight">{{ student.full_name }}</p>
                    <p class="text-[11px] text-slate-400">{{ student.email_personal || 'Sin correo' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">{{ student.student_id }}</td>
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">{{ student.grade || 'Sin grado' }} - {{ student.section || 'A' }}</td>
              <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400">{{ student.phone_mobile || '—' }}</td>
              <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400">{{ student.formatted_admission_date }}</td>
              <td class="py-3.5 px-4">
                <span 
                  :class="[
                    student.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-brand-gold border border-amber-200 dark:border-amber-800',
                    'px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize'
                  ]"
                >
                  {{ student.status === 'active' ? 'activo' : 'deshabilitado' }}
                </span>
              </td>
              <td class="py-3.5 pr-5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button 
                    @click="navigateTo(`/students/enrollment-form?student_id=${student.id}`)" 
                    class="p-1.5 rounded-lg text-brand-purple dark:text-brand-secondary hover:text-brand-primary dark:hover:text-white hover:bg-brand-primary/10 dark:hover:bg-brand-purple/20" 
                    title="Ficha Oficial de Inscripción (2026-2027)"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button @click="openEditDrawer(student)" class="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10" title="Editar">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    v-if="student.status === 'active'"
                    @click="confirmDisableStudent(student)" 
                    class="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40" 
                    title="Deshabilitar estudiante"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                  <button 
                    v-else
                    @click="reactivateStudent(student)" 
                    class="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40" 
                    title="Reactivar estudiante"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- STANDARDIZED CENTERED MODAL: Create / Edit Student -->
    <Teleport to="body">
      <div 
        v-if="showDrawer" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#0c081e]/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeDrawer"
      >
        <!-- Modal Container: Centered with bounded max-height -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-[#130b2e] border border-slate-200/90 dark:border-white/15 shadow-2xl rounded-3xl flex flex-col max-h-[90vh] my-auto z-10 animate-scale-up overflow-hidden">
          
          <!-- Modal Header Banner -->
          <div class="bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary px-6 py-4.5 flex items-center justify-between text-white flex-shrink-0 border-b border-brand-gold/30 shadow-md">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                🎓
              </div>
              <div>
                <h3 class="font-display font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                  {{ editingStudent ? 'Expediente del Estudiante' : 'Inscripción de Estudiante' }}
                </h3>
                <p class="text-[11px] text-brand-gold font-semibold tracking-wide mt-0.5">
                  {{ editingStudent ? `ID: ${editingStudent.student_id} • Matrícula Activa` : 'U.E Santa Luisa • Sistema de Matrícula Real' }}
                </p>
              </div>
            </div>
            <button 
              @click="closeDrawer" 
              type="button" 
              class="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" 
              title="Cerrar panel"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Navigation Tabs -->
          <div class="px-6 py-2.5 bg-slate-50 dark:bg-[#110926] border-b border-slate-200/80 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto flex-shrink-0 scrollbar-none">
            <button 
              v-for="tab in drawerTabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              type="button"
              :class="[
                activeTab === tab.id 
                  ? 'bg-white dark:bg-[#1b1145] text-brand-primary dark:text-white font-bold shadow-xs border border-slate-200 dark:border-white/15' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent',
                'px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap'
              ]"
            >
              <span>{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Drawer Form with Tabbed Content -->
          <form @submit.prevent="saveStudent" class="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">

              <!-- TAB 1: ACADÉMICO -->
              <div v-show="activeTab === 'academic'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Student ID -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Matrícula ID / Cédula Escolar <span class="text-rose-500">*</span>
                    </label>
                    <input 
                      v-model="form.student_id" 
                      type="text" 
                      placeholder="Ej: EST-2026-1001" 
                      :class="[
                        'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all',
                        errors.student_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10'
                      ]"
                    />
                    <p v-if="errors.student_id" class="text-[10px] text-rose-500 font-bold mt-1">Este campo es obligatorio</p>
                  </div>

                  <!-- Admission Date -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Inscripción
                    </label>
                    <input 
                      v-model="form.admission_date" 
                      type="date" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    />
                  </div>

                  <!-- Grade -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Grado / Año Escolar <span class="text-rose-500">*</span>
                    </label>
                    <select 
                      v-model="form.grade" 
                      :class="[
                        'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer',
                        errors.grade ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10'
                      ]"
                    >
                      <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
                    </select>
                    <p v-if="errors.grade" class="text-[10px] text-rose-500 font-bold mt-1">Selecciona el año escolar</p>
                  </div>

                  <!-- Section -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sección Asignada
                    </label>
                    <select 
                      v-model="form.section" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option value="A">Sección A</option>
                      <option value="B">Sección B</option>
                      <option value="C">Sección C</option>
                      <option value="U">Única</option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estado en Matrícula
                    </label>
                    <select 
                      v-model="form.status" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option value="active">Activo (Cursante)</option>
                      <option value="inactive">Inactivo / En Reserva</option>
                    </select>
                  </div>

                  <!-- Scholarship -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Beca o Exoneración
                    </label>
                    <select 
                      v-model="form.scholarship" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option :value="false">Sin beca (Regular)</option>
                      <option :value="true">Becado</option>
                    </select>
                  </div>
                </div>

                <!-- Notes / Observaciones -->
                <div class="mt-4">
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Notas u Observaciones Académicas
                  </label>
                  <textarea 
                    v-model="form.notes" 
                    rows="2"
                    placeholder="Detalles sobre historial previo, colegios anteriores, etc."
                    class="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  ></textarea>
                </div>
              </div>

              <!-- TAB 2: DATOS PERSONALES -->
              <div v-show="activeTab === 'personal'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- First Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primer Nombre <span class="text-rose-500">*</span>
                    </label>
                    <input 
                      v-model="form.first_name" 
                      type="text" 
                      placeholder="Ej: Alejandro" 
                      :class="[
                        'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all',
                        errors.first_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10'
                      ]"
                    />
                    <p v-if="errors.first_name" class="text-[10px] text-rose-500 font-bold mt-1">El nombre es obligatorio</p>
                  </div>

                  <!-- Middle Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Segundo Nombre
                    </label>
                    <input 
                      v-model="form.middle_name" 
                      type="text" 
                      placeholder="Ej: José" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Apellidos <span class="text-rose-500">*</span>
                    </label>
                    <input 
                      v-model="form.last_name" 
                      type="text" 
                      placeholder="Ej: Paredes Mendoza" 
                      :class="[
                        'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all',
                        errors.last_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10'
                      ]"
                    />
                    <p v-if="errors.last_name" class="text-[10px] text-rose-500 font-bold mt-1">El apellido es obligatorio</p>
                  </div>

                  <!-- National ID / Cédula -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cédula / DNI / C.I.
                    </label>
                    <input 
                      v-model="form.national_id" 
                      type="text" 
                      placeholder="Ej: V-32.456.789" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>

                  <!-- Date of Birth -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input 
                      v-model="form.date_of_birth" 
                      type="date" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    />
                  </div>

                  <!-- Gender -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Género
                    </label>
                    <select 
                      v-model="form.gender" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <!-- Mobile Phone -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Móvil
                    </label>
                    <input 
                      v-model="form.phone_mobile" 
                      type="tel" 
                      placeholder="Ej: 0414-1234567" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico Personal
                    </label>
                    <input 
                      v-model="form.email_personal" 
                      type="email" 
                      placeholder="alumno@ejemplo.com" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>

                <!-- Address -->
                <div class="mt-4">
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección de Habitación
                  </label>
                  <input 
                    v-model="form.address_line1" 
                    type="text" 
                    placeholder="Calle, avenida, edificio o urbanización" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  />
                </div>
              </div>

              <!-- TAB 3: SALUD & MÉDICO -->
              <div v-show="activeTab === 'health'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Blood Type -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Grupo Sanguíneo y Factor Rh
                    </label>
                    <select 
                      v-model="form.blood_type" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer font-mono text-xs"
                    >
                      <option value="O+">O Positivo (O+)</option>
                      <option value="O-">O Negativo (O-)</option>
                      <option value="A+">A Positivo (A+)</option>
                      <option value="A-">A Negativo (A-)</option>
                      <option value="B+">B Positivo (B+)</option>
                      <option value="B-">B Negativo (B-)</option>
                      <option value="AB+">AB Positivo (AB+)</option>
                      <option value="AB-">AB Negativo (AB-)</option>
                      <option value="unknown">Desconocido / Por evaluar</option>
                    </select>
                  </div>

                  <!-- Doctor Phone -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono del Médico Tratante
                    </label>
                    <input 
                      v-model="form.doctor_phone" 
                      type="tel" 
                      placeholder="Ej: 0412-5551234" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>

                <!-- Allergies -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alergias Conocidas (Alimentos, Medicamentos)
                  </label>
                  <input 
                    v-model="form.allergies" 
                    type="text" 
                    placeholder="Ej: Penicilina, mariscos, polen (o 'Ninguna')" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  />
                </div>

                <!-- Medical conditions -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Condiciones Médicas o Diagnósticos
                  </label>
                  <textarea 
                    v-model="form.medical_conditions" 
                    rows="2"
                    placeholder="Ej: Asma bronquial, rinitis alérgica, etc."
                    class="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  ></textarea>
                </div>

                <!-- Medications -->
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Medicamentos Recetados
                  </label>
                  <input 
                    v-model="form.medications" 
                    type="text" 
                    placeholder="Ej: Salbutamol inhalador si presenta crisis" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  />
                </div>
              </div>

              <!-- TAB 4: EMERGENCIA / REPRESENTANTE -->
              <div v-show="activeTab === 'emergency'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Emergency Contact Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre del Contacto de Emergencia
                    </label>
                    <input 
                      v-model="form.emergency_contact_name" 
                      type="text" 
                      placeholder="Ej: María Mendoza" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>

                  <!-- Relationship -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parentesco / Relación
                    </label>
                    <select 
                      v-model="form.emergency_contact_rel" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Abuelo/a">Abuelo/a</option>
                      <option value="Tío/a">Tío/a</option>
                      <option value="Tutor Legal">Tutor Legal</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <!-- Emergency Phone -->
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Contacto Inmediato
                    </label>
                    <input 
                      v-model="form.emergency_contact_phone" 
                      type="tel" 
                      placeholder="Ej: 0424-9876543" 
                      class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>
              </div>

            </div>

            <!-- Drawer Fixed Footer with Save / Cancel -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50/90 dark:bg-[#0e0722]/90 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">
                Pestaña actual: <strong class="text-slate-700 dark:text-slate-200">{{ drawerTabs.find(t => t.id === activeTab)?.label }}</strong>
              </span>

              <div class="flex items-center gap-3">
                <button 
                  type="button" 
                  @click="closeDrawer" 
                  class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="isSubmitting"
                  class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/25 active:scale-95 transition-all border border-brand-primary/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span v-else>💾</span>
                  <span>{{ isSubmitting ? 'Guardando...' : (editingStudent ? 'Actualizar Expediente' : 'Guardar en Matrícula') }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- SOFT DELETE / INACTIVATION CONFIRMATION MODAL -->
    <Teleport to="body">
      <div v-if="studentToDisable" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0c081e]/80 backdrop-blur-xs">
        <div class="relative w-full max-w-md bg-white dark:bg-[#1b1145] border border-amber-400/40 shadow-2xl rounded-3xl p-6 text-center animate-fade-in">
          <div class="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-2xl mb-4 text-amber-600 dark:text-brand-gold shadow-inner">
            ⚠️
          </div>
          
          <h3 class="font-display font-extrabold text-lg text-slate-900 dark:text-white">
            ¿Deshabilitar Estudiante?
          </h3>
          
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            ¿Deseas pasar a inactivo a <strong class="text-brand-primary dark:text-brand-gold">{{ studentToDisable.full_name }}</strong> (ID: {{ studentToDisable.student_id }})?
          </p>

          <div class="mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl text-[11px] text-amber-800 dark:text-brand-gold-light text-left leading-normal">
            💡 <strong>Conservación de Datos:</strong> El alumno no se eliminará de PostgreSQL. Su historial académico y notas continuarán guardados intactos.
          </div>

          <div class="mt-6 flex items-center justify-center gap-3">
            <button 
              @click="studentToDisable = null" 
              type="button" 
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              @click="executeDisableStudent" 
              type="button" 
              class="px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Sí, Inactivar Alumno
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3031'

const viewMode = ref('grid') // 'grid' | 'table'
const search = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const showDrawer = ref(false)
const editingStudent = ref(null)
const studentToDisable = ref(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const activeTab = ref('academic')

const drawerTabs = [
  { id: 'academic', label: 'Académico', icon: '🎓' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'health', label: 'Salud', icon: '🏥' },
  { id: 'emergency', label: 'Emergencia', icon: '📞' }
]

const availableGrades = [
  '1er grado', '2do grado', '3er grado', 
  '4to grado', '5to grado', '6to grado',
  '1er año', '2do año', '3er año', '4to año', '5to año'
]

const form = ref({
  student_id: '',
  admission_date: new Date().toISOString().split('T')[0],
  first_name: '',
  middle_name: '',
  last_name: '',
  national_id: '',
  date_of_birth: '2012-05-14',
  gender: 'male',
  grade: '1er grado',
  section: 'A',
  phone_mobile: '',
  email_personal: '',
  blood_type: 'O+',
  doctor_phone: '',
  allergies: '',
  medical_conditions: '',
  medications: '',
  emergency_contact_name: '',
  emergency_contact_rel: 'Madre',
  emergency_contact_phone: '',
  status: 'active',
  scholarship: false,
  notes: '',
  address_line1: ''
})

const errors = reactive({
  student_id: false,
  first_name: false,
  last_name: false,
  grade: false
})

const resetErrors = () => {
  errors.student_id = false
  errors.first_name = false
  errors.last_name = false
  errors.grade = false
}

// Students State (Loaded strictly from Backend)
const students = ref([])

// Metrics computed from live DB state
const totalStudents = computed(() => students.value.length)
const activeStudentsCount = computed(() => students.value.filter(s => s.status === 'active').length)
const inactiveStudentsCount = computed(() => students.value.filter(s => s.status === 'inactive').length)
const uniqueGradesCount = computed(() => new Set(students.value.map(s => s.grade).filter(Boolean)).size)

const sessionCookie = useCookie('session_token')

// Auth Headers Helper
const getAuthHeaders = () => {
  const token = sessionCookie.value || (import.meta.client ? sessionStorage.getItem('token') : null)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Map student record for view
const mapStudent = (s) => {
  const computedName = `${s.first_name || ''} ${s.last_name || ''}`.trim()
  const fullName = s.full_name || computedName || 'Estudiante'
  const initials = fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ES'
  
  let age = null
  if (s.date_of_birth) {
    const diff = Date.now() - new Date(s.date_of_birth).getTime()
    age = Math.abs(new Date(diff).getUTCFullYear() - 1970)
  }

  let formattedDate = '—'
  if (s.admission_date) {
    const d = new Date(s.admission_date)
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  // Parse grade/section from notes if not set
  let grade = s.grade
  let section = s.section || 'A'
  if (!grade && s.notes) {
    const match = s.notes.match(/([^|]+(?:grado|año))\s*-\s*Sección\s*([A-Za-z])/i)
    if (match) {
      grade = match[1].trim()
      section = match[2].trim().toUpperCase()
    }
  }

  return {
    ...s,
    full_name: fullName,
    initials,
    age,
    grade: grade || '1er año',
    section,
    status: s.status || 'active',
    formatted_admission_date: formattedDate
  }
}

// Fetch students from Backend (Zero mock fallback)
const fetchStudents = async () => {
  isLoading.value = true
  try {
    const headers = getAuthHeaders()
    const res = await $fetch(`${apiBase}/students?$limit=100`, { headers })
    if (res && res.data) {
      students.value = res.data.map(mapStudent)
    } else if (Array.isArray(res)) {
      students.value = res.map(mapStudent)
    } else {
      students.value = []
    }
  } catch (err) {
    console.error('Error al consultar estudiantes:', err)
    toast.error('No se pudo conectar con el servicio de estudiantes de la base de datos.', 'Error de Conexión')
    students.value = []
  } finally {
    isLoading.value = false
  }
}

// Filtered students computation
const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const q = search.value.toLowerCase().trim()
    const matchesSearch = !q || 
      s.full_name.toLowerCase().includes(q) || 
      (s.student_id && s.student_id.toLowerCase().includes(q)) ||
      (s.national_id && s.national_id.toLowerCase().includes(q))

    const matchesGrade = !filterGrade.value || s.grade === filterGrade.value
    const matchesStatus = !filterStatus.value || s.status === filterStatus.value

    return matchesSearch && matchesGrade && matchesStatus
  })
})

// Drawer Actions
const openCreateDrawer = () => {
  resetErrors()
  activeTab.value = 'academic'
  editingStudent.value = null
  form.value = {
    student_id: `EST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    admission_date: new Date().toISOString().split('T')[0],
    first_name: '',
    middle_name: '',
    last_name: '',
    national_id: '',
    date_of_birth: '2012-05-14',
    gender: 'male',
    grade: availableGrades[0],
    section: 'A',
    phone_mobile: '',
    email_personal: '',
    blood_type: 'O+',
    doctor_phone: '',
    allergies: '',
    medical_conditions: '',
    medications: '',
    emergency_contact_name: '',
    emergency_contact_rel: 'Madre',
    emergency_contact_phone: '',
    status: 'active',
    scholarship: false,
    notes: '',
    address_line1: ''
  }
  showDrawer.value = true
}

const openEditDrawer = (student) => {
  resetErrors()
  activeTab.value = 'academic'
  editingStudent.value = student
  form.value = { 
    ...student,
    status: student.status || 'active',
    blood_type: student.blood_type || 'unknown'
  }
  showDrawer.value = true
}

const closeDrawer = () => {
  showDrawer.value = false
  editingStudent.value = null
  resetErrors()
}

// Form Validation
const validateForm = () => {
  resetErrors()
  let isValid = true

  if (!form.value.student_id || !form.value.student_id.trim()) {
    errors.student_id = true
    isValid = false
    activeTab.value = 'academic'
  }
  if (!form.value.first_name || !form.value.first_name.trim()) {
    errors.first_name = true
    isValid = false
    activeTab.value = 'personal'
  }
  if (!form.value.last_name || !form.value.last_name.trim()) {
    errors.last_name = true
    isValid = false
    if (isValid) activeTab.value = 'personal'
  }
  if (!form.value.grade) {
    errors.grade = true
    isValid = false
    activeTab.value = 'academic'
  }

  return isValid
}

// Save Student (Real Backend Create or Edit)
const saveStudent = async () => {
  if (!validateForm()) {
    toast.error('Por favor completa todos los campos requeridos señalados.', 'Validación Requerida')
    return
  }

  isSubmitting.value = true
  const headers = getAuthHeaders()

  try {
    if (editingStudent.value) {
      // EDIT MODE
      await $fetch(`${apiBase}/students/${editingStudent.value.id}`, {
        method: 'PATCH',
        headers,
        body: form.value
      })

      toast.success(
        `Expediente de ${form.value.first_name} ${form.value.last_name} actualizado en PostgreSQL con éxito.`,
        'Estudiante Actualizado'
      )
    } else {
      // CREATE MODE
      const created = await $fetch(`${apiBase}/students`, {
        method: 'POST',
        headers,
        body: form.value
      })

      toast.success(
        `El estudiante ${created.first_name || form.value.first_name} ${created.last_name || form.value.last_name} fue registrado en la matrícula escolar.`,
        'Inscripción Exitosa'
      )
    }

    await fetchStudents()
    closeDrawer()
  } catch (err) {
    console.error('Error al guardar estudiante:', err)
    const msg = err.data?.message || err.message || 'Error al persistir el estudiante en base de datos.'
    toast.error(msg, 'Error en Servidor')
  } finally {
    isSubmitting.value = false
  }
}

// Soft Delete (Inactivation)
const confirmDisableStudent = (student) => {
  studentToDisable.value = student
}

const executeDisableStudent = async () => {
  if (!studentToDisable.value) return
  const s = studentToDisable.value
  
  try {
    const headers = getAuthHeaders()
    await $fetch(`${apiBase}/students/${s.id}`, {
      method: 'PATCH',
      headers,
      body: { status: 'inactive' }
    })

    toast.warning(
      `El estudiante ${s.full_name} ha sido marcado como Inactivo. Su expediente e historial continúan en la base de datos.`,
      'Estudiante Deshabilitado'
    )
    await fetchStudents()
  } catch (err) {
    console.error('Error al deshabilitar estudiante:', err)
    toast.error('No se pudo deshabilitar el estudiante en el servidor.', 'Error')
  } finally {
    studentToDisable.value = null
  }
}

// Reactivate Student
const reactivateStudent = async (student) => {
  try {
    const headers = getAuthHeaders()
    await $fetch(`${apiBase}/students/${student.id}`, {
      method: 'PATCH',
      headers,
      body: { status: 'active' }
    })

    toast.success(
      `El estudiante ${student.full_name} ha sido reactivado en la matrícula escolar.`,
      'Estudiante Reactivado'
    )
    await fetchStudents()
  } catch (err) {
    console.error('Error al reactivar estudiante:', err)
    toast.error('No se pudo reactivar el estudiante en el servidor.', 'Error')
  }
}

onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-left {
  animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
