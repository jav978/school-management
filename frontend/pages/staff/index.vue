<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            👥
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            {{ $t('staffTitle', 'Personal y Colaboradores (Staff)') }}
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Gestión de personal administrativo, obrero, operativo y especialistas
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openModal()" 
          type="button"
          data-testid="create-staff-btn"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>{{ $t('new', 'Nuevo') }} {{ $t('staff', 'Personal') }}</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Personal -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Personal</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Administrativos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Administrativos</p>
          <p class="text-3xl font-black font-display text-sky-600 dark:text-brand-secondary mt-1 leading-tight tracking-tight">{{ stats.administrativos }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Profesionales -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Profesionales</p>
          <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 mt-1 leading-tight tracking-tight">{{ stats.profesionales }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
      </div>

      <!-- Obreros / Servicios -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Obreros / Servicios</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ stats.obreros }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters and Search Card -->
    <div class="glass-card rounded-2xl p-4 shadow-sm">
      <div class="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <!-- Search -->
        <div class="flex-1 relative min-w-[240px]">
          <input 
            v-model="searchQuery"
            data-testid="staff-search-input"
            type="text" 
            placeholder="Buscar por nombre, cédula, cargo, departamento o código..."
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
          <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filter Selects -->
        <div class="flex flex-wrap items-center gap-2.5">
          <select 
            v-model="selectedDepartment" 
            data-testid="staff-department-filter"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los Departamentos</option>
            <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <select 
            v-model="selectedType" 
            data-testid="staff-type-filter"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los Roles</option>
            <option value="administrativo">Administrativo</option>
            <option value="profesional">Profesional</option>
            <option value="obrero">Obrero / Servicios</option>
          </select>

          <select 
            v-model="selectedStatus" 
            data-testid="staff-status-filter"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los Estados</option>
            <option value="activo">Activos</option>
            <option value="licencia">En Licencia</option>
            <option value="inactivo">Inactivos (Deshabilitados)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Staff List -->
    <div v-if="loading" class="text-center py-16 glass-card rounded-2xl">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-primary dark:border-brand-gold border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-3 font-medium">Cargando nómina de personal de la U.E Santa Luisa...</p>
    </div>

    <div v-else-if="filteredStaff.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-3xl mb-3">
        📋
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron registros de personal</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Añade nuevos colaboradores o ajusta los filtros de búsqueda según el cargo o estado.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div 
        v-for="person in filteredStaff" 
        :key="person.id"
        data-testid="staff-card"
        class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all"
        :class="person.status === 'inactivo' ? 'opacity-85 border-amber-500/30' : ''"
      >
        <div>
          <!-- Top Row -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 overflow-hidden border border-brand-primary/20 dark:border-brand-purple/30 flex-shrink-0 flex items-center justify-center shadow-inner">
                <img 
                  v-if="person.photo_url" 
                  :src="resolvePhotoUrl(person.photo_url)" 
                  :alt="person.first_name" 
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-sm font-black text-brand-primary dark:text-brand-gold">
                  {{ (person.first_name || 'S')[0] }}{{ (person.last_name || 'L')[0] }}
                </span>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {{ person.first_name }} {{ person.last_name }}
                </h3>
                <p class="text-xs text-brand-purple dark:text-brand-secondary font-semibold mt-0.5">
                  {{ person.position || 'Colaborador' }}
                </p>
              </div>
            </div>
            
            <!-- Badges Column -->
            <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span 
                :class="getStatusBadgeClass(person.status)"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border"
              >
                {{ person.status === 'inactivo' ? 'Inactivo' : (person.status === 'licencia' ? 'En Licencia' : 'Activo') }}
              </span>

              <!-- User Account Badge -->
              <span 
                data-testid="staff-account-badge"
                class="px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 shadow-2xs"
                :class="person.has_user_account || person.user_id 
                  ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'"
                :title="person.has_user_account || person.user_id ? 'Cuenta de usuario activa en el sistema' : 'Sin cuenta de acceso al sistema'"
              >
                <span>{{ person.has_user_account || person.user_id ? '👤' : '📄' }}</span>
                <span>{{ person.has_user_account || person.user_id ? 'Cuenta Activa' : 'Sin Usuario' }}</span>
              </span>

              <!-- Carnet Badge -->
              <span 
                data-testid="staff-carnet-badge"
                class="px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 shadow-2xs"
                :class="person.photo_url 
                  ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' 
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'"
                :title="person.photo_url ? 'Fotografía registrada, carnet listo para emitir' : 'Fotografía pendiente para carnet escolar'"
              >
                <span>{{ person.photo_url ? '🪪' : '📷' }}</span>
                <span>{{ person.photo_url ? 'Carnet Listo' : 'Foto Pendiente' }}</span>
              </span>
            </div>
          </div>

          <!-- Identification & Type -->
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/10 pt-3">
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Código / Cédula:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ person.staff_id }} • {{ person.id_card || 'S/C' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Tipo / Depto:</span>
              <span class="font-semibold capitalize text-slate-700 dark:text-slate-300">{{ person.staff_type }} ({{ person.department || 'General' }})</span>
            </div>
            <div v-if="person.hire_date" class="flex justify-between items-center">
              <span class="text-slate-400">Fecha de Ingreso:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300 font-mono">{{ person.hire_date }}</span>
            </div>
            <div v-if="person.date_of_birth || person.gender" class="flex justify-between items-center">
              <span class="text-slate-400">Nacimiento / Género:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300 capitalize">
                {{ person.date_of_birth || '' }} {{ person.gender ? `(${person.gender === 'femenino' ? 'F' : 'M'})` : '' }}
              </span>
            </div>
            <div v-if="person.blood_type" class="flex justify-between items-center">
              <span class="text-slate-400">Tipo de Sangre:</span>
              <span class="font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md text-[11px]">{{ person.blood_type }}</span>
            </div>
            <div v-if="person.phone" class="flex justify-between items-center">
              <span class="text-slate-400">Teléfono:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">{{ person.phone }}</span>
            </div>
            <div v-if="person.email" class="flex justify-between items-center">
              <span class="text-slate-400">Email:</span>
              <span class="font-medium text-slate-600 dark:text-slate-400 truncate max-w-[160px]">{{ person.email }}</span>
            </div>
            <div v-if="person.emergency_contact" class="flex justify-between items-center">
              <span class="text-slate-400">Emergencia:</span>
              <span class="font-medium text-amber-600 dark:text-brand-gold text-[11px] truncate max-w-[170px]">{{ person.emergency_contact }} {{ person.emergency_phone ? `(${person.emergency_phone})` : '' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-white/10">
          <!-- Carnet Direct Navigation Link -->
          <NuxtLink 
            :to="'/idcards?type=' + (person.staff_type === 'obrero' ? 'obrero' : 'administrativo')"
            data-testid="staff-carnet-link"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-xl transition-all border border-sky-200 dark:border-sky-800/40 cursor-pointer shadow-2xs active:scale-[0.98]"
            title="Ir al módulo de Carnets Escolares para emitir o imprimir credencial"
          >
            <span>🪪</span>
            <span>Carnet</span>
          </NuxtLink>

          <div class="flex items-center gap-1.5">
            <button 
              v-if="person.status === 'inactivo'"
              @click="reactivatePerson(person)"
              data-testid="reactivate-staff-btn"
              class="px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              title="Reactivar Colaborador"
            >
              <span>↺</span>
              <span>Reactivar</span>
            </button>
            <button 
              @click="editPerson(person)"
              data-testid="edit-staff-btn"
              class="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-amber-500/30"
              title="Editar miembro del personal"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              v-if="person.status !== 'inactivo'"
              @click="openDeleteModal(person)"
              data-testid="delete-staff-btn"
              class="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
              title="Inhabilitar miembro del personal"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STANDARDIZED MODAL (3 NUMBERED SECTIONS & INSTITUTIONAL HEADER) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeModal"
      >
        <div 
          data-testid="staff-modal"
          class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Institutional Header Banner -->
          <div class="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary border-b border-brand-gold/30 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 border border-brand-gold/50 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                👥
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Miembro de Personal' : 'Nuevo Miembro de Personal' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Nómina de Personal y Colaboradores
                </p>
              </div>
            </div>

            <button 
              @click="closeModal" 
              type="button" 
              class="w-8.5 h-8.5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="savePerson" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 pb-8 space-y-6">
              
              <!-- Section 1: Identificación y Clasificación Laboral -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-primary dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-gold"></span>
                  <span>1. Identificación y Clasificación Laboral</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Staff ID -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código Único *
                    </label>
                    <input 
                      v-model="form.staff_id" 
                      data-testid="staff-id-input"
                      type="text" 
                      placeholder="STF-001"
                      :class="[
                        formErrors.staff_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all'
                      ]"
                    />
                    <p v-if="formErrors.staff_id" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.staff_id }}
                    </p>
                  </div>

                  <!-- ID Card -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cédula de Identidad *
                    </label>
                    <input 
                      v-model="form.id_card" 
                      data-testid="staff-id-card-input"
                      type="text" 
                      placeholder="V-12345678"
                      :class="[
                        formErrors.id_card ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all'
                      ]"
                    />
                    <p v-if="formErrors.id_card" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.id_card }}
                    </p>
                  </div>

                  <!-- Staff Type -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Personal *
                    </label>
                    <select 
                      v-model="form.staff_type" 
                      data-testid="staff-type-select"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="administrativo">Administrativo</option>
                      <option value="profesional">Profesional</option>
                      <option value="obrero">Obrero / Servicios</option>
                    </select>
                  </div>

                  <!-- Hire Date -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Ingreso
                    </label>
                    <input 
                      v-model="form.hire_date" 
                      data-testid="staff-hire-date-input"
                      type="date" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all font-sans"
                    />
                  </div>
                </div>

                <!-- Status Selector Segmented -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Estado de Actividad en la Institución
                  </label>
                  <div class="grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      type="button"
                      @click="form.status = 'activo'"
                      :class="[
                        form.status === 'activo' 
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' 
                          : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                        'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                      ]"
                    >
                      <span>✓ Activo</span>
                    </button>
                    <button
                      type="button"
                      @click="form.status = 'licencia'"
                      :class="[
                        form.status === 'licencia' 
                          ? 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-sky-400 font-bold shadow-xs' 
                          : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                        'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                      ]"
                    >
                      <span>⏱️ Licencia</span>
                    </button>
                    <button
                      type="button"
                      @click="form.status = 'inactivo'"
                      :class="[
                        form.status === 'inactivo' 
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 font-bold shadow-xs' 
                          : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300',
                        'p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer'
                      ]"
                    >
                      <span>⚠️ Inactivo</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section 2: Datos Personales y Cargo -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-primary dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-gold"></span>
                  <span>2. Datos del Empleado, Cargo y Fotografía</span>
                </div>

                <!-- Avatar Upload Component -->
                <UiAvatarUpload 
                  v-model="form.photo_url" 
                  label="Fotografía del Personal (Carnet / Perfil)" 
                />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- First Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombres *
                    </label>
                    <input 
                      v-model="form.first_name" 
                      data-testid="staff-firstname-input"
                      type="text" 
                      placeholder="Ej. Elena María"
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
                      data-testid="staff-lastname-input"
                      type="text" 
                      placeholder="Ej. Vargas Mendoza"
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

                <!-- Date of Birth & Gender -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input 
                      v-model="form.date_of_birth" 
                      data-testid="staff-dob-input"
                      type="date" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Género
                    </label>
                    <select 
                      v-model="form.gender" 
                      data-testid="staff-gender-select"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="">No especificado</option>
                      <option value="femenino">Femenino</option>
                      <option value="masculino">Masculino</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Position / Role -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo / Puesto Desempeñado *
                    </label>
                    <input 
                      v-model="form.position" 
                      data-testid="staff-position-input"
                      type="text" 
                      placeholder="Ej. Coordinador de Servicios / Asistente Administrativo"
                      :class="[
                        formErrors.position ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.position" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.position }}
                    </p>
                  </div>

                  <!-- Department with Institutional Datalist -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Departamento / Área Institucional
                    </label>
                    <div class="relative">
                      <input 
                        v-model="form.department" 
                        list="institutional-departments"
                        data-testid="staff-department-input"
                        type="text" 
                        placeholder="Ej. Control de Estudios, Mantenimiento..."
                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                      />
                      <datalist id="institutional-departments">
                        <option value="Control de Estudios y Evaluación" />
                        <option value="Dirección y Subdirección" />
                        <option value="Administración y Finanzas" />
                        <option value="Orientación y Psicología (DOBE)" />
                        <option value="Servicios Generales y Mantenimiento" />
                        <option value="Seguridad y Vigilancia" />
                        <option value="Tecnología y Soporte Técnico" />
                        <option value="Biblioteca y Archivo" />
                        <option value="Bienestar Estudiantil" />
                        <option value="Coordinación Pedagógica" />
                        <option value="Servicio Médico / Enfermería" />
                        <option value="General / Operativo" />
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 3: Contacto, Salud y Emergencia -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-primary dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-gold"></span>
                  <span>3. Contacto, Salud y Emergencia</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Email -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input 
                      v-model="form.email" 
                      data-testid="staff-email-input"
                      type="email" 
                      placeholder="correo@santaluisa.edu.ve"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Móvil
                    </label>
                    <input 
                      v-model="form.phone" 
                      data-testid="staff-phone-input"
                      type="text" 
                      placeholder="+58 414 123 4567"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Blood Type -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Sangre
                    </label>
                    <select 
                      v-model="form.blood_type" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
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

                  <!-- Emergency Contact -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contacto de Emergencia
                    </label>
                    <input 
                      v-model="form.emergency_contact" 
                      type="text" 
                      placeholder="Ej. Carmen Vargas (Esposa)"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Emergency Phone -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tel. Emergencia
                    </label>
                    <input 
                      v-model="form.emergency_phone" 
                      type="text" 
                      placeholder="+58 412 987 6543"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
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
                    placeholder="Ej. Av. San Martín, Calle Los Andes, Casa N° 12, Caracas"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                  />
                </div>
              </div>

              <!-- Section 4: Cuenta de Usuario y Carnetización -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-primary dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-gold"></span>
                  <span>4. Cuenta de Usuario y Carnetización Escolar</span>
                </div>

                <!-- User Account Toggle Box -->
                <div 
                  class="p-4 rounded-2xl border transition-all"
                  :class="form.create_user_account 
                    ? 'bg-purple-500/5 dark:bg-purple-950/20 border-purple-500/30' 
                    : 'bg-slate-50 dark:bg-[#110926] border-slate-200 dark:border-white/10'"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div 
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                        :class="form.create_user_account ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' : 'bg-slate-200 dark:bg-white/10 text-slate-400'"
                      >
                        🔐
                      </div>
                      <div>
                        <p class="text-xs font-bold text-slate-800 dark:text-slate-100">
                          Habilitar Cuenta de Acceso Web al Sistema
                        </p>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400">
                          Permite al personal iniciar sesión en el portal con rol Staff / Colaborador
                        </p>
                      </div>
                    </div>

                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        v-model="form.create_user_account" 
                        data-testid="staff-create-user-toggle"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                    </label>
                  </div>

                  <!-- Expanded Account Options -->
                  <div v-if="form.create_user_account" class="mt-4 pt-4 border-t border-purple-500/20 space-y-3">
                    <!-- Status message if existing user account linked -->
                    <div v-if="form.user_id" class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span>✓</span>
                        <span>Colaborador vinculado a la cuenta de usuario <strong>#{{ form.user_id }}</strong> ({{ form.email || 'Email institucional' }}).</span>
                      </div>
                      <button 
                        type="button" 
                        @click="unlinkUserAccount" 
                        class="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                      >
                        Desvincular
                      </button>
                    </div>

                    <div v-else class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-700 dark:text-purple-300">
                      ℹ️ Se creará automáticamente un usuario en <strong>school.users</strong> con el correo <strong>{{ form.email || '(ingresa el correo en la Sección 3)' }}</strong> y rol <strong>Staff</strong>.
                    </div>

                    <!-- Password field -->
                    <div>
                      <div class="flex items-center justify-between mb-1">
                        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {{ form.user_id ? 'Restablecer Contraseña (opcional)' : 'Contraseña de Acceso inicial' }}
                        </label>
                        <button 
                          type="button" 
                          @click="generatePassword" 
                          class="text-[11px] font-bold text-brand-purple hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>🎲</span>
                          <span>Generar Segura</span>
                        </button>
                      </div>
                      <div class="relative">
                        <input 
                          v-model="form.user_account_password" 
                          data-testid="staff-user-password-input"
                          :type="showPassword ? 'text' : 'password'" 
                          :placeholder="form.user_id ? 'Dejar en blanco para conservar contraseña actual' : 'Ej. SantaLuisa.2026!*'"
                          class="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all"
                        />
                        <button 
                          type="button" 
                          @click="showPassword = !showPassword" 
                          class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                        >
                          {{ showPassword ? '🙈' : '👁️' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Carnet Status Info Box -->
                <div class="p-3.5 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div class="flex items-center gap-2.5">
                    <span class="text-xl">🪪</span>
                    <div>
                      <p class="font-bold text-slate-800 dark:text-slate-200">Integración con Carnets Escolares</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">
                        {{ form.photo_url 
                          ? 'Foto cargada: El carnet institucional está listo para emitir e imprimir.' 
                          : 'Pendiente fotografía: Sube una foto en la Sección 2 para habilitar el carnet con fotografía.' }}
                      </p>
                    </div>
                  </div>
                  <NuxtLink 
                    to="/idcards?type=administrativo"
                    target="_blank"
                    class="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex-shrink-0 flex items-center gap-1"
                  >
                    <span>Ver Carnets</span>
                    <span>↗</span>
                  </NuxtLink>
                </div>
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50/95 dark:bg-[#110926]/95 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3 shadow-xs">
              <button 
                type="button" 
                @click="closeModal" 
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </button>
              <button 
                type="submit" 
                data-testid="submit-staff-btn"
                :disabled="saving"
                class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 border border-brand-primary/30 cursor-pointer"
              >
                <span v-if="saving">Guardando...</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isEditing ? 'Actualizar Colaborador' : 'Guardar Colaborador' }}</span>
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
        <div 
          data-testid="staff-delete-modal"
          class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md p-6 text-center animate-scale-up"
        >
          <div class="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-brand-gold flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
            ⚠️
          </div>
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">¿Inhabilitar Miembro del Personal?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Se dará de baja laboral/operativa a <strong>{{ personToDelete?.first_name }} {{ personToDelete?.last_name }}</strong> ({{ personToDelete?.staff_id }}).
          </p>
          <div class="mt-3 p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 text-left">
            ℹ️ <strong>Conservación de Datos:</strong> Todos los registros laborales, asistencias y antecedentes se conservarán intactos en la base de datos. Podrás reactivar este miembro en cualquier momento.
          </div>
          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              @click="isDeleteModalOpen = false" 
              type="button"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/90 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button 
              @click="confirmDeletePerson" 
              data-testid="confirm-delete-staff-btn"
              class="px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Confirmar Inhabilitación
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

const api = useApi()
const toast = useToast()

const staff = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const isDeleteModalOpen = ref(false)
const personToDelete = ref(null)

const form = ref({
  staff_id: '',
  first_name: '',
  last_name: '',
  id_card: '',
  staff_type: 'administrativo',
  position: '',
  department: '',
  date_of_birth: '',
  hire_date: '',
  gender: '',
  phone: '',
  email: '',
  address_line1: '',
  photo_url: '',
  blood_type: 'O+',
  emergency_contact: '',
  emergency_phone: '',
  status: 'activo',
  create_user_account: false,
  user_account_password: '',
  unlink_user_account: false,
  user_id: null
})

const showPassword = ref(false)

const generatePassword = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$'
  let pass = 'Staff26!'
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.user_account_password = pass
  showPassword.value = true
  toast.info('Contraseña segura generada: ' + pass)
}

