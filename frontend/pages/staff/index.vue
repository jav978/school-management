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
            Personal y Colaboradores (Staff)
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
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Miembro de Personal</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Personal -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Personal</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-purple/40 text-brand-primary dark:text-brand-secondary flex items-center justify-center font-bold text-xl flex-shrink-0">
          👥
        </div>
      </div>

      <!-- Administrativos -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Administrativos</p>
          <p class="text-3xl font-black font-display text-sky-600 dark:text-brand-secondary mt-1 leading-tight tracking-tight">{{ stats.administrativos }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/40 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
          💼
        </div>
      </div>

      <!-- Profesionales -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profesionales</p>
          <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 mt-1 leading-tight tracking-tight">{{ stats.profesionales }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/25 border border-brand-purple/20 dark:border-brand-purple/40 text-brand-purple dark:text-brand-gold flex items-center justify-center font-bold text-xl flex-shrink-0">
          🎓
        </div>
      </div>

      <!-- Obreros / Servicios -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Obreros / Servicios</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ stats.obreros }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-brand-gold/30 text-amber-600 dark:text-brand-gold flex items-center justify-center font-bold text-xl flex-shrink-0">
          🛠️
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
            v-model="selectedType" 
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer"
          >
            <option value="">Todos los Roles</option>
            <option value="administrativo">Administrativo</option>
            <option value="profesional">Profesional</option>
            <option value="obrero">Obrero / Servicios</option>
          </select>

          <select 
            v-model="selectedStatus" 
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
                  :src="person.photo_url" 
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

            <span 
              :class="getStatusBadgeClass(person.status)"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize flex-shrink-0 border"
            >
              {{ person.status === 'inactivo' ? 'Inactivo' : (person.status === 'licencia' ? 'En Licencia' : 'Activo') }}
            </span>
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
          <div class="text-[10px] text-slate-400 font-medium">
            U.E Santa Luisa
          </div>
          <div class="flex items-center gap-1.5">
            <button 
              v-if="person.status === 'inactivo'"
              @click="reactivatePerson(person)"
              class="px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-all flex items-center gap-1"
              title="Reactivar Colaborador"
            >
              <span>↺</span>
              <span>Reactivar</span>
            </button>
            <button 
              @click="editPerson(person)"
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
          class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
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
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="savePerson" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Identificación y Clasificación Laboral -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Identificación y Clasificación Laboral</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Staff ID -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código Único *
                    </label>
                    <input 
                      v-model="form.staff_id" 
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
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="administrativo">Administrativo</option>
                      <option value="profesional">Profesional</option>
                      <option value="obrero">Obrero / Servicios</option>
                    </select>
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
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Datos del Empleado y Cargo</span>
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

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Position / Role -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo / Puesto Desempeñado *
                    </label>
                    <input 
                      v-model="form.position" 
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

                  <!-- Department -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Departamento / Área Operativa
                    </label>
                    <input 
                      v-model="form.department" 
                      type="text" 
                      placeholder="Ej. Administración, Mantenimiento, Orientación"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 3: Contacto, Salud y Emergencia -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Contacto, Salud y Emergencia</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Email -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input 
                      v-model="form.email" 
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
                      type="text" 
                      placeholder="+58 414 123 4567"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

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
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                ✕ Cancelar
              </button>
              <button 
                type="submit" 
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
        <div class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md p-6 text-center animate-scale-up">
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
              class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              @click="confirmDeletePerson" 
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
  phone: '',
  email: '',
  photo_url: '',
  blood_type: 'O+',
  emergency_contact: '',
  emergency_phone: '',
  status: 'activo'
})

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
    staff.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching staff:', err)
    toast.error('No se pudo cargar la lista de personal')
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = staff.value.length
  const administrativos = staff.value.filter(s => s.staff_type === 'administrativo').length
  const profesionales = staff.value.filter(s => s.staff_type === 'profesional').length
  const obreros = staff.value.filter(s => s.staff_type === 'obrero').length
  return { total, administrativos, profesionales, obreros }
})

const filteredStaff = computed(() => {
  return staff.value.filter(s => {
    const term = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !term ||
      (s.first_name?.toLowerCase().includes(term) ||
       s.last_name?.toLowerCase().includes(term) ||
       s.staff_id?.toLowerCase().includes(term) ||
       s.id_card?.toLowerCase().includes(term) ||
       s.position?.toLowerCase().includes(term) ||
       s.department?.toLowerCase().includes(term))
    
    const matchesType = !selectedType.value || s.staff_type === selectedType.value
    const matchesStatus = !selectedStatus.value || s.status === selectedStatus.value

    return matchesSearch && matchesType && matchesStatus
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
  form.value = {
    staff_id: `STF-00${staff.value.length + 1}`,
    first_name: '',
    last_name: '',
    id_card: '',
    staff_type: 'administrativo',
    position: '',
    department: '',
    phone: '',
    email: '',
    photo_url: '',
    blood_type: 'O+',
    emergency_contact: '',
    emergency_phone: '',
    status: 'activo'
  }
  isModalOpen.value = true
}

const editPerson = (person) => {
  isEditing.value = true
  currentId.value = person.id
  formErrors.value = {}
  form.value = { ...person }
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

  saving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`staff/${currentId.value}`, form.value)
      toast.success(`Datos de ${form.value.first_name} ${form.value.last_name} actualizados exitosamente`)
    } else {
      await api.post('staff', form.value)
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
