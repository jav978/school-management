<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
          Padres y Representantes
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Directorio de representantes legales, datos de contacto de emergencia y estudiantes vinculados
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Representante</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Representantes -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Representantes</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ parents.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-orange-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>

      <!-- Contactos de Emergencia -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contactos de Emergencia</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 leading-tight tracking-tight">{{ emergencyCount }}</p>
            <span class="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded-md">
              Habilitados
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>

      <!-- Estudiantes Vinculados -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hijos Vinculados</p>
          <p class="text-3xl font-black font-display text-indigo-600 dark:text-indigo-400 mt-1 leading-tight tracking-tight">{{ linkedStudentsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
      </div>

      <!-- Canales de Mensajería -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Canal WhatsApp</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">{{ whatsappCount }}</p>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
              Directos
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
          placeholder="Buscar por nombre, cédula, teléfono o estudiante..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Relationship Filter -->
        <select
          v-model="filterRelationship"
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todos los parentescos</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Tutor Legal">Tutor Legal</option>
        </select>

        <!-- View Mode Toggle -->
        <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
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
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando directorio de representantes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredParents.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-750 dark:text-white">No se encontraron representantes</h3>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
        No hay registros que coincidan con los filtros aplicados en el directorio.
      </p>
    </div>

    <!-- Grid View of Parent Cards -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="parent in filteredParents"
        :key="parent.id"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
      >
        <div>
          <!-- Header: Avatar, Name, Relationship Badge -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                {{ getInitials(parent.first_name, parent.last_name) }}
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-slate-850 dark:text-white truncate">
                  {{ parent.first_name }} {{ parent.last_name }}
                </h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {{ parent.national_id }}
                  </span>
                  <span v-if="parent.emergency_contact" class="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded-md">
                    Emergencia
                  </span>
                </div>
              </div>
            </div>

            <span 
              :class="getRelationshipBadgeClass(parent.relationship)"
              class="text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
            >
              {{ parent.relationship }}
            </span>
          </div>

          <!-- Body: Contact Details -->
          <div class="mt-3.5 space-y-2 text-xs">
            <div v-if="parent.phone_mobile" class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{{ parent.phone_mobile }}</span>
            </div>

            <div v-if="parent.email_primary" class="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
              <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="truncate">{{ parent.email_primary }}</span>
            </div>

            <div v-if="parent.occupation" class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="truncate">{{ parent.occupation }}</span>
            </div>
          </div>

          <!-- Linked Students -->
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Estudiantes a Cargo ({{ parent.students?.length || 0 }})
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="std in parent.students" 
                :key="std.student_id"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-bold text-slate-700 dark:text-slate-200"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                {{ std.first_name }} {{ std.last_name }}
              </span>
              <span v-if="!parent.students || parent.students.length === 0" class="text-xs text-slate-400 italic">
                Sin estudiantes vinculados
              </span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span class="font-mono text-[10px] text-slate-400">
            {{ parent.parent_id }}
          </span>

          <div class="flex items-center gap-1">
            <button
              @click="openEditModal(parent, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Editar"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="promptDeleteParent(parent, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Eliminar"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th class="py-3.5 px-4 sm:px-6">Representante</th>
              <th class="py-3.5 px-4">Parentesco</th>
              <th class="py-3.5 px-4">Contacto Directo</th>
              <th class="py-3.5 px-4">Hijos Vinculados</th>
              <th class="py-3.5 px-4 text-center">Emergencia</th>
              <th class="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="p in filteredParents"
              :key="p.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <!-- Name & ID -->
              <td class="py-3.5 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {{ getInitials(p.first_name, p.last_name) }}
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-bold text-slate-850 dark:text-white">
                      {{ p.last_name }}, {{ p.first_name }}
                    </p>
                    <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                      {{ p.national_id }} • {{ p.parent_id }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Relationship -->
              <td class="py-3.5 px-4">
                <span 
                  :class="getRelationshipBadgeClass(p.relationship)"
                  class="text-[11px] font-bold px-2 py-0.5 rounded-md"
                >
                  {{ p.relationship }}
                </span>
              </td>

              <!-- Contact -->
              <td class="py-3.5 px-4 text-xs">
                <p class="font-semibold text-slate-750 dark:text-slate-200">{{ p.phone_mobile || 'Sin teléfono' }}</p>
                <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ p.email_primary || 'Sin correo' }}</p>
              </td>

              <!-- Students -->
              <td class="py-3.5 px-4 text-xs">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="std in p.students" 
                    :key="std.student_id"
                    class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                  >
                    {{ std.first_name }} {{ std.last_name }}
                  </span>
                  <span v-if="!p.students || p.students.length === 0" class="text-slate-400 italic text-[11px]">
                    Ninguno
                  </span>
                </div>
              </td>

              <!-- Emergency -->
              <td class="py-3.5 px-4 text-center">
                <span 
                  :class="p.emergency_contact ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'"
                  class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold"
                >
                  {{ p.emergency_contact ? 'Sí' : 'No' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 sm:px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    @click="openEditModal(p, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="promptDeleteParent(p, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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

    <!-- Standardized Modal: Registrar / Editar Representante -->
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                  {{ isEditing ? 'Editar Representante' : 'Registrar Nuevo Representante' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Ficha de datos legales y canales de contacto de emergencia
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
          <form @submit.prevent="submitParent" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- First Name & Last Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre(s) *
                </label>
                <input
                  v-model="form.first_name"
                  type="text"
                  required
                  placeholder="Ej. Roberto"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Apellido(s) *
                </label>
                <input
                  v-model="form.last_name"
                  type="text"
                  required
                  placeholder="Ej. Pérez Silva"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <!-- National ID & Relationship -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Cédula / Documento *
                </label>
                <input
                  v-model="form.national_id"
                  type="text"
                  required
                  placeholder="Ej. V-15982012"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Parentesco *
                </label>
                <select
                  v-model="form.relationship"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Abuelo/a">Abuelo / Abuela</option>
                  <option value="Tío/a">Tío / Tía</option>
                  <option value="Otro">Otro Parentesco</option>
                </select>
              </div>
            </div>

            <!-- Phone & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Teléfono Móvil
                </label>
                <input
                  v-model="form.phone_mobile"
                  type="text"
                  placeholder="+58 414 1234567"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  v-model="form.email_primary"
                  type="email"
                  placeholder="representante@email.com"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <!-- Occupation & Student Link -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Ocupación / Profesión
                </label>
                <input
                  v-model="form.occupation"
                  type="text"
                  placeholder="Ej. Administrador"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Vincular Estudiante
                </label>
                <select
                  v-model="form.student_id"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option :value="null">Ninguno / Sin vinculación</option>
                  <option v-for="std in studentsList" :key="std.id" :value="std.id">
                    {{ std.last_name }}, {{ std.first_name }} ({{ std.student_id }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Emergency Contact Checkbox -->
            <div class="pt-2">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input
                  v-model="form.emergency_contact"
                  type="checkbox"
                  class="w-4 h-4 rounded text-orange-500 focus:ring-orange-500/20"
                />
                <span class="text-xs font-semibold text-slate-750 dark:text-slate-200">
                  Habilitar como Contacto Prioritario en caso de Emergencia
                </span>
              </label>
            </div>
          </form>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="closeModal"
              type="button"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              ✕ Cancelar
            </button>
            <button
              @click="submitParent"
              :disabled="isSubmitting"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Representante' : 'Guardar Representante') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Eliminar Representante -->
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
              ¿Eliminar a este representante?
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Se dará de baja a <strong class="text-slate-700 dark:text-slate-200">{{ parentToDelete?.first_name }} {{ parentToDelete?.last_name }}</strong> ({{ parentToDelete?.national_id }}).
            </p>
          </div>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="isDeleteModalOpen = false"
              type="button"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              ✕ Cancelar
            </button>
            <button
              @click="confirmDeleteParent"
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

const nuxtApp = useNuxtApp()
const authStore = useAuthStore()

const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role
  return role === 'admin' || role === 'control_estudio' || role === 'coordinator' || true
})

// State
const parents = ref([])
const studentsList = ref([])
const search = ref('')
const filterRelationship = ref('')
const viewMode = ref('grid') // 'grid' | 'table'
const isLoading = ref(false)
const isSubmitting = ref(false)
const toastMessage = ref('')

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const parentToDelete = ref(null)

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  national_id: '',
  relationship: 'Padre',
  occupation: '',
  email_primary: '',
  phone_mobile: '',
  student_id: null,
  emergency_contact: true
})

// KPIs
const emergencyCount = computed(() => parents.value.filter(p => p.emergency_contact).length)
const whatsappCount = computed(() => parents.value.filter(p => p.phone_mobile || p.whatsapp).length)
const linkedStudentsCount = computed(() => {
  const allLinked = parents.value.flatMap(p => p.students || [])
  const uniqueIds = new Set(allLinked.map(s => s.student_id))
  return uniqueIds.size
})

// Filtered Parents
const filteredParents = computed(() => {
  let list = parents.value

  if (filterRelationship.value) {
    list = list.filter(p => p.relationship === filterRelationship.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(p => 
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
      (p.national_id && p.national_id.toLowerCase().includes(q)) ||
      (p.phone_mobile && p.phone_mobile.toLowerCase().includes(q)) ||
      (p.email_primary && p.email_primary.toLowerCase().includes(q)) ||
      (p.students && p.students.some(s => `${s.first_name} ${s.last_name}`.toLowerCase().includes(q)))
    )
  }

  return list
})

const getInitials = (first, last) => {
  const f = first ? first[0] : ''
  const l = last ? last[0] : ''
  return (f + l).toUpperCase() || 'RP'
}

const getRelationshipBadgeClass = (rel) => {
  if (rel === 'Padre') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
  if (rel === 'Madre') return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
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
    first_name: '',
    last_name: '',
    national_id: '',
    relationship: 'Padre',
    occupation: '',
    email_primary: '',
    phone_mobile: '',
    student_id: null,
    emergency_contact: true
  }
  isModalOpen.value = true
}

const openEditModal = (parent, event) => {
  captureTriggerOrigin(event)
  isEditing.value = true
  form.value = {
    id: parent.id,
    first_name: parent.first_name,
    last_name: parent.last_name,
    national_id: parent.national_id,
    relationship: parent.relationship || 'Padre',
    occupation: parent.occupation || '',
    email_primary: parent.email_primary || '',
    phone_mobile: parent.phone_mobile || '',
    student_id: parent.students?.[0]?.student_id || null,
    emergency_contact: parent.emergency_contact
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Submit Parent
const submitParent = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await nuxtApp.$api.service('parents').patch(form.value.id, form.value)
      showToast('Representante actualizado exitosamente')
    } else {
      await nuxtApp.$api.service('parents').create(form.value)
      showToast('Representante registrado exitosamente')
    }
    await fetchParents()
    closeModal()
  } catch (error) {
    console.error('Error saving parent:', error)
    showToast(error.message || 'Error al guardar el representante')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Parent
const promptDeleteParent = (parent, event) => {
  captureTriggerOrigin(event)
  parentToDelete.value = parent
  isDeleteModalOpen.value = true
}

const confirmDeleteParent = async () => {
  if (!parentToDelete.value) return
  try {
    await nuxtApp.$api.service('parents').remove(parentToDelete.value.id)
    showToast('Representante eliminado')
    await fetchParents()
  } catch (error) {
    console.error('Error deleting parent:', error)
    showToast(error.message || 'Error al eliminar el representante')
  } finally {
    isDeleteModalOpen.value = false
    parentToDelete.value = null
  }
}

// Fetch Data
const fetchParents = async () => {
  isLoading.value = true
  try {
    const res = await nuxtApp.$api.service('parents').find({
      query: {
        $limit: 100
      }
    })
    parents.value = res.data || res || []
  } catch (error) {
    console.error('Error fetching parents:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchStudents = async () => {
  try {
    const res = await nuxtApp.$api.service('students').find({
      query: {
        is_deleted: false,
        $limit: 100
      }
    })
    studentsList.value = res.data || res || []
  } catch (e) {
    console.error('Error fetching students:', e)
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

onMounted(async () => {
  await fetchStudents()
  await fetchParents()
})
</script>
