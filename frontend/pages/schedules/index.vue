<template>
  <div class="space-y-6 animate-fade-in">
    
    <!-- Official Institutional Header (Visible on Print) -->
    <div class="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-4">
      <div class="flex items-center justify-center gap-3 mb-2">
        <img src="/logocolegio.png" alt="Logo" class="w-14 h-14 object-contain" />
        <div>
          <h2 class="text-xs uppercase font-bold tracking-widest text-slate-700">República Bolivariana de Venezuela</h2>
          <h2 class="text-xs uppercase font-bold tracking-widest text-slate-700">Ministerio del Poder Popular para la Educación</h2>
          <h1 class="text-base font-black text-slate-900 font-display">Unidad Educativa Colegio "Santa Luisa"</h1>
          <p class="text-[11px] font-semibold text-slate-600">Prado de María – Caracas | RIF: J-00123456-7</p>
        </div>
      </div>
      <div class="flex items-center justify-between text-xs font-bold text-slate-800 mt-2 px-2">
        <span>Horario de Clases — Año Escolar 2025-2026</span>
        <span v-if="viewMode === 'section'">{{ selectedGrade }} - Sección {{ selectedSection }}</span>
        <span v-else>{{ selectedTeacherName }}</span>
        <span>Jornada: 7:00 am a 3:00 pm</span>
      </div>
    </div>

    <!-- Screen Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-gold/15 text-amber-700 dark:text-brand-gold border border-brand-gold/30">
            Santa Luisa • Horario Oficial
          </span>
          <span v-if="!canManage" class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            👁 Consulta (Solo Lectura)
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Horarios Escolares
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          U.E Santa Luisa • Jornada pedagógica de 7:00 am a 3:00 pm en bloques de 45 minutos
        </p>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center gap-2.5">
        <button
          @click="windowPrint"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <svg class="w-4 h-4 text-brand-purple dark:text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Imprimir Horario</span>
        </button>

        <!-- Only Admin, Control de Estudio or Coordinator can create blocks -->
        <button 
          v-if="canManage"
          @click="openCreateModal(null, null, $event)" 
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/25 active:scale-[0.98] transition-all duration-200 border border-brand-primary/30 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Bloque</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards (print:hidden) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      <!-- Total Bloques Asignados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bloques Semanales</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ filteredSchedules.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 border border-brand-primary/20 dark:border-brand-purple/40 text-brand-primary dark:text-brand-secondary flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Materias Programadas -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Materias Activas</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ uniqueSubjectsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <!-- Docentes Programados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Docentes Asignados</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ uniqueTeachersCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-brand-gold/30 text-amber-600 dark:text-brand-gold flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Horas Pedagógicas Semanales -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Carga Semanal</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-brand-purple dark:text-purple-300 leading-tight tracking-tight">{{ totalAcademicHours }}</p>
            <span class="text-xs font-semibold text-slate-400">bloques (45m)</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/25 border border-brand-purple/20 dark:border-brand-purple/40 text-brand-purple dark:text-brand-gold flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- View Mode Switcher & Filter Controls (print:hidden) -->
    <div class="glass-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
      <!-- Tabs Switcher: Por Sección vs. Por Profesor Especialista -->
      <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#110926] p-1 rounded-xl border border-slate-200 dark:border-white/10">
        <button
          @click="viewMode = 'section'"
          :class="viewMode === 'section' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🏫 Por Grado / Sección</span>
        </button>
        <button
          @click="viewMode = 'specialist'"
          :class="viewMode === 'specialist' ? 'bg-white dark:bg-[#201646] text-brand-primary dark:text-brand-gold font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>👨‍🏫 Por Docente Especialista</span>
        </button>
      </div>

      <!-- Contextual Selectors based on View Mode -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- If By Section Mode -->
        <template v-if="viewMode === 'section'">
          <!-- Level selector -->
          <select
            v-model="educationLevel"
            @change="handleLevelChange"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-bold"
          >
            <option value="primaria">Primaria (1° a 6°)</option>
            <option value="media">Media General (1er a 5to Año)</option>
          </select>

          <!-- Grade selector -->
          <select
            v-model="selectedGrade"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-semibold"
          >
            <option v-for="g in currentGradesList" :key="g" :value="g">{{ g }}</option>
          </select>

          <!-- Section selector -->
          <div class="flex items-center bg-slate-100 dark:bg-[#110926] p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button
              v-for="sec in ['A', 'B']"
              :key="sec"
              @click="selectedSection = sec"
              :class="selectedSection === sec ? 'bg-brand-primary text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
              class="w-7 h-7 rounded-lg text-xs transition-all font-mono cursor-pointer"
            >
              {{ sec }}
            </button>
          </div>
        </template>

        <!-- If By Specialist Teacher Mode -->
        <template v-else>
          <select
            v-model="selectedTeacherId"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple cursor-pointer font-semibold min-w-[200px]"
          >
            <option :value="null">Seleccionar Docente...</option>
            <option v-for="t in teachersList" :key="t.id" :value="t.id">
              Prof. {{ t.first_name }} {{ t.last_name }} ({{ t.specialization || 'Docente' }})
            </option>
          </select>
        </template>
      </div>
    </div>

    <!-- Official Class Timetable Matrix -->
    <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[760px]">
          <!-- Day of the Week Columns -->
          <thead>
            <tr class="bg-slate-50/80 dark:bg-[#110926] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-white/10">
              <th class="p-3 w-36 text-center border-r border-slate-200 dark:border-white/10">Hora / Bloque</th>
              <th v-for="day in weekDays" :key="day.id" class="p-3 text-center border-r border-slate-200 dark:border-white/10 last:border-r-0">
                <span class="block text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm">{{ day.label }}</span>
                <span class="block text-[10px] text-slate-400 font-normal">Jornada Escolar</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-xs">
            <template v-for="(slot, sIndex) in activeTimeSlots" :key="sIndex">
              <!-- Special Break / Civic Row -->
              <tr v-if="slot.isBreak" class="bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-brand-gold border-y border-amber-200/50 dark:border-brand-gold/20">
                <td class="p-2.5 text-center font-mono font-bold text-[11px] border-r border-amber-200/50 dark:border-brand-gold/20">
                  {{ slot.start }} - {{ slot.end }}
                </td>
                <td colspan="5" class="p-2.5 text-center font-bold tracking-wider text-[11px]">
                  <span class="inline-flex items-center gap-2">
                    <span>{{ slot.icon }}</span>
                    <span>{{ slot.title }}</span>
                  </span>
                </td>
              </tr>

              <!-- Standard Academic Block Row (45 mins) -->
              <tr v-else class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                <!-- Time Block Header -->
                <td class="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50/40 dark:bg-[#110926]/40 border-r border-slate-200 dark:border-white/10">
                  <div class="text-xs text-slate-900 dark:text-white font-extrabold">{{ slot.start }} - {{ slot.end }}</div>
                  <div class="text-[10px] text-brand-purple dark:text-brand-secondary font-bold">Bloque {{ slot.blockNum }} (45m)</div>
                </td>

                <!-- Cells for each Day -->
                <td 
                  v-for="day in weekDays" 
                  :key="day.id"
                  class="p-2 border-r border-slate-200 dark:border-white/10 last:border-r-0 align-top relative group"
                >
                  <!-- Find Assigned Class in this Slot -->
                  <div v-if="getScheduleAt(day.id, slot.start)" class="h-full">
                    <div 
                      :class="getClassCardColor(getScheduleAt(day.id, slot.start).subject_name)"
                      class="p-2.5 rounded-xl border shadow-xs h-full flex flex-col justify-between transition-all group-hover:shadow-md"
                    >
                      <div>
                        <div class="flex items-start justify-between gap-1">
                          <p class="font-extrabold text-xs leading-snug line-clamp-2">
                            {{ getScheduleAt(day.id, slot.start).subject_name }}
                          </p>
                          <button
                            v-if="canManage"
                            @click="openDeleteConfirm(getScheduleAt(day.id, slot.start))"
                            type="button"
                            class="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-0.5 rounded transition-opacity print:hidden cursor-pointer"
                            title="Eliminar bloque"
                          >
                            ✕
                          </button>
                        </div>

                        <!-- Teacher or Section Info -->
                        <p class="text-[11px] font-medium opacity-90 mt-1 truncate">
                          {{ viewMode === 'section' ? getScheduleAt(day.id, slot.start).teacher_name : `${getScheduleAt(day.id, slot.start).grade} "${getScheduleAt(day.id, slot.start).section}"` }}
                        </p>
                      </div>

                      <!-- Footer with Classroom -->
                      <div class="mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-bold">
                        <span class="truncate">📍 {{ getScheduleAt(day.id, slot.start).classroom_name || 'Aula' }}</span>
                        <button
                          v-if="canManage"
                          @click="openEditModal(getScheduleAt(day.id, slot.start))"
                          type="button"
                          class="opacity-0 group-hover:opacity-100 text-brand-primary dark:text-brand-gold hover:underline print:hidden cursor-pointer"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Empty Slot Button for Managers -->
                  <div v-else-if="canManage" class="h-full min-h-[64px] flex items-center justify-center print:hidden">
                    <button
                      @click="openCreateModal(day.id, slot, $event)"
                      type="button"
                      class="opacity-0 group-hover:opacity-100 w-full h-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-brand-purple dark:hover:border-brand-gold text-slate-400 hover:text-brand-purple dark:hover:text-brand-gold text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>+ Asignar</span>
                    </button>
                  </div>

                  <!-- Empty slot on print/readonly -->
                  <div v-else class="h-full min-h-[40px] text-center text-slate-300 dark:text-slate-600 text-xs flex items-center justify-center">
                    —
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Official Footer for Print -->
    <div class="hidden print:flex justify-between items-end pt-12 text-center text-xs font-bold text-slate-800">
      <div class="w-64 border-t border-slate-900 pt-1">
        Coordinador(a) Docente<br>
        <span class="font-normal text-[10px]">Coordinación Académica</span>
      </div>
      <div class="w-40 border border-slate-300 p-3 rounded-lg text-[9px] text-slate-400 uppercase">
        Sello Oficial U.E Santa Luisa
      </div>
      <div class="w-64 border-t border-slate-900 pt-1">
        Dirección General<br>
        <span class="font-normal text-[10px]">U.E Colegio "Santa Luisa"</span>
      </div>
    </div>

    <!-- STANDARDIZED MODAL: ASIGNAR / EDITAR HORARIO (3 NUMBERED SECTIONS & INSTITUTIONAL HEADER) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen && canManage" 
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
                📅
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditing ? 'Editar Bloque de Horario' : 'Asignar Nuevo Bloque de Horario' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E Santa Luisa • {{ form.grade }} - Sección {{ form.section }}
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

          <!-- Modal Form Body -->
          <form @submit.prevent="submitSchedule" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
              
              <!-- Section 1: Nivel Académico y Bloque Horario -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
                  <span>1. Nivel Académico y Bloque Horario</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Grade & Section -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grado / Año Académico *
                    </label>
                    <select
                      v-model="form.grade"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option v-for="g in [...primariaGrades, ...mediaGrades]" :key="g" :value="g">{{ g }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sección *
                    </label>
                    <select
                      v-model="form.section"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option value="A">Sección A</option>
                      <option value="B">Sección B</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Day of the Week -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Día de la Semana *
                    </label>
                    <select
                      v-model="form.day_of_week"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option v-for="day in weekDays" :key="day.id" :value="day.id">{{ day.label }}</option>
                    </select>
                  </div>

                  <!-- Start Time -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bloque Horario (45 min) *
                    </label>
                    <select
                      v-model="form.start_time"
                      @change="updateEndTime"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono"
                    >
                      <option v-for="slot in activeAcademicSlots" :key="slot.start" :value="slot.start">
                        {{ slot.start }} - {{ slot.end }} (Bloque {{ slot.blockNum }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section 2: Asignatura y Cátedra Curricular -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-brand-secondary border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-secondary"></span>
                  <span>2. Asignatura y Cátedra Curricular</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Materia Curricular *
                  </label>
                  <select
                    v-model="form.subject_id"
                    :class="[
                      formErrors.subject_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                      'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium'
                    ]"
                  >
                    <option :value="null">Seleccionar Materia...</option>
                    <option v-for="sub in subjectsList" :key="sub.id" :value="sub.id">
                      {{ sub.name }} ({{ sub.code }})
                    </option>
                  </select>
                  <p v-if="formErrors.subject_id" class="text-rose-500 text-[11px] font-bold mt-1">
                    {{ formErrors.subject_id }}
                  </p>
                </div>
              </div>

              <!-- Section 3: Docente y Aula Asignada -->
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-gold border-b border-slate-100 dark:border-white/10 pb-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-purple dark:bg-brand-gold"></span>
                  <span>3. Docente y Aula Asignada</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Teacher -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Docente Responsable *
                    </label>
                    <select
                      v-model="form.teacher_id"
                      :class="[
                        formErrors.teacher_id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-white/10',
                        'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium'
                      ]"
                    >
                      <option :value="null">Seleccionar Docente...</option>
                      <option v-for="teacher in teachersList" :key="teacher.id" :value="teacher.id">
                        Prof. {{ teacher.first_name }} {{ teacher.last_name }} ({{ teacher.specialization || 'Docente' }})
                      </option>
                    </select>
                    <p v-if="formErrors.teacher_id" class="text-rose-500 text-[11px] font-bold mt-1">
                      {{ formErrors.teacher_id }}
                    </p>
                  </div>

                  <!-- Classroom -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Aula / Espacio Físico *
                    </label>
                    <select
                      v-model="form.classroom_id"
                      class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
                    >
                      <option v-for="room in classroomsList" :key="room.id" :value="room.id">
                        {{ room.name || room.id }} ({{ room.room_number || room.id }})
                      </option>
                    </select>
                  </div>
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
                  <span>{{ isEditing ? 'Actualizar Bloque' : 'Asignar Horario' }}</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- DELETE CONFIRMATION MODAL -->
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
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">¿Eliminar Bloque de Clase?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
            Se desasignará la clase de <strong class="text-slate-900 dark:text-white">{{ scheduleToDelete?.subject_name }}</strong> del horario semanal.
          </p>
          <div class="flex items-center justify-center gap-3 mt-6">
            <button 
              @click="isDeleteModalOpen = false" 
              class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              @click="confirmDeleteSchedule" 
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

// Strict Role Check
const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role || ''
  return role === 'admin' || role === 'control_estudio' || role === 'coordinator'
})