const unlinkUserAccount = () => {
  form.value.user_id = null
  form.value.create_user_account = false
  form.value.unlink_user_account = true
  toast.warning('Se desvinculará la cuenta de usuario al guardar los cambios.')
}

const formErrors = ref({})

const validateForm = () => {
  const errors = {}
  if (!form.value.staff_id?.trim()) errors.staff_id = 'El código único es obligatorio'
  if (!form.value.id_card?.trim()) errors.id_card = 'La cédula es obligatoria'
  if (!form.value.first_name?.trim()) errors.first_name = 'El nombre es obligatorio'
  if (!form.value.last_name?.trim()) errors.last_name = 'El apellido es obligatorio'
  if (!form.value.position?.trim()) errors.position = 'El cargo es obligatorio'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const fetchStaff = async () => {
  loading.value = true
  try {
    const res = await api.get('staff')
    if (res && Array.isArray(res.data)) {
      staff.value = res.data
    } else if (Array.isArray(res)) {
      staff.value = res
    } else {
      staff.value = []
    }
  } catch (err) {
    console.warn('Silent fallback fetching staff:', err)
    staff.value = []
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = staff.value.length
  const administrativos = staff.value.filter(s => s.staff_type === 'administrativo' || s.category === 'administrative').length
  const profesionales = staff.value.filter(s => s.staff_type === 'profesional' || s.category === 'professional').length
  const obreros = staff.value.filter(s => s.staff_type === 'obrero' || s.category === 'worker' || s.category === 'services').length
  const activos = staff.value.filter(s => s.status === 'activo' || s.status === 'active').length
  return { total, administrativos, profesionales, obreros, activos }
})

const departmentsList = computed(() => {
  const depts = new Set(staff.value.map(s => s.department).filter(Boolean))
  return Array.from(depts).sort()
})

const filteredStaff = computed(() => {
  return staff.value.filter(s => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
      (s.id_card && s.id_card.toLowerCase().includes(q)) ||
      (s.national_id && s.national_id.toLowerCase().includes(q)) ||
      (s.staff_id && s.staff_id.toLowerCase().includes(q)) ||
      (s.employee_id && s.employee_id.toLowerCase().includes(q)) ||
      (s.position && s.position.toLowerCase().includes(q)) ||
      (s.position_title && s.position_title.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))

    const typeNormalized = s.staff_type || (s.category === 'administrative' ? 'administrativo' : s.category)
    const statusNormalized = (s.status === 'active' || s.status === 'activo') ? 'activo' : ((s.status === 'inactive' || s.status === 'inactivo') ? 'inactivo' : s.status)

    const matchesType = !selectedType.value || typeNormalized === selectedType.value
    const matchesStatus = !selectedStatus.value || statusNormalized === selectedStatus.value
    const matchesDept = !selectedDepartment.value || s.department === selectedDepartment.value

    return matchesSearch && matchesType && matchesStatus && matchesDept
  })
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'activo': 
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    case 'licencia': 
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
    case 'inactivo': 
      return 'bg-amber-500/15 text-amber-600 dark:text-brand-gold border-amber-500/30'
    default: 
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

const openModal = () => {
  isEditing.value = false
  currentId.value = null
  formErrors.value = {}
  showPassword.value = false
  form.value = {
    staff_id: `STF-00${staff.value.length + 1}`,
    first_name: '',
    last_name: '',
    id_card: '',
    staff_type: 'administrativo',
    position: '',
    department: 'Control de Estudios y Evaluación',
    date_of_birth: '',
    hire_date: new Date().toISOString().split('T')[0],
    gender: '',
    phone: '',
    email: '',
    address_line1: '',
    photo_url: '',
    blood_type: 'O+',
    emergency_contact: '',
    emergency_phone: '',
    status: 'activo',
    create_user_account: false,
    user_account_password: '',
    unlink_user_account: false,
    user_id: null
  }
  isModalOpen.value = true
}

const editPerson = (person) => {
  isEditing.value = true
  currentId.value = person.id
  formErrors.value = {}
  showPassword.value = false
  form.value = {
    ...person,
    position: person.position || person.position_title || '',
    staff_type: person.staff_type || (person.category === 'administrative' ? 'administrativo' : person.category) || 'administrativo',
    staff_id: person.staff_id || person.employee_id || '',
    id_card: person.id_card || person.national_id || '',
    department: person.department || '',
    date_of_birth: person.date_of_birth || '',
    hire_date: person.hire_date || '',
    gender: person.gender || '',
    phone: person.phone || person.phone_mobile || '',
    email: person.email || person.email_personal || '',
    emergency_contact: person.emergency_contact || person.emergency_contact_name || '',
    emergency_phone: person.emergency_phone || person.emergency_contact_phone || '',
    create_user_account: Boolean(person.has_user_account || person.user_id),
    user_account_password: '',
    unlink_user_account: false,
    user_id: person.user_id || null
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formErrors.value = {}
}

const savePerson = async () => {
  if (!validateForm()) {
    toast.warning('Por favor completa todos los campos requeridos (*)')
    return
  }

  if (form.value.create_user_account && !form.value.user_id && !form.value.email?.trim()) {
    toast.warning('Para habilitar la cuenta de acceso web, el correo electrónico es obligatorio')
    return
  }

  saving.value = true
  try {
    const payload = {
      ...form.value,
      position_title: form.value.position,
      category: form.value.staff_type,
      employee_id: form.value.staff_id,
      national_id: form.value.id_card,
      phone_mobile: form.value.phone,
      email_personal: form.value.email,
      emergency_contact_name: form.value.emergency_contact,
      emergency_contact_phone: form.value.emergency_phone,
      hire_date: form.value.hire_date || null,
      date_of_birth: form.value.date_of_birth || null,
      gender: form.value.gender || null,
      create_user_account: Boolean(form.value.create_user_account),
      user_account_password: form.value.user_account_password || null,
      unlink_user_account: Boolean(form.value.unlink_user_account)
    }

    if (isEditing.value) {
      await api.patch(`staff/${currentId.value}`, payload)
      toast.success(`Datos de ${form.value.first_name} ${form.value.last_name} actualizados exitosamente`)
    } else {
      await api.post('staff', payload)
      toast.success(`Miembro de personal ${form.value.first_name} ${form.value.last_name} registrado en la U.E Santa Luisa`)
    }
    isModalOpen.value = false
    await fetchStaff()
  } catch (err) {
    console.error('Error al guardar personal:', err)
    toast.error('Error al guardar: ' + (err.message || 'Verifica los datos'))
  } finally {
    saving.value = false
  }
}

const openDeleteModal = (person) => {
  personToDelete.value = person
  isDeleteModalOpen.value = true
}

const confirmDeletePerson = async () => {
  if (!personToDelete.value) return
  try {
    // Soft delete: update status to 'inactivo' preserving all DB records
    await api.patch(`staff/${personToDelete.value.id}`, { status: 'inactivo' })
    toast.warning(`Colaborador ${personToDelete.value.first_name} ${personToDelete.value.last_name} inhabilitado. El historial laboral se conserva.`)
    isDeleteModalOpen.value = false
    personToDelete.value = null
    await fetchStaff()
  } catch (err) {
    console.error('Error al inhabilitar personal:', err)
    toast.error('Error al inhabilitar: ' + err.message)
  }
}

const reactivatePerson = async (person) => {
  try {
    await api.patch(`staff/${person.id}`, { status: 'activo' })
    toast.success(`Colaborador ${person.first_name} ${person.last_name} reactivado exitosamente`)
    await fetchStaff()
  } catch (err) {
    console.error('Error al reactivar personal:', err)
    toast.error('Error al reactivar: ' + err.message)
  }
}

onMounted(fetchStaff)
</script>
