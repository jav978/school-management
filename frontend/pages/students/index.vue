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
          U.E Santa Luisa • Matrícula, expedientes y control académico escolar
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- Seed Demo Data Button (Only visible if 0 students) -->
        <button 
          v-if="students.length === 0"
          @click="seedDemoStudents" 
          type="button"
          class="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition-all shadow-xs active:scale-[0.98]"
        >
          ⚡ Cargar Alumnos Demo
        </button>

        <!-- New Student Button - Unified Institutional Palette -->
        <button 
          @click="openCreateModal" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Estudiante</span>
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
        <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-secondary/30 flex items-center justify-center text-brand-primary dark:text-brand-secondary flex-shrink-0">
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
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
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
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-brand-gold flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
      </div>

      <!-- Grados Activos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Grados Cubiertos</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ uniqueGradesCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-brand-purple dark:text-brand-secondary flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Search & Filter Controls Card -->
    <div class="glass-card rounded-2xl p-4">
      <div class="flex flex-col md:flex-row items-center gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar estudiantes por nombre, apellido o Matrícula ID..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
          />
        </div>

        <!-- Grade Filter -->
        <div class="w-full md:w-56">
          <select 
            v-model="filterGrade" 
            class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
          >
            <option value="">Todos los grados</option>
            <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <!-- Status Filter (Including Inactive / Disabled) -->
        <div class="w-full md:w-52">
          <select 
            v-model="filterStatus" 
            class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="active">Solo Activos (Matriculados)</option>
            <option value="inactive">Solo Inactivos (Deshabilitados)</option>
          </select>
        </div>

        <!-- View Mode Switcher (Grid vs Table) -->
        <div class="flex items-center gap-1 border border-slate-200 dark:border-slate-800 p-1 rounded-xl bg-slate-50 dark:bg-slate-950/60 flex-shrink-0">
          <button 
            @click="viewMode = 'grid'" 
            :class="[viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-white shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all']"
            title="Vista en tarjetas"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'table'" 
            :class="[viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-white shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all']"
            title="Vista en tabla"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredStudents.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <div class="w-16 h-16 rounded-full bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center mx-auto text-2xl mb-4 border border-brand-primary/20">
        🎓
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white font-display">No se encontraron estudiantes</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba cambiando los filtros de búsqueda o agrega un nuevo estudiante usando el botón de registro.
      </p>
      <button 
        @click="openCreateModal"
        class="mt-4 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-brand-primary/20"
      >
        + Registrar Estudiante
      </button>
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
                  :src="student.photo_url" 
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
              <button 
                @click="openEditModal(student)" 
                class="w-8 h-8 rounded-lg text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
                title="Editar estudiante"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <!-- Soft Delete / Toggle Status Button -->
              <button 
                v-if="student.status === 'active'"
                @click="confirmDisableStudent(student)" 
                class="w-8 h-8 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-center transition-all"
                title="Deshabilitar estudiante (Soft delete)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>

              <!-- Reactivate Button if Inactive -->
              <button 
                v-else
                @click="reactivateStudent(student)" 
                class="w-8 h-8 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center transition-all"
                title="Reactivar estudiante en matrícula"
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
              <span class="font-medium truncate">{{ student.grade }} - Sección {{ student.section || 'A' }}</span>
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
        <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between h-9">
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
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="py-3.5 pl-5">Estudiante</th>
              <th class="py-3.5 px-4">Matrícula ID</th>
              <th class="py-3.5 px-4">Grado & Sección</th>
              <th class="py-3.5 px-4">Teléfono</th>
              <th class="py-3.5 px-4">Inscripción</th>
              <th class="py-3.5 px-4">Estado</th>
              <th class="py-3.5 pr-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
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
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">{{ student.grade }} - {{ student.section || 'A' }}</td>
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
                  <button @click="openEditModal(student)" class="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800" title="Editar">
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

    <!-- STANDARDIZED MODAL: Create / Edit Student (U.E Santa Luisa Unified Design) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
        <!-- Backdrop click to close -->
        <div @click="closeModal" class="fixed inset-0" aria-hidden="true"></div>

        <!-- Modal Container: Centered with bounded max-height -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-[#1b1145] border border-slate-200/90 dark:border-white/15 shadow-2xl rounded-3xl flex flex-col max-h-[90vh] my-auto overflow-hidden z-10 animate-fade-in">
          
          <!-- Institutional Header Banner (U.E Santa Luisa Palette) -->
          <div class="bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary border-b border-brand-gold/40 px-6 py-4 flex items-center justify-between text-white flex-shrink-0 shadow-md">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                🎓
              </div>
              <div>
                <h3 class="font-display font-extrabold text-base sm:text-lg tracking-tight text-white">
                  {{ editingStudent ? 'Editar Expediente de Estudiante' : 'Nuevo Registro de Estudiante' }}
                </h3>
                <p class="text-[11px] text-brand-gold font-semibold tracking-wide">
                  U.E Santa Luisa • Sistema de Matrícula y Control Escolar
                </p>
              </div>
            </div>
            <button 
              @click="closeModal" 
              type="button" 
              class="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors" 
              title="Cerrar modal"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Structure with Fixed Footer -->
          <form @submit.prevent="saveStudent" class="flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-5 text-xs sm:text-sm">
              
              <!-- Section 1: Datos de Matrícula y Académicos -->
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <h4 class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    1. Datos de Matrícula y Académicos
                  </h4>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Student ID -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Matrícula ID / Cédula Escolar <span class="text-rose-500">*</span>
                    </label>
                    <input 
                      v-model="form.student_id" 
                      type="text" 
                      placeholder="Ej: EST004" 
                      :class="[
                        'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all',
                        errors.student_id ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
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
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
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
                        'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer',
                        errors.grade ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                      ]"
                    >
                      <option value="" disabled>Seleccionar grado</option>
                      <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
                    </select>
                    <p v-if="errors.grade" class="text-[10px] text-rose-500 font-bold mt-1">Por favor selecciona un grado</p>
                  </div>

                  <!-- Section -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sección <span class="text-rose-500">*</span>
                    </label>
                    <select 
                      v-model="form.section" 
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option value="A">Sección A</option>
                      <option value="B">Sección B</option>
                      <option value="C">Sección C</option>
                      <option value="D">Sección D</option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estado de Matrícula
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <label 
                        :class="[
                          'flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all',
                          form.status === 'active' 
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold' 
                            : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        ]"
                      >
                        <input type="radio" v-model="form.status" value="active" class="text-emerald-600" />
                        <span>✅ Activo (Matriculado)</span>
                      </label>
                      <label 
                        :class="[
                          'flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all',
                          form.status === 'inactive' 
                            ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-brand-gold font-bold' 
                            : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        ]"
                      >
                        <input type="radio" v-model="form.status" value="inactive" class="text-amber-600" />
                        <span>⚠️ Inactivo (Deshabilitado)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Datos Personales del Alumno -->
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <h4 class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    2. Datos Personales
                  </h4>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- First Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombres <span class="text-rose-500">*</span>
                    </label>
                    <input 
                      v-model="form.first_name" 
                      type="text" 
                      placeholder="Ej: Carlos Eduardo" 
                      :class="[
                        'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all',
                        errors.first_name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                      ]"
                    />
                    <p v-if="errors.first_name" class="text-[10px] text-rose-500 font-bold mt-1">El nombre es requerido</p>
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Apellidos <span class="text-rose-500">*</span>
                    </label>
                    <input 
                      v-model="form.last_name" 
                      type="text" 
                      placeholder="Ej: Rodríguez Pérez" 
                      :class="[
                        'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all',
                        errors.last_name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                      ]"
                    />
                    <p v-if="errors.last_name" class="text-[10px] text-rose-500 font-bold mt-1">El apellido es requerido</p>
                  </div>

                  <!-- Date of Birth -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input 
                      v-model="form.date_of_birth" 
                      type="date" 
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    />
                  </div>

                  <!-- Gender -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Género
                    </label>
                    <select 
                      v-model="form.gender" 
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all cursor-pointer"
                    >
                      <option value="male">Masculino (♂)</option>
                      <option value="female">Femenino (♀)</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section 3: Contacto y Residencia -->
              <div>
                <div class="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span class="w-2 h-2 rounded-full bg-brand-purple"></span>
                  <h4 class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">
                    3. Contacto y Residencia
                  </h4>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Mobile Phone -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input 
                      v-model="form.phone_mobile" 
                      type="text" 
                      placeholder="Ej: 0414-1234567" 
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>

                  <!-- Emergency Contact -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contacto de Emergencia / Representante
                    </label>
                    <input 
                      v-model="form.emergency_contact_phone" 
                      type="text" 
                      placeholder="Ej: 0424-9876543 (Madre)" 
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                    />
                  </div>

                  <!-- Full Address -->
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dirección Residencial Completa
                    </label>
                    <textarea 
                      v-model="form.address_line1" 
                      rows="2" 
                      placeholder="Calle, Sector, Edificio/Casa, Parroquia..." 
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

            </div>

            <!-- Standardized Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
              >
                ✕ Cancelar
              </button>
              <button 
                type="submit" 
                class="px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/25 active:scale-95 transition-all flex items-center gap-2 border border-brand-primary/30"
              >
                <span>🪪</span>
                <span>{{ editingStudent ? 'Guardar Cambios' : 'Registrar Estudiante' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- SOFT DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <div v-if="studentToDisable" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
        <div class="relative w-full max-w-md bg-white dark:bg-[#1b1145] border border-amber-400/40 shadow-2xl rounded-3xl p-6 text-center animate-fade-in">
          <div class="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-2xl mb-4 text-amber-600 dark:text-brand-gold shadow-inner">
            ⚠️
          </div>
          
          <h3 class="font-display font-extrabold text-lg text-slate-900 dark:text-white">
            ¿Deshabilitar Estudiante?
          </h3>
          
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            ¿Deseas deshabilitar a <strong class="text-brand-primary dark:text-brand-gold">{{ studentToDisable.full_name }}</strong> (ID: {{ studentToDisable.student_id }})?
          </p>

          <div class="mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl text-[11px] text-amber-800 dark:text-brand-gold-light text-left leading-normal">
            💡 <strong>Aviso de Conservación:</strong> El alumno cambiará al estado <em>Inactivo</em>. No será eliminado de la base de datos y sus calificaciones, boletines e historial continuarán protegidos.
          </div>

          <div class="mt-6 flex items-center justify-center gap-3">
            <button 
              @click="studentToDisable = null" 
              type="button" 
              class="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button 
              @click="executeDisableStudent" 
              type="button" 
              class="px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all"
            >
              Sí, Deshabilitar Alumno
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
const showModal = ref(false)
const editingStudent = ref(null)
const studentToDisable = ref(null)

const availableGrades = [
  '1er grado', '2do grado', '3er grado', 
  '4to grado', '5to grado', '6to grado',
  '1er año', '2do año', '3er año', '4to año', '5to año'
]

const form = ref({
  student_id: '',
  admission_date: new Date().toISOString().split('T')[0],
  first_name: '',
  last_name: '',
  date_of_birth: '2012-05-14',
  gender: 'male',
  grade: '1er grado',
  section: 'A',
  phone_mobile: '',
  emergency_contact_phone: '',
  status: 'active',
  address_line1: ''
})

const errors = reactive({
  student_id: false,
  first_name: false,
  last_name: false,
  grade: false
})

// Clear errors
const resetErrors = () => {
  errors.student_id = false
  errors.first_name = false
  errors.last_name = false
  errors.grade = false
}

// Students State
const students = ref([])

// Compute metrics
const totalStudents = computed(() => students.value.length)
const activeStudentsCount = computed(() => students.value.filter(s => s.status === 'active').length)
const inactiveStudentsCount = computed(() => students.value.filter(s => s.status === 'inactive').length)
const uniqueGradesCount = computed(() => new Set(students.value.map(s => s.grade).filter(Boolean)).size)

// Fetch students from Backend
const fetchStudents = async () => {
  try {
    const token = localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await $fetch(`${apiBase}/students?$limit=100`, { headers }).catch(() => null)
    if (res && res.data && res.data.length > 0) {
      students.value = res.data.map(mapStudent)
    } else if (students.value.length === 0) {
      seedLocalDefaultData()
    }
  } catch (err) {
    if (students.value.length === 0) seedLocalDefaultData()
  }
}

// Map student record for uniform view
const mapStudent = (s) => {
  const fullName = s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Estudiante'
  const initials = fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ES'
  
  let age = 12
  if (s.date_of_birth) {
    const diff = Date.now() - new Date(s.date_of_birth).getTime()
    age = Math.abs(new Date(diff).getUTCFullYear() - 1970)
  }

  let formattedDate = '31 ago 2024'
  if (s.admission_date) {
    const d = new Date(s.admission_date)
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  return {
    ...s,
    full_name: fullName,
    initials,
    age,
    status: s.status || 'active',
    formatted_admission_date: formattedDate
  }
}

// Initial students
const seedLocalDefaultData = () => {
  students.value = [
    mapStudent({
      id: 1,
      student_id: 'EST001',
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      grade: '4to grado',
      section: 'B',
      phone_mobile: '0414-5550103',
      admission_date: '2024-08-31',
      date_of_birth: '2012-04-10',
      gender: 'male',
      address_line1: 'Av. Libertad #456, Caracas',
      status: 'active'
    }),
    mapStudent({
      id: 2,
      student_id: 'EST002',
      first_name: 'Sofía',
      last_name: 'Martínez',
      grade: '2do grado',
      section: 'A',
      phone_mobile: '0424-5550105',
      admission_date: '2024-08-31',
      date_of_birth: '2014-06-22',
      gender: 'female',
      address_line1: 'Calle 5ta #789, Caracas',
      status: 'active'
    }),
    mapStudent({
      id: 3,
      student_id: 'EST003',
      first_name: 'María',
      last_name: 'González',
      grade: '3er grado',
      section: 'A',
      phone_mobile: '0412-5550101',
      admission_date: '2024-08-31',
      date_of_birth: '2013-09-18',
      gender: 'female',
      address_line1: 'Calle Principal #123, Centro',
      status: 'active'
    })
  ]
}

const seedDemoStudents = async () => {
  seedLocalDefaultData()
  toast.info('Alumnos demo cargados en el panel.')
}

// Filtered students computation
const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const q = search.value.toLowerCase().trim()
    const matchesSearch = !q || 
      s.full_name.toLowerCase().includes(q) || 
      (s.student_id && s.student_id.toLowerCase().includes(q))

    const matchesGrade = !filterGrade.value || s.grade === filterGrade.value
    const matchesStatus = !filterStatus.value || s.status === filterStatus.value

    return matchesSearch && matchesGrade && matchesStatus
  })
})

