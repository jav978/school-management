<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
          Comunicación y Cartelera
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Difusión de avisos institucionales, directivas escolares y mensajería interna
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
          <span>Nuevo Comunicado</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Comunicados -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avisos Publicados</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ announcements.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>

      <!-- Urgentes -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Prioridad Urgente</p>
          <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1 leading-tight tracking-tight">{{ urgentCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <!-- Fijados en Cartelera -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fijados en Cartelera</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-amber-500 leading-tight tracking-tight">{{ pinnedCount }}</p>
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md">
              Destacados
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      </div>

      <!-- Lecturas Totales -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lecturas Totales</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ totalViews }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
          placeholder="Buscar por título o contenido..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Priority Filter -->
        <select
          v-model="filterPriority"
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todas las prioridades</option>
          <option value="urgent">Urgente</option>
          <option value="high">Alta</option>
          <option value="normal">Normal</option>
        </select>
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
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando comunicados...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredAnnouncements.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-750 dark:text-white">No hay comunicados disponibles</h3>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
        No se encontraron anuncios activos con los filtros aplicados.
      </p>
    </div>

    <!-- Announcements Feed Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="a in filteredAnnouncements"
        :key="a.id"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden"
      >
        <!-- Top accent banner if pinned -->
        <div v-if="a.is_pinned" class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>

        <div>
          <!-- Header: Priority & Pinned Star -->
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span 
                :class="getPriorityBadgeClass(a.priority)"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              >
                {{ getPriorityLabel(a.priority) }}
              </span>
              <span v-if="a.is_pinned" class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                ★ Destacado
              </span>
            </div>

            <span class="text-[11px] font-medium text-slate-400">
              {{ formatDate(a.created_at) }}
            </span>
          </div>

          <!-- Title & Body -->
          <div class="mt-3.5">
            <h3 class="text-base font-bold font-display text-slate-850 dark:text-white leading-snug">
              {{ a.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
              {{ a.body }}
            </p>
          </div>
        </div>

        <!-- Footer: Author & Actions -->
        <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold">
              {{ a.author_first_name ? a.author_first_name[0] : 'C' }}
            </div>
            <div class="text-[11px] leading-tight">
              <p class="font-bold text-slate-750 dark:text-slate-200">
                {{ a.author_first_name ? `${a.author_first_name} ${a.author_last_name}` : 'Dirección Académica' }}
              </p>
              <p class="text-[10px] text-slate-400">{{ a.author_department || 'Coordinación' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              @click="openEditModal(a, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Editar"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="promptDeleteAnnouncement(a, $event)"
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

    <!-- Standardized Modal: Publicar / Editar Comunicado -->
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                  {{ isEditing ? 'Editar Comunicado' : 'Publicar Nuevo Comunicado' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Difusión a la comunidad educativa y cartelera digital
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
          <form @submit.prevent="submitAnnouncement" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Title -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Título del Comunicado *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Ej. Convocatoria a Asamblea General"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <!-- Priority & Pinned -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nivel de Prioridad *
                </label>
                <select
                  v-model="form.priority"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div class="flex items-center pt-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.is_pinned"
                    type="checkbox"
                    class="w-4 h-4 rounded text-orange-500 focus:ring-orange-500/20"
                  />
                  <span class="text-xs font-semibold text-slate-750 dark:text-slate-200">
                    Fijar al inicio de la cartelera
                  </span>
                </label>
              </div>
            </div>

            <!-- Body -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Contenido del Comunicado *
              </label>
              <textarea
                v-model="form.body"
                required
                rows="5"
                placeholder="Escriba el texto completo del comunicado o aviso..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 leading-relaxed"
              ></textarea>
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
              @click="submitAnnouncement"
              :disabled="isSubmitting"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {{ isSubmitting ? 'Publicando...' : (isEditing ? 'Actualizar Comunicado' : 'Publicar Comunicado') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Eliminar Comunicado -->
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
              ¿Eliminar este comunicado?
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Se retirará de la cartelera digital el aviso <strong class="text-slate-700 dark:text-slate-200">{{ announcementToDelete?.title }}</strong>.
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
              @click="confirmDeleteAnnouncement"
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
const announcements = ref([])
const search = ref('')
const filterPriority = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const toastMessage = ref('')

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const announcementToDelete = ref(null)

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  id: null,
  title: '',
  body: '',
  priority: 'normal',
  is_pinned: false
})

// KPIs
const urgentCount = computed(() => announcements.value.filter(a => a.priority === 'urgent').length)
const pinnedCount = computed(() => announcements.value.filter(a => a.is_pinned).length)
const totalViews = computed(() => announcements.value.reduce((acc, a) => acc + (a.view_count || 1), 0))

// Filtered announcements
const filteredAnnouncements = computed(() => {
  let list = announcements.value

  if (filterPriority.value) {
    list = list.filter(a => a.priority === filterPriority.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q)
    )
  }

  return list
})

const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getPriorityLabel = (priority) => {
  if (priority === 'urgent') return 'Urgente'
  if (priority === 'high') return 'Prioridad Alta'
  return 'Informativo'
}

const getPriorityBadgeClass = (priority) => {
  if (priority === 'urgent') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
  if (priority === 'high') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
  return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
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
    title: '',
    body: '',
    priority: 'normal',
    is_pinned: false
  }
  isModalOpen.value = true
}

const openEditModal = (a, event) => {
  captureTriggerOrigin(event)
  isEditing.value = true
  form.value = {
    id: a.id,
    title: a.title,
    body: a.body,
    priority: a.priority,
    is_pinned: a.is_pinned
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Submit Announcement
const submitAnnouncement = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await nuxtApp.$api.service('announcements').patch(form.value.id, form.value)
      showToast('Comunicado actualizado')
    } else {
      await nuxtApp.$api.service('announcements').create(form.value)
      showToast('Comunicado publicado exitosamente')
    }
    await fetchAnnouncements()
    closeModal()
  } catch (error) {
    console.error('Error saving announcement:', error)
    showToast(error.message || 'Error al publicar el comunicado')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Announcement
const promptDeleteAnnouncement = (a, event) => {
  captureTriggerOrigin(event)
  announcementToDelete.value = a
  isDeleteModalOpen.value = true
}

const confirmDeleteAnnouncement = async () => {
  if (!announcementToDelete.value) return
  try {
    await nuxtApp.$api.service('announcements').remove(announcementToDelete.value.id)
    showToast('Comunicado retirado')
    await fetchAnnouncements()
  } catch (error) {
    console.error('Error removing announcement:', error)
    showToast(error.message || 'Error al retirar el comunicado')
  } finally {
    isDeleteModalOpen.value = false
    announcementToDelete.value = null
  }
}

// Fetch Announcements
const fetchAnnouncements = async () => {
  isLoading.value = true
  try {
    const res = await nuxtApp.$api.service('announcements').find({
      query: {
        $limit: 50
      }
    })
    announcements.value = res.data || res || []
  } catch (error) {
    console.error('Error fetching announcements:', error)
  } finally {
    isLoading.value = false
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

onMounted(async () => {
  await fetchAnnouncements()
})
</script>
