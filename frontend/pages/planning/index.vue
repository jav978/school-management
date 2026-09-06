<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            📑
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Planificaciones Curriculares
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Planificación docente por lapsos, temas indispensables y planes de evaluación
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
          <span>Nueva Planificación</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Planes -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Planes</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-purple/40 text-brand-primary dark:text-brand-secondary flex items-center justify-center font-bold text-xl flex-shrink-0">
          📑
        </div>
      </div>

      <!-- Aprobadas -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aprobadas</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ stats.aprobadas }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-500 flex items-center justify-center font-bold text-xl flex-shrink-0">
          ✓
        </div>
      </div>

      <!-- Finalizadas -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Finalizadas</p>
          <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 mt-1 leading-tight tracking-tight">{{ stats.finalizadas }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/25 border border-brand-purple/20 dark:border-brand-purple/40 text-brand-purple dark:text-brand-gold flex items-center justify-center font-bold text-xl flex-shrink-0">
          ⏱️
        </div>
      </div>

      <!-- En Borrador -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Borrador</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ stats.borrador }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-brand-gold/30 text-amber-600 dark:text-brand-gold flex items-center justify-center font-bold text-xl flex-shrink-0">
          ✏️
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
            placeholder="Buscar por materia, tema indispensable, proyecto o grado..."
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
          <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filter Selects -->
        <div class="flex flex-wrap items-center gap-2.5">
          <select 
            v-model="selectedPeriod" 
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-medium"
          >
            <option value="">Todos los Lapsos</option>
            <option value="1er lapso">1er Lapso</option>
            <option value="2do lapso">2do Lapso</option>
            <option value="3er lapso">3er Lapso</option>
          </select>

          <select 
            v-model="selectedStatus" 
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-medium"
          >
            <option value="">Todos los Estados</option>
            <option value="aprobada">Aprobada</option>
            <option value="finalizada">Finalizada</option>
            <option value="borrador">En Borrador</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Planning Cards List -->
    <div v-if="loading" class="text-center py-16 glass-card rounded-2xl">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-primary dark:border-brand-gold border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-3 font-medium">Cargando planificaciones curriculares U.E Santa Luisa...</p>
    </div>

    <div v-else-if="filteredPlannings.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-3xl mb-3">
        📚
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No hay planificaciones registradas</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Crea la primera planificación docente para el lapso en curso con el botón superior.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="plan in filteredPlannings" 
        :key="plan.id"
        class="glass-card glass-card-hover rounded-2xl p-6 transition-all"
      >
        <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary border border-brand-primary/20 dark:border-brand-purple/40">
                {{ plan.period }} • {{ plan.academic_year }}
              </span>
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                {{ plan.grade }} {{ plan.section ? `Secc. ${plan.section}` : '' }}
              </span>
              <span 
                :class="getStatusBadgeClass(plan.status)"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border"
              >
                {{ plan.status }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {{ plan.indispensable_theme || 'Planificación Académica' }}
            </h3>
            <p v-if="plan.project_theme" class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              <strong class="text-brand-purple dark:text-brand-gold">Proyecto Pedagógico:</strong> {{ plan.project_theme }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="toggleDetails(plan.id)"
              class="px-3 py-1.5 text-xs font-bold text-brand-purple dark:text-brand-secondary hover:bg-brand-purple/10 rounded-xl transition-all cursor-pointer"
            >
              {{ expandedId === plan.id ? 'Ocultar Cronograma ▲' : 'Ver Plan Semanal ▼' }}
            </button>
            <button 
              @click="editPlan(plan)"
              class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              Editar
            </button>
            <button 
              @click="openDeleteModal(plan)"
              class="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>

        <!-- Expanded Details: Weekly Schedule & Evaluation Plan -->
        <div v-if="expandedId === plan.id" class="mt-4 pt-4 space-y-4 animate-fade-in">
          <!-- Weekly Planning -->
          <div v-if="getArray(plan.weekly_planning).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">Cronograma Semanal de Clases:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="(w, idx) in getArray(plan.weekly_planning)" 
                :key="idx"
                class="p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10"
              >
                <div class="flex items-center justify-between text-xs font-bold text-brand-purple dark:text-brand-gold mb-1">
                  <span>Semana {{ w.week || idx + 1 }}</span>
                </div>
                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">{{ w.topic }}</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ w.activities }}</p>
              </div>
            </div>
          </div>

          <!-- Evaluation Plan -->
          <div v-if="getArray(plan.evaluation_plan).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">Plan de Evaluación (Ponderación 100%):</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                <thead class="bg-slate-50 dark:bg-[#110926] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold text-[10px] uppercase">
                  <tr>
                    <th class="p-2.5">Estrategia / Evaluación</th>
                    <th class="p-2.5">Instrumento</th>
                    <th class="p-2.5 text-center">Semana</th>
                    <th class="p-2.5 text-right">Ponderación</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                  <tr v-for="(ev, idx) in getArray(plan.evaluation_plan)" :key="idx" class="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    <td class="p-2.5 font-bold text-slate-850 dark:text-slate-100">{{ ev.evaluation }}</td>
                    <td class="p-2.5 text-slate-600 dark:text-slate-300">{{ ev.instrument || 'Rúbrica de Evaluación' }}</td>
                    <td class="p-2.5 text-center text-slate-600 dark:text-slate-300">{{ ev.week ? `Sem. ${ev.week}` : '-' }}</td>
                    <td class="p-2.5 text-right font-black text-brand-purple dark:text-brand-gold">{{ ev.percentage }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                📑
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Planificación Docente' : 'Nueva Planificación Curricular' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Plan Pedagógico y Cronograma Escolar
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
          <form @submit.prevent="savePlan" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Período, Nivel y Estado -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Período, Nivel y Estado</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Academic Year -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Año Escolar *
                    </label>
                    <input 
                      v-model="form.academic_year" 
                      type="text"
                      placeholder="2025-2026"
                      :class="[
                        formErrors.academic_year ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono transition-all'
                      ]"
                    />
                    <p v-if="formErrors.academic_year" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.academic_year }}
                    </p>
                  </div>

                  <!-- Period / Lapso -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Período / Lapso *
                    </label>
                    <select 
                      v-model="form.period" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="1er lapso">1er Lapso</option>
                      <option value="2do lapso">2do Lapso</option>
                      <option value="3er lapso">3er Lapso</option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Estado del Plan
                    </label>
                    <select 
                      v-model="form.status"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="borrador">En Borrador</option>
                      <option value="aprobada">Aprobada</option>
                      <option value="finalizada">Finalizada</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Grade -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grado / Año Académico *
                    </label>
                    <input 
                      v-model="form.grade" 
                      type="text"
                      placeholder="Ej: 1er Año / 4° Primaria"
                      :class="[
                        formErrors.grade ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                      ]"
                    />
                    <p v-if="formErrors.grade" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.grade }}
                    </p>
                  </div>

                  <!-- Section -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sección
                    </label>
                    <select 
                      v-model="form.section" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="A">Sección A</option>
                      <option value="B">Sección B</option>
                      <option value="General">Todas las Secciones</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section 2: Contenido Curricular y Proyecto -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Contenido Curricular y Proyecto</span>
                </div>

                <!-- Indispensable Theme -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tema Indispensable / Propósito Pedagógico *
                  </label>
                  <input 
                    v-model="form.indispensable_theme" 
                    type="text"
                    placeholder="Ej: Ciencia, tecnología, soberanía alimentaria e innovación"
                    :class="[
                      formErrors.indispensable_theme ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                      'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all'
                    ]"
                  />
                  <p v-if="formErrors.indispensable_theme" class="text-rose-500 text-[11px] font-bold mt-1">
                    {{ formErrors.indispensable_theme }}
                  </p>
                </div>

                <!-- Project Theme -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tema Generador / Proyecto de Aprendizaje
                  </label>
                  <input 
                    v-model="form.project_theme" 
                    type="text"
                    placeholder="Ej: Aplicaciones prácticas del método científico en el huerto escolar"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                  />
                </div>

                <!-- Group Schedule -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Horario de Atención del Grupo
                  </label>
                  <input 
                    v-model="form.group_schedule" 
                    type="text"
                    placeholder="Lunes y Miércoles 07:00 - 08:30"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                  />
                </div>
              </div>

              <!-- Section 3: Vinculación Docente y Asignatura -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Vinculación Docente y Asignatura</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ID Docente Asignado
                    </label>
                    <input 
                      v-model.number="form.teacher_id" 
                      type="number"
                      placeholder="1"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ID Materia Curricular
                    </label>
                    <input 
                      v-model.number="form.subject_id" 
                      type="number"
                      placeholder="1"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all font-mono"
                    />
                  </div>
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
                  <span>{{ isEditing ? 'Actualizar Plan' : 'Guardar Plan' }}</span>
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
          <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/40 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
            ⚠️
          </div>
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">¿Eliminar Planificación?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Se eliminará la planificación <strong class="text-slate-900 dark:text-white">{{ planToDelete?.indispensable_theme }}</strong> ({{ planToDelete?.grade }} - {{ planToDelete?.period }}).
          </p>
          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              @click="isDeleteModalOpen = false" 
              class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              @click="confirmDeletePlan" 
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

