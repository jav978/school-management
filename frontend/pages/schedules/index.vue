<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
          Horarios Escolares
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Planificación semanal de bloques académicos, asignación de aulas y docentes
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="canManage"
          @click="openCreateModal(null, null, $event)" 
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Bloque</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Bloques Asignados -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bloques Semanales</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ schedules.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Materias Programadas -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Materias Activas</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ uniqueSubjectsCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <!-- Docentes Programados -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Docentes en Aula</p>
          <p class="text-3xl font-black font-display text-amber-500 mt-1 leading-tight tracking-tight">{{ uniqueTeachersCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Horas Lectivas Semanales -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[104px] transition-all hover:shadow-sm">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Carga Semanal</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-slate-850 dark:text-white leading-tight tracking-tight">{{ totalHours }}</p>
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">horas</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-orange-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter & Classroom Bar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <!-- Grade Selector -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Grado / Nivel
          </label>
          <div class="relative">
            <select
              v-model="selectedGrade"
              @change="fetchSchedules"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none pr-9 cursor-pointer transition-all"
            >
              <option v-for="grade in gradesList" :key="grade" :value="grade">{{ grade }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Section Selector -->
        <div class="w-full sm:w-40">
          <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Sección
          </label>
          <div class="relative">
            <select
              v-model="selectedSection"
              @change="fetchSchedules"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none pr-9 cursor-pointer transition-all"
            >
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
              <option value="C">Sección C</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Current selection badge -->
      <div class="self-end sm:self-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80 text-orange-700 dark:text-orange-300 text-xs font-bold">
          <span class="w-2 h-2 rounded-full bg-orange-500"></span>
          {{ selectedGrade }} - Sec. {{ selectedSection }}
        </span>
      </div>
    </div>

    <!-- Weekly Matrix Timetable Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 mb-3 animate-spin">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando horario escolar...</p>
      </div>

      <!-- Timetable Grid -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th class="py-3.5 px-4 w-32 border-r border-slate-100 dark:border-slate-800/80 text-center">
                Bloque
              </th>
              <th 
                v-for="day in weekDays" 
                :key="day.id"
                class="py-3.5 px-4 text-center border-r last:border-r-0 border-slate-100 dark:border-slate-800/80"
              >
                {{ day.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr v-for="slot in timeSlots" :key="slot.start" class="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
              <!-- Time Column -->
              <td class="py-3.5 px-4 text-center border-r border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/10">
                <p class="text-xs font-bold text-slate-850 dark:text-white">{{ slot.start }}</p>
                <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500">{{ slot.end }}</p>
              </td>

              <!-- Days Columns -->
              <td 
                v-for="day in weekDays" 
                :key="day.id"
                class="p-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 align-top w-1/5 h-28"
              >
                <!-- Scheduled Class Card -->
                <div 
                  v-if="getSchedule(day.id, slot.start)"
                  class="group h-full p-2.5 rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between cursor-pointer"
                  :style="{ 
                    borderColor: `${getSchedule(day.id, slot.start).subject_color || '#F97316'}40`,
                    backgroundColor: `${getSchedule(day.id, slot.start).subject_color || '#F97316'}10` 
                  }"
                  @click="openEditModal(getSchedule(day.id, slot.start), $event)"
                >
                  <div>
                    <div class="flex items-center justify-between gap-1">
                      <span 
                        class="text-xs font-bold truncate text-slate-850 dark:text-white"
                        :style="{ color: getSchedule(day.id, slot.start).subject_color || '#F97316' }"
                      >
                        {{ getSchedule(day.id, slot.start).subject_name }}
                      </span>
                      <button
                        @click.stop="promptDeleteSchedule(getSchedule(day.id, slot.start), $event)"
                        type="button"
                        class="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all"
                        title="Eliminar bloque"
                      >
                        ✕
                      </button>
                    </div>

                    <!-- Teacher Name -->
                    <p class="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1 truncate">
                      {{ getSchedule(day.id, slot.start).teacher_first_name }} {{ getSchedule(day.id, slot.start).teacher_last_name }}
                    </p>
                  </div>

                  <!-- Room and time indicator -->
                  <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                      {{ getSchedule(day.id, slot.start).classroom_name || getSchedule(day.id, slot.start).classroom_id }}
                    </span>
                    <span class="text-[9px] font-mono text-slate-400">
                      {{ slot.start }}-{{ slot.end }}
                    </span>
                  </div>
                </div>

                <!-- Empty Slot Hover Quick Add -->
                <div 
                  v-else
                  @click="openCreateModal(day.id, slot.start, $event)"
                  class="h-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-2 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/20 dark:hover:bg-orange-950/10 cursor-pointer transition-all group"
                  title="Clic para asignar materia a este bloque"
                >
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="text-[11px] font-bold">Asignar</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Standardized Modal: Asignar / Editar Horario -->
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                  {{ isEditing ? 'Editar Asignación de Horario' : 'Asignar Bloque de Horario' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ selectedGrade }} - Sección {{ selectedSection }}
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
          <form @submit.prevent="submitSchedule" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Subject Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Materia Curricular *
              </label>
              <select
                v-model="form.subject_id"
                required
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option v-for="t in teachersList" :key="t.id" :value="t.id">
                  {{ t.first_name }} {{ t.last_name }} ({{ t.department || 'Docente' }})
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
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option v-for="c in classroomsList" :key="c.id" :value="c.id">
                  {{ c.name }} (Capacidad: {{ c.capacity }})
                </option>
              </select>
            </div>

            <!-- Day of week & Times -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Día *
                </label>
                <select
                  v-model="form.day_of_week"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option v-for="d in weekDays" :key="d.id" :value="d.id">{{ d.label }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Hora Inicio *
                </label>
                <input
                  v-model="form.start_time"
                  type="time"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Hora Fin *
                </label>
                <input
                  v-model="form.end_time"
                  type="time"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
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
              @click="submitSchedule"
              :disabled="isSubmitting"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Horario' : 'Guardar Horario') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Eliminar Bloque de Horario -->
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
              ¿Eliminar este bloque de horario?
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Se desvinculará la clase de <strong class="text-slate-700 dark:text-slate-200">{{ scheduleToDelete?.subject_name }}</strong> asignada a las {{ scheduleToDelete?.start_time }}.
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
              @click="confirmDeleteSchedule"
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
const schedules = ref([])
const subjectsList = ref([])
const teachersList = ref([])
const classroomsList = ref([])
const selectedGrade = ref('1° Primaria')
const selectedSection = ref('A')
const isLoading = ref(false)
const isSubmitting = ref(false)
const toastMessage = ref('')

const gradesList = ['1° Primaria', '2° Primaria', '3° Primaria', '1° Secundaria', '2° Secundaria']

const weekDays = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' }
]

const timeSlots = [
  { start: '08:00', end: '09:30' },
  { start: '09:45', end: '11:15' },
  { start: '11:30', end: '13:00' },
  { start: '13:30', end: '15:00' }
]

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const scheduleToDelete = ref(null)

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  id: null,
  subject_id: null,
  teacher_id: null,
  classroom_id: 'AULA-101',
  day_of_week: 'monday',
  start_time: '08:00',
  end_time: '09:30',
  grade: '1° Primaria',
  section: 'A'
})

// KPI Computations
const uniqueSubjectsCount = computed(() => {
  const set = new Set(schedules.value.map(s => s.subject_id))
  return set.size
})

const uniqueTeachersCount = computed(() => {
  const set = new Set(schedules.value.map(s => s.teacher_id))
  return set.size
})

const totalHours = computed(() => {
  // Each block is 1.5 hours
  return (schedules.value.length * 1.5).toFixed(1)
})

const getSchedule = (dayId, startTime) => {
  return schedules.value.find(s => s.day_of_week === dayId && s.start_time === startTime)
}

// Modal handlers
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

const openCreateModal = (dayId, startTime, event) => {
  captureTriggerOrigin(event)
  isEditing.value = false
  form.value = {
    id: null,
    subject_id: subjectsList.value[0]?.id || null,
    teacher_id: teachersList.value[0]?.id || null,
    classroom_id: classroomsList.value[0]?.id || 'AULA-101',
    day_of_week: dayId || 'monday',
    start_time: startTime || '08:00',
    end_time: startTime === '08:00' ? '09:30' : (startTime === '09:45' ? '11:15' : '13:00'),
    grade: selectedGrade.value,
    section: selectedSection.value
  }
  isModalOpen.value = true
}

const openEditModal = (schedule, event) => {
  captureTriggerOrigin(event)
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

const closeModal = () => {
  isModalOpen.value = false
}

// Submit Schedule
const submitSchedule = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await nuxtApp.$api.service('schedules').patch(form.value.id, form.value)
      showToast('Horario actualizado exitosamente')
    } else {
      await nuxtApp.$api.service('schedules').create(form.value)
      showToast('Horario registrado exitosamente')
    }
    await fetchSchedules()
    closeModal()
  } catch (error) {
    console.error('Error saving schedule:', error)
    showToast(error.message || 'Error al guardar el horario')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Schedule
const promptDeleteSchedule = (schedule, event) => {
  captureTriggerOrigin(event)
  scheduleToDelete.value = schedule
  isDeleteModalOpen.value = true
}

const confirmDeleteSchedule = async () => {
  if (!scheduleToDelete.value) return
  try {
    await nuxtApp.$api.service('schedules').remove(scheduleToDelete.value.id)
    showToast('Bloque de horario eliminado')
    await fetchSchedules()
  } catch (error) {
    console.error('Error deleting schedule:', error)
    showToast(error.message || 'Error al eliminar el bloque')
  } finally {
    isDeleteModalOpen.value = false
    scheduleToDelete.value = null
  }
}

// Fetch Schedules from DB
const fetchSchedules = async () => {
  isLoading.value = true
  try {
    const res = await nuxtApp.$api.service('schedules').find({
      query: {
        grade: selectedGrade.value,
        section: selectedSection.value,
        $limit: 100
      }
    })
    schedules.value = res.data || res || []
  } catch (error) {
    console.error('Error fetching schedules:', error)
  } finally {
    isLoading.value = false
  }
}

// Fetch Auxiliaries
const fetchAuxiliaryData = async () => {
  try {
    const [subRes, tRes, cRes] = await Promise.all([
      nuxtApp.$api.service('subjects').find({ query: { is_deleted: false, $limit: 50 } }),
      nuxtApp.$api.service('teachers').find({ query: { is_deleted: false, $limit: 50 } }),
      nuxtApp.$api.service('classrooms').find({ query: { $limit: 50 } })
    ])
    subjectsList.value = subRes.data || subRes || []
    teachersList.value = tRes.data || tRes || []
    classroomsList.value = cRes.data || cRes || []
  } catch (e) {
    console.error('Error fetching auxiliary data:', e)
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

onMounted(async () => {
  await fetchAuxiliaryData()
  await fetchSchedules()
})
</script>
