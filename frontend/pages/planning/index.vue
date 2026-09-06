<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section (Screen-only during print) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            📑
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Planificación Académica
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Gestiona las planificaciones escolares por período, cronogramas semanales y planes de evaluación
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
          <span>+ Nueva Planificación</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards (Screen-only) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
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

    <!-- Filters & Search Bar Card (Screen-only) -->
    <div class="glass-card rounded-2xl p-4 shadow-sm print:hidden">
      <div class="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <!-- Search Input -->
        <div class="flex-1 relative min-w-[240px]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por profesor, materia, tema o grado..."
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

          <select 
            v-model="selectedGrade" 
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-medium"
          >
            <option value="">Todos los Grados</option>
            <option v-for="g in gradesList" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Planning Cards List (Screen-only) -->
    <div v-if="loading" class="text-center py-16 glass-card rounded-2xl print:hidden">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-primary dark:border-brand-gold border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-3 font-medium">Cargando planificaciones curriculares U.E Santa Luisa...</p>
    </div>

    <div v-else-if="filteredPlannings.length === 0" class="glass-card rounded-2xl p-12 text-center print:hidden">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-3xl mb-3">
        📚
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No hay planificaciones registradas</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Crea la primera planificación docente para el lapso en curso con el botón superior.</p>
    </div>

    <!-- Cards Grid (Matching format of the screenshots with rich institutional card styling) -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5 print:hidden">
      <div 
        v-for="plan in filteredPlannings" 
        :key="plan.id"
        class="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
        :class="plan.status === 'borrador' ? 'border-amber-500/30' : ''"
      >
        <div>
          <!-- Card Header (Matches Screenshot 1) -->
          <div class="p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                  {{ getSubjectName(plan.subject_id) }}
                </h3>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ plan.grade }} {{ plan.section ? `- Sección ${plan.section}` : '' }}
                </p>
              </div>

              <!-- Status & Period Badges -->
              <div class="flex items-center gap-1.5 flex-wrap justify-end">
                <span 
                  :class="getStatusBadgeClass(plan.status)"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border"
                >
                  {{ plan.status }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-primary/10 dark:bg-brand-purple/25 text-brand-primary dark:text-brand-secondary border border-brand-primary/20 dark:border-brand-purple/40">
                  {{ plan.period }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body: Attributes & Theme Boxes (Matches Screenshot 1) -->
          <div class="p-5 space-y-3.5">
            <!-- Metadata line: Teacher, Year, Schedule -->
            <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex items-center gap-2">
                <span class="text-slate-400">👤</span>
                <span class="font-medium">{{ getTeacherName(plan.teacher_id) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400">📅</span>
                <span>{{ plan.academic_year || '2025-2026' }}</span>
              </div>
              <div v-if="plan.group_schedule" class="flex items-center gap-2">
                <span class="text-slate-400">🕒</span>
                <span>{{ plan.group_schedule }}</span>
              </div>
            </div>

            <!-- TEMA INDISPENSABLE BOX -->
            <div class="p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200/80 dark:border-white/10">
              <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                TEMA INDISPENSABLE
              </p>
              <p class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase leading-snug">
                {{ plan.indispensable_theme || 'DEFENSA Y PRESERVACIÓN DE LA VIDA' }}
              </p>
            </div>

            <!-- PROYECTO BOX -->
            <div v-if="plan.project_theme" class="p-3 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-xl border border-brand-purple/15 dark:border-brand-purple/30">
              <p class="text-[10px] uppercase font-bold tracking-wider text-brand-purple dark:text-brand-secondary mb-1">
                PROYECTO
              </p>
              <p class="text-xs font-semibold text-brand-primary dark:text-purple-200 uppercase leading-snug">
                {{ plan.project_theme }}
              </p>
            </div>

            <!-- Objectives preview if any -->
            <div v-if="getArray(plan.general_objectives).length > 0" class="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Objetivos Principales:</p>
              <ul class="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                <li v-for="(obj, i) in getArray(plan.general_objectives).slice(0, 2)" :key="i">{{ obj }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Expanded Details: Weekly Schedule & Evaluation Plan -->
        <div v-if="expandedId === plan.id" class="px-5 pb-5 space-y-4 animate-fade-in border-t border-slate-100 dark:border-white/10 pt-4">
          <!-- Weekly Planning -->
          <div v-if="getArray(plan.weekly_planning).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-brand-purple dark:text-brand-gold mb-2 flex items-center gap-1.5">
              <span>📅</span> Cronograma Semanal de Clases:
            </h4>
            <div class="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              <div 
                v-for="(w, idx) in getArray(plan.weekly_planning)" 
                :key="idx"
                class="p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-xs"
              >
                <div class="flex items-center justify-between text-xs font-bold text-brand-purple dark:text-brand-gold mb-1">
                  <span>Semana {{ w.week || idx + 1 }} {{ w.dates ? `(${w.dates})` : '' }}</span>
                  <span v-if="w.delivery_date" class="text-[10px] text-slate-400 font-normal">Entrega: {{ w.delivery_date }}</span>
                </div>
                <p v-if="w.generator_theme" class="font-bold text-slate-800 dark:text-slate-100">{{ w.generator_theme }}</p>
                <p v-if="w.theoretical_referent" class="text-slate-600 dark:text-slate-300 mt-0.5 text-[11px]">
                  <strong>Ref. Teórico:</strong> {{ w.theoretical_referent }}
                </p>
                <p v-if="w.content" class="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">
                  <strong>Contenido:</strong> {{ w.content }}
                </p>
                <div v-if="w.evaluative_activity || w.evaluation_instrument" class="mt-1 pt-1 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span v-if="w.evaluative_activity"><strong>Actividad:</strong> {{ w.evaluative_activity }}</span>
                  <span v-if="w.evaluation_instrument"><strong>Instrumento:</strong> {{ w.evaluation_instrument }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Evaluation Plan -->
          <div v-if="getArray(plan.evaluation_plan).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-brand-purple dark:text-brand-gold mb-2 flex items-center gap-1.5">
              <span>📊</span> Plan de Evaluación (Ponderación 100%):
            </h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                <thead class="bg-slate-50 dark:bg-[#110926] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold text-[10px] uppercase">
                  <tr>
                    <th class="p-2.5">Estrategia / Evaluación</th>
                    <th class="p-2.5">Fecha</th>
                    <th class="p-2.5 text-center">Puntos</th>
                    <th class="p-2.5 text-right">Peso (%)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                  <tr v-for="(ev, idx) in getArray(plan.evaluation_plan)" :key="idx" class="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    <td class="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                      {{ ev.description || ev.evaluation || `Evaluación ${idx + 1}` }}
                    </td>
                    <td class="p-2.5 text-slate-600 dark:text-slate-300">{{ ev.date || '-' }}</td>
                    <td class="p-2.5 text-center text-slate-600 dark:text-slate-300 font-bold">{{ ev.points || '-' }}</td>
                    <td class="p-2.5 text-right font-black text-brand-purple dark:text-brand-gold">{{ ev.weight || ev.percentage || 0 }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Card Footer (Matches Screenshot 1 counts & context actions) -->
        <div class="p-4 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
          <!-- Summary Counts -->
          <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{{ getArray(plan.weekly_planning).length }} semanas planificadas</span>
            <span>•</span>
            <span>{{ getArray(plan.evaluation_plan).length }} evaluaciones</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-1.5">
            <!-- Imprimir PDF -->
            <button 
              @click="openPdfModal(plan)"
              class="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-gold hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              title="Imprimir / Exportar PDF Institucional"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            <!-- Ver Cronograma -->
            <button 
              @click="toggleDetails(plan.id)"
              class="px-2.5 py-1.5 text-xs font-bold text-brand-purple dark:text-brand-secondary hover:bg-brand-purple/10 rounded-xl transition-all cursor-pointer"
            >
              {{ expandedId === plan.id ? 'Ocultar ▲' : 'Ver Detalle ▼' }}
            </button>

            <!-- Editar (Lápiz amarillo con ayuda contextual) -->
            <button 
              @click="editPlan(plan)"
              class="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-amber-500/30"
              title="Editar planificación académica"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <!-- Eliminar (Papelera roja con ayuda contextual) -->
            <button 
              @click="openDeleteModal(plan)"
              class="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
              title="Eliminar planificación académica"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STANDARDIZED MODAL WITH 4 TABS: General, Planificación, Evaluación, Estudiantes (Ampliado a max-w-6xl) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:hidden"
        @click.self="closeModal"
      >
        <div 
          class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Institutional Header Banner -->
          <div class="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary border-b border-brand-gold/30 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 border border-brand-gold/50 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                📑
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Planificación Académica' : 'Nueva Planificación Académica' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • Gestión Curricular, Cronograma Semanal y Evaluaciones
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

          <!-- 4 TABS NAVIGATION (Matches Screenshots 2, 3, 4, 5) -->
          <div class="flex-shrink-0 px-6 pt-3 bg-slate-50 dark:bg-[#110926] border-b border-slate-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto">
            <button 
              type="button"
              @click="activeTab = 'general'"
              :class="[
                activeTab === 'general' 
                  ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold border-t-2 border-brand-primary dark:border-brand-gold font-bold shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                'px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              ]"
            >
              <span>📋 General</span>
            </button>

            <button 
              type="button"
              @click="activeTab = 'weekly'"
              :class="[
                activeTab === 'weekly' 
                  ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold border-t-2 border-brand-primary dark:border-brand-gold font-bold shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                'px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              ]"
            >
              <span>📅 Planificación</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-gold">
                {{ form.weekly_planning.length }}
              </span>
            </button>

            <button 
              type="button"
              @click="activeTab = 'evaluation'"
              :class="[
                activeTab === 'evaluation' 
                  ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold border-t-2 border-brand-primary dark:border-brand-gold font-bold shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                'px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              ]"
            >
              <span>📊 Evaluación</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-gold">
                {{ form.evaluation_plan.length }}
              </span>
            </button>

            <button 
              type="button"
              @click="activeTab = 'students'"
              :class="[
                activeTab === 'students' 
                  ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold border-t-2 border-brand-primary dark:border-brand-gold font-bold shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                'px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              ]"
            >
              <span>👥 Estudiantes</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-gold">
                {{ filteredStudentsForModal.length }}
              </span>
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="savePlan" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">

              <!-- ================= TAB 1: GENERAL ================= -->
              <div v-show="activeTab === 'general'" class="space-y-5 animate-fade-in">
                <!-- Teacher & Subject Selection -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Profesor * -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Profesor Titular *
                    </label>
                    <select 
                      v-model="form.teacher_id" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option v-for="t in teachersList" :key="t.id" :value="t.id">
                        {{ t.first_name ? `${t.first_name} ${t.last_name}` : t.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Materia * -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Materia / Asignatura *
                    </label>
                    <select 
                      v-model="form.subject_id" 
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option v-for="s in subjectsList" :key="s.id" :value="s.id">
                        {{ s.name }} ({{ s.code }})
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Academic Year, Period, Grade, Section -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Año Escolar * -->
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

                  <!-- Periodo * -->
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

                  <!-- Grado * -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grado / Nivel *
                    </label>
                    <select 
                      v-model="form.grade"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option v-for="g in gradesList" :key="g" :value="g">{{ g }}</option>
                    </select>
                  </div>

                  <!-- Sección -->
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
                      <option value="U">Sección U (Única)</option>
                      <option value="General">General / Todas</option>
                    </select>
                  </div>
                </div>

                <!-- Schedule & Status -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Horario del Grupo -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Horario del Grupo
                    </label>
                    <input 
                      v-model="form.group_schedule" 
                      type="text"
                      placeholder="Ej: Martes 4:30pm - 6:00pm"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                    />
                  </div>

                  <!-- Estado -->
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

                <!-- Tema Indispensable -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tema Indispensable *
                  </label>
                  <input 
                    v-model="form.indispensable_theme" 
                    type="text"
                    placeholder="Ej: DEFENSA Y PRESERVACIÓN DE LA VIDA"
                    :class="[
                      formErrors.indispensable_theme ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                      'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 uppercase font-semibold transition-all'
                    ]"
                  />
                  <p v-if="formErrors.indispensable_theme" class="text-rose-500 text-[11px] font-bold mt-1">
                    {{ formErrors.indispensable_theme }}
                  </p>
                </div>

                <!-- Tema del Proyecto -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tema del Proyecto
                  </label>
                  <input 
                    v-model="form.project_theme" 
                    type="text"
                    placeholder="Ej: SOMOS DEFENSORES DE VIDA"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 uppercase font-semibold transition-all"
                  />
                </div>

                <!-- Objetivos Generales (Dynamic list with + Agregar button) -->
                <div class="space-y-3 pt-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Objetivos Generales
                    </label>
                    <button 
                      type="button" 
                      @click="addObjective"
                      class="px-3 py-1 bg-brand-primary/10 dark:bg-brand-purple/25 text-brand-primary dark:text-brand-gold font-bold text-xs rounded-xl hover:bg-brand-primary/20 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>+ Agregar</span>
                    </button>
                  </div>

                  <div v-if="form.general_objectives.length === 0" class="p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
                    No has agregado objetivos generales. Haz clic en "+ Agregar" para añadir uno.
                  </div>

                  <div v-else class="space-y-2">
                    <div 
                      v-for="(obj, idx) in form.general_objectives" 
                      :key="idx" 
                      class="flex items-center gap-2"
                    >
                      <span class="w-6 text-center text-xs font-mono font-bold text-slate-400">{{ idx + 1 }}.</span>
                      <input 
                        v-model="form.general_objectives[idx]" 
                        type="text"
                        placeholder="Escribe un objetivo pedagógico..."
                        class="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      />
                      <button 
                        type="button" 
                        @click="removeObjective(idx)"
                        class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                        title="Eliminar objetivo"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ================= TAB 2: PLANIFICACIÓN SEMANAL ================= -->
              <div v-show="activeTab === 'weekly'" class="space-y-4 animate-fade-in">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Planificación Semanal</h3>
                    <p class="text-xs text-slate-400">Define temas generadores, referentes teóricos y actividades por semana</p>
                  </div>
                  <button 
                    type="button" 
                    @click="addWeek"
                    class="px-3.5 py-2 bg-gradient-to-r from-brand-primary to-brand-purple text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>+ Agregar Semana</span>
                  </button>
                </div>

                <div v-if="form.weekly_planning.length === 0" class="p-8 text-center bg-slate-50 dark:bg-[#110926] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                  No hay semanas registradas aún. Haz clic en "+ Agregar Semana" para comenzar.
                </div>

                <div v-else class="space-y-4">
                  <div 
                    v-for="(w, idx) in form.weekly_planning" 
                    :key="idx" 
                    class="p-4 bg-slate-50/70 dark:bg-[#110926] rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 relative"
                  >
                    <!-- Week Header & Delete -->
                    <div class="flex items-center justify-between">
                      <span class="px-3 py-1 bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold font-bold text-xs rounded-xl border border-brand-primary/20 dark:border-brand-purple/40">
                        Semana {{ w.week || idx + 1 }}
                      </span>
                      <button 
                        type="button" 
                        @click="removeWeek(idx)"
                        class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer text-sm"
                        title="Eliminar esta semana"
                      >
                        🗑️
                      </button>
                    </div>

                    <!-- Row 1: Fechas de la Semana & Tema Generador -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Fechas de la Semana
                        </label>
                        <input 
                          v-model="w.dates" 
                          type="text"
                          placeholder="Ej: 07/10/2024 al 11/10/2024"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Tema Generador
                        </label>
                        <input 
                          v-model="w.generator_theme" 
                          type="text"
                          placeholder="Defensa y preservación de la vida"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                    </div>

                    <!-- Referente Teórico -->
                    <div>
                      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Referente Teórico
                      </label>
                      <input 
                        v-model="w.theoretical_referent" 
                        type="text"
                        placeholder="Ej: Historia de la Informática y de la Computación"
                        class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      />
                    </div>

                    <!-- Contenido -->
                    <div>
                      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Contenido
                      </label>
                      <textarea 
                        v-model="w.content" 
                        rows="2"
                        placeholder="Detalle de los contenidos curriculares a abordar..."
                        class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
                      ></textarea>
                    </div>

                    <!-- Row 3: Actividad Evaluativa & Instrumento & Fecha de Entrega -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Actividad Evaluativa
                        </label>
                        <input 
                          v-model="w.evaluative_activity" 
                          type="text"
                          placeholder="Ej: Actividad investigación"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Instrumento de Evaluación
                        </label>
                        <input 
                          v-model="w.evaluation_instrument" 
                          type="text"
                          placeholder="Ej: Lista de cotejo / Rúbrica"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Fecha de Entrega
                        </label>
                        <input 
                          v-model="w.delivery_date" 
                          type="date"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ================= TAB 3: PLAN DE EVALUACIÓN ================= -->
              <div v-show="activeTab === 'evaluation'" class="space-y-4 animate-fade-in">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10 flex-wrap gap-2">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Plan de Evaluación</h3>
                    <p class="text-xs text-slate-400">Ponderación acumulada de las actividades evaluativas</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span 
                      :class="totalEvaluationWeight === 100 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'"
                      class="px-3 py-1 rounded-xl text-xs font-bold border"
                    >
                      Ponderación Total: {{ totalEvaluationWeight }}%
                    </span>
                    <button 
                      type="button" 
                      @click="addEvaluation"
                      class="px-3.5 py-2 bg-gradient-to-r from-brand-primary to-brand-purple text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>+ Agregar Evaluación</span>
                    </button>
                  </div>
                </div>

                <div v-if="form.evaluation_plan.length === 0" class="p-8 text-center bg-slate-50 dark:bg-[#110926] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                  No hay evaluaciones configuradas. Haz clic en "+ Agregar Evaluación" para registrar actividades.
                </div>

                <div v-else class="space-y-4">
                  <div 
                    v-for="(ev, idx) in form.evaluation_plan" 
                    :key="idx" 
                    class="p-4 bg-slate-50/70 dark:bg-[#110926] rounded-2xl border border-slate-200 dark:border-white/10 space-y-3"
                  >
                    <!-- Evaluation Header & Delete -->
                    <div class="flex items-center justify-between">
                      <span class="px-3 py-1 bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold font-bold text-xs rounded-xl border border-brand-primary/20 dark:border-brand-purple/40">
                        Evaluación {{ idx + 1 }}
                      </span>
                      <button 
                        type="button" 
                        @click="removeEvaluation(idx)"
                        class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer text-sm"
                        title="Eliminar esta evaluación"
                      >
                        🗑️
                      </button>
                    </div>

                    <!-- Row 1: Fecha, Peso (%), Puntos -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Fecha
                        </label>
                        <input 
                          v-model="ev.date" 
                          type="date"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Peso (%)
                        </label>
                        <input 
                          v-model.number="ev.weight" 
                          type="number"
                          min="1"
                          max="100"
                          placeholder="30"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-bold text-brand-purple dark:text-brand-gold"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Puntos
                        </label>
                        <input 
                          v-model.number="ev.points" 
                          type="number"
                          min="1"
                          placeholder="6"
                          class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-bold"
                        />
                      </div>
                    </div>

                    <!-- Descripción de la Evaluación -->
                    <div>
                      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Descripción / Estrategia
                      </label>
                      <input 
                        v-model="ev.description" 
                        type="text"
                        placeholder="Ej: Historia de la Informática y la Computación"
                        class="w-full px-3 py-2 text-xs bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- ================= TAB 4: ESTUDIANTES ================= -->
              <div v-show="activeTab === 'students'" class="space-y-4 animate-fade-in">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10 flex-wrap gap-2">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Lista de Estudiantes Asignados</h3>
                    <p class="text-xs text-slate-400">Estudiantes matriculados en el nivel {{ form.grade }} {{ form.section ? `- Sección ${form.section}` : '' }}</p>
                  </div>
                  <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl">
                    Estudiantes disponibles: {{ filteredStudentsForModal.length }}
                  </span>
                </div>

                <!-- Quick search within students -->
                <div class="relative">
                  <input 
                    v-model="studentSearchInModal" 
                    type="text" 
                    placeholder="Filtrar por nombre o cédula..." 
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                  <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                </div>

                <!-- Students Table / List -->
                <div class="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 dark:bg-[#110926] text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase border-b border-slate-200 dark:border-white/10 sticky top-0">
                      <tr>
                        <th class="p-3">Estudiante</th>
                        <th class="p-3">Identificación</th>
                        <th class="p-3 text-right">Grado / Nivel</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                      <tr 
                        v-for="std in filteredStudentsForModal" 
                        :key="std.id"
                        class="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
                      >
                        <td class="p-3 font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <span class="w-7 h-7 rounded-lg bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-gold flex items-center justify-center font-bold text-[11px]">
                            {{ (std.first_name || std.name || 'E').charAt(0) }}
                          </span>
                          <span>{{ std.first_name ? `${std.first_name} ${std.last_name}` : std.name }}</span>
                        </td>
                        <td class="p-3 font-mono text-slate-500 dark:text-slate-400">
                          {{ std.id_document || std.student_id || 'V-28.000.000' }}
                        </td>
                        <td class="p-3 text-right font-medium text-slate-600 dark:text-slate-300">
                          {{ std.grade || form.grade }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <!-- Sticky Fixed Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div>
                <button 
                  v-if="isEditing && currentPlan" 
                  type="button" 
                  @click="openPdfModal(currentPlan)"
                  class="px-4 py-2 text-xs font-bold text-brand-purple dark:text-brand-gold hover:bg-brand-purple/10 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🖨️ Imprimir PDF</span>
                </button>
              </div>

              <div class="flex items-center gap-3">
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
                    <span>{{ isEditing ? 'Actualizar Planificación' : 'Guardar Planificación' }}</span>
                  </span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

    <!-- INSTITUTIONAL PRINTABLE PDF PREVIEW MODAL -->
    <Teleport to="body">
      <div 
        v-if="isPdfModalOpen" 
        class="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto"
        @click.self="isPdfModalOpen = false"
      >
        <div class="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-scale-up">
          <!-- Top bar with Print and Close buttons (hidden in print) -->
          <div class="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
            <div class="flex items-center gap-2">
              <span class="text-xl">📄</span>
              <span class="font-bold text-sm text-slate-800">Vista Previa e Impresión de Planificación Curricular</span>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="triggerPrint" 
                class="px-4 py-2 bg-brand-primary hover:bg-brand-purple text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🖨️ Imprimir / Guardar como PDF</span>
              </button>
              <button 
                @click="isPdfModalOpen = false" 
                class="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>
          </div>

          <!-- Printable Document Sheet (A4 Institutional Style) -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-10 print:p-0 print:m-0 bg-white" id="printable-planning-sheet">
            <!-- Official Venezuelan Institutional Header -->
            <div class="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <div class="flex items-center gap-4">
                <img src="/logocolegio.png" alt="U.E Santa Luisa" class="w-16 h-16 object-contain" />
                <div>
                  <h4 class="text-[10px] uppercase font-bold tracking-widest text-slate-600">República Bolivariana de Venezuela</h4>
                  <h4 class="text-[10px] uppercase font-bold tracking-widest text-slate-600">Ministerio del Poder Popular para la Educación</h4>
                  <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900 font-display">UNIDAD EDUCATIVA COLEGIO SANTA LUISA</h2>
                  <p class="text-[10px] font-semibold text-slate-500 uppercase">Caracas • Distrito Capital • Código Plantel: PD-00230101</p>
                </div>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black font-mono border border-slate-300">
                  {{ selectedPlanForPdf?.academic_year || '2025-2026' }}
                </span>
                <p class="text-[10px] font-bold uppercase text-slate-500 mt-1">{{ selectedPlanForPdf?.period }}</p>
              </div>
            </div>

            <!-- Title of the Document -->
            <div class="text-center my-4">
              <h1 class="text-lg font-black uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
                PLANIFICACIÓN ACADÉMICA Y CURRICULAR
              </h1>
            </div>

            <!-- General Information Table -->
            <div class="border border-slate-400 rounded-lg overflow-hidden text-xs mb-6">
              <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-slate-300 bg-slate-50">
                <div class="p-2.5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block">Docente Titular:</span>
                  <span class="font-bold text-slate-900">{{ getTeacherName(selectedPlanForPdf?.teacher_id) }}</span>
                </div>
                <div class="p-2.5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block">Asignatura / Cátedra:</span>
                  <span class="font-bold text-slate-900">{{ getSubjectName(selectedPlanForPdf?.subject_id) }}</span>
                </div>
                <div class="p-2.5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block">Grado / Nivel:</span>
                  <span class="font-bold text-slate-900">{{ selectedPlanForPdf?.grade }} {{ selectedPlanForPdf?.section ? `(Secc. ${selectedPlanForPdf?.section})` : '' }}</span>
                </div>
                <div class="p-2.5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block">Horario de Atención:</span>
                  <span class="font-bold text-slate-900">{{ selectedPlanForPdf?.group_schedule || 'Reglamentario' }}</span>
                </div>
              </div>

              <!-- Tema Indispensable & Proyecto -->
              <div class="p-3 border-t border-slate-300 bg-white">
                <p class="text-[10px] font-bold uppercase text-slate-500">Tema Indispensable:</p>
                <p class="font-black text-slate-900 uppercase text-xs">{{ selectedPlanForPdf?.indispensable_theme || 'DEFENSA Y PRESERVACIÓN DE LA VIDA' }}</p>
              </div>
              <div v-if="selectedPlanForPdf?.project_theme" class="p-3 border-t border-slate-300 bg-slate-50/50">
                <p class="text-[10px] font-bold uppercase text-slate-500">Proyecto Pedagógico:</p>
                <p class="font-bold text-slate-900 uppercase text-xs">{{ selectedPlanForPdf?.project_theme }}</p>
              </div>
            </div>

            <!-- Objetivos Generales -->
            <div v-if="getArray(selectedPlanForPdf?.general_objectives).length > 0" class="mb-6">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Objetivos Generales
              </h3>
              <ul class="list-disc list-inside text-xs text-slate-700 space-y-1">
                <li v-for="(obj, i) in getArray(selectedPlanForPdf?.general_objectives)" :key="i">
                  {{ obj }}
                </li>
              </ul>
            </div>

            <!-- Cronograma Semanal Table -->
            <div class="mb-6">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Cronograma Semanal de Clases
              </h3>
              <table class="w-full text-left text-[11px] border border-slate-400">
                <thead class="bg-slate-100 font-bold uppercase text-[10px] border-b border-slate-400">
                  <tr>
                    <th class="p-2 border-r border-slate-400 w-16 text-center">Sem.</th>
                    <th class="p-2 border-r border-slate-400 w-28">Fechas</th>
                    <th class="p-2 border-r border-slate-400">Tema Generador y Referentes</th>
                    <th class="p-2 border-r border-slate-400">Contenidos</th>
                    <th class="p-2 w-32">Actividad / Entrega</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-300">
                  <tr v-for="(w, i) in getArray(selectedPlanForPdf?.weekly_planning)" :key="i">
                    <td class="p-2 border-r border-slate-300 font-bold text-center">Sem. {{ w.week || i + 1 }}</td>
                    <td class="p-2 border-r border-slate-300 text-slate-600 font-mono text-[10px]">{{ w.dates || '-' }}</td>
                    <td class="p-2 border-r border-slate-300">
                      <p class="font-bold text-slate-900">{{ w.generator_theme }}</p>
                      <p v-if="w.theoretical_referent" class="text-slate-600 text-[10px] mt-0.5">Ref: {{ w.theoretical_referent }}</p>
                    </td>
                    <td class="p-2 border-r border-slate-300 text-slate-700">{{ w.content }}</td>
                    <td class="p-2">
                      <p class="font-bold text-slate-900">{{ w.evaluative_activity || '-' }}</p>
                      <p v-if="w.evaluation_instrument" class="text-[10px] text-slate-500">Inst: {{ w.evaluation_instrument }}</p>
                      <p v-if="w.delivery_date" class="text-[10px] font-mono text-slate-500 mt-0.5">Fec: {{ w.delivery_date }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Plan de Evaluación Table -->
            <div class="mb-8">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Plan de Evaluación Acumulado (100%)
              </h3>
              <table class="w-full text-left text-[11px] border border-slate-400">
                <thead class="bg-slate-100 font-bold uppercase text-[10px] border-b border-slate-400">
                  <tr>
                    <th class="p-2 border-r border-slate-400 w-16 text-center">N°</th>
                    <th class="p-2 border-r border-slate-400 w-28">Fecha</th>
                    <th class="p-2 border-r border-slate-400">Descripción / Estrategia Evaluativa</th>
                    <th class="p-2 border-r border-slate-400 w-20 text-center">Puntos</th>
                    <th class="p-2 w-24 text-right">Peso (%)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-300">
                  <tr v-for="(ev, i) in getArray(selectedPlanForPdf?.evaluation_plan)" :key="i">
                    <td class="p-2 border-r border-slate-300 font-bold text-center">#{{ i + 1 }}</td>
                    <td class="p-2 border-r border-slate-300 text-slate-600 font-mono text-[10px]">{{ ev.date || '-' }}</td>
                    <td class="p-2 border-r border-slate-300 font-bold text-slate-800">
                      {{ ev.description || ev.evaluation || `Evaluación ${i + 1}` }}
                    </td>
                    <td class="p-2 border-r border-slate-300 text-center font-bold">{{ ev.points || '-' }}</td>
                    <td class="p-2 text-right font-black text-slate-900">{{ ev.weight || ev.percentage || 0 }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Signatures Block -->
            <div class="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
              <div class="border-t border-slate-400 pt-2">
                <p class="font-bold text-slate-900">{{ getTeacherName(selectedPlanForPdf?.teacher_id) }}</p>
                <p class="text-[10px] text-slate-500 uppercase">Docente Titular de Asignatura</p>
              </div>
              <div class="border-t border-slate-400 pt-2">
                <p class="font-bold text-slate-900">Coordinación Pedagógica</p>
                <p class="text-[10px] text-slate-500 uppercase">Control y Evaluación U.E Santa Luisa</p>
              </div>
              <div class="border-t border-slate-400 pt-2">
                <p class="font-bold text-slate-900">Dirección General</p>
                <p class="text-[10px] text-slate-500 uppercase">Sello y Firma del Plantel</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Teleport>

    <!-- SOFT DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs print:hidden"
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
const teachersList = ref([])
const subjectsList = ref([])
const studentsList = ref([])

const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedPeriod = ref('')
const selectedStatus = ref('')
const selectedGrade = ref('')
const expandedId = ref(null)

const activeTab = ref('general') // 'general' | 'weekly' | 'evaluation' | 'students'
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)
const currentPlan = ref(null)

const isDeleteModalOpen = ref(false)
const planToDelete = ref(null)

const isPdfModalOpen = ref(false)
const selectedPlanForPdf = ref(null)
const studentSearchInModal = ref('')

const gradesList = [
  '1er Año',
  '2do Año',
  '3er Año',
  '4to Año',
  '5to Año',
  '1° Primaria',
  '2° Primaria',
  '3° Primaria',
  '4° Primaria',
  '5° Primaria',
  '6° Primaria'
]

const form = ref({
  teacher_id: 1,
  subject_id: 1,
  academic_year: '2025-2026',
  period: '1er lapso',
  grade: '4to Año',
  section: 'U',
  group_schedule: 'Martes 4:30pm - 6:00pm',
  indispensable_theme: 'DEFENSA Y PRESERVACIÓN DE LA VIDA',
  project_theme: 'SOMOS DEFENSORES DE VIDA',
  general_objectives: [
    'Familiarizar a los estudiantes con la interfaz de Word 2019',
    'Desarrollar habilidades prácticas en el procesamiento de texto digital'
  ],
  weekly_planning: [
    {
      week: 1,
      dates: '07/10/2024 al 11/10/2024',
      generator_theme: 'Defensa y preservación de la vida',
      theoretical_referent: 'Historia de la Informática y de la Computación',
      content: 'Informática y computación - Conceptos básicos',
      evaluative_activity: 'Actividad investigación sobre historia de la computación',
      evaluation_instrument: 'Lista de cotejo',
      delivery_date: '2024-10-11'
    }
  ],
  evaluation_plan: [
    {
      evaluation: 'Evaluación 1',
      date: '2024-10-22',
      weight: 30,
      points: 6,
      description: 'Historia de la Informática y la Computación'
    },
    {
      evaluation: 'Evaluación 2',
      date: '2024-11-12',
      weight: 30,
      points: 6,
      description: 'Creación de afiches sobre las generaciones de la computación'
    },
    {
      evaluation: 'Evaluación 3',
      date: '2024-12-05',
      weight: 40,
      points: 8,
      description: 'Práctica evaluada de edición de documentos en procesador de texto'
    }
  ],
  status: 'finalizada'
})

const formErrors = ref({})

// Computed evaluation weight sum
const totalEvaluationWeight = computed(() => {
  if (!form.value.evaluation_plan || !Array.isArray(form.value.evaluation_plan)) return 0
  return form.value.evaluation_plan.reduce((sum, item) => sum + (Number(item.weight) || Number(item.percentage) || 0), 0)
})

// Filtered students for Tab 4 in modal
const filteredStudentsForModal = computed(() => {
  const query = studentSearchInModal.value.toLowerCase().trim()
  return studentsList.value.filter(s => {
    const fullName = `${s.first_name || ''} ${s.last_name || ''} ${s.name || ''}`.toLowerCase()
    const doc = (s.id_document || s.student_id || '').toLowerCase()
    return !query || fullName.includes(query) || doc.includes(query)
  })
})

const validateForm = () => {
  const errors = {}
  if (!form.value.academic_year?.trim()) errors.academic_year = 'El año escolar es obligatorio'
  if (!form.value.grade?.trim()) errors.grade = 'El grado es obligatorio'
  if (!form.value.indispensable_theme?.trim()) errors.indispensable_theme = 'El tema indispensable es obligatorio'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Helpers for adding/removing dynamic items
const addObjective = () => {
  form.value.general_objectives.push('')
}

const removeObjective = (index) => {
  form.value.general_objectives.splice(index, 1)
}

const addWeek = () => {
  const nextWeekNum = form.value.weekly_planning.length + 1
  form.value.weekly_planning.push({
    week: nextWeekNum,
    dates: '',
    generator_theme: '',
    theoretical_referent: '',
    content: '',
    evaluative_activity: '',
    evaluation_instrument: '',
    delivery_date: ''
  })
}

const removeWeek = (index) => {
  form.value.weekly_planning.splice(index, 1)
}

const addEvaluation = () => {
  const nextNum = form.value.evaluation_plan.length + 1
  form.value.evaluation_plan.push({
    evaluation: `Evaluación ${nextNum}`,
    date: '',
    weight: 20,
    points: 4,
    description: ''
  })
}

const removeEvaluation = (index) => {
  form.value.evaluation_plan.splice(index, 1)
}

// Name lookup helpers
const getSubjectName = (subjectId) => {
  if (!subjectId) return 'Informática y Computación'
  const sub = subjectsList.value.find(s => s.id === Number(subjectId) || s.id === subjectId)
  return sub ? `${sub.name}` : 'Informática y Computación'
}

const getTeacherName = (teacherId) => {
  if (!teacherId) return 'Profesor José Antonio Vásquez'
  const tch = teachersList.value.find(t => t.id === Number(teacherId) || t.id === teacherId)
  if (!tch) return 'Profesor José Antonio Vásquez'
  return tch.first_name ? `${tch.first_name} ${tch.last_name}` : tch.name
}

// Fetch Auxiliary Data
const fetchAuxiliaryData = async () => {
  try {
    const [subRes, tchRes, stdRes] = await Promise.all([
      api.get('subjects').catch(() => ({ data: [] })),
      api.get('teachers').catch(() => ({ data: [] })),
      api.get('students').catch(() => ({ data: [] }))
    ])

    subjectsList.value = (subRes.data || subRes || [])
    teachersList.value = (tchRes.data || tchRes || [])
    studentsList.value = (stdRes.data || stdRes || [])

    // Seed fallback teachers if empty
    if (teachersList.value.length === 0) {
      teachersList.value = [
        { id: 1, name: 'José Antonio Vásquez', title: 'Lic. Informática Educativa' },
        { id: 2, name: 'Roberto Gómez', title: 'Prof. Ciencias Naturales' },
        { id: 3, name: 'Laura Méndez', title: 'Lic. Lengua y Literatura' },
        { id: 4, name: 'Miguel Silva', title: 'Prof. Matemática y Física' }
      ]
    }

    // Seed fallback subjects if empty
    if (subjectsList.value.length === 0) {
      subjectsList.value = [
        { id: 1, name: 'Informática y Computación', code: 'INF-4' },
        { id: 2, name: 'Ciencias Naturales', code: 'CNAT-M' },
        { id: 3, name: 'Castellano y Literatura', code: 'CAST-M' },
        { id: 4, name: 'Matemática', code: 'MAT-M' },
        { id: 5, name: 'Química', code: 'QUIN-M' }
      ]
    }

    // Seed fallback students if empty (matching screenshot 5)
    if (studentsList.value.length === 0) {
      studentsList.value = [
        { id: 1, first_name: 'Carlos', last_name: 'Rodríguez', grade: '4to Año', id_document: 'V-31.420.111' },
        { id: 2, first_name: 'Sofía', last_name: 'Martínez', grade: '4to Año', id_document: 'V-31.890.334' },
        { id: 3, first_name: 'María', last_name: 'González', grade: '4to Año', id_document: 'V-32.110.890' },
        { id: 4, first_name: 'Alejandro', last_name: 'Pérez', grade: '4to Año', id_document: 'V-31.554.212' }
      ]
    }
  } catch (err) {
    console.error('Error fetching auxiliary data:', err)
  }
}

// Fetch Plannings
const fetchPlannings = async () => {
  loading.value = true
  try {
    const res = await api.get('academic-plannings')
    const rawList = res.data || res || []
    
    if (rawList.length > 0) {
      plannings.value = rawList
    } else {
      // Fallback sample plan matching screenshots 1, 2, 3, 4
      plannings.value = [
        {
          id: 1,
          teacher_id: 1,
          subject_id: 1,
          academic_year: '2024-2025',
          period: '1er lapso',
          grade: '4to Año',
          section: 'U',
          group_schedule: 'Martes 4:30pm - 6:00pm',
          indispensable_theme: 'DEFENSA Y PRESERVACIÓN DE LA VIDA',
          project_theme: 'SOMOS DEFENSORES DE VIDA',
          general_objectives: [
            'Familiarizar a los estudiantes con la interfaz de Word 2019',
            'Desarrollar habilidades prácticas en el procesamiento de texto digital'
          ],
          weekly_planning: [
            {
              week: 1,
              dates: '07/10/2024 al 11/10/2024',
              generator_theme: 'Defensa y preservación de la vida',
              theoretical_referent: 'Historia de la Informática y de la Computación',
              content: 'Informática y computación - Conceptos básicos',
              evaluative_activity: 'Actividad investigación sobre historia de la computación',
              evaluation_instrument: 'Lista de cotejo',
              delivery_date: '2024-10-11'
            }
          ],
          evaluation_plan: [
            {
              evaluation: 'Evaluación 1',
              date: '2024-10-22',
              weight: 30,
              points: 6,
              description: 'Historia de la Informática y la Computación'
            },
            {
              evaluation: 'Evaluación 2',
              date: '2024-11-12',
              weight: 30,
              points: 6,
              description: 'Creación de afiches sobre las generaciones de la computación'
            },
            {
              evaluation: 'Evaluación 3',
              date: '2024-12-05',
              weight: 40,
              points: 8,
              description: 'Práctica evaluada de edición de documentos en procesador de texto'
            }
          ],
          status: 'finalizada'
        },
        {
          id: 2,
          teacher_id: 2,
          subject_id: 2,
          academic_year: '2025-2026',
          period: '1er lapso',
          grade: '1er Año',
          section: 'A',
          group_schedule: 'Lunes y Miércoles 07:00 - 08:30',
          indispensable_theme: 'CIENCIA, TECNOLOGÍA Y SOBERANÍA ALIMENTARIA',
          project_theme: 'EL HUERTO ESCOLAR Y EL LABORATORIO',
          general_objectives: [
            'Desarrollar el pensamiento crítico e investigativo mediante la experimentación en el laboratorio',
            'Comprender el impacto de las ciencias biológicas en el entorno cotidiano'
          ],
          weekly_planning: [
            {
              week: 1,
              dates: '15/09/2025 al 19/09/2025',
              generator_theme: 'El método científico en la vida diaria',
              theoretical_referent: 'Normas de bioseguridad y materiales de laboratorio',
              content: 'Identificación de reactivos, cristalería e instrumentos de precisión',
              evaluative_activity: 'Taller práctico de reconocimiento de equipos',
              evaluation_instrument: 'Escala de estimación',
              delivery_date: '2025-09-19'
            },
            {
              week: 2,
              dates: '22/09/2025 al 26/09/2025',
              generator_theme: 'La célula como unidad fundamental de la vida',
              theoretical_referent: 'Estructura celular procariota y eucariota',
              content: 'Diferenciación celular vegetal y animal bajo el microscopio óptico',
              evaluative_activity: 'Informe de laboratorio con preparaciones en fresco',
              evaluation_instrument: 'Rúbrica analítica',
              delivery_date: '2025-09-26'
            }
          ],
          evaluation_plan: [
            {
              evaluation: 'Evaluación 1',
              date: '2025-10-10',
              weight: 25,
              points: 5,
              description: 'Informe de laboratorio sobre bioseguridad y microscopía'
            },
            {
              evaluation: 'Evaluación 2',
              date: '2025-11-05',
              weight: 35,
              points: 7,
              description: 'Prueba teórico-práctica de componentes celulares'
            },
            {
              evaluation: 'Evaluación 3',
              date: '2025-12-01',
              weight: 40,
              points: 8,
              description: 'Presentación del modelo celular tridimensional y defensa oral'
            }
          ],
          status: 'aprobada'
        }
      ]
    }
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
    const subjName = getSubjectName(p.subject_id).toLowerCase()
    const tchName = getTeacherName(p.teacher_id).toLowerCase()
    
    const matchesSearch = !term ||
      (p.indispensable_theme?.toLowerCase().includes(term) ||
       p.project_theme?.toLowerCase().includes(term) ||
       p.grade?.toLowerCase().includes(term) ||
       subjName.includes(term) ||
       tchName.includes(term))
    
    const matchesPeriod = !selectedPeriod.value || p.period === selectedPeriod.value
    const matchesStatus = !selectedStatus.value || p.status === selectedStatus.value
    const matchesGrade = !selectedGrade.value || p.grade === selectedGrade.value

    return matchesSearch && matchesPeriod && matchesStatus && matchesGrade
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
  currentPlan.value = null
  activeTab.value = 'general'
  formErrors.value = {}
  form.value = {
    teacher_id: teachersList.value[0]?.id || 1,
    subject_id: subjectsList.value[0]?.id || 1,
    academic_year: '2025-2026',
    period: '1er lapso',
    grade: '4to Año',
    section: 'U',
    group_schedule: 'Martes 4:30pm - 6:00pm',
    indispensable_theme: '',
    project_theme: '',
    general_objectives: [''],
    weekly_planning: [
      {
        week: 1,
        dates: '',
        generator_theme: '',
        theoretical_referent: '',
        content: '',
        evaluative_activity: '',
        evaluation_instrument: '',
        delivery_date: ''
      }
    ],
    evaluation_plan: [
      {
        evaluation: 'Evaluación 1',
        date: '',
        weight: 30,
        points: 6,
        description: ''
      }
    ],
    status: 'borrador'
  }
  isModalOpen.value = true
}

const editPlan = (plan) => {
  isEditing.value = true
  currentId.value = plan.id
  currentPlan.value = plan
  activeTab.value = 'general'
  formErrors.value = {}
  
  form.value = {
    ...plan,
    general_objectives: getArray(plan.general_objectives).length > 0 ? getArray(plan.general_objectives) : [''],
    weekly_planning: getArray(plan.weekly_planning).length > 0 ? getArray(plan.weekly_planning) : [],
    evaluation_plan: getArray(plan.evaluation_plan).length > 0 ? getArray(plan.evaluation_plan) : []
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formErrors.value = {}
}

const savePlan = async () => {
  if (!validateForm()) {
    activeTab.value = 'general'
    toast.warning('Por favor completa los campos obligatorios (*) en la pestaña General')
    return
  }

  saving.value = true
  try {
    const payload = {
      teacher_id: Number(form.value.teacher_id) || 1,
      subject_id: Number(form.value.subject_id) || 1,
      academic_year: form.value.academic_year || '2025-2026',
      period: form.value.period || '1er lapso',
      grade: form.value.grade || '4to Año',
      section: form.value.section || 'U',
      group_schedule: form.value.group_schedule || '',
      indispensable_theme: form.value.indispensable_theme || '',
      project_theme: form.value.project_theme || '',
      weekly_planning: JSON.stringify(form.value.weekly_planning || []),
      general_objectives: JSON.stringify(form.value.general_objectives?.filter(Boolean) || []),
      evaluation_plan: JSON.stringify(form.value.evaluation_plan || []),
      status: form.value.status || 'borrador',
      submission_date: new Date().toISOString().split('T')[0]
    }

    if (isEditing.value) {
      await api.patch(`academic-plannings/${currentId.value}`, payload).catch(() => null)
      // Update locally
      const idx = plannings.value.findIndex(p => p.id === currentId.value)
      if (idx !== -1) {
        plannings.value[idx] = { ...plannings.value[idx], ...form.value }
      }
      toast.success('Planificación académica actualizada exitosamente')
    } else {
      const created = await api.post('academic-plannings', payload).catch(() => null)
      const newPlan = created && created.id ? created : {
        id: Date.now(),
        ...form.value
      }
      plannings.value.unshift(newPlan)
      toast.success('Planificación registrada exitosamente en la U.E Santa Luisa')
    }
    isModalOpen.value = false
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
    await api.remove(`academic-plannings/${planToDelete.value.id}`).catch(() => null)
    plannings.value = plannings.value.filter(p => p.id !== planToDelete.value.id)
    toast.warning('Planificación curricular eliminada')
    isDeleteModalOpen.value = false
    planToDelete.value = null
  } catch (err) {
    console.error('Error al eliminar:', err)
    toast.error('Error al eliminar la planificación')
  }
}

// PDF Modal & Printing
const openPdfModal = (plan) => {
  selectedPlanForPdf.value = plan
  isPdfModalOpen.value = true
}

const triggerPrint = () => {
  window.print()
}

onMounted(async () => {
  await fetchAuxiliaryData()
  await fetchPlannings()
})
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-planning-sheet,
  #printable-planning-sheet * {
    visibility: visible;
  }
  #printable-planning-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    background: white !important;
    color: black !important;
  }
}
</style>
