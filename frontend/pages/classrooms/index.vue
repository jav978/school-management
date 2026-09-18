<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            🏫
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Aulas y Espacios Escolares
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Gestión de infraestructura, laboratorios, canchas y auditorios
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
          <span>Nueva Aula / Espacio</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Espacios -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Espacios</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <!-- Disponibles -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Disponibles</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ stats.disponibles }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Capacidad Total -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Capacidad Total</p>
          <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 mt-1 leading-tight tracking-tight">{{ stats.totalCapacity }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- En Mantenimiento -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Mantenimiento</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ stats.mantenimiento }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar Card -->
    <div class="glass-card rounded-2xl p-4 shadow-sm">
      <div class="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <!-- Search Input -->
        <div class="flex-1 relative min-w-[240px]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por código, nombre, edificio o equipamiento..."
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
          <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filter Selects -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Type Filter -->
          <select 
            v-model="selectedType" 
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-medium"
          >
            <option value="">Todos los Tipos</option>
            <option value="aula_regular">Aulas Regulares</option>
            <option value="laboratorio">Laboratorios</option>
            <option value="biblioteca">Biblioteca</option>
            <option value="auditorio">Auditorio</option>
            <option value="gimnasio">Gimnasio / Canchas</option>
          </select>

          <!-- Status Filter -->
          <select 
            v-model="selectedStatus" 
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-medium"
          >
            <option value="">Todos los Estados</option>
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="mantenimiento">En Mantenimiento</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Classrooms Grid -->
    <div v-if="loading" class="text-center py-16 glass-card rounded-2xl">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-primary dark:border-brand-gold border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-3 font-medium">Cargando espacios e instalaciones de la U.E Santa Luisa...</p>
    </div>

    <div v-else-if="filteredClassrooms.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-3xl mb-3">
        🏫
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron espacios</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Prueba a cambiar los filtros o agrega una nueva aula con el botón superior.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div 
        v-for="room in filteredClassrooms" 
        :key="room.id"
        class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all"
        :class="room.status === 'mantenimiento' ? 'border-amber-500/30' : ''"
      >
        <div>
          <!-- Top Row: Room Code & Status Badge -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 rounded-xl font-black text-xs font-mono">
              {{ room.room_number }}
            </span>
            <span 
              :class="getStatusBadgeClass(room.status)"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border"
            >
              {{ room.status }}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {{ room.name }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <span>📍 {{ room.building || 'Edificio Principal' }}</span>
            <span v-if="room.floor !== null && room.floor !== undefined">• Piso {{ room.floor }}</span>
          </p>

          <!-- Capacity & Type Chips -->
          <div class="flex items-center gap-2 mt-4 text-xs font-semibold">
            <span class="px-2.5 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-700 dark:text-slate-300">
              👥 {{ room.capacity }} pupitres/puestos
            </span>
            <span class="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40 rounded-lg capitalize">
              {{ formatType(room.type) }}
            </span>
          </div>

          <!-- Equipment Info -->
          <div v-if="room.equipment" class="mt-4 p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10">
            <p class="text-[10px] uppercase tracking-wider font-bold text-brand-purple dark:text-brand-gold mb-1">Equipamiento e Instalaciones:</p>
            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{{ room.equipment }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-white/10">
          <span class="text-[10px] text-slate-400 font-medium">U.E Santa Luisa</span>
          <div class="flex items-center gap-1">
            <button 
              @click="editRoom(room)"
              class="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-amber-500/30"
              title="Editar espacio escolar"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              @click="openDeleteModal(room)"
              class="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
              title="Eliminar espacio escolar"
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
                🏫
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Aula o Espacio Escolar' : 'Nueva Aula o Espacio Escolar' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Gestión de Infraestructura y Salones
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
          <form @submit.prevent="saveRoom" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Identificación y Tipo de Espacio -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Identificación y Tipo de Espacio</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Room Number -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número / Código de Aula *
                    </label>
                    <input 
                      v-model="form.room_number" 
                      type="text" 
                      placeholder="Ej: A-101, LAB-01"
                      :class="[
                        formErrors.room_number ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all'
                      ]"
                    />
                    <p v-if="formErrors.room_number" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.room_number }}
                    </p>
                  </div>

                  <!-- Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Descriptivo *
                    </label>
                    <input 
                      v-model="form.name" 
                      type="text" 
                      placeholder="Ej: Salón 1er Año A / Laboratorio Química"
                      :class="[
                        formErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.name" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.name }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Type -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Espacio Pedagógico *
                    </label>
                    <select 
                      v-model="form.type"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="aula_regular">Aula Regular</option>
                      <option value="laboratorio">Laboratorio Especializado</option>
                      <option value="biblioteca">Biblioteca</option>
                      <option value="auditorio">Auditorio</option>
                      <option value="gimnasio">Gimnasio / Canchas</option>
                    </select>
                  </div>

                  <!-- Status Segmented -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Estado Operativo
                    </label>
                    <select 
                      v-model="form.status"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="disponible">Disponible para Clases</option>
                      <option value="ocupada">Ocupada / Asignada</option>
                      <option value="mantenimiento">En Mantenimiento</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section 2: Ubicación y Capacidad Física -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Ubicación y Capacidad Física</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Capacity -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Capacidad Máxima *
                    </label>
                    <input 
                      v-model.number="form.capacity" 
                      type="number" 
                      min="1"
                      max="200"
                      placeholder="35"
                      :class="[
                        formErrors.capacity ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.capacity" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.capacity }}
                    </p>
                  </div>

                  <!-- Building -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Edificio / Módulo
                    </label>
                    <input 
                      v-model="form.building" 
                      type="text"
                      placeholder="Edificio San Vicente"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Floor -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Piso / Nivel
                    </label>
                    <input 
                      v-model.number="form.floor" 
                      type="number" 
                      placeholder="1"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 3: Equipamiento e Instalaciones Especiales -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Equipamiento e Instalaciones Especiales</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Equipamiento Disponible en el Espacio
                  </label>
                  <textarea 
                    v-model="form.equipment" 
                    rows="3"
                    placeholder="Pizarra acrílica, proyector multimedia HDMI, 35 pupitres individuales, aire acondicionado, red WiFi..."
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/90 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
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
                  <span>{{ isEditing ? 'Actualizar Aula' : 'Guardar Aula' }}</span>
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
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">¿Eliminar Espacio Escolar?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Se retirará el espacio <strong class="text-slate-900 dark:text-white">{{ roomToDelete?.name }}</strong> ({{ roomToDelete?.room_number }}).
          </p>
          <div class="mt-3 p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 text-left">
            ℹ️ <strong>Nota Institucional:</strong> Los registros de horarios y planificaciones asociadas mantendrán la referencia histórica.
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
              @click="confirmDeleteRoom" 
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
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

