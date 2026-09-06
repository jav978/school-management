<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 border border-rose-200/60 dark:border-rose-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Exámenes y Constructor de Preguntas
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Programación de evaluaciones, banco de preguntas y generación de pruebas imprimibles
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openExamModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Examen</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Exámenes -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Exámenes</p>
          <p class="text-3xl font-black font-display text-brand-primary dark:text-white mt-1 leading-tight tracking-tight">{{ exams.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <!-- Programados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Programados</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-blue-600 dark:text-blue-400 leading-tight tracking-tight">{{ stats.programados }}</p>
            <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded-md">
              Activos
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Preguntas en Banco -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preguntas en Banco</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 leading-tight tracking-tight">{{ questions.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Escala Máxima -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escala Máxima</p>
          <div class="flex items-baseline gap-1 mt-1">
            <p class="text-3xl font-black font-display text-amber-600 dark:text-amber-400 leading-tight tracking-tight">20</p>
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">pts</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Exams List & Question Builder Container -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: Exams Selection (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Evaluaciones Disponibles
            </h2>
            <span class="text-xs text-slate-400">{{ exams.length }} exámenes</span>
          </div>

          <div v-if="loadingExams" class="py-8 text-center">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-rose-500 border-t-transparent"></div>
          </div>

          <div v-else class="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            <div 
              v-for="exam in exams" 
              :key="exam.id"
              @click="selectExam(exam)"
              :class="[
                selectedExam?.id === exam.id 
                  ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              ]"
              class="p-4 rounded-xl border transition-all cursor-pointer text-left"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {{ exam.subject_name || 'Materia' }}
                  </span>
                  <h3 class="text-sm font-bold text-slate-850 dark:text-white mt-1 leading-snug">
                    {{ exam.title }}
                  </h3>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  {{ exam.status || 'programado' }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span>📅 {{ formatDate(exam.exam_date) }}</span>
                <span>⏱️ {{ exam.duration_minutes || 90 }} min</span>
                <span class="font-bold text-rose-500">Total: {{ exam.total_marks || 20 }} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Question Builder & Actions (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <div v-if="!selectedExam" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center">
          <p class="text-4xl mb-2">👈</p>
          <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">Selecciona un examen</h3>
          <p class="text-xs text-slate-400 mt-1">Elige un examen de la lista izquierda para gestionar sus preguntas o imprimirlo.</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Selected Exam Header & Action Toolbar -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-rose-500 uppercase tracking-wider">
                  {{ selectedExam.subject_name }}
                </span>
                <span>•</span>
                <span class="text-xs text-slate-400">{{ selectedExam.class_name || '1er Año A' }}</span>
              </div>
              <h2 class="text-lg font-bold text-slate-850 dark:text-white leading-snug">
                {{ selectedExam.title }}
              </h2>
            </div>

            <!-- Print & Question Action Buttons -->
            <div class="flex items-center gap-2">
              <button 
                @click="openQuestionModal()"
                class="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <span>+ Pregunta</span>
              </button>
              <button 
                @click="printExamMode = true"
                class="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <span>🖨️ Imprimir Prueba</span>
              </button>
            </div>
          </div>

          <!-- Questions List -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div class="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-200">
                Preguntas Configuradas ({{ examQuestions.length }})
              </h3>
              <span class="text-xs font-bold text-slate-500">
                Puntaje Total Acumulado: <span class="text-rose-500 font-black">{{ totalPoints }} / {{ selectedExam.total_marks || 20 }} pts</span>
              </span>
            </div>

            <div v-if="examQuestions.length === 0" class="text-center py-8">
              <p class="text-slate-400 text-xs">Este examen aún no tiene preguntas configuradas.</p>
              <button 
                @click="openQuestionModal()"
                class="mt-2 text-xs font-bold text-rose-500 hover:underline"
              >
                + Agregar la primera pregunta
              </button>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="(q, idx) in examQuestions" 
                :key="q.id"
                class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center">
                      {{ idx + 1 }}
                    </span>
                    <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {{ formatQuestionType(q.question_type) }}
                    </span>
                  </div>
                  <span class="text-xs font-black text-rose-600 dark:text-rose-400">
                    {{ q.marks || 5 }} pts
                  </span>
                </div>

                <p class="text-sm font-bold text-slate-850 dark:text-white pt-1">
                  {{ q.question_text }}
                </p>

                <!-- Options if available -->
                <div v-if="getOptions(q.options).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div 
                    v-for="(opt, oIdx) in getOptions(q.options)" 
                    :key="oIdx"
                    :class="[
                      isCorrectOption(opt, q.correct_answer)
                        ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    ]"
                    class="p-2 rounded-lg border text-xs flex items-center gap-2"
                  >
                    <span class="font-bold text-[10px] w-4 text-center">{{ String.fromCharCode(65 + oIdx) }})</span>
                    <span>{{ opt }}</span>
                    <span v-if="isCorrectOption(opt, q.correct_answer)" class="ml-auto text-emerald-600 font-bold">✓</span>
                  </div>
                </div>

                <div v-else-if="q.correct_answer" class="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-lg mt-2">
                  <strong class="font-bold">Respuesta Clave:</strong> {{ q.correct_answer }}
                </div>

                <div v-if="q.explanation" class="text-[11px] text-slate-400 italic pt-1">
                  💡 {{ q.explanation }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Printable Exam Modal / Overlay -->
    <div 
      v-if="printExamMode"
      class="fixed inset-0 z-50 bg-white dark:bg-slate-950 overflow-y-auto p-6 sm:p-12 print:p-0"
    >
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-center print:hidden border-b pb-4">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">Vista Previa de Impresión</h2>
          <div class="flex items-center gap-3">
            <button 
              @click="windowPrint()" 
              class="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Imprimir Ahora
            </button>
            <button 
              @click="printExamMode = false" 
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>

        <!-- Official Paper Sheet Preview -->
        <div class="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-md print:shadow-none print:border-none print:p-0">
          <!-- Institutional Header -->
          <div class="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
            <div class="flex items-center gap-4">
              <img src="/logocolegio.png" alt="Logo U.E Santa Luisa" class="w-16 h-16 object-contain" />
              <div>
                <h1 class="text-lg font-black uppercase tracking-tight">U.E Santa Luisa</h1>
                <p class="text-xs font-semibold text-slate-600 uppercase">Comunidad Educativa Vicenciana • Caracas, Venezuela</p>
                <p class="text-xs font-bold mt-1 text-rose-700 uppercase">{{ selectedExam?.title }}</p>
              </div>
            </div>
            <div class="text-right text-xs space-y-1 font-semibold">
              <p>Materia: <span class="font-bold">{{ selectedExam?.subject_name }}</span></p>
              <p>Fecha: <span class="font-bold">{{ formatDate(selectedExam?.exam_date) }}</span></p>
              <p>Puntaje: <span class="font-bold">___ / {{ selectedExam?.total_marks || 20 }} pts</span></p>
            </div>
          </div>

          <!-- Student Name Fill Header -->
          <div class="grid grid-cols-12 gap-3 text-xs font-bold mb-6 border p-3 rounded-lg bg-slate-50">
            <div class="col-span-8">Estudiante: ____________________________________________________</div>
            <div class="col-span-4">C.I: ____________________</div>
            <div class="col-span-6">Año y Sección: _____________________</div>
            <div class="col-span-6">Docente: ___________________________</div>
          </div>

          <!-- Instructions -->
          <div class="text-xs text-slate-600 mb-6 italic">
            <strong>Instrucciones Generales:</strong> {{ selectedExam?.instructions || 'Lea detenidamente cada enunciado antes de responder. Utilice bolígrafo de tinta negra o azul. Dispone de 90 minutos.' }}
          </div>

          <!-- Questions Body -->
          <div class="space-y-6">
            <div v-for="(q, idx) in examQuestions" :key="q.id" class="space-y-2">
              <p class="text-sm font-bold">
                {{ idx + 1 }}. {{ q.question_text }} (Valor: {{ q.marks || 5 }} pts)
              </p>

              <!-- Multiple Choice Options -->
              <div v-if="getOptions(q.options).length > 0" class="grid grid-cols-2 gap-2 pl-4 text-xs">
                <div v-for="(opt, oIdx) in getOptions(q.options)" :key="oIdx">
                  ( &nbsp; ) {{ String.fromCharCode(65 + oIdx) }}. {{ opt }}
                </div>
              </div>

              <!-- Essay / Short answer blank lines -->
              <div v-else class="space-y-2 pl-2 pt-1">
                <div class="border-b border-dotted border-slate-400 h-6"></div>
                <div class="border-b border-dotted border-slate-400 h-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Exam Modal -->
    <div 
      v-if="isExamModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">Nueva Evaluación / Examen</h2>
        <form @submit.prevent="saveExam" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Título de la Prueba *</label>
            <input 
              v-model="examForm.title" 
              required 
              placeholder="Ej: 2do Parcial: Leyes de Newton y Dinámica"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Fecha del Examen *</label>
              <input 
                v-model="examForm.exam_date" 
                type="date"
                required 
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Duración (minutos)</label>
              <input 
                v-model.number="examForm.duration_minutes" 
                type="number" 
                placeholder="90"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Puntaje Total</label>
              <input 
                v-model.number="examForm.total_marks" 
                type="number" 
                placeholder="20"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo</label>
              <select 
                v-model="examForm.exam_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="written">Escrito</option>
                <option value="practical">Práctico / Laboratorio</option>
                <option value="oral">Oral</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Instrucciones</label>
            <textarea 
              v-model="examForm.instructions" 
              rows="2"
              placeholder="Instrucciones para los alumnos..."
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              @click="isExamModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20"
            >
              Crear Examen
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Question Modal -->
    <div 
      v-if="isQuestionModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">Nueva Pregunta</h2>

        <form @submit.prevent="saveQuestion" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Pregunta</label>
              <select 
                v-model="questionForm.question_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="seleccion_simple">Selección Simple</option>
                <option value="verdadero_falso">Verdadero / Falso</option>
                <option value="seleccion_multiple">Selección Múltiple</option>
                <option value="completacion">Completación</option>
                <option value="respuesta_corta">Desarrollo Corto</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Puntos / Ponderación</label>
              <input 
                v-model.number="questionForm.marks" 
                type="number" 
                required 
                placeholder="5"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Enunciado de la Pregunta *</label>
            <textarea 
              v-model="questionForm.question_text" 
              required
              rows="3"
              placeholder="Escribe aquí el texto de la pregunta..."
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
          </div>

          <!-- Options if selection -->
          <div v-if="['seleccion_simple', 'seleccion_multiple', 'verdadero_falso'].includes(questionForm.question_type)">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Opciones (separadas por coma)</label>
            <input 
              v-model="questionForm.optionsRaw" 
              placeholder="Opción A, Opción B, Opción C, Opción D"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Respuesta Correcta / Clave *</label>
            <input 
              v-model="questionForm.correct_answer" 
              required 
              placeholder="Texto o letra de la respuesta correcta"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Explicación o Criterio Pedagógico</label>
            <textarea 
              v-model="questionForm.explanation" 
              rows="2"
              placeholder="Justificación de la respuesta correcta..."
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              @click="isQuestionModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20"
            >
              Guardar Pregunta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const exams = ref([])
const questions = ref([])
const loadingExams = ref(true)
const selectedExam = ref(null)
const printExamMode = ref(false)

const isExamModalOpen = ref(false)
const isQuestionModalOpen = ref(false)

const examForm = ref({
  title: '',
  class_subject_id: 1,
  term_id: 1,
  exam_date: new Date().toISOString().split('T')[0],
  duration_minutes: 90,
  total_marks: 20,
  exam_type: 'written',
  instructions: ''
})

const questionForm = ref({
  question_type: 'seleccion_simple',
  question_text: '',
  optionsRaw: 'Opción 1, Opción 2, Opción 3, Opción 4',
  correct_answer: '',
  marks: 5,
  explanation: ''
})

const fetchExams = async () => {
  loadingExams.value = true
  try {
    const res = await api.get('exams')
    exams.value = res.data || res || []
    if (exams.value.length > 0 && !selectedExam.value) {
      selectExam(exams.value[0])
    }
  } catch (err) {
    console.error('Error fetching exams:', err)
  } finally {
    loadingExams.value = false
  }
}

const fetchQuestions = async () => {
  try {
    const res = await api.get('exam-questions')
    questions.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching questions:', err)
  }
}

const selectExam = (exam) => {
  selectedExam.value = exam
}

const examQuestions = computed(() => {
  if (!selectedExam.value) return []
  return questions.value.filter(q => q.exam_id === selectedExam.value.id)
})

const totalPoints = computed(() => {
  return examQuestions.value.reduce((acc, q) => acc + (parseFloat(q.marks) || 0), 0)
})

const stats = computed(() => {
  const programados = exams.value.filter(e => !e.status || e.status === 'programado').length
  return { programados }
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatQuestionType = (type) => {
  switch (type) {
    case 'seleccion_simple': return 'Selección Simple'
    case 'seleccion_multiple': return 'Selección Múltiple'
    case 'verdadero_falso': return 'Verdadero / Falso'
    case 'completacion': return 'Completación'
    case 'respuesta_corta': return 'Desarrollo Corto'
    default: return type || 'Pregunta'
  }
}

const getOptions = (options) => {
  if (!options) return []
  if (Array.isArray(options)) return options
  try {
    return JSON.parse(options)
  } catch {
    return []
  }
}

const isCorrectOption = (opt, correct) => {
  if (!correct) return false
  return opt.toLowerCase().trim() === correct.toLowerCase().trim() ||
         correct.toLowerCase().includes(opt.toLowerCase().trim())
}

const openExamModal = () => {
  examForm.value = {
    title: '',
    class_subject_id: 1,
    term_id: 1,
    exam_date: new Date().toISOString().split('T')[0],
    duration_minutes: 90,
    total_marks: 20,
    exam_type: 'written',
    instructions: 'Lea atentamente cada enunciado. No se permite el uso de dispositivos móviles.'
  }
  isExamModalOpen.value = true
}

const saveExam = async () => {
  try {
    const created = await api.post('exams', examForm.value)
    isExamModalOpen.value = false
    await fetchExams()
    if (created) selectExam(created)
  } catch (err) {
    alert('Error al crear examen: ' + err.message)
  }
}

const openQuestionModal = () => {
  questionForm.value = {
    question_type: 'seleccion_simple',
    question_text: '',
    optionsRaw: 'Opción 1, Opción 2, Opción 3, Opción 4',
    correct_answer: '',
    marks: 5,
    explanation: ''
  }
  isQuestionModalOpen.value = true
}

const saveQuestion = async () => {
  if (!selectedExam.value) return
  const options = questionForm.value.question_type === 'verdadero_falso'
    ? ['Verdadero', 'Falso']
    : questionForm.value.optionsRaw.split(',').map(s => s.trim()).filter(Boolean)

  const payload = {
    exam_id: selectedExam.value.id,
    question_type: questionForm.value.question_type,
    question_text: questionForm.value.question_text,
    options: JSON.stringify(options),
    correct_answer: questionForm.value.correct_answer,
    marks: questionForm.value.marks,
    order_num: examQuestions.value.length + 1,
    explanation: questionForm.value.explanation,
    is_deleted: false,
    version: 1
  }

  try {
    await api.post('exam-questions', payload)
    isQuestionModalOpen.value = false
    await fetchQuestions()
  } catch (err) {
    alert('Error al guardar pregunta: ' + err.message)
  }
}

const windowPrint = () => {
  window.print()
}

onMounted(async () => {
  await Promise.all([fetchExams(), fetchQuestions()])
})
</script>