// Modal Actions
const openCreateModal = () => {
  resetErrors()
  editingStudent.value = null
  form.value = {
    student_id: `EST00${students.value.length + 1}`,
    admission_date: new Date().toISOString().split('T')[0],
    first_name: '',
    last_name: '',
    date_of_birth: '2013-05-14',
    gender: 'male',
    grade: availableGrades[0],
    section: 'A',
    phone_mobile: '',
    emergency_contact_phone: '',
    status: 'active',
    address_line1: ''
  }
  showModal.value = true
}

const openEditModal = (student) => {
  resetErrors()
  editingStudent.value = student
  form.value = { 
    ...student,
    status: student.status || 'active'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
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
  }
  if (!form.value.first_name || !form.value.first_name.trim()) {
    errors.first_name = true
    isValid = false
  }
  if (!form.value.last_name || !form.value.last_name.trim()) {
    errors.last_name = true
    isValid = false
  }
  if (!form.value.grade) {
    errors.grade = true
    isValid = false
  }

  return isValid
}

// Save Student (Create or Edit)
const saveStudent = async () => {
  if (!validateForm()) {
    toast.error('Por favor completa todos los campos obligatorios resaltados en rojo.', 'Validación Requerida')
    return
  }

  const token = localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  if (editingStudent.value) {
    // EDIT MODE
    const idx = students.value.findIndex(s => s.id === editingStudent.value.id)
    if (idx !== -1) {
      students.value[idx] = mapStudent({
        ...students.value[idx],
        ...form.value
      })
    }

    // Try patch to backend
    if (typeof editingStudent.value.id === 'number' && editingStudent.value.id < 10000000000) {
      await $fetch(`${apiBase}/students/${editingStudent.value.id}`, {
        method: 'PATCH',
        headers,
        body: form.value
      }).catch(() => null)
    }

    toast.info(
      `El expediente de ${form.value.first_name} ${form.value.last_name} ha sido actualizado con éxito.`,
      'Estudiante Actualizado'
    )
  } else {
    // CREATE MODE
    const newId = Date.now()
    const newRecord = mapStudent({
      id: newId,
      ...form.value
    })
    students.value.unshift(newRecord)

    // Try save to backend
    await $fetch(`${apiBase}/students`, {
      method: 'POST',
      headers,
      body: form.value
    }).catch(() => null)

    toast.success(
      `El estudiante ${form.value.first_name} ${form.value.last_name} (${form.value.student_id}) fue registrado en la matrícula.`,
      'Estudiante Registrado'
    )
  }

  closeModal()
}