// View Modes: 'section' or 'specialist'
const viewMode = ref('section')
const educationLevel = ref('media') // 'primaria' or 'media'
const selectedGrade = ref('1er Año')
const selectedSection = ref('A')
const selectedTeacherId = ref(null)

const schedules = ref([])
const subjectsList = ref([])
const teachersList = ref([])
const classroomsList = ref([])
const isSubmitting = ref(false)

const isDeleteModalOpen = ref(false)
const scheduleToDelete = ref(null)

const primariaGrades = ['1° Primaria', '2° Primaria', '3° Primaria', '4° Primaria', '5° Primaria', '6° Primaria']
const mediaGrades = ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año']

const currentGradesList = computed(() => {
  return educationLevel.value === 'primaria' ? primariaGrades : mediaGrades
})

const weekDays = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' }
]

// Official Santa Luisa Schedules from docs/horarios-alumnos-2025-2026.doc
const primariaTimeSlots = [
  { start: '07:00', end: '07:10', isBreak: true, title: 'Acto Espiritual y Cívico (Oración e Himnos)', icon: '🇻🇪' },
  { start: '07:10', end: '07:55', isBreak: false, blockNum: 1 },
  { start: '07:55', end: '08:40', isBreak: false, blockNum: 2 },
  { start: '08:40', end: '08:55', isBreak: true, title: 'D E S A Y U N O', icon: '🍎' },
  { start: '08:55', end: '09:40', isBreak: false, blockNum: 3 },
  { start: '09:40', end: '10:25', isBreak: false, blockNum: 4 },
  { start: '10:25', end: '10:40', isBreak: true, title: 'R E C E S O', icon: '⚽' },
  { start: '10:40', end: '11:25', isBreak: false, blockNum: 5 },
  { start: '11:25', end: '12:10', isBreak: false, blockNum: 6 }
]

