<template>
  <div class="space-y-6 animate-fade-in pb-12">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
              Respaldos y Migración de Datos
            </h1>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Copias de seguridad transaccionales, snapshots de prevención y asistente para ingesta histórica de 5 a 20 años
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2.5 w-full sm:w-auto">
        <button 
          v-if="activeTab === 'backups'"
          @click="handleCreateBackup" 
          :disabled="isCreatingBackup"
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <svg v-if="!isCreatingBackup" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ isCreatingBackup ? 'Generando Copia...' : 'Crear Respaldo Ahora' }}</span>
        </button>

        <button 
          v-if="activeTab === 'backups'"
          @click="showConfigCard = !showConfigCard"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-2xl transition-all cursor-pointer shadow-xs"
        >
          <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="hidden md:inline">Programación Diaria</span>
        </button>
      </div>
    </div>

    <!-- 4 High-Density KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Ultimo Respaldo -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Último Respaldo</p>
          <p class="text-lg sm:text-xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">
            {{ stats.last_backup_date ? formatDate(stats.last_backup_date) : 'Sin registros' }}
          </p>
          <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {{ backups.length > 0 ? `${backups[0].size_mb} MB compresos` : 'Iniciar primer respaldo' }}
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Proxima Ejecucion / Cron -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Programación Diaria</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white leading-tight tracking-tight">
              {{ schedulerConfig.hour || '18:00' }}
            </p>
            <span :class="schedulerConfig.enabled ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {{ schedulerConfig.enabled ? 'Activo' : 'Pausado' }}
            </span>
          </div>
          <span class="text-[10px] font-medium text-slate-400 mt-0.5">
            Retención: {{ schedulerConfig.retention_days || 30 }} días
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <!-- Almacenamiento Total -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Espacio en Disco</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-2xl sm:text-3xl font-black font-display text-indigo-600 dark:text-indigo-400 leading-tight tracking-tight">
              {{ stats.total_size_mb || 0 }} <span class="text-sm font-semibold text-slate-500">MB</span>
            </p>
          </div>
          <span class="text-[10px] font-medium text-slate-400 mt-0.5">
            {{ backups.length }} archivo(s) comprimido(s)
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
      </div>

      <!-- Puntos de Restauracion / Snapshots -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Snapshots de Emergencia</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-2xl sm:text-3xl font-black font-display text-purple-600 dark:text-purple-400 leading-tight tracking-tight">
              {{ stats.snapshots_count || 0 }}
            </p>
            <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800/40">
              Protegidos
            </span>
          </div>
          <span class="text-[10px] font-medium text-slate-400 mt-0.5">
            Generados pre-migración/restauración
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/30 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-px">
      <button 
        @click="activeTab = 'backups'"
        type="button"
        :class="activeTab === 'backups' 
          ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold'"
        class="flex items-center gap-2 px-4 py-3 border-b-2 text-sm transition-all cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <span>Copias de Seguridad (Backups)</span>
        <span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
          {{ backups.length }}
        </span>
      </button>

      <button 
        @click="activeTab = 'migration'"
        type="button"
        :class="activeTab === 'migration' 
          ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold'"
        class="flex items-center gap-2 px-4 py-3 border-b-2 text-sm transition-all cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span>Asistente de Migración Histórica (5 - 20 Años)</span>
        <span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold">
          Multi-Formato
        </span>
      </button>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 1: COPÍAS DE SEGURIDAD (BACKUPS) -->
    <!-- ========================================================================= -->
    <div v-if="activeTab === 'backups'" class="space-y-6">
      <!-- Config Drawer Card -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-2 opacity-0">
        <div v-if="showConfigCard" class="glass-card rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-900/30">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Programación de Respaldo Nocturno Automático</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">El sistema generará una copia íntegra del esquema 'school' diariamente a la hora configurada</p>
              </div>
            </div>
            <button @click="showConfigCard = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <!-- Estado Activo -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Ejecución Automática</label>
              <div class="flex items-center gap-3 pt-1">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="schedulerForm.enabled" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  <span class="ml-3 text-xs font-semibold text-slate-700 dark:text-slate-300">{{ schedulerForm.enabled ? 'Habilitado' : 'Desactivado' }}</span>
                </label>
              </div>
            </div>

            <!-- Hora de Ejecucion -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Hora Diaria de Ejecución</label>
              <select v-model="schedulerForm.hour" class="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-200">
                <option value="18:00">18:00 (06:00 PM - Cierre escolar)</option>
                <option value="20:00">20:00 (08:00 PM)</option>
                <option value="22:00">22:00 (10:00 PM)</option>
                <option value="00:00">00:00 (12:00 AM - Medianoche)</option>
                <option value="02:00">02:00 (02:00 AM)</option>
                <option value="04:00">04:00 (04:00 AM)</option>
              </select>
            </div>

            <!-- Retencion -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Días de Retención en Disco</label>
              <select v-model="schedulerForm.retention_days" class="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-200">
                <option :value="7">7 días</option>
                <option :value="15">15 días</option>
                <option :value="30">30 días (Recomendado)</option>
                <option :value="60">60 días</option>
                <option :value="90">90 días</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end mt-5 pt-4 border-t border-slate-100 dark:border-white/10">
            <button 
              @click="handleSaveConfig"
              :disabled="isSavingConfig"
              type="button"
              class="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>{{ isSavingConfig ? 'Guardando...' : 'Guardar Programación' }}</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Search & Filters Toolbar -->
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="relative w-full sm:w-72">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre o fecha..." 
            class="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#120d2b] border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select 
            v-model="typeFilter" 
            class="w-full sm:w-auto px-3.5 py-2.5 bg-white dark:bg-[#120d2b] border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
          >
            <option value="">Todos los tipos</option>
            <option value="automatico">Automáticos</option>
            <option value="manual">Manuales</option>
            <option value="snapshot">Snapshots de Emergencia</option>
          </select>
        </div>
      </div>

      <!-- Backups Table -->
      <div class="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-50/70 dark:bg-white/[0.03] text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/60 dark:border-white/5">
              <tr>
                <th class="py-3.5 px-4 sm:px-6">Archivo y Notas</th>
                <th class="py-3.5 px-4">Tipo</th>
                <th class="py-3.5 px-4">Registros</th>
                <th class="py-3.5 px-4">Tamaño</th>
                <th class="py-3.5 px-4">Fecha y Hora</th>
                <th class="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-if="loadingBackups" class="text-center py-8">
                <td colspan="6" class="py-12 text-slate-400">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <svg class="w-6 h-6 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span class="text-xs font-semibold">Cargando catálogo de respaldos...</span>
                  </div>
                </td>
              </tr>

              <tr v-else-if="filteredBackups.length === 0" class="text-center py-8">
                <td colspan="6" class="py-12 text-slate-400">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">No se encontraron respaldos</span>
                    <span class="text-[11px] text-slate-400">Haga clic en 'Crear Respaldo Ahora' para generar la primera copia de seguridad.</span>
                  </div>
                </td>
              </tr>

              <tr 
                v-for="b in filteredBackups" 
                :key="b.filename"
                class="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <!-- Archivo -->
                <td class="py-3.5 px-4 sm:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 dark:text-white font-mono text-xs">{{ b.filename }}</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{{ b.notes || 'Sin descripción adicional' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Tipo -->
                <td class="py-3.5 px-4">
                  <span 
                    :class="getTypeBadgeClass(b.type)"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  >
                    {{ getTypeLabel(b.type) }}
                  </span>
                </td>

                <!-- Registros -->
                <td class="py-3.5 px-4">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ Number(b.total_records || 0).toLocaleString() }}</span>
                  <span class="text-[10px] text-slate-400 ml-1">filas</span>
                </td>

                <!-- Tamaño -->
                <td class="py-3.5 px-4">
                  <span class="font-medium text-slate-700 dark:text-slate-300">{{ b.size_mb }} MB</span>
                </td>

                <!-- Fecha -->
                <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                  {{ formatDate(b.timestamp) }}
                </td>

                <!-- Acciones -->
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Descargar -->
                    <button 
                      @click="downloadBackup(b.filename)"
                      title="Descargar archivo comprimido"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <!-- Restaurar -->
                    <button 
                      @click="openRestoreModal(b)"
                      title="Restaurar base de datos a este punto"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>

                    <!-- Eliminar -->
                    <button 
                      @click="handleDeleteBackup(b.filename)"
                      title="Eliminar este respaldo"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
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
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: ASISTENTE DE MIGRACIÓN HISTÓRICA (5 - 20 AÑOS) -->
    <!-- ========================================================================= -->
    <div v-else class="space-y-6">
      <!-- 4-Step Visual Stepper Header -->
      <div class="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-white/10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            v-for="(st, idx) in steps" 
            :key="idx"
            :class="[
              currentStep === idx + 1 ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 
              currentStep > idx + 1 ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20' : 
              'border-slate-200 dark:border-white/10 opacity-60'
            ]"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all"
          >
            <div 
              :class="[
                currentStep === idx + 1 ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' : 
                currentStep > idx + 1 ? 'bg-emerald-600 text-white' : 
                'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              ]"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
            >
              <svg v-if="currentStep > idx + 1" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div>
              <p class="text-xs font-black text-slate-800 dark:text-white leading-tight">{{ st.title }}</p>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{{ st.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 1: ENTIDAD Y ARCHIVO -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Entity Selector Cards (Sequence respecting foreign keys) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-800 dark:text-white">
              1. Seleccione la Entidad a Migrar (Secuencia de Integridad)
            </h3>
            <span class="text-[11px] font-medium text-slate-400">
              Siga el orden sugerido para evitar conflictos de claves foráneas
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div 
              v-for="ent in entitiesList" 
              :key="ent.key"
              @click="selectedEntity = ent.key; handleEntityChange()"
              :class="selectedEntity === ent.key 
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/40' 
                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-[#120d2b]'"
              class="rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div>
                <span class="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Fase {{ ent.order }}</span>
                <p class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1 leading-snug">{{ ent.label }}</p>
              </div>
              <div class="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                <span>{{ ent.tableName }}</span>
                <span v-if="selectedEntity === ent.key" class="text-indigo-600 dark:text-indigo-400 font-bold">✓ Seleccionada</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Drag & Drop Zone -->
        <div class="space-y-3">
          <h3 class="text-sm font-black text-slate-800 dark:text-white">
            2. Cargar Archivo de Datos Históricos
          </h3>

          <div 
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="isDragging ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]'"
            class="border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer relative"
            @click="triggerFileInput"
          >
            <input 
              ref="fileInputRef" 
              type="file" 
              accept=".xlsx,.xls,.csv,.tsv,.txt,.sql" 
              class="hidden" 
              @change="handleFileSelect"
            />

            <div class="flex flex-col items-center justify-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <div>
                <p class="text-sm font-bold text-slate-800 dark:text-white">
                  Arrastre y suelte su archivo aquí, o <span class="text-indigo-600 dark:text-indigo-400 underline">explore en su equipo</span>
                </p>
                <p class="text-xs text-slate-400 mt-1">
                  Formatos soportados: Excel (.xlsx, .xls), Delimitado (.csv, .tsv, .txt) o Script SQL (.sql con INSERT INTO)
                </p>
              </div>

              <!-- Supported Formats Badges -->
              <div class="flex items-center gap-2 mt-2">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/30">.XLSX / .XLS</span>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/30">.CSV / .TSV</span>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/30">.SQL INSERT</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Parsed File Preview Banner -->
        <div v-if="parsedData" class="glass-card rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/40 animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">
              OK
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-bold text-slate-900 dark:text-white text-sm">{{ parsedData.filename }}</p>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                  {{ parsedData.total_rows }} filas detectadas
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Columnas encontradas: {{ parsedData.headers.join(', ') }}
              </p>
            </div>
          </div>

          <button 
            @click="goToStep(2)" 
            type="button"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Continuar al Mapeo</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>

      <!-- STEP 2: MAPEO INTELIGENTE Y VALORES POR DEFECTO -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white">
              Emparejamiento de Columnas y Reglas por Defecto
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empareje las columnas de su archivo antiguo con los campos de Santa Luisa. Asigne valores por defecto a campos que no existían.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="recomputeAutoMap"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#120d2b] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Auto-Emparejar</span>
            </button>
          </div>
        </div>

        <!-- Mapping Table -->
        <div class="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <thead class="bg-slate-50/70 dark:bg-white/[0.03] text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/60 dark:border-white/5">
                <tr>
                  <th class="py-3 px-4 sm:px-6 w-1/3">Campo Destino (Santa Luisa)</th>
                  <th class="py-3 px-4 w-1/3">Columna en su Archivo</th>
                  <th class="py-3 px-4 w-1/3">Valor por Defecto / Fallback</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                <tr v-for="field in currentSchemaFields" :key="field.field" class="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <!-- Campo Destino -->
                  <td class="py-3 px-4 sm:px-6">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 dark:text-white">{{ field.label }}</span>
                      <span v-if="field.required" class="px-1.5 py-0.2 text-[9px] font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded">REQUERIDO</span>
                    </div>
                    <p class="text-[10px] text-slate-400 font-mono mt-0.5">columna db: {{ field.field }} ({{ field.type }})</p>
                  </td>

                  <!-- Selector de Origen -->
                  <td class="py-3 px-4">
                    <select 
                      v-model="columnMapping[field.field]"
                      class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    >
                      <option :value="null">-- No mapear / Usar valor por defecto --</option>
                      <option v-for="h in parsedData?.headers || []" :key="h" :value="h">
                        {{ h }}
                      </option>
                    </select>
                  </td>

                  <!-- Valor por Defecto -->
                  <td class="py-3 px-4">
                    <input 
                      v-model="defaultValues[field.field]"
                      type="text" 
                      :placeholder="field.default !== undefined ? `Por defecto: ${field.default}` : 'Opcional si falta en el archivo'"
                      class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button 
            @click="goToStep(1)" 
            type="button"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all cursor-pointer"
          >
            ← Volver a Carga
          </button>

          <button 
            @click="runDryRunValidation" 
            :disabled="isValidating"
            type="button"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <svg v-if="isValidating" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isValidating ? 'Simulando Validación...' : 'Ejecutar Validación en Seco (Dry-Run)' }}</span>
            <svg v-if="!isValidating" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>

      <!-- STEP 3: VALIDACIÓN EN SECO (DRY-RUN) -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white">
              Diagnóstico de Simulación (Dry-Run)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Revise las inconsistencias detectadas antes de realizar la inserción real en la base de datos.
            </p>
          </div>
        </div>

        <!-- 3 Validation KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Validos -->
          <div class="glass-card rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Filas Válidas</p>
              <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1">{{ validationResult?.valid_count || 0 }}</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Listas para inserción limpia</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>

          <!-- Advertencias Corregidas -->
          <div class="glass-card rounded-2xl p-5 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Con Advertencias</p>
              <p class="text-3xl font-black font-display text-amber-600 dark:text-amber-400 mt-1">{{ validationResult?.warning_count || 0 }}</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Auto-corregidas por el motor</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
          </div>

          <!-- Errores Bloqueantes -->
          <div class="glass-card rounded-2xl p-5 border border-rose-200 dark:border-rose-800/40 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Rechazos / Errores</p>
              <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1">{{ validationResult?.error_count || 0 }}</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Se exportarán a CSV descargable</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </div>
          </div>
        </div>

        <!-- Breakdown of Error Samples -->
        <div v-if="validationResult?.errors?.length > 0" class="glass-card rounded-2xl p-5 border border-rose-200 dark:border-rose-900/40 space-y-3">
          <h4 class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Muestra de Filas con Inconsistencias Bloqueantes</span>
          </h4>
          <div class="space-y-2 max-h-56 overflow-y-auto pr-2">
            <div v-for="err in validationResult.errors" :key="err.row" class="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs">
              <div class="flex items-center justify-between font-bold text-rose-700 dark:text-rose-300">
                <span>Fila #{{ err.row }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ JSON.stringify(err.raw).slice(0, 80) }}...</span>
              </div>
              <ul class="list-disc list-inside mt-1 text-rose-600 dark:text-rose-400 text-[11px]">
                <li v-for="(msg, mIdx) in err.errors" :key="mIdx">{{ msg }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Live Sample Preview -->
        <div v-if="validationResult?.valid_samples?.length > 0" class="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/10 space-y-3">
          <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <span>Vista Previa de Registros Mapeados para Inserción</span>
          </h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-100 dark:bg-white/5 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th v-for="key in Object.keys(validationResult.valid_samples[0])" :key="key" class="py-2 px-3">{{ key }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                <tr v-for="(sample, sIdx) in validationResult.valid_samples" :key="sIdx">
                  <td v-for="(val, k) in sample" :key="k" class="py-2 px-3 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {{ val !== null ? val : 'NULL' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button 
            @click="goToStep(2)" 
            type="button"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all cursor-pointer"
          >
            ← Ajustar Mapeo
          </button>

          <button 
            @click="goToStep(4)" 
            :disabled="validationResult?.valid_count === 0"
            type="button"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <span>Proceder a la Ejecución ({{ validationResult?.valid_count || 0 }} registros)</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>

      <!-- STEP 4: EJECUCIÓN Y RESULTADO -->
      <div v-if="currentStep === 4" class="space-y-6">
        <!-- Pre-execution confirmation card -->
        <div v-if="!migrationFinished" class="glass-card rounded-2xl p-6 border border-indigo-200 dark:border-indigo-900/40 space-y-5 max-w-2xl mx-auto">
          <div class="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-white/10">
            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              🛡️
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Garantía de Seguridad y Snapshot Automático</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Se creará un Snapshot Pre-Migración inmediatamente antes de escribir en la base de datos.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/5 space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Entidad de destino:</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ currentEntityLabel }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Filas válidas a insertar:</span>
              <span class="font-bold text-emerald-600">{{ validationResult?.valid_count || 0 }} registros</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Filas con error que se rechazarán:</span>
              <span class="font-bold text-rose-500">{{ validationResult?.error_count || 0 }} registros</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ingrese su Contraseña de Administrador para Autorizar
            </label>
            <input 
              v-model="adminPasswordForMigration" 
              type="password" 
              placeholder="Contraseña de administrador..." 
              class="w-full px-4 py-2.5 bg-white dark:bg-[#120d2b] border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div class="flex items-center justify-between pt-2">
            <button 
              @click="goToStep(3)" 
              type="button"
              class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all cursor-pointer"
            >
              ← Volver
            </button>

            <button 
              @click="handleExecuteMigration" 
              :disabled="isExecuting || !adminPasswordForMigration"
              type="button"
              class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <svg v-if="isExecuting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ isExecuting ? 'Ejecutando Inserción Transaccional...' : 'Iniciar Migración Ahora' }}</span>
            </button>
          </div>
        </div>

        <!-- Migration Completed Success Card -->
        <div v-else class="glass-card rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800/40 text-center max-w-xl mx-auto space-y-5 animate-scale-up">
          <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>

          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white font-display">¡Migración Histórica Finalizada!</h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Los registros históricos fueron incorporados exitosamente en la base de datos de Santa Luisa.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-xs text-left">
            <div>
              <p class="text-slate-400 text-[10px] uppercase font-bold">Insertados con Éxito</p>
              <p class="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{{ migrationResult?.inserted_count || 0 }}</p>
            </div>
            <div>
              <p class="text-slate-400 text-[10px] uppercase font-bold">Rechazados por Error</p>
              <p class="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{{ migrationResult?.rejected_count || 0 }}</p>
            </div>
          </div>

          <div class="space-y-2.5 pt-2">
            <!-- Descargar rechazados si hay -->
            <button 
              v-if="migrationResult?.rejected_csv"
              @click="downloadRejectedCsv"
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Descargar CSV con Filas Rechazadas y Motivo de Error</span>
            </button>

            <!-- Reset workflow -->
            <button 
              @click="resetMigrationWorkflow"
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Migrar Otra Entidad / Archivo</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PASSWORD-PROTECTED RESTORE MODAL -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div 
        v-if="isRestoreModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="closeRestoreModal"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 space-y-5 animate-scale-up">
          <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/60 dark:border-rose-800/40 shadow-inner">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div class="text-center">
            <h3 class="text-lg font-black text-slate-900 dark:text-white">¿Restaurar Base de Datos?</h3>
            <p class="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
              ¡Acción Crítica! Se creará un Snapshot de Emergencia antes de proceder.
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs space-y-1.5 font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400">Archivo:</span>
              <span class="text-slate-800 dark:text-white font-bold truncate max-w-[200px]">{{ targetBackupForRestore?.filename }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Fecha:</span>
              <span class="text-slate-700 dark:text-slate-300">{{ formatDate(targetBackupForRestore?.timestamp) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Registros:</span>
              <span class="text-slate-700 dark:text-slate-300">{{ targetBackupForRestore?.total_records }} filas</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
              Contraseña de Administrador Requerida
            </label>
            <input 
              v-model="adminPasswordForRestore"
              type="password"
              placeholder="Ingrese su contraseña actual..."
              class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="closeRestoreModal"
              class="px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button 
              type="button" 
              @click="handleConfirmRestore"
              :disabled="isRestoring || !adminPasswordForRestore"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <svg v-if="isRestoring" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ isRestoring ? 'Restaurando Base de Datos...' : 'Confirmar y Restaurar' }}</span>
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
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'


const authStore = useAuthStore()
const api = useApi()
const toast = useToast()

// Tab state
const activeTab = ref('backups')

// Backups state
const backups = ref([])
const stats = ref({
  total_backups: 0,
  total_size_mb: 0,
  snapshots_count: 0,
  last_backup_date: null
})
const schedulerConfig = ref({
  enabled: true,
  hour: '18:00',
  retention_days: 30
})
const loadingBackups = ref(true)
const isCreatingBackup = ref(false)
const showConfigCard = ref(false)
const isSavingConfig = ref(false)
const schedulerForm = ref({
  enabled: true,
  hour: '18:00',
  retention_days: 30
})

// Search & filter
const searchQuery = ref('')
const typeFilter = ref('')

// Restore Modal
const isRestoreModalOpen = ref(false)
const targetBackupForRestore = ref(null)
const adminPasswordForRestore = ref('')
const isRestoring = ref(false)

// Stepper workflow state for Migration
const currentStep = ref(1)
const steps = [
  { title: '1. Entidad y Archivo', desc: 'Selección y carga multi-formato' },
  { title: '2. Mapeo y Valores', desc: 'Auto-matching y valores por defecto' },
  { title: '3. Simulación Dry-Run', desc: 'Diagnóstico previo de inconsistencias' },
  { title: '4. Ejecución y Reporte', desc: 'Snapshot previo e inserción transaccional' }
]

const entitiesList = [
  { key: 'academic_years', order: 1, label: 'Años Escolares', tableName: 'academic_years' },
  { key: 'subjects', order: 2, label: 'Catálogo de Materias', tableName: 'subjects' },
  { key: 'teachers', order: 3, label: 'Personal Docente', tableName: 'teachers' },
  { key: 'students', order: 4, label: 'Estudiantes e Historial', tableName: 'students' },
  { key: 'report_cards', order: 5, label: 'Historial de Calificaciones', tableName: 'report_cards' }
]

const selectedEntity = ref('students')
const availableSchemas = ref({})
const fileInputRef = ref(null)
const isDragging = ref(false)
const parsedData = ref(null)

const columnMapping = ref({})
const defaultValues = ref({})
const isValidating = ref(false)
const validationResult = ref(null)

const adminPasswordForMigration = ref('')
const isExecuting = ref(false)
const migrationFinished = ref(false)
const migrationResult = ref(null)

// Computed
const filteredBackups = computed(() => {
  return backups.value.filter(b => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !q || b.filename.toLowerCase().includes(q) || (b.notes && b.notes.toLowerCase().includes(q))
    const matchesType = !typeFilter.value || (b.type && b.type.includes(typeFilter.value))
    return matchesSearch && matchesType
  })
})

const currentSchemaFields = computed(() => {
  const schema = availableSchemas.value[selectedEntity.value]
  return schema ? schema.fields : []
})

const currentEntityLabel = computed(() => {
  const ent = entitiesList.find(e => e.key === selectedEntity.value)
  return ent ? ent.label : selectedEntity.value
})

// Methods: Backups
const fetchBackups = async () => {
  loadingBackups.value = true
  try {
    const res = await api.get('backups')
    backups.value = res.backups || []
    stats.value = res.stats || stats.value
    if (res.config) {
      schedulerConfig.value = res.config
      schedulerForm.value = { ...res.config }
    }
  } catch (err) {
    console.error('Error fetching backups:', err)
    toast.error('No se pudo cargar la lista de respaldos.')
  } finally {
    loadingBackups.value = false
  }
}

const handleCreateBackup = async () => {
  isCreatingBackup.value = true
  try {
    const res = await api.post('backups', {
      notes: 'Copia de seguridad manual disparada desde el panel'
    })
    toast.success('Respaldo generado con éxito.')
    await fetchBackups()
  } catch (err) {
    console.error('Create backup error:', err)
    toast.error(err.message || 'Error al crear la copia de seguridad.')
  } finally {
    isCreatingBackup.value = false
  }
}

const handleSaveConfig = async () => {
  isSavingConfig.value = true
  try {
    const res = await api.post('backups/config', schedulerForm.value)
    schedulerConfig.value = res.config || schedulerForm.value
    showConfigCard.value = false
    toast.success('Programación de respaldos actualizada.')
  } catch (err) {
    toast.error('Error al guardar la configuración.')
  } finally {
    isSavingConfig.value = false
  }
}

const downloadBackup = (filename) => {
  const token = authStore.token || sessionStorage.getItem('token')
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/backups/${filename}/download?token=${encodeURIComponent(token)}`
  window.open(url, '_blank')
}

const openRestoreModal = (backup) => {
  targetBackupForRestore.value = backup
  adminPasswordForRestore.value = ''
  isRestoreModalOpen.value = true
}

const closeRestoreModal = () => {
  isRestoreModalOpen.value = false
  targetBackupForRestore.value = null
  adminPasswordForRestore.value = ''
}

const handleConfirmRestore = async () => {
  if (!adminPasswordForRestore.value) {
    toast.error('Debe ingresar su contraseña de administrador.')
    return
  }
  isRestoring.value = true
  try {
    const res = await api.post('backups/restore', {
      filename: targetBackupForRestore.value.filename,
      password: adminPasswordForRestore.value
    })
    toast.success(res.message || 'Base de datos restaurada correctamente.')
    closeRestoreModal()
    await fetchBackups()
  } catch (err) {
    toast.error(err.data?.error || err.message || 'Error durante la restauración.')
  } finally {
    isRestoring.value = false
  }
}

const handleDeleteBackup = async (filename) => {
  if (!confirm(`¿Está seguro de eliminar el respaldo ${filename}? Esta acción no se puede deshacer.`)) {
    return
  }
  try {
    await api.remove(`backups/${filename}`)
    toast.success('Respaldo eliminado del almacenamiento.')
    await fetchBackups()
  } catch (err) {
    toast.error('Error al eliminar el respaldo.')
  }
}

// Methods: Migration Workflow
const fetchEntities = async () => {
  try {
    const res = await api.get('data-migration/entities')
    if (res.entities) {
      const map = {}
      res.entities.forEach(e => { map[e.key] = e })
      availableSchemas.value = map
    }
  } catch (err) {
    console.error('Error fetching migration schemas:', err)
  }
}

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) processUploadFile(file)
}

const handleFileDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processUploadFile(file)
}

const processUploadFile = (file) => {
  const reader = new FileReader()
  const ext = file.name.split('.').pop().toLowerCase()
  const isBinary = ext === 'xlsx' || ext === 'xls'

  reader.onload = async (evt) => {
    try {
      let content = ''
      let isBase64 = false
      if (isBinary) {
        const base64Str = btoa(
          new Uint8Array(evt.target.result).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        content = base64Str
        isBase64 = true
      } else {
        content = evt.target.result
      }

      const res = await api.post('data-migration/parse', {
        filename: file.name,
        content,
        base64: isBase64
      })

      parsedData.value = res
      if (res.detected_entity && entitiesList.some(e => e.key === res.detected_entity)) {
        selectedEntity.value = res.detected_entity
      }
      columnMapping.value = res.auto_mapping || {}
      toast.success(`Archivo procesado: ${res.total_rows} registros detectados.`)
    } catch (err) {
      console.error('Parse file error:', err)
      toast.error(err.data?.error || err.message || 'Error al procesar el archivo.')
    }
  }

  if (isBinary) {
    reader.readAsArrayBuffer(file)
  } else {
    reader.readAsText(file)
  }
}

const handleEntityChange = async () => {
  if (parsedData.value?.headers) {
    await recomputeAutoMap()
  }
}

const recomputeAutoMap = async () => {
  if (!parsedData.value?.headers) return
  try {
    const res = await api.post('data-migration/auto-map', {
      entity: selectedEntity.value,
      headers: parsedData.value.headers
    })
    columnMapping.value = res.mapping || {}
    toast.info('Auto-mapeo recalculado para ' + selectedEntity.value)
  } catch (err) {
    console.error('Recompute auto-map error:', err)
  }
}

const goToStep = (step) => {
  currentStep.value = step
}

const runDryRunValidation = async () => {
  isValidating.value = true
  try {
    const res = await api.post('data-migration/validate', {
      entity: selectedEntity.value,
      rows: parsedData.value.rows || parsedData.value.sample_rows || [],
      mapping: columnMapping.value,
      defaultValues: defaultValues.value
    })
    validationResult.value = res
    goToStep(3)
    toast.success('Validación en seco finalizada.')
  } catch (err) {
    toast.error(err.data?.error || err.message || 'Error durante la validación en seco.')
  } finally {
    isValidating.value = false
  }
}

const handleExecuteMigration = async () => {
  if (!adminPasswordForMigration.value) {
    toast.error('Debe ingresar su contraseña de administrador.')
    return
  }

  isExecuting.value = true
  try {
    const res = await api.post('data-migration/execute', {
      entity: selectedEntity.value,
      rows: parsedData.value.rows || parsedData.value.sample_rows || [],
      mapping: columnMapping.value,
      defaultValues: defaultValues.value,
      password: adminPasswordForMigration.value
    })

    migrationResult.value = res
    migrationFinished.value = true
    toast.success(`Migración completada: ${res.inserted_count} registros insertados.`)
    await fetchBackups()
  } catch (err) {
    toast.error(err.data?.error || err.message || 'Error al ejecutar la migración.')
  } finally {
    isExecuting.value = false
  }
}

const downloadRejectedCsv = () => {
  if (!migrationResult.value?.rejected_csv) return
  const blob = new Blob([migrationResult.value.rejected_csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rechazados_${selectedEntity.value}_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const resetMigrationWorkflow = () => {
  currentStep.value = 1
  parsedData.value = null
  columnMapping.value = {}
  defaultValues.value = {}
  validationResult.value = null
  adminPasswordForMigration.value = ''
  migrationFinished.value = false
  migrationResult.value = null
}

// Helpers
const formatDate = (isoStr) => {
  if (!isoStr) return 'N/A'
  try {
    const d = new Date(isoStr)
    return d.toLocaleString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (_) {
    return isoStr
  }
}

const getTypeBadgeClass = (type) => {
  if (type === 'automatico') {
    return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40'
  }
  if (type === 'manual') {
    return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40'
  }
  if (type && type.includes('snapshot')) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
  }
  return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
}

const getTypeLabel = (type) => {
  if (type === 'automatico') return 'Automático'
  if (type === 'manual') return 'Manual'
  if (type === 'snapshot_pre_migracion') return 'Pre-Migración'
  if (type === 'snapshot_pre_restauracion') return 'Pre-Restauración'
  return type || 'Estándar'
}

onMounted(() => {
  fetchBackups()
  fetchEntities()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
}
:root.dark .glass-card {
  background: rgba(18, 13, 43, 0.85);
  backdrop-filter: blur(12px);
}
.glass-card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.glass-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}
:root.dark .glass-card-hover:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}
</style>
