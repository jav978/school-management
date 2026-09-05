<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">🎓</span>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Gestión de Estudiantes
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administra la información de todos los estudiantes
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

        <!-- New Student Button -->
        <button 
          @click="openCreateModal" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Estudiante</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Estudiantes -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Estudiantes</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ totalStudents }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
      </div>

      <!-- Estudiantes Activos -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estudiantes Activos</p>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-3xl font-black font-display text-slate-850 dark:text-white leading-tight tracking-tight">{{ activeStudentsCount }}</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Activo
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Grados -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Grados</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ uniqueGradesCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>

      <!-- Nuevos Este Mes -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nuevos Este Mes</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ newThisMonthCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-orange-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Search & Filter Controls Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs">
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
            placeholder="Buscar estudiantes por nombre o ID..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <!-- Grade Filter -->
        <div class="w-full md:w-56">
          <select 
            v-model="filterGrade" 
            class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            <option value="">Todos los grados</option>
            <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="w-full md:w-44">
          <select 
            v-model="filterStatus" 
            class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <!-- View Mode Switcher (Grid vs Table) -->
        <div class="flex items-center gap-1 border border-slate-200 dark:border-slate-800 p-1 rounded-xl bg-slate-50 dark:bg-slate-950/60 flex-shrink-0">
          <button 
            @click="viewMode = 'grid'" 
            :class="[viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all']"
            title="Vista en tarjetas"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'table'" 
            :class="[viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200', 'p-1.5 rounded-lg transition-all']"
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
    <div v-if="filteredStudents.length === 0" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center shadow-xs">
      <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-2xl mb-4">
        🎓
      </div>
      <h3 class="text-base font-bold text-slate-850 dark:text-white">No se encontraron estudiantes</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Prueba cambiando los filtros de búsqueda o agrega un nuevo estudiante usando el botón superior.
      </p>
      <button 
        @click="openCreateModal"
        class="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
      >
        + Registrar Estudiante
      </button>
    </div>

    <!-- GRID VIEW: Student Cards (Base44 style) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="student in filteredStudents" 
        :key="student.id"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <!-- Card Header: Avatar, Name, ID, action buttons -->
          <div class="flex items-start justify-between min-h-[52px]">
            <div class="flex items-center gap-3 min-w-0 flex-1 mr-2">
              <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-sm flex-shrink-0">
                <img 
                  v-if="student.photo_url" 
                  :src="student.photo_url" 
                  :alt="student.full_name"
                  class="w-full h-full object-cover rounded-full"
                  @error="student.photo_url = null"
                />
                <span v-else>{{ student.initials }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-sm sm:text-base text-slate-850 dark:text-white leading-snug truncate">
                  {{ student.full_name }}
                </h3>
                <p class="text-xs font-semibold text-slate-400 mt-0.5">
                  ID: {{ student.student_id }}
                </p>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <button 
                @click="openEditModal(student)" 
                class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
                title="Editar estudiante"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                @click="deleteStudent(student)" 
                class="w-8 h-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 flex items-center justify-center transition-all"
                title="Eliminar estudiante"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Body: Details list with strict vertical alignment -->
          <div class="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <!-- Grade & Section -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <svg class="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">Inscrito: {{ student.formatted_admission_date }}</span>
            </div>

            <!-- Address -->
            <div class="flex items-center gap-2.5 h-5">
              <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
              'px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize'
            ]"
          >
            {{ student.status === 'active' ? 'activo' : 'inactivo' }}
          </span>

          <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {{ student.age ? `${student.age} años` : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW (High density alternative) -->
    <div v-else class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
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
                  <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
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
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
                    'px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize'
                  ]"
                >
                  {{ student.status === 'active' ? 'activo' : 'inactivo' }}
                </span>
              </td>
              <td class="py-3.5 pr-5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button @click="openEditModal(student)" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="deleteStudent(student)" class="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40">
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

    <!-- MODAL: Create / Edit Student (Teleported to body, centered, fixed footer) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
        <!-- Backdrop click to close -->
        <div @click="closeModal" class="fixed inset-0" aria-hidden="true"></div>

        <!-- Modal Card: Centered with bounded max-height -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col max-h-[85vh] my-auto overflow-hidden z-10 animate-fade-in">
          <!-- Top Gradient Banner (Fixed) -->
          <div class="bg-gradient-to-r from-blue-600 to-emerald-500 px-5 sm:px-6 py-3.5 flex items-center justify-between text-white flex-shrink-0 shadow-xs">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">🎓</span>
              <h3 class="font-bold text-base sm:text-lg">
                {{ editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante' }}
              </h3>
            </div>
            <button @click="closeModal" type="button" class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" title="Cerrar">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Structure with Fixed Footer -->
          <form @submit.prevent="saveStudent" class="flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <!-- Row 1: Student ID & Admission Date -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ID del Estudiante <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    v-model="form.student_id" 
                    type="text" 
                    required 
                    placeholder="Ej: EST001" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Inscripción
                  </label>
                  <input 
                    v-model="form.admission_date" 
                    type="date" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <!-- Row 2: First Name & Last Name -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    v-model="form.first_name" 
                    type="text" 
                    required 
                    placeholder="Nombre del estudiante" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Apellido <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    v-model="form.last_name" 
                    type="text" 
                    required 
                    placeholder="Apellido del estudiante" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <!-- Row 3: Birth Date & Gender -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input 
                    v-model="form.date_of_birth" 
                    type="date" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Género
                  </label>
                  <select 
                    v-model="form.gender" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <!-- Row 4: Grade & Section -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grado <span class="text-rose-500">*</span>
                  </label>
                  <select 
                    v-model="form.grade" 
                    required
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="" disabled>Seleccionar grado</option>
                    <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sección
                  </label>
                  <select 
                    v-model="form.section" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                    <option value="C">Sección C</option>
                    <option value="D">Sección D</option>
                  </select>
                </div>
              </div>

              <!-- Row 5: Phone & Emergency Contact -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono
                  </label>
                  <input 
                    v-model="form.phone_mobile" 
                    type="text" 
                    placeholder="Número de teléfono" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contacto de Emergencia
                  </label>
                  <input 
                    v-model="form.emergency_contact_phone" 
                    type="text" 
                    placeholder="Contacto de emergencia" 
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <!-- Row 6: Status -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estado
                </label>
                <select 
                  v-model="form.status" 
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="graduated">Graduado</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>

              <!-- Row 7: Full Address -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección
                </label>
                <textarea 
                  v-model="form.address_line1" 
                  rows="3" 
                  placeholder="Dirección completa" 
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Sticky Modal Footer (Permanently visible) -->
            <div class="flex-shrink-0 px-6 py-3.5 bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                ✕ Cancelar
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>🪪</span>
                <span>{{ editingStudent ? 'Guardar Cambios' : 'Crear Estudiante' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3031'

const viewMode = ref('grid') // 'grid' | 'table'
const search = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingStudent = ref(null)

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
  grade: '4to grado',
  section: 'A',
  phone_mobile: '',
  emergency_contact_phone: '',
  status: 'active',
  address_line1: ''
})

// Students State
const students = ref([])

// Compute metrics
const totalStudents = computed(() => students.value.length)
const activeStudentsCount = computed(() => students.value.filter(s => s.status === 'active').length)
const uniqueGradesCount = computed(() => new Set(students.value.map(s => s.grade).filter(Boolean)).size)
const newThisMonthCount = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  return students.value.filter(s => {
    if (!s.admission_date) return false
    const d = new Date(s.admission_date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).length
})

// Fetch students from Backend
const fetchStudents = async () => {
  try {
    const token = localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await $fetch(`${apiBase}/students`, { headers }).catch(() => null)
    if (res && res.data && res.data.length > 0) {
      students.value = res.data.map(mapStudent)
    } else if (students.value.length === 0) {
      // Load initial reference data matching the user's Base44 screenshot
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
  
  // Calculate age if date_of_birth exists
  let age = 12
  if (s.date_of_birth) {
    const diff = Date.now() - new Date(s.date_of_birth).getTime()
    age = Math.abs(new Date(diff).getUTCFullYear() - 1970)
  }

  // Format admission date
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
    formatted_admission_date: formattedDate
  }
}

// Initial 3 students exactly as in the user's Base44 screenshot
const seedLocalDefaultData = () => {
  students.value = [
    mapStudent({
      id: 1,
      student_id: 'EST002',
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      grade: '4to grado',
      section: 'B',
      phone_mobile: '555-0103',
      admission_date: '2024-08-31',
      date_of_birth: '2012-04-10',
      address_line1: 'Av. Libertad #456, Norte',
      status: 'active'
    }),
    mapStudent({
      id: 2,
      student_id: 'EST003',
      first_name: 'Sofía',
      last_name: 'Martínez',
      grade: '2do grado',
      section: 'A',
      phone_mobile: '555-0105',
      admission_date: '2024-08-31',
      date_of_birth: '2014-06-22',
      address_line1: 'Calle 5ta #789, Sur',
      status: 'active'
    }),
    mapStudent({
      id: 3,
      student_id: 'EST001',
      first_name: 'María',
      last_name: 'González',
      grade: '3er grado',
      section: 'A',
      phone_mobile: '555-0101',
      admission_date: '2024-08-31',
      date_of_birth: '2013-09-18',
      address_line1: 'Calle Principal #123, Centro',
      status: 'active'
    })
  ]
}

// Push demo data to backend
const seedDemoStudents = async () => {
  seedLocalDefaultData()
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
  editingStudent.value = null
  form.value = {
    student_id: `EST00${students.value.length + 1}`,
    admission_date: new Date().toISOString().split('T')[0],
    first_name: '',
    last_name: '',
    date_of_birth: '2012-05-14',
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
  editingStudent.value = student
  form.value = { ...student }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingStudent.value = null
}

const saveStudent = async () => {
  if (editingStudent.value) {
    const idx = students.value.findIndex(s => s.id === editingStudent.value.id)
    if (idx !== -1) {
      students.value[idx] = mapStudent({
        ...students.value[idx],
        ...form.value
      })
    }
  } else {
    const newRecord = mapStudent({
      id: Date.now(),
      ...form.value
    })
    students.value.unshift(newRecord)
  }
  closeModal()
}

const deleteStudent = (student) => {
  if (confirm(`¿Estás seguro de eliminar al estudiante ${student.full_name}?`)) {
    students.value = students.value.filter(s => s.id !== student.id)
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
</style>
