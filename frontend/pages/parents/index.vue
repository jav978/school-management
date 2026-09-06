<template>
  <div class="space-y-6 animate-fade-in">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            👨‍👩‍👧
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Padres y Representantes Legales
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Directorio de representantes legales, datos de contacto de emergencia y estudiantes vinculados
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Representante</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Representantes -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Representantes</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ parents.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-purple/40 flex items-center justify-center text-brand-primary dark:text-brand-secondary flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>

      <!-- Contactos de Emergencia -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contactos Emergencia</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 leading-tight tracking-tight">{{ emergencyCount }}</p>
            <span class="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded-md">
              Habilitados
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/40 flex items-center justify-center text-rose-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>

      <!-- Estudiantes Vinculados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hijos Vinculados</p>
          <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 mt-1 leading-tight tracking-tight">{{ linkedStudentsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/25 border border-brand-purple/20 dark:border-brand-purple/40 flex items-center justify-center text-brand-purple dark:text-brand-gold flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
      </div>

      <!-- Canales Directos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Canal Telefónico</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">{{ whatsappCount }}</p>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
              Directos
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="glass-card rounded-2xl p-4 sm:p-5 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
        </div>

        <!-- Filters Row -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Relationship Filter -->
          <select
            v-model="filterRelationship"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los parentescos</option>
            <option value="Padre">Padre</option>
            <option value="Madre">Madre</option>
            <option value="Tutor Legal">Tutor Legal</option>
            <option value="Abuelo/a">Abuelo/a</option>
            <option value="Tío/a">Tío/a</option>
          </select>

          <!-- View Mode Toggle -->
          <div class="flex items-center bg-slate-100 dark:bg-[#110926] p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button
              @click="switchViewMode('grid')"
              type="button"
              :class="viewMode === 'grid' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
              class="p-1.5 rounded-lg text-xs transition-all cursor-pointer"
              title="Vista de Cuadrícula"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="switchViewMode('table')"
              type="button"
              :class="viewMode === 'table' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
              class="p-1.5 rounded-lg text-xs transition-all cursor-pointer"
              title="Vista de Tabla"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-16 text-center glass-card rounded-2xl">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-primary dark:border-brand-gold border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-3 font-medium">Cargando directorio de representantes U.E Santa Luisa...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredParents.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-3xl mb-3">
        👨‍👩‍👧
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron representantes</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        No hay registros que coincidan con los filtros aplicados en el directorio.
      </p>
    </div>

    <!-- Grid View of Parent Cards -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="parent in filteredParents"
        :key="parent.id"
        class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all"
      >
        <div>
          <!-- Header: Avatar, Name, Relationship Badge -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                {{ getInitials(parent.first_name, parent.last_name) }}
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {{ parent.first_name }} {{ parent.last_name }}
                </h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {{ parent.national_id }}
                  </span>
                  <span v-if="parent.emergency_contact" class="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded-md border border-rose-500/20">
                    Emergencia
                  </span>
                </div>
              </div>
            </div>

            <span 
              :class="getRelationshipBadgeClass(parent.relationship)"
              class="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 border"
            >
              {{ parent.relationship }}
            </span>
          </div>

          <!-- Body: Contact Details -->
          <div class="mt-3.5 space-y-2 text-xs">
            <div v-if="parent.phone_mobile" class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <svg class="w-3.5 h-3.5 text-brand-purple dark:text-brand-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-medium">{{ parent.phone_mobile }}</span>
            </div>

            <div v-if="parent.email_primary" class="flex items-center gap-2 text-slate-600 dark:text-slate-400 truncate">
              <svg class="w-3.5 h-3.5 text-brand-purple dark:text-brand-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
              Estudiantes a Cargo ({{ parent.students?.length || 0 }})
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="std in parent.students" 
                :key="std.student_id"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-200"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                <span>{{ std.first_name }} {{ std.last_name }}</span>
              </span>
              <span v-if="!parent.students || parent.students.length === 0" class="text-[11px] text-slate-400 italic">
                Sin estudiantes vinculados actualmente
              </span>
            </div>
          </div>
        </div>

        <!-- Footer: Action buttons -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          <span class="text-[10px] text-slate-400 font-medium">U.E Santa Luisa</span>
          <div class="flex items-center gap-1">
            <button
              @click="openEditModal(parent, $event)"
              type="button"
              class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              Editar
            </button>
            <button
              @click="promptDeleteParent(parent, $event)"
              type="button"
              class="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="glass-card rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50/80 dark:bg-[#110926] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-white/10">
            <tr>
              <th class="py-3.5 px-4 sm:px-6">Representante</th>
              <th class="py-3.5 px-4">Parentesco</th>
              <th class="py-3.5 px-4">Contacto Directo</th>
              <th class="py-3.5 px-4">Hijos Vinculados</th>
              <th class="py-3.5 px-4 text-center">Emergencia</th>
              <th class="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/5">
            <tr
              v-for="p in filteredParents"
              :key="p.id"
              class="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
            >
              <!-- Name & ID -->
              <td class="py-3.5 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {{ getInitials(p.first_name, p.last_name) }}
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {{ p.last_name }}, {{ p.first_name }}
                    </p>
                    <span class="font-mono text-[10px] text-slate-400">
                      {{ p.national_id }} • {{ p.parent_id }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Relationship -->
              <td class="py-3.5 px-4">
                <span 
                  :class="getRelationshipBadgeClass(p.relationship)"
                  class="text-[11px] font-bold px-2 py-0.5 rounded-md border"
                >
                  {{ p.relationship }}
                </span>
              </td>

              <!-- Contact -->
              <td class="py-3.5 px-4 text-xs">
                <p class="font-semibold text-slate-800 dark:text-slate-200">{{ p.phone_mobile || 'Sin teléfono' }}</p>
                <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ p.email_primary || 'Sin correo' }}</p>
              </td>

              <!-- Students -->
              <td class="py-3.5 px-4 text-xs">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="std in p.students" 
                    :key="std.student_id"
                    class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300"
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
                  :class="p.emergency_contact ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20' : 'bg-slate-100 text-slate-500 dark:bg-white/5 border border-slate-200 dark:border-white/10'"
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
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="promptDeleteParent(p, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

    <!-- STANDARDIZED MODAL: REGISTRAR / EDITAR REPRESENTANTE (3 NUMBERED SECTIONS & INSTITUTIONAL HEADER) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
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
                👨‍👩‍👧
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Ficha del Representante' : 'Nuevo Registro de Representante' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Directorio de Representantes Legales y Contacto Escolar
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

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="submitParent" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Identidad y Parentesco Legal -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Identidad y Parentesco Legal</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- National ID -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cédula / Documento de Identidad *
                    </label>
                    <input
                      v-model="form.national_id"
                      type="text"
                      placeholder="Ej. V-15982012"
                      :class="[
                        formErrors.national_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all'
                      ]"
                    />
                    <p v-if="formErrors.national_id" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.national_id }}
                    </p>
                  </div>

                  <!-- Relationship -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Parentesco Legal con el Alumno *
                    </label>
                    <select
                      v-model="form.relationship"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
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
              </div>

              <!-- Section 2: Datos Personales y Estudiante Vinculado -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Datos del Representante y Estudiante Vinculado</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- First Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombres del Representante *
                    </label>
                    <input
                      v-model="form.first_name"
                      type="text"
                      placeholder="Ej. Roberto Carlos"
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
                      Apellidos del Representante *
                    </label>
                    <input
                      v-model="form.last_name"
                      type="text"
                      placeholder="Ej. Pérez Silva"
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

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Occupation -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ocupación / Profesión
                    </label>
                    <input
                      v-model="form.occupation"
                      type="text"
                      placeholder="Ej. Contador Público / Comerciante"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Student Link -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Vincular Estudiante Principal
                    </label>
                    <select
                      v-model="form.student_id"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option :value="null">Ninguno / Asignar más adelante</option>
                      <option v-for="std in studentsList" :key="std.id" :value="std.id">
                        {{ std.last_name }}, {{ std.first_name }} ({{ std.student_id }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section 3: Contacto y Canales de Emergencia -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Contacto Directo y Canales de Emergencia</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Phone Mobile -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Móvil (WhatsApp) *
                    </label>
                    <input
                      v-model="form.phone_mobile"
                      type="text"
                      placeholder="+58 414 1234567"
                      :class="[
                        formErrors.phone_mobile ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.phone_mobile" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.phone_mobile }}
                    </p>
                  </div>

                  <!-- Email Primary -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      v-model="form.email_primary"
                      type="email"
                      placeholder="representante@email.com"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>

                <!-- Emergency Contact Toggle -->
                <div class="p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      v-model="form.emergency_contact"
                      type="checkbox"
                      class="w-4 h-4 rounded text-brand-primary dark:text-brand-gold focus:ring-brand-purple/30 cursor-pointer"
                    />
                    <div>
                      <span class="text-xs font-bold text-slate-850 dark:text-slate-200 block">
                        Habilitar como Contacto Prioritario en caso de Emergencia
                      </span>
                      <span class="text-[11px] text-slate-400">
                        El personal de coordinación y enfermería llamará a este representante prioritariamente ante cualquier eventualidad.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                ✕ Cancelar
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
                  <span>{{ isEditing ? 'Actualizar Representante' : 'Guardar Representante' }}</span>
                </span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

    <!-- Modal: Eliminar / Inhabilitar Representante -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md p-6 text-center animate-scale-up">
          <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/40 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
            ⚠️
          </div>
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">
            ¿Eliminar a este representante?
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Se dará de baja a <strong class="text-slate-900 dark:text-white">{{ parentToDelete?.first_name }} {{ parentToDelete?.last_name }}</strong> ({{ parentToDelete?.national_id }}).
          </p>
          <div class="mt-3 p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 text-left">
            ℹ️ <strong>Nota Institucional:</strong> Los expedientes de los estudiantes asociados permanecerán intactos en el sistema.
          </div>
          <div class="flex items-center justify-center gap-3 mt-6">
            <button
              @click="isDeleteModalOpen = false"
              type="button"
              class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              @click="confirmDeleteParent"
              type="button"
              class="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Confirmar Eliminación
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

const nuxtApp = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()

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

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const parentToDelete = ref(null)

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

const formErrors = ref({})

const validateForm = () => {
  const errors = {}
  if (!form.value.national_id?.trim()) errors.national_id = 'La cédula o documento es obligatorio'
  if (!form.value.first_name?.trim()) errors.first_name = 'El nombre es obligatorio'
  if (!form.value.last_name?.trim()) errors.last_name = 'El apellido es obligatorio'
  if (!form.value.phone_mobile?.trim()) errors.phone_mobile = 'El teléfono de contacto es obligatorio'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

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
  if (rel === 'Padre') return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
  if (rel === 'Madre') return 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
  return 'bg-amber-500/10 text-amber-600 dark:text-brand-gold border-amber-500/20'
}

const switchViewMode = (mode) => {
  viewMode.value = mode
}

const openCreateModal = () => {
  isEditing.value = false
  formErrors.value = {}
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

const openEditModal = (parent) => {
  isEditing.value = true
  formErrors.value = {}
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
  formErrors.value = {}
}

// Submit Parent
const submitParent = async () => {
  if (!validateForm()) {
    toast.warning('Por favor completa los campos obligatorios (*)')
    return
  }

  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await nuxtApp.$api.service('parents').patch(form.value.id, form.value)
      toast.success(`Ficha de ${form.value.first_name} ${form.value.last_name} actualizada exitosamente`)
    } else {
      await nuxtApp.$api.service('parents').create(form.value)
      toast.success(`Representante ${form.value.first_name} ${form.value.last_name} registrado en la institución`)
    }
    await fetchParents()
    closeModal()
  } catch (error) {
    console.error('Error saving parent:', error)
    toast.error(error.message || 'Error al guardar el representante')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Parent
const promptDeleteParent = (parent) => {
  parentToDelete.value = parent
  isDeleteModalOpen.value = true
}

const confirmDeleteParent = async () => {
  if (!parentToDelete.value) return
  try {
    await nuxtApp.$api.service('parents').remove(parentToDelete.value.id)
    toast.warning(`Representante ${parentToDelete.value.first_name} ${parentToDelete.value.last_name} eliminado del directorio`)
    await fetchParents()
  } catch (error) {
    console.error('Error deleting parent:', error)
    toast.error(error.message || 'Error al eliminar el representante')
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
    toast.error('No se pudo cargar el directorio de representantes')
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

onMounted(async () => {
  await fetchStudents()
  await fetchParents()
})
</script>