const plannings = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedPeriod = ref('')
const selectedStatus = ref('')
const expandedId = ref(null)

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const isDeleteModalOpen = ref(false)
const planToDelete = ref(null)

const form = ref({
  teacher_id: 1,
  subject_id: 1,
  academic_year: '2025-2026',
  period: '1er lapso',
  grade: '1er Año',
  section: 'A',
  group_schedule: 'Lunes y Miércoles 07:00 - 08:30',
  indispensable_theme: '',
  project_theme: '',
  status: 'borrador'
})

const formErrors = ref({})

const validateForm = () => {
  const errors = {}
  if (!form.value.academic_year?.trim()) errors.academic_year = 'El año escolar es obligatorio'
  if (!form.value.grade?.trim()) errors.grade = 'El grado es obligatorio'
  if (!form.value.indispensable_theme?.trim()) errors.indispensable_theme = 'El tema indispensable es obligatorio'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const fetchPlannings = async () => {
  loading.value = true
  try {
    const res = await api.get('academic-plannings')
    plannings.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching plannings:', err)
    toast.error('No se pudo cargar la lista de planificaciones')
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = plannings.value.length
  const aprobadas = plannings.value.filter(p => p.status === 'aprobada').length
  const finalizadas = plannings.value.filter(p => p.status === 'finalizada').length
  const borrador = plannings.value.filter(p => p.status === 'borrador').length
  return { total, aprobadas, finalizadas, borrador }
})

const filteredPlannings = computed(() => {
  return plannings.value.filter(p => {
    const term = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !term ||
      (p.indispensable_theme?.toLowerCase().includes(term) ||
       p.project_theme?.toLowerCase().includes(term) ||
       p.grade?.toLowerCase().includes(term))
    
    const matchesPeriod = !selectedPeriod.value || p.period === selectedPeriod.value
    const matchesStatus = !selectedStatus.value || p.status === selectedStatus.value

    return matchesSearch && matchesPeriod && matchesStatus
  })
})

const getArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try {
    return JSON.parse(val)
  } catch {
    return []
  }
}