// Soft Delete (Disable) Dialog
const confirmDisableStudent = (student) => {
  studentToDisable.value = student
}

const executeDisableStudent = async () => {
  if (!studentToDisable.value) return
  const s = studentToDisable.value
  
  // Soft delete: change status to inactive
  s.status = 'inactive'

  // Update backend
  const token = localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  if (typeof s.id === 'number' && s.id < 10000000000) {
    await $fetch(`${apiBase}/students/${s.id}`, {
      method: 'PATCH',
      headers,
      body: { status: 'inactive' }
    }).catch(() => null)
  }

  toast.warning(
    `El estudiante ${s.full_name} ha sido deshabilitado (Estado: Inactivo). Sus calificaciones y expediente se conservan en la base de datos.`,
    'Estudiante Deshabilitado'
  )

  studentToDisable.value = null
}

// Reactivate Student
const reactivateStudent = async (student) => {
  student.status = 'active'
  
  const token = localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  if (typeof student.id === 'number' && student.id < 10000000000) {
    await $fetch(`${apiBase}/students/${student.id}`, {
      method: 'PATCH',
      headers,
      body: { status: 'active' }
    }).catch(() => null)
  }

  toast.success(
    `El estudiante ${student.full_name} ha sido reactivado en la matrícula escolar.`,
    'Estudiante Reactivado'
  )
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
</style>
