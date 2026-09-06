<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Boletas de Calificaciones y Rendimiento
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Emisión oficial con 3 modelos de diseño, escala dual venezolana y verificación QR
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openCreateModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Emitir Nueva Boleta</span>
        </button>

        <button 
          @click="triggerPrint()" 
          :disabled="!isSolvent"
          type="button"
          :class="!isSolvent ? 'opacity-50 cursor-not-allowed bg-slate-500' : 'bg-slate-800 hover:bg-slate-900 cursor-pointer'"
          class="px-4 py-2.5 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
          :title="!isSolvent ? 'Impresión bloqueada: El representante no se encuentra solvente' : 'Imprimir Boleta de Calificaciones'"
        >
          <span>🖨️ Imprimir Boleta</span>
        </button>
      </div>
    </div>

    <!-- Model Switcher & Solvency Toolbar (print:hidden) -->
    <div class="bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 print:hidden">
      <!-- Selector de Modelo de Boleta -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Modelo de Diseño:</span>
        <div class="inline-flex p-1 bg-slate-100 dark:bg-white/10 rounded-xl">
          <button 
            @click="selectedModel = 'moderna'"
            :class="selectedModel === 'moderna' ? 'bg-white dark:bg-[#201646] text-orange-600 dark:text-brand-gold shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
          >
            Moderna
          </button>
          <button 
            @click="selectedModel = 'clasica'"
            :class="selectedModel === 'clasica' ? 'bg-white dark:bg-[#201646] text-orange-600 dark:text-brand-gold shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
          >
            Clásica Institucional
          </button>
          <button 
            @click="selectedModel = 'compacta'"
            :class="selectedModel === 'compacta' ? 'bg-white dark:bg-[#201646] text-orange-600 dark:text-brand-gold shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
          >
            Compacta
          </button>
        </div>
      </div>

      <!-- Selector de Boleta Activa y Control de Solvencia -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Seleccionar Estudiante:</span>
          <select 
            v-model="selectedReportCardId"
            class="px-3 py-2 text-xs bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option v-for="rc in reportCards" :key="rc.id" :value="rc.id">
              {{ rc.student_name || `Estudiante #${rc.student_id}` }} • {{ rc.period }} ({{ rc.academic_year }})
            </option>
          </select>
        </div>

        <!-- Solvency Status Badge & Admin Toggle -->
        <div class="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-white/10">
          <span 
            :class="isSolvent ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'"
            class="px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5"
            :title="isSolvent ? 'El representante está solvente' : 'El representante tiene pagos pendientes (Boleta bloqueada)'"
          >
            <span class="w-2 h-2 rounded-full" :class="isSolvent ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            <span>{{ isSolvent ? 'Solvente' : 'No Solvente' }}</span>
          </span>

          <button 
            @click="toggleSolvency"
            type="button"
            class="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Alternar estado de solvencia (Control Administrativo)"
          >
            {{ isSolvent ? 'Simular Insolvencia' : 'Conceder Solvencia' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Active Boleta Rendering Container -->
    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Generando modelo de boleta...</p>
    </div>

    <div v-else-if="!activeReportCard" class="bg-white dark:bg-[#170f33] rounded-2xl p-12 text-center border border-slate-100 dark:border-white/10">
      <p class="text-4xl mb-2">📄</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay boletas disponibles</h3>
      <p class="text-xs text-slate-400 mt-1">Presiona "Emitir Nueva Boleta" para crear una evaluación formal.</p>
    </div>

    <!-- SI EL REPRESENTANTE NO ESTÁ SOLVENTE: RESTRICCIÓN ADMINISTRATIVA -->
    <div v-else-if="!isSolvent" class="bg-white dark:bg-[#170f33] border-2 border-dashed border-amber-400/50 dark:border-amber-500/40 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl space-y-6 animate-fade-in print:hidden">
      <div class="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-brand-gold flex items-center justify-center mx-auto text-4xl shadow-inner">
        🔒
      </div>

      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-brand-gold border border-amber-300 dark:border-amber-700/50 mb-3">
          Restricción Administrativa • Pendiente de Solvencia
        </span>
        <h2 class="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
          Boletín de Calificaciones No Disponible
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-lg mx-auto">
          Estimado Representante de <strong class="text-slate-900 dark:text-white">{{ activeReportCard?.student_name }}</strong>:
          Para poder visualizar, descargar o imprimir la boleta de calificaciones en el sistema, es requisito indispensable encontrarse <strong>solvente con las mensualidades y compromisos administrativos</strong> de la U.E Santa Luisa.
        </p>
      </div>

      <div class="p-4 bg-slate-50 dark:bg-[#110926] rounded-2xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto text-left space-y-2">
        <p class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span>🏛️</span> ¿Cómo consultar su boleta?
        </p>
        <p>• Acérquese a la oficina de <strong>Control de Estudios o Administración</strong> del plantel para revisar su estado de cuenta.</p>
        <p>• Si ya realizó su pago, registre su comprobante en el módulo de <strong>Tesorería y Finanzas</strong> para su oportuna conciliación.</p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <NuxtLink 
          to="/finance"
          class="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <span>💳 Ir a Tesorería y Pagos</span>
        </NuxtLink>
        <button 
          @click="toggleSolvency"
          type="button"
          class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          <span>⚖️ Conceder Solvencia (Administrador)</span>
        </button>
      </div>
    </div>

    <!-- SI ESTÁ SOLVENTE: RENDERIZA LOS MODELOS DE BOLETA -->
    <div v-else class="space-y-6">
      <!-- MODELO 1: MODERNA -->
      <div 
        v-if="selectedModel === 'moderna'"
        class="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto print:shadow-none print:border-none print:p-0"
      >
        <!-- Institutional Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 mb-6">
          <div class="flex items-center gap-4">
            <img src="/logocolegio.png" alt="U.E Santa Luisa" class="w-16 h-16 object-contain" />
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-orange-600">República Bolivariana de Venezuela • MPPE</span>
              <h1 class="text-xl font-black font-display tracking-tight text-slate-900">U.E Santa Luisa</h1>
              <p class="text-xs text-slate-500">Boletín Informativo de Calificaciones • {{ activeReportCard.period }}</p>
            </div>
          </div>

          <!-- Dynamic QR Code -->
          <div class="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <ui-qr-code 
              :value="getVerificationUrl(activeReportCard.verification_code)"
              :size="64"
            />
            <div class="text-[10px] leading-tight">
              <p class="font-bold text-slate-800">Código de Verificación:</p>
              <p class="font-mono text-orange-600 font-bold mt-0.5">{{ activeReportCard.verification_code }}</p>
              <p class="text-slate-400 mt-0.5">Escanea para validar</p>
            </div>
          </div>
        </div>

        <!-- Student Dossier Snapshot -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl mb-6 text-xs">
          <div>
            <span class="text-slate-400 uppercase font-bold text-[10px] block">Estudiante:</span>
            <span class="font-bold text-slate-800">{{ activeReportCard.student_name }}</span>
          </div>
          <div>
            <span class="text-slate-400 uppercase font-bold text-[10px] block">Año / Sección:</span>
            <span class="font-bold text-slate-800">{{ activeReportCard.grade_level || '1er Año A' }}</span>
          </div>
          <div>
            <span class="text-slate-400 uppercase font-bold text-[10px] block">Año Escolar:</span>
            <span class="font-bold text-slate-800">{{ activeReportCard.academic_year }}</span>
          </div>
          <div>
            <span class="text-slate-400 uppercase font-bold text-[10px] block">Nivel Educativo:</span>
            <span class="font-bold text-slate-800 capitalize">{{ activeReportCard.education_level }}</span>
          </div>
        </div>

        <!-- Subject Grades Table -->
        <div class="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th class="p-3">Asignatura / Área de Formación</th>
                <th class="p-3 text-center">Escala Numérica (1-20)</th>
                <th class="p-3 text-center">Escala Literal</th>
                <th class="p-3">Apreciación / Observaciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(g, idx) in gradesList" :key="idx" class="hover:bg-slate-50">
                <td class="p-3 font-bold text-slate-800">{{ g.subject_name }}</td>
                <td class="p-3 text-center">
                  <span class="inline-block px-2.5 py-1 rounded-lg font-black text-xs" :class="getScoreBadge(g.score)">
                    {{ g.score }} pts
                  </span>
                </td>
                <td class="p-3 text-center font-bold text-slate-700">{{ g.letter || getLetterFromScore(g.score) }}</td>
                <td class="p-3 text-slate-600 text-[11px]">{{ g.observations || 'Buen desempeño' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Metrics & Observations -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/60 mb-6">
          <div class="md:col-span-4 text-center md:text-left">
            <span class="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">Promedio General de Lapso:</span>
            <div class="flex items-baseline justify-center md:justify-start gap-2 mt-1">
              <span class="text-4xl font-black font-display text-orange-600">{{ activeReportCard.final_average }}</span>
              <span class="text-sm font-bold text-orange-800">/ 20 pts</span>
              <span class="px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-xs ml-1">
                Literal: {{ activeReportCard.final_letter || 'A' }}
              </span>
            </div>
          </div>
          <div class="md:col-span-8 text-xs text-slate-700 border-t md:border-t-0 md:border-l border-orange-200 md:pl-6 pt-3 md:pt-0">
            <p class="font-bold uppercase text-[10px] text-orange-800 mb-1">Observaciones del Docente Guía:</p>
            <p class="italic">{{ activeReportCard.teacher_observations }}</p>
          </div>
        </div>

        <!-- Official Signatures -->
        <div class="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
          <div>
            <div class="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <p class="font-bold">Docente Guía</p>
          </div>
          <div>
            <div class="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <p class="font-bold">Control de Estudios</p>
          </div>
          <div>
            <div class="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <p class="font-bold">Dirección General</p>
          </div>
        </div>
      </div>

      <!-- MODELO 2: CLÁSICA INSTITUCIONAL (Formato Tradicional) -->
      <div 
        v-else-if="selectedModel === 'clasica'"
        class="bg-white text-slate-900 p-8 rounded-xl border-2 border-slate-800 max-w-4xl mx-auto font-serif print:border-none print:p-0"
      >
        <!-- Header Formal -->
        <div class="text-center border-b-2 border-slate-800 pb-4 mb-4">
          <p class="text-[11px] uppercase tracking-widest font-bold">República Bolivariana de Venezuela</p>
          <p class="text-[11px] uppercase tracking-widest font-bold">Ministerio del Poder Popular para la Educación</p>
          <h2 class="text-xl font-bold uppercase tracking-wider mt-1">Unidad Educativa Santa Luisa</h2>
          <p class="text-xs italic">Inscrito en el M.P.P.E. • Código DEA: S-2026-SL</p>
          <p class="text-sm font-bold uppercase mt-2 text-slate-850">Boletín Informativo de Evaluación Integral</p>
        </div>

        <!-- Student Data Formal Grid -->
        <div class="border border-slate-800 text-xs mb-4">
          <div class="grid grid-cols-12 divide-x divide-slate-800 border-b border-slate-800 p-2">
            <div class="col-span-8"><strong>Estudiante:</strong> {{ activeReportCard.student_name }}</div>
            <div class="col-span-4"><strong>Cédula / Código:</strong> {{ activeReportCard.student_code || 'V-32456789' }}</div>
          </div>
          <div class="grid grid-cols-12 divide-x divide-slate-800 p-2">
            <div class="col-span-4"><strong>Año / Grado:</strong> {{ activeReportCard.grade_level || '1er Año' }}</div>
            <div class="col-span-4"><strong>Período:</strong> {{ activeReportCard.period }}</div>
            <div class="col-span-4"><strong>Año Escolar:</strong> {{ activeReportCard.academic_year }}</div>
          </div>
        </div>

        <!-- Classical Table -->
        <table class="w-full border-collapse border border-slate-800 text-xs mb-4">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-800">
              <th class="border border-slate-800 p-2 text-left">Áreas de Formación</th>
              <th class="border border-slate-800 p-2 text-center w-24">Calificación (1-20)</th>
              <th class="border border-slate-800 p-2 text-center w-24">Literal</th>
              <th class="border border-slate-800 p-2 text-left">Rasgos Cualitativos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(g, idx) in gradesList" :key="idx">
              <td class="border border-slate-800 p-2 font-bold">{{ g.subject_name }}</td>
              <td class="border border-slate-800 p-2 text-center font-bold">{{ g.score }}</td>
              <td class="border border-slate-800 p-2 text-center font-bold">{{ g.letter || getLetterFromScore(g.score) }}</td>
              <td class="border border-slate-800 p-2 text-[11px]">{{ g.observations || 'Satisfactorio' }}</td>
            </tr>
            <tr class="font-bold bg-slate-50">
              <td class="border border-slate-800 p-2 text-right">PROMEDIO GENERAL:</td>
              <td class="border border-slate-800 p-2 text-center text-sm font-black">{{ activeReportCard.final_average }}</td>
              <td class="border border-slate-800 p-2 text-center">{{ activeReportCard.final_letter || 'A' }}</td>
              <td class="border border-slate-800 p-2 text-xs">Aprobado con Distinción</td>
            </tr>
          </tbody>
        </table>

        <!-- QR Verification Section -->
        <div class="flex items-center justify-between border border-slate-800 p-3 mb-6">
          <div class="text-xs space-y-1">
            <p><strong>Observaciones:</strong> {{ activeReportCard.teacher_observations }}</p>
            <p class="text-[11px] text-slate-500">Documento legal certificado por el sistema escolar U.E Santa Luisa.</p>
          </div>
          <ui-qr-code 
            :value="getVerificationUrl(activeReportCard.verification_code)"
            :size="60"
          />
        </div>

        <!-- Classical Signatures -->
        <div class="grid grid-cols-3 gap-6 pt-8 text-center text-xs">
          <div>
            <div class="border-t border-slate-800 w-36 mx-auto mb-1"></div>
            <p class="font-bold">Docente Guía</p>
          </div>
          <div>
            <div class="border-t border-slate-800 w-36 mx-auto mb-1"></div>
            <p class="font-bold">Control de Estudios</p>
          </div>
          <div>
            <div class="border-t border-slate-800 w-36 mx-auto mb-1"></div>
            <p class="font-bold">Directora General</p>
          </div>
        </div>
      </div>

      <!-- MODELO 3: COMPACTA -->
      <div 
        v-else-if="selectedModel === 'compacta'"
        class="bg-white text-slate-900 p-6 rounded-2xl border border-slate-300 max-w-2xl mx-auto text-xs print:border-none print:p-0"
      >
        <div class="flex items-center justify-between border-b pb-3 mb-3">
          <div class="flex items-center gap-3">
            <img src="/logocolegio.png" alt="Logo" class="w-10 h-10 object-contain" />
            <div>
              <h2 class="font-black text-sm uppercase">U.E Santa Luisa • Boleta Compacta</h2>
              <p class="text-[11px] text-slate-500">{{ activeReportCard.student_name }} • {{ activeReportCard.grade_level || '1er Año' }} • {{ activeReportCard.period }}</p>
            </div>
          </div>
          <ui-qr-code 
            :value="getVerificationUrl(activeReportCard.verification_code)"
            :size="48"
          />
        </div>

        <table class="w-full text-left mb-3">
          <thead class="border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th class="py-1">Materia</th>
              <th class="py-1 text-center">Nota</th>
              <th class="py-1 text-center">Literal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(g, idx) in gradesList" :key="idx">
              <td class="py-1.5 font-bold">{{ g.subject_name }}</td>
              <td class="py-1.5 text-center font-bold text-orange-600">{{ g.score }}</td>
              <td class="py-1.5 text-center">{{ g.letter || getLetterFromScore(g.score) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border font-bold">
          <span>PROMEDIO: {{ activeReportCard.final_average }} / 20</span>
          <span>LITERAL: {{ activeReportCard.final_letter || 'A' }}</span>
          <span>ASISTENCIA: {{ activeReportCard.attendance_present || 58 }} días</span>
        </div>
      </div>
    </div>

    <!-- Create Report Card Modal -->
    <div 
      v-if="isCreateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">Emitir Nueva Boleta de Calificaciones</h2>

        <form @submit.prevent="saveReportCard" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Año Escolar *</label>
              <input 
                v-model="modalForm.academic_year" 
                required 
                placeholder="2026-2027"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Período / Lapso *</label>
              <select 
                v-model="modalForm.period" 
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="1er lapso">1er Lapso</option>
                <option value="2do lapso">2do Lapso</option>
                <option value="3er lapso">3er Lapso</option>
                <option value="final">Final Anual</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nivel Educativo *</label>
              <select 
                v-model="modalForm.education_level" 
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="media">Media General (1-20)</option>
                <option value="primaria">Primaria (A-E)</option>
                <option value="preescolar">Preescolar (A-E)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Promedio Obtenido *</label>
              <input 
                v-model.number="modalForm.final_average" 
                type="number" 
                step="0.01" 
                required 
                placeholder="18.5"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Observaciones del Docente</label>
            <textarea 
              v-model="modalForm.teacher_observations" 
              rows="3"
              placeholder="Desempeño y apreciación cualitativa del estudiante..."
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              @click="isCreateModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Guardar y Emitir
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
const reportCards = ref([])
const students = ref([])
const loading = ref(true)
const selectedModel = ref('moderna') // 'moderna' | 'clasica' | 'compacta'
const selectedReportCardId = ref(null)
const isCreateModalOpen = ref(false)
const studentSolvencyMap = ref({})

const isSolvent = computed(() => {
  if (!activeReportCard.value) return false
  const cardId = activeReportCard.value.id
  if (studentSolvencyMap.value[cardId] !== undefined) {
    return studentSolvencyMap.value[cardId]
  }
  return activeReportCard.value.is_solvent !== false
})

const toggleSolvency = () => {
  if (!activeReportCard.value) return
  const cardId = activeReportCard.value.id
  studentSolvencyMap.value[cardId] = !isSolvent.value
}

const modalForm = ref({
  student_id: 1,
  academic_year: '2026-2027',
  period: '1er lapso',
  education_level: 'media',
  final_average: 18.5,
  final_letter: 'A',
  teacher_observations: 'Excelente estudiante, alta motivación y disciplina.'
})

const fetchReportCards = async () => {
  loading.value = true
  try {
    const [rcRes, stdRes] = await Promise.all([
      api.get('report-cards'),
      api.get('students')
    ])

    students.value = stdRes.data || stdRes || []
    const rawCards = rcRes.data || rcRes || []

    reportCards.value = rawCards.map(rc => {
      const std = students.value.find(s => s.id === rc.student_id)
      return {
        ...rc,
        student_name: std ? `${std.first_name} ${std.last_name}` : 'Estudiante U.E Santa Luisa',
        student_code: std?.student_id || 'STU-001',
        grade_level: std?.grade || '1er Año A'
      }
    })

    if (reportCards.value.length > 0 && !selectedReportCardId.value) {
      selectedReportCardId.value = reportCards.value[0].id
    }
  } catch (err) {
    console.error('Error fetching report cards:', err)
  } finally {
    loading.value = false
  }
}

const activeReportCard = computed(() => {
  return reportCards.value.find(rc => rc.id === selectedReportCardId.value) || reportCards.value[0]
})

const gradesList = computed(() => {
  if (!activeReportCard.value?.subject_grades) return []
  if (Array.isArray(activeReportCard.value.subject_grades)) return activeReportCard.value.subject_grades
  try {
    return JSON.parse(activeReportCard.value.subject_grades)
  } catch {
    return []
  }
})

const getLetterFromScore = (score) => {
  if (score >= 18) return 'A'
  if (score >= 15) return 'B'
  if (score >= 12) return 'C'
  if (score >= 10) return 'D'
  return 'E'
}

const getScoreBadge = (score) => {
  if (score >= 18) return 'bg-emerald-100 text-emerald-700'
  if (score >= 15) return 'bg-blue-100 text-blue-700'
  if (score >= 10) return 'bg-amber-100 text-amber-700'
  return 'bg-rose-100 text-rose-700'
}

const getVerificationUrl = (code) => {
  if (process.client) {
    return `${window.location.origin}/verificar-boleta/${code || 'SL-BOL-2026-001'}`
  }
  return `https://santaluisa.edu.ve/verificar-boleta/${code || 'SL-BOL-2026-001'}`
}

const triggerPrint = () => {
  if (!isSolvent.value) {
    alert('Impresión no autorizada: El representante debe estar solvente con la institución para imprimir el boletín.')
    return
  }
  window.print()
}

const openCreateModal = () => {
  modalForm.value = {
    student_id: students.value[0]?.id || 1,
    academic_year: '2026-2027',
    period: '1er lapso',
    education_level: 'media',
    final_average: 18.0,
    final_letter: 'A',
    teacher_observations: 'Demuestra alto rendimiento y puntualidad en sus entregas.'
  }
  isCreateModalOpen.value = true
}

const saveReportCard = async () => {
  const code = `SL-BOL-2026-${String(reportCards.value.length + 1).padStart(3, '0')}`
  const defaultSubjects = [
    { subject_name: 'Matemáticas', score: 19, letter: 'A', observations: 'Excelente' },
    { subject_name: 'Castellano y Literatura', score: 18, letter: 'A', observations: 'Muy bueno' },
    { subject_name: 'Física', score: 17, letter: 'B', observations: 'Sobresaliente' },
    { subject_name: 'Química', score: 18, letter: 'A', observations: 'Notable' },
    { subject_name: 'Inglés', score: 19, letter: 'A', observations: 'Excelente' }
  ]

  const payload = {
    ...modalForm.value,
    verification_code: code,
    status: 'emitida',
    issue_date: new Date().toISOString().split('T')[0],
    subject_grades: JSON.stringify(defaultSubjects)
  }

  try {
    const created = await api.post('report-cards', payload)
    isCreateModalOpen.value = false
    await fetchReportCards()
    if (created?.id) selectedReportCardId.value = created.id
  } catch (err) {
    alert('Error al emitir boleta: ' + err.message)
  }
}

onMounted(fetchReportCards)
</script>