const mediaTimeSlots = [
  { start: '07:00', end: '07:45', isBreak: false, blockNum: 1 },
  { start: '07:45', end: '08:30', isBreak: false, blockNum: 2 },
  { start: '08:30', end: '08:45', isBreak: true, title: 'D E S A Y U N O', icon: '🍎' },
  { start: '08:45', end: '09:30', isBreak: false, blockNum: 3 },
  { start: '09:30', end: '10:15', isBreak: false, blockNum: 4 },
  { start: '10:15', end: '11:00', isBreak: false, blockNum: 5 },
  { start: '11:00', end: '11:10', isBreak: true, title: 'R E C E S O', icon: '⚽' },
  { start: '11:10', end: '11:55', isBreak: false, blockNum: 6 },
  { start: '11:55', end: '12:40', isBreak: false, blockNum: 7 },
  { start: '12:40', end: '13:25', isBreak: false, blockNum: 8 },
  { start: '13:25', end: '14:10', isBreak: true, title: 'Almuerzo / Horario Administrativo', icon: '🥪' },
  { start: '15:00', end: '15:45', isBreak: false, blockNum: 9 },
  { start: '15:45', end: '16:30', isBreak: false, blockNum: 10 },
  { start: '16:30', end: '17:15', isBreak: false, blockNum: 11 },
  { start: '17:15', end: '18:00', isBreak: false, blockNum: 12 }
]