const toggleDetails = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'aprobada': 
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    case 'finalizada': 
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
    case 'borrador': 
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
    teacher_id: 1,
    subject_id: 1,
    academic_year: '2025-2026',
    period: '1er lapso',
    grade: '1er Año',
    section: 'A',
    group_schedule: '',
    indispensable_theme: '',
    project_theme: '',
    status: 'borrador'
  }
  isModalOpen.value = true
}

const editPlan = (plan) => {
  isEditing.value = true
  currentId.value = plan.id
  formErrors.value = {}
  form.value = { ...plan }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formErrors.value = {}
}

const savePlan = async () => {
  if (!validateForm()) {
    toast.warning('Por favor completa los campos requeridos (*)')
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`academic-plannings/${currentId.value}`, form.value)
      toast.success('Planificación académica actualizada exitosamente')
    } else {
      await api.post('academic-plannings', form.value)
      toast.success('Planificación registrada exitosamente en la U.E Santa Luisa')
    }
    isModalOpen.value = false
    await fetchPlannings()
  } catch (err) {
    console.error('Error al guardar:', err)
    toast.error('Error al guardar la planificación')
  } finally {
    saving.value = false
  }
}

const openDeleteModal = (plan) => {
  planToDelete.value = plan
  isDeleteModalOpen.value = true
}

const confirmDeletePlan = async () => {
  if (!planToDelete.value) return
  try {
    await api.remove(`academic-plannings/${planToDelete.value.id}`)
    toast.warning('Planificación curricular eliminada')
    isDeleteModalOpen.value = false
    planToDelete.value = null
    await fetchPlannings()
  } catch (err) {
    console.error('Error al eliminar:', err)
    toast.error('Error al eliminar la planificación')
  }
}

onMounted(fetchPlannings)
</script>