const api = useApi()
const toast = useToast()

const classrooms = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const isDeleteModalOpen = ref(false)
const roomToDelete = ref(null)

const form = ref({
  room_number: '',
  name: '',
  capacity: 35,
  type: 'aula_regular',
  status: 'disponible',
  building: 'Edificio Central San Vicente',
  floor: 1,
  equipment: ''
})

const formErrors = ref({})

const validateForm = () => {
  const errors = {}
  if (!form.value.room_number?.trim()) errors.room_number = 'El código de aula es obligatorio'
  if (!form.value.name?.trim()) errors.name = 'El nombre del espacio es obligatorio'
  if (!form.value.capacity || form.value.capacity < 1) errors.capacity = 'Indica una capacidad válida'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const fetchClassrooms = async () => {
  loading.value = true
  try {
    const res = await api.get('classrooms')
    classrooms.value = res.data || res || []
  } catch (err) {
    console.warn('Silent fallback loading classrooms:', err)
    classrooms.value = []
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = classrooms.value.length
  const disponibles = classrooms.value.filter(c => c.status === 'disponible').length
  const mantenimiento = classrooms.value.filter(c => c.status === 'mantenimiento').length
  const totalCapacity = classrooms.value.reduce((acc, c) => acc + (parseInt(c.capacity, 10) || 0), 0)
  return { total, disponibles, mantenimiento, totalCapacity }
})

const filteredClassrooms = computed(() => {
  return classrooms.value.filter(c => {
    const term = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !term || 
      (c.room_number?.toLowerCase().includes(term) ||
       c.name?.toLowerCase().includes(term) ||
       c.building?.toLowerCase().includes(term) ||
       c.equipment?.toLowerCase().includes(term))
    
    const matchesType = !selectedType.value || c.type === selectedType.value
    const matchesStatus = !selectedStatus.value || c.status === selectedStatus.value

    return matchesSearch && matchesType && matchesStatus
  })
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'disponible': 
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    case 'ocupada': 
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
    case 'mantenimiento': 
      return 'bg-amber-500/15 text-amber-600 dark:text-brand-gold border-amber-500/30'
    default: 
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

const formatType = (type) => {
  switch (type) {
    case 'aula_regular': return 'Aula Regular'
    case 'laboratorio': return 'Laboratorio'
    case 'biblioteca': return 'Biblioteca'
    case 'auditorio': return 'Auditorio'
    case 'gimnasio': return 'Gimnasio'
    default: return type || 'Espacio'
  }
}

const openModal = () => {
  isEditing.value = false
  currentId.value = null
  formErrors.value = {}
  form.value = {
    room_number: `A-${classrooms.value.length + 101}`,
    name: '',
    capacity: 35,
    type: 'aula_regular',
    status: 'disponible',
    building: 'Edificio Central San Vicente',
    floor: 1,
    equipment: ''
  }
  isModalOpen.value = true
}

const editRoom = (room) => {
  isEditing.value = true
  currentId.value = room.id
  formErrors.value = {}
  form.value = { ...room }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formErrors.value = {}
}

const saveRoom = async () => {
  if (!validateForm()) {
    toast.warning('Por favor completa los campos requeridos (*)')
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`classrooms/${currentId.value}`, form.value)
      toast.success(`Espacio ${form.value.name} actualizado exitosamente`)
    } else {
      await api.post('classrooms', form.value)
      toast.success(`Aula ${form.value.name} registrada en la U.E Santa Luisa`)
    }
    isModalOpen.value = false
    await fetchClassrooms()
  } catch (err) {
    console.error('Error al guardar aula:', err)
    toast.error('Error al guardar: ' + (err.message || 'Verifica los campos'))
  } finally {
    saving.value = false
  }
}

const openDeleteModal = (room) => {
  roomToDelete.value = room
  isDeleteModalOpen.value = true
}

const confirmDeleteRoom = async () => {
  if (!roomToDelete.value) return
  try {
    await api.remove(`classrooms/${roomToDelete.value.id}`)
    toast.warning(`Aula ${roomToDelete.value.name} eliminada`)
    isDeleteModalOpen.value = false
    roomToDelete.value = null
    await fetchClassrooms()
  } catch (err) {
    console.error('Error al eliminar aula:', err)
    toast.error('Error al eliminar: ' + err.message)
  }
}

onMounted(fetchClassrooms)
</script>