const activeTimeSlots = computed(() => {
  if (viewMode.value === 'specialist') {
    return mediaTimeSlots
  }
  return educationLevel.value === 'primaria' ? primariaTimeSlots : mediaTimeSlots
})

const activeAcademicSlots = computed(() => {
  return activeTimeSlots.value.filter(s => !s.isBreak)
})

// Modal Form State
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null,
  subject_id: null,
  teacher_id: null,
  classroom_id: 'AULA-101',
  day_of_week: 'monday',
  start_time: '07:00',
  end_time: '07:45',
  grade: '1er Año',
  section: 'A'
})

const formErrors = ref({})

const validateForm = () => {
  const errors = {}
  if (!form.value.subject_id) errors.subject_id = 'La materia es obligatoria'
  if (!form.value.teacher_id) errors.teacher_id = 'El docente es obligatorio'
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleLevelChange = () => {
  selectedGrade.value = educationLevel.value === 'primaria' ? '1° Primaria' : '1er Año'
}

// Filtered Schedules based on View Mode
const filteredSchedules = computed(() => {
  if (viewMode.value === 'section') {
    return schedules.value.filter(s => s.grade === selectedGrade.value && s.section === selectedSection.value)
  } else {
    if (!selectedTeacherId.value) return []
    return schedules.value.filter(s => s.teacher_id === selectedTeacherId.value)
  }
})

const uniqueSubjectsCount = computed(() => {
  const set = new Set(filteredSchedules.value.map(s => s.subject_name))
  return set.size
})

const uniqueTeachersCount = computed(() => {
  const set = new Set(filteredSchedules.value.map(s => s.teacher_name))
  return set.size
})

const totalAcademicHours = computed(() => {
  return filteredSchedules.value.length
})

const selectedTeacherName = computed(() => {
  const t = teachersList.value.find(tch => tch.id === selectedTeacherId.value)
  return t ? `Prof. ${t.first_name} ${t.last_name}` : 'Docente Especialista'
})

const getScheduleAt = (dayId, startTime) => {
  return filteredSchedules.value.find(s => s.day_of_week === dayId && s.start_time === startTime)
}

const getClassCardColor = (subjectName) => {
  const sub = (subjectName || '').toLowerCase()
  if (sub.includes('matemática') || sub.includes('física') || sub.includes('química')) {
    return 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/60'
  }
  if (sub.includes('castellano') || sub.includes('inglés') || sub.includes('literatura')) {
    return 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900/60'
  }
  if (sub.includes('biología') || sub.includes('naturales') || sub.includes('ciencias')) {
    return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60'
  }
  if (sub.includes('educación física') || sub.includes('deporte')) {
    return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
  }
  if (sub.includes('fe') || sub.includes('religión') || sub.includes('valores')) {
    return 'bg-brand-primary/10 dark:bg-brand-purple/25 text-brand-primary dark:text-brand-gold border-brand-primary/20 dark:border-brand-purple/40'
  }
  return 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10'
}

const openCreateModal = (dayId, slot) => {
  if (!canManage.value) return
  isEditing.value = false
  formErrors.value = {}

  const slotObj = slot || activeAcademicSlots.value[0] || { start: '07:00', end: '07:45' }

  form.value = {
    id: null,
    subject_id: subjectsList.value[0]?.id || null,
    teacher_id: selectedTeacherId.value || teachersList.value[0]?.id || null,
    classroom_id: classroomsList.value[0]?.id || 'AULA-101',
    day_of_week: dayId || 'monday',
    start_time: slotObj.start,
    end_time: slotObj.end,
    grade: selectedGrade.value,
    section: selectedSection.value
  }
  isModalOpen.value = true
}

const openEditModal = (schedule) => {
  if (!canManage.value || !schedule) return
  isEditing.value = true
  formErrors.value = {}
  form.value = {
    id: schedule.id,
    subject_id: schedule.subject_id,
    teacher_id: schedule.teacher_id,
    classroom_id: schedule.classroom_id,
    day_of_week: schedule.day_of_week,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    grade: schedule.grade,
    section: schedule.section
  }
  isModalOpen.value = true
}

const updateEndTime = () => {
  const slot = activeAcademicSlots.value.find(s => s.start === form.value.start_time)
  if (slot) {
    form.value.end_time = slot.end
  }
}

const closeModal = () => {
  isModalOpen.value = false
  formErrors.value = {}
}

const submitSchedule = async () => {
  if (!canManage.value) return
  if (!validateForm()) {
    toast.warning('Por favor completa todos los campos requeridos (*)')
    return
  }

  isSubmitting.value = true
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    if (isEditing.value && form.value.id) {
      await api.service('schedules').patch(form.value.id, form.value)
      toast.success('Bloque de horario actualizado con éxito')
    } else {
      await api.service('schedules').create({
        ...form.value,
        academic_year: '2025-2026',
        semester: '1er Lapso'
      })
      toast.success('Bloque asignado exitosamente')
    }
    closeModal()
    await fetchSchedules()
  } catch (err) {
    console.error('Error saving schedule:', err)
    toast.error('Error al guardar el bloque de clase')
  } finally {
    isSubmitting.value = false
  }
}

