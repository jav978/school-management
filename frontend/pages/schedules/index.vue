<template>
  <div class="space-y-6">
    
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
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Jornada pedagógica de 7:00 am a 3:00 pm en bloques de 45 minutos (Primaria y Educación Media)
        </p>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center gap-2.5">
        <button
          @click="windowPrint"
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xs transition-all"
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
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-purple hover:brightness-110 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-primary/20 active:scale-[0.98] transition-all duration-200"
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
      <div class="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Bloques Semanales</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ filteredSchedules.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary dark:text-brand-secondary flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Materias Programadas -->
      <div class="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Materias Activas</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ uniqueSubjectsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <!-- Docentes Programados -->
      <div class="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Docentes Asignados</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-brand-gold mt-1 leading-tight tracking-tight">{{ uniqueTeachersCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-gold/15 text-amber-600 dark:text-brand-gold flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Horas Pedagógicas Semanales -->
      <div class="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Carga Semanal</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-brand-purple dark:text-white leading-tight tracking-tight">{{ totalAcademicHours }}</p>
            <span class="text-xs font-semibold text-slate-400">horas (45m)</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple dark:text-brand-secondary flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- View Mode Switcher & Filter Controls (print:hidden) -->
    <div class="glass-card rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
      <!-- Tabs Switcher: Por Sección vs. Por Profesor Especialista -->
      <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
        <button
          @click="viewMode = 'section'"
          :class="viewMode === 'section' ? 'bg-brand-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
        >
          <span>🏫 Por Grado / Sección</span>
        </button>
        <button
          @click="viewMode = 'specialist'"
          :class="viewMode === 'specialist' ? 'bg-brand-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
        >
          <span>👨‍🏫 Por Profesor Especialista</span>
        </button>
      </div>

      <!-- Filters when viewMode === 'section' -->
      <div v-if="viewMode === 'section'" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end">
        <!-- Education Level Filter Switch -->
        <div class="min-w-[140px]">
          <select
            v-model="educationLevel"
            @change="handleLevelChange"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="primaria">Primaria (Mañana)</option>
            <option value="media">Media / Bachillerato</option>
          </select>
        </div>

        <!-- Grade Selector -->
        <div class="min-w-[170px]">
          <select
            v-model="selectedGrade"
            @change="fetchSchedules"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option v-for="grade in currentGradesList" :key="grade" :value="grade">{{ grade }}</option>
          </select>
        </div>

        <!-- Section Selector -->
        <div class="w-28">
          <select
            v-model="selectedSection"
            @change="fetchSchedules"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="A">Sección A</option>
            <option value="B">Sección B</option>
          </select>
        </div>
      </div>

      <!-- Filter when viewMode === 'specialist' -->
      <div v-else class="flex items-center gap-3 flex-1 justify-end">
        <label class="text-xs font-bold text-slate-500">Docente:</label>
        <select
          v-model="selectedTeacherId"
          @change="fetchSchedules"
          class="w-full sm:w-80 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option v-for="t in teachersList" :key="t.id" :value="t.id">
            Prof. {{ t.first_name }} {{ t.last_name }} — {{ t.specialization || 'Docente' }}
          </option>
        </select>
      </div>
    </div>

    <!-- Timetable Card Table -->
    <div class="glass-card rounded-2xl shadow-xs overflow-hidden print:border-none print:shadow-none">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary mb-3 animate-spin">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando horario escolar oficial...</p>
      </div>

      <!-- Timetable Grid -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[840px] print:min-w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-brand-primary/5 dark:bg-brand-dark/40 text-[11px] font-black text-brand-primary dark:text-slate-300 uppercase tracking-wider">
              <th class="py-3 px-4 w-36 border-r border-slate-200 dark:border-slate-800 text-center">
                Hora
              </th>
              <th 
                v-for="day in weekDays" 
                :key="day.id"
                class="py-3 px-4 text-center border-r last:border-r-0 border-slate-200 dark:border-slate-800"
              >
                {{ day.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
            <!-- Render rows dynamically based on official slots -->
            <template v-for="slot in activeTimeSlots" :key="slot.start">
              
              <!-- Case A: Receso / Desayuno / Acto Cívico Banner -->
              <tr v-if="slot.isBreak" class="bg-amber-50/80 dark:bg-amber-950/30 border-y border-amber-200/60 dark:border-amber-900/40 text-center">
                <td class="py-2.5 px-4 font-mono text-[11px] font-bold text-amber-800 dark:text-amber-300 border-r border-amber-200/60 dark:border-amber-900/40">
                  {{ slot.start }} - {{ slot.end }}
                </td>
                <td colspan="5" class="py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-brand-gold">
                  <span class="inline-flex items-center gap-2">
                    <span>{{ slot.icon }}</span>
                    <span>{{ slot.title }}</span>
                  </span>
                </td>
              </tr>

              <!-- Case B: Academic Slot (45 min) -->
              <tr v-else class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <!-- Time Column -->
                <td class="py-3 px-3 text-center border-r border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 w-36">
                  <p class="text-xs font-extrabold text-slate-800 dark:text-white">{{ slot.start }} a {{ slot.end }}</p>
                  <span class="text-[10px] font-semibold text-slate-400 uppercase">Bloque {{ slot.blockNum }}</span>
                </td>

                <!-- Days Columns -->
                <td 
                  v-for="day in weekDays" 
                  :key="day.id"
                  class="p-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800 align-top w-1/5 min-h-[90px]"
                >
                  <!-- Scheduled Class Card -->
                  <div 
                    v-if="getSchedule(day.id, slot.start)"
                    class="group p-2.5 rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between"
                    :class="canManage ? 'cursor-pointer hover:scale-[1.01]' : ''"
                    :style="{ 
                      borderColor: `${getSchedule(day.id, slot.start).subject_color || '#281470'}40`,
                      backgroundColor: `${getSchedule(day.id, slot.start).subject_color || '#281470'}12` 
                    }"
                    @click="canManage ? openEditModal(getSchedule(day.id, slot.start), $event) : null"
                  >
                    <div>
                      <div class="flex items-center justify-between gap-1">
                        <span 
                          class="text-xs font-black truncate"
                          :style="{ color: getSchedule(day.id, slot.start).subject_color || '#281470' }"
                        >
                          {{ getSchedule(day.id, slot.start).subject_name }}
                        </span>
                        <button
                          v-if="canManage"
                          @click.stop="promptDeleteSchedule(getSchedule(day.id, slot.start), $event)"
                          type="button"
                          class="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all print:hidden"
                          title="Eliminar bloque"
                        >
                          ✕
                        </button>
                      </div>

                      <!-- Teacher Name or Grade Info depending on viewMode -->
                      <p v-if="viewMode === 'section'" class="text-[11px] text-slate-700 dark:text-slate-300 font-semibold mt-1 truncate">
                        Prof. {{ getSchedule(day.id, slot.start).teacher_first_name }} {{ getSchedule(day.id, slot.start).teacher_last_name }}
                      </p>
                      <p v-else class="text-[11px] text-brand-purple dark:text-brand-gold font-bold mt-1 truncate">
                        {{ getSchedule(day.id, slot.start).grade }} - Sec {{ getSchedule(day.id, slot.start).section }}
                      </p>
                    </div>

                    <!-- Room and time indicator -->
                    <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px]">
                      <span class="font-bold text-slate-500 dark:text-slate-400 truncate">
                        📍 {{ getSchedule(day.id, slot.start).classroom_name || getSchedule(day.id, slot.start).classroom_id }}
                      </span>
                      <span class="font-mono text-slate-400 text-[9px]">
                        {{ slot.start }}-{{ slot.end }}
                      </span>
                    </div>
                  </div>

                  <!-- Empty Slot: Only clickable if canManage -->
                  <div 
                    v-else-if="canManage"
                    @click="openCreateModal(day.id, slot.start, $event)"
                    class="h-full min-h-[70px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-2 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:border-brand-primary/50 hover:text-brand-primary cursor-pointer transition-all group print:hidden"
                    title="Clic para asignar materia a este bloque"
                  >
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold">
                      <span>+ Asignar</span>
                    </div>
                  </div>

                  <!-- Empty Slot for Read-Only Users -->
                  <div v-else class="h-full min-h-[70px] flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs">
                    -
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Official Signatures Block on Print -->
    <div class="hidden print:flex justify-between items-end pt-12 mt-8 text-center text-xs font-bold text-slate-800">
      <div class="w-64 border-t border-slate-900 pt-1">
        Prof. José Vásquez Madrid<br>
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

    <!-- Standardized Modal: Asignar / Editar Horario (Solo visible para Admin / Control de Estudio) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen && canManage" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                🗓
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                  {{ isEditing ? 'Editar Asignación de Horario' : 'Asignar Bloque Académico (45 min)' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ form.grade }} - Sección {{ form.section }}
                </p>
              </div>
            </div>
            <button 
              @click="closeModal" 
              type="button" 
              class="text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          </div>

          <!-- Modal Form -->
          <form @submit.prevent="submitSchedule" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Subject Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Materia Curricular *
              </label>
              <select
                v-model="form.subject_id"
                required
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                <option v-for="sub in subjectsList" :key="sub.id" :value="sub.id">
                  {{ sub.name }} ({{ sub.code }})
                </option>
              </select>
            </div>

            <!-- Teacher Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Docente Responsable *
              </label>
              <select
                v-model="form.teacher_id"
                required
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                <option v-for="teacher in teachersList" :key="teacher.id" :value="teacher.id">
                  Prof. {{ teacher.first_name }} {{ teacher.last_name }} ({{ teacher.specialization || 'Docente' }})
                </option>
              </select>
            </div>

            <!-- Classroom Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Aula / Espacio Físico *
              </label>
              <select
                v-model="form.classroom_id"
                required
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                <option v-for="room in classroomsList" :key="room.id" :value="room.id">
                  {{ room.name || room.id }} ({{ room.room_number || room.id }})
                </option>
              </select>
            </div>

            <!-- Day & Time -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Día de la Semana
                </label>
                <select
                  v-model="form.day_of_week"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option v-for="day in weekDays" :key="day.id" :value="day.id">{{ day.label }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Hora Inicio (Bloque)
                </label>
                <select
                  v-model="form.start_time"
                  @change="updateEndTime"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option v-for="slot in activeAcademicSlots" :key="slot.start" :value="slot.start">
                    {{ slot.start }} (Bloque {{ slot.blockNum }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2 bg-brand-primary hover:bg-brand-purple text-white text-xs font-bold rounded-xl shadow-md"
              >
                {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Bloque' : 'Asignar Horario') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Floating Feedback Toast -->
    <Teleport to="body">
      <div 
        v-if="toastMessage" 
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 text-xs sm:text-sm font-bold"
      >
        <span class="w-2 h-2 rounded-full bg-brand-gold"></span>
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

// Strict Role Check: ONLY Admin, Control de Estudio or Coordinator can modify
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
const isLoading = ref(false)
const isSubmitting = ref(false)
const toastMessage = ref('')

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

const handleLevelChange = () => {
  selectedGrade.value = educationLevel.value === 'primaria' ? '1° Primaria' : '1er Año'
  fetchSchedules()
}

const selectedTeacherName = computed(() => {
  const t = teachersList.value.find(item => item.id === selectedTeacherId.value)
  return t ? `Prof. ${t.first_name} ${t.last_name}` : 'Docente Especialista'
})

const filteredSchedules = computed(() => {
  if (viewMode.value === 'specialist') {
    if (!selectedTeacherId.value) return []
    return schedules.value.filter(s => s.teacher_id === selectedTeacherId.value)
  }
  return schedules.value.filter(s => s.grade === selectedGrade.value && s.section === selectedSection.value)
})

const getSchedule = (dayId, startTime) => {
  return filteredSchedules.value.find(s => s.day_of_week === dayId && s.start_time === startTime)
}

const uniqueSubjectsCount = computed(() => {
  return new Set(filteredSchedules.value.map(s => s.subject_id)).size
})

const uniqueTeachersCount = computed(() => {
  return new Set(filteredSchedules.value.map(s => s.teacher_id)).size
})

const totalAcademicHours = computed(() => {
  return filteredSchedules.value.length
})

const fetchSchedules = async () => {
  isLoading.value = true
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    const res = await api.service('schedules').find({
      query: {
        $limit: 250
      }
    })
    schedules.value = res.data || []
  } catch (err) {
    console.error('Error fetching schedules:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchAuxiliaryData = async () => {
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    const [subRes, teachRes, roomRes] = await Promise.all([
      api.service('subjects').find({ query: { $limit: 100 } }),
      api.service('teachers').find({ query: { $limit: 100 } }),
      api.service('classrooms').find({ query: { $limit: 100 } })
    ])
    subjectsList.value = subRes.data || []
    teachersList.value = teachRes.data || []
    classroomsList.value = roomRes.data || []

    // Default specialist selection to Prof. José Vásquez if available
    const vasquez = teachersList.value.find(t => (t.last_name || '').toLowerCase().includes('vasquez') || (t.last_name || '').toLowerCase().includes('vásquez'))
    if (vasquez) {
      selectedTeacherId.value = vasquez.id
    } else if (teachersList.value.length > 0) {
      selectedTeacherId.value = teachersList.value[0].id
    }
  } catch (err) {
    console.error('Error fetching auxiliary data:', err)
  }
}

const openCreateModal = (dayId, startTime) => {
  if (!canManage.value) return
  isEditing.value = false
  const defaultSlot = activeAcademicSlots.value[0] || { start: '07:00', end: '07:45' }
  const slotObj = activeAcademicSlots.value.find(s => s.start === startTime) || defaultSlot

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
}

const submitSchedule = async () => {
  if (!canManage.value) return
  isSubmitting.value = true
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    if (isEditing.value && form.value.id) {
      await api.service('schedules').patch(form.value.id, form.value)
      showToast('Bloque actualizado con éxito')
    } else {
      await api.service('schedules').create({
        ...form.value,
        academic_year: '2025-2026',
        semester: '1er Lapso'
      })
      showToast('Bloque asignado con éxito')
    }
    closeModal()
    await fetchSchedules()
  } catch (err) {
    console.error('Error saving schedule:', err)
    showToast('Error al guardar el bloque')
  } finally {
    isSubmitting.value = false
  }
}

const promptDeleteSchedule = async (schedule) => {
  if (!canManage.value || !schedule) return
  if (!confirm(`¿Eliminar la clase de ${schedule.subject_name}?`)) return
  try {
    const api = nuxtApp.$api || useNuxtApp().$api
    await api.service('schedules').remove(schedule.id)
    showToast('Bloque eliminado')
    await fetchSchedules()
  } catch (err) {
    console.error('Error deleting schedule:', err)
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const windowPrint = () => {
  window.print()
}

onMounted(async () => {
  await fetchAuxiliaryData()
  await fetchSchedules()
})
</script>