const openDeleteConfirm = (schedule) => {
  if (!canManage.value || !schedule) return
  scheduleToDelete.value = schedule
  isDeleteModalOpen.value = true
}

const confirmDeleteSchedule = async () => {
  if (!scheduleToDelete.value) return
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    await api.service('schedules').remove(scheduleToDelete.value.id)
    toast.warning('Bloque de horario eliminado')
    isDeleteModalOpen.value = false
    scheduleToDelete.value = null
    await fetchSchedules()
  } catch (err) {
    console.error('Error deleting schedule:', err)
    toast.error('Error al eliminar el bloque')
  }
}

const windowPrint = () => {
  window.print()
}

// Fetch Auxiliary Data & Schedules
const fetchAuxiliaryData = async () => {
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    const [subRes, tchRes, clsRes] = await Promise.all([
      api.service('subjects').find({ query: { $limit: 100 } }).catch(() => ({ data: [] })),
      api.service('teachers').find({ query: { $limit: 100 } }).catch(() => ({ data: [] })),
      api.service('classrooms').find({ query: { $limit: 100 } }).catch(() => ({ data: [] }))
    ])

    subjectsList.value = subRes.data || subRes || []
    teachersList.value = tchRes.data || tchRes || []
    classroomsList.value = clsRes.data || clsRes || []
  } catch (err) {
    console.error('Error loading auxiliary data:', err)
  }
}

const fetchSchedules = async () => {
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    const res = await api.service('schedules').find({ query: { $limit: 200 } })
    schedules.value = res.data || res || []
  } catch (err) {
    console.error('Error loading schedules:', err)
  }
}

onMounted(async () => {
  await fetchAuxiliaryData()
  await fetchSchedules()
})
</script>
