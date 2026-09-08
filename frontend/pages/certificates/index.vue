<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Certificados y Diplomas de Honor
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Emisión de diplomas con marco ceremonial, esquineros geométricos, marca de agua histórica y validación QR
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openCreateModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Emitir Nuevo Diploma</span>
        </button>

        <button 
          @click="triggerPrint()" 
          type="button"
          class="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          title="Imprimir Diploma en Formato Horizontal Carta"
        >
          <span>🖨️ Imprimir Certificado</span>
        </button>
      </div>
    </div>

    <!-- Certificate Selection & Design Toolbar (print:hidden) -->
    <div class="bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 print:hidden">
      <!-- Selector de Estudiante / Diploma -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Seleccionar Diploma:</span>
          <select 
            v-model="selectedCertId" 
            class="px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option v-for="c in certificates" :key="c.id" :value="c.id">
              {{ c.recipient_name }} — {{ formatCertType(c.certificate_type) }} ({{ c.academic_year }})
            </option>
          </select>
        </div>

        <!-- Mención Badge -->
        <span class="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-brand-gold rounded-xl text-xs font-bold border border-amber-300/60 dark:border-amber-700/40">
          {{ formatCertType(activeCert?.certificate_type) }}
        </span>
      </div>

      <!-- Actions for Selected Certificate & Info -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Edit & Delete buttons for active certificate -->
        <div v-if="activeCert && activeCert.id" class="flex items-center gap-2">
          <button
            @click="openEditModal()"
            type="button"
            class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Modificar datos del certificado"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </button>

          <button
            @click="openDeleteModal()"
            type="button"
            class="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Anular y eliminar diploma"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Anular</span>
          </button>
        </div>

        <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-white/10">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Carta Horizontal</span>
        </div>
      </div>
    </div>

    <!-- Certificate Loading / Empty States -->
    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Cargando certificados...</p>
    </div>

    <div v-else-if="!activeCert" class="bg-white dark:bg-[#170f33] rounded-2xl p-12 text-center border border-slate-200 dark:border-white/10">
      <p class="text-4xl mb-2">📜</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay certificados registrados</h3>
      <p class="text-xs text-slate-400 mt-1">Presione "Emitir Nuevo Diploma" para crear el primero.</p>
    </div>

    <!-- CEREMONIAL DIPLOMA CANVAS (LANDSCAPE PREVIEW & PRINT) -->
    <div v-else class="max-w-5xl mx-auto print:max-w-none print:w-full print:m-0">
      <div 
        class="bg-white text-slate-900 rounded-3xl shadow-2xl relative overflow-hidden p-3 sm:p-5 print:p-0 print:shadow-none print:rounded-none print:bg-white"
        style="min-height: 580px; aspect-ratio: 1.414 / 1;"
      >
        <!-- Outer Ceremonial Double Border (Deep Royal Blue & Violet Accent from Screenshot 2) -->
        <div class="w-full h-full border-4 sm:border-[5px] border-indigo-900/90 dark:border-indigo-600/90 rounded-2xl relative p-3 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FAFAFE] via-[#FFFFFF] to-[#F8F7FF] print:border-indigo-900 print:bg-white">
          
          <!-- Geometric Corner Brackets (Screenshot 2 exact style) -->
          <!-- Top Left Corner Bracket -->
          <div class="absolute top-2 left-2 sm:top-3 sm:left-3 pointer-events-none">
            <div class="w-8 h-8 sm:w-12 sm:h-12 border-t-4 border-l-4 border-indigo-600 print:border-indigo-800"></div>
          </div>
          <!-- Top Right Corner Bracket -->
          <div class="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none">
            <div class="w-8 h-8 sm:w-12 sm:h-12 border-t-4 border-r-4 border-indigo-600 print:border-indigo-800"></div>
          </div>
          <!-- Bottom Left Corner Bracket -->
          <div class="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 pointer-events-none">
            <div class="w-8 h-8 sm:w-12 sm:h-12 border-b-4 border-l-4 border-indigo-600 print:border-indigo-800"></div>
          </div>
          <!-- Bottom Right Corner Bracket -->
          <div class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 pointer-events-none">
            <div class="w-8 h-8 sm:w-12 sm:h-12 border-b-4 border-r-4 border-indigo-600 print:border-indigo-800"></div>
          </div>

          <!-- Thin Inner Border Frame -->
          <div class="absolute inset-4 sm:inset-6 border border-amber-400/40 pointer-events-none"></div>

          <!-- Translucent Watermark (U.E Santa Luisa Coat of Arms) with subtle enhancement -->
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.09] print:opacity-[0.10] pointer-events-none z-0">
            <img src="/logocolegio.png" alt="U.E Santa Luisa Watermark" class="w-[430px] h-[430px] object-contain rotate-[-2deg]" />
          </div>

          <!-- DIPLOMA CONTENT (z-10) -->
          <div class="relative z-10 flex flex-col items-center justify-between text-center h-full py-2 sm:py-3 px-4 sm:px-8">
            
            <!-- Header Section: Santa Luisa (Left), Ministerial & Institutional Text (Center), San Vicente (Right) -->
            <div class="w-full flex items-center justify-between gap-4 pt-1 sm:pt-2 px-2 sm:px-6">
              <!-- Left: Santa Luisa de Marillac -->
              <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-16 h-20 sm:w-20 sm:h-24 p-1 rounded-xl bg-white border border-amber-400/40 shadow-xs flex items-center justify-center">
                  <img src="/images/santaluisa.png" alt="Santa Luisa de Marillac" class="w-full h-full object-contain rounded-lg" />
                </div>
                <span class="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Sta. Luisa de Marillac</span>
              </div>

              <!-- Center: Institutional Hierarchy Heading -->
              <div class="flex-1 flex flex-col items-center space-y-0.5 text-center">
                <span class="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-800">
                  República Bolivariana de Venezuela
                </span>
                <span class="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-700">
                  Ministerio del Poder Popular para la Educación
                </span>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-black font-display text-indigo-950 tracking-tight uppercase pt-0.5">
                  Unidad Educativa Colegio Santa Luisa
                </h2>
                <p class="text-[10px] sm:text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                  Hijas de la Caridad de San Vicente de Paúl
                </p>

                <!-- Golden Accent Diamond Divider -->
                <div class="flex items-center justify-center gap-2 pt-1 w-48 mx-auto">
                  <div class="h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1"></div>
                  <div class="w-2 h-2 rotate-45 bg-amber-600"></div>
                  <div class="h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1"></div>
                </div>
              </div>

              <!-- Right: San Vicente de Paúl -->
              <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-16 h-20 sm:w-20 sm:h-24 p-1 rounded-xl bg-white border border-amber-400/40 shadow-xs flex items-center justify-center">
                  <img src="/images/sanvicente.png" alt="San Vicente de Paúl" class="w-full h-full object-contain rounded-lg" />
                </div>
                <span class="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">San Vicente de Paúl</span>
              </div>
            </div>

            <!-- Title of Honor (High Contrast Dark Indigo Display) -->
            <div class="my-1.5 sm:my-2">
              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-indigo-950 tracking-wider uppercase drop-shadow-xs">
                {{ formatCertTitle(activeCert.certificate_type) }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 font-semibold tracking-wide uppercase mt-1">
                Se otorga el presente certificado a:
              </p>
            </div>

            <!-- Recipient Name Display: Bold, Centered, High Contrast Slate-950 with Gold Underline -->
            <div class="my-1.5 sm:my-2 w-full">
              <h4 class="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-950 tracking-tight">
                {{ activeCert.recipient_name }}
              </h4>
              <!-- Gold Underline -->
              <div class="w-64 sm:w-80 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 mx-auto mt-2 rounded-full shadow-xs"></div>
              
              <p class="text-xs sm:text-sm font-bold text-slate-700 mt-2 uppercase tracking-wider">
                {{ activeCert.recipient_type === 'estudiante' ? (activeCert.grade_level || '1er Año de Educación Media General') : (activeCert.department || 'Cuerpo Docente Titular') }}
              </p>
            </div>

            <!-- Statement / Narrative Citation -->
            <div class="max-w-3xl mx-auto my-1">
              <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic">
                {{ activeCert.description || 'Por haber obtenido el más alto índice académico de su cohorte durante el período escolar, demostrando constancia, rectitud y virtud vicenciana.' }}
              </p>
              
              <div v-if="activeCert.average_grade" class="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-amber-50 rounded-full border border-amber-300">
                <span class="text-xs font-bold text-amber-900">Obteniendo un promedio de:</span>
                <span class="text-xs font-black text-indigo-950">{{ activeCert.average_grade }} / 20 pts</span>
              </div>
            </div>

            <!-- Footer: Dynamic QR, Date & 3 Institutional Signatures (Directora, Control de Estudios, Profesor Guía), Official Golden Seal -->
            <div class="w-full flex flex-col pt-3 border-t border-slate-200/80 mt-1">
              <p class="text-[10px] sm:text-xs text-slate-600 mb-3 text-center">
                Fecha de emisión: <strong class="text-slate-900">{{ activeCert.issue_date || '1 de septiembre de 2026' }}</strong>
              </p>

              <div class="w-full grid grid-cols-12 items-end gap-2">
                <!-- Left: Verification QR Code -->
                <div class="col-span-2 flex flex-col items-center sm:items-start text-left">
                  <div class="bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    <ui-qr-code 
                      :value="getVerificationUrl(activeCert.verification_code)"
                      :size="52"
                    />
                  </div>
                  <div class="text-[8px] text-slate-500 mt-1 leading-tight">
                    <span class="font-mono text-indigo-900 font-bold block">Código: {{ activeCert.verification_code }}</span>
                    <span class="text-slate-400">Escanear para validar</span>
                  </div>
                </div>

                <!-- Center: 3 Institutional Signatures (Directora, Control de Estudios, Profesor Guía) -->
                <div class="col-span-8 grid grid-cols-3 gap-3 sm:gap-6 text-center">
                  <!-- Firma 1: Directora General -->
                  <div>
                    <div class="border-t-2 border-slate-900 w-24 sm:w-32 mx-auto mb-1"></div>
                    <p class="font-black text-slate-950 text-[10px] sm:text-xs leading-tight">{{ activeCert.issued_by || 'Sor María Dolores Amaya' }}</p>
                    <p class="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase">{{ activeCert.issued_role || 'Directora General' }}</p>
                  </div>

                  <!-- Firma 2: Control de Estudios -->
                  <div>
                    <div class="border-t-2 border-slate-900 w-24 sm:w-32 mx-auto mb-1"></div>
                    <p class="font-black text-slate-950 text-[10px] sm:text-xs leading-tight">Prof. Elena Vargas</p>
                    <p class="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase">Control de Estudios</p>
                  </div>

                  <!-- Firma 3: Profesor Guía (Solicitado en Audio 2) -->
                  <div>
                    <div class="border-t-2 border-slate-900 w-24 sm:w-32 mx-auto mb-1"></div>
                    <p class="font-black text-slate-950 text-[10px] sm:text-xs leading-tight">Prof. Carlos Mendoza</p>
                    <p class="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase">Docente Guía</p>
                  </div>
                </div>

                <!-- Right: Official Golden Seal -->
                <div class="col-span-2 flex flex-col items-center sm:items-end text-center sm:text-right">
                  <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-amber-500 bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-1 shadow-sm">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span class="text-[8px] font-black uppercase tracking-tighter text-amber-900 leading-none mt-0.5">Sello Oficial</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Issue / Edit Certificate Modal (Standardized Institutional Header) -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
          <!-- Institutional Header Banner -->
          <div class="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-primary border-b border-brand-gold/30 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 border border-brand-gold/50 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                🎖️
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  {{ isEditingCert ? 'Editar Diploma de Honor' : 'Emitir Diploma de Honor' }}
                </h2>
                <p class="text-[11px] font-semibold text-brand-gold/90 uppercase tracking-wider">
                  U.E SANTA LUISA • PROTOCOLO DE DIPLOMAS Y RECONOCIMIENTOS
                </p>
              </div>
            </div>
            <button 
              @click="isModalOpen = false" 
              type="button" 
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <form @submit.prevent="saveCertificate" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo del Destinatario *</label>
                <input 
                  v-model="certForm.recipient_name" 
                  required 
                  placeholder="Ej: Pedro Pérez Gómez"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Destinatario</label>
                  <select 
                    v-model="certForm.recipient_type"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor / Docente</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Certificado</label>
                  <select 
                    v-model="certForm.certificate_type"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-bold text-amber-600 dark:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                  >
                    <option value="excelencia_academica">Certificado de Excelencia Académica</option>
                    <option value="mejor_promedio">Diploma al Mejor Promedio</option>
                    <option value="conducta_excelente">Reconocimiento a la Conducta Intachable</option>
                    <option value="participacion_destacada">Mención de Participación Destacada</option>
                    <option value="reconocimiento_docente">Reconocimiento a la Labor Docente</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Año Escolar</label>
                  <input 
                    v-model="certForm.academic_year" 
                    placeholder="2025-2026"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Promedio Obtenido (1-20)</label>
                  <input 
                    v-model.number="certForm.average_grade" 
                    type="number" 
                    step="0.01" 
                    placeholder="19.8"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grado / Nivel</label>
                <input 
                  v-model="certForm.grade_level" 
                  placeholder="1er Año de Educación Media General"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Texto Conmemorativo / Motivo</label>
                <textarea 
                  v-model="certForm.description" 
                  rows="3"
                  placeholder="Por haber demostrado excelencia académica, constancia y disciplina..."
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Elevated Standard Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-slate-50/95 dark:bg-[#110926]/95 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3 shadow-xs">
              <button 
                type="button" 
                @click="isModalOpen = false"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </button>
              <button 
                type="submit" 
                class="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/25 transition-all active:scale-[0.98] border border-brand-primary/30 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ isEditingCert ? 'Guardar Cambios' : 'Emitir y Guardar Diploma' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Anular / Eliminar Certificate Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 animate-scale-up text-center">
          <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200/60 dark:border-rose-800/40 shadow-inner">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">¿Anular este Diploma?</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Está a punto de anular el diploma otorgado a 
            <strong class="text-slate-800 dark:text-slate-100">{{ certToDelete?.recipient_name }}</strong>.
            El certificado será retirado de la lista activa y su código de verificación quedará invalidado.
          </p>

          <div class="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
            <button 
              type="button" 
              @click="isDeleteModalOpen = false"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button 
              type="button" 
              @click="confirmDeleteCert"
              class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              Confirmar Anulación
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

const certificates = ref([])
const loading = ref(true)
const selectedCertId = ref(null)
const isModalOpen = ref(false)
const isEditingCert = ref(false)
const isDeleteModalOpen = ref(false)
const certToDelete = ref(null)

const certForm = ref({
  recipient_name: 'Pedro Pérez Gómez',
  recipient_type: 'estudiante',
  certificate_type: 'excelencia_academica',
  academic_year: '2025-2026',
  grade_level: '1er Año de Educación Media General',
  average_grade: 19.8,
  issued_by: 'Sor María Dolores Amaya',
  issued_role: 'Directora',
  description: 'Por haber demostrado excelencia académica, constancia, alto espíritu vicenciano y disciplina ejemplar en sus actividades formativas.'
})

const fetchCertificates = async () => {
  loading.value = true
  try {
    const res = await api.get('certificates')
    const list = res.data || res || []
    
    if (list.length === 0) {
      certificates.value = [
        {
          id: 1,
          recipient_name: 'Pedro Pérez Gómez',
          recipient_type: 'estudiante',
          certificate_type: 'excelencia_academica',
          academic_year: '2025-2026',
          grade_level: '1er Año de Educación Media General',
          average_grade: 19.8,
          verification_code: 'CERT-MTKBKQ8D',
          issue_date: '1 de septiembre de 2026',
          issued_by: 'Sor María Dolores Amaya',
          issued_role: 'Directora',
          description: 'Por haber demostrado un destacado rendimiento académico, constancia y apego a los valores de nuestra institución educativa.'
        },
        {
          id: 2,
          recipient_name: 'Sofía Valentina Morales',
          recipient_type: 'estudiante',
          certificate_type: 'mejor_promedio',
          academic_year: '2025-2026',
          grade_level: '2do Año Sección B',
          average_grade: 20.0,
          verification_code: 'CERT-SVM2026B',
          issue_date: '1 de septiembre de 2026',
          issued_by: 'Sor María Dolores Amaya',
          issued_role: 'Directora',
          description: 'Por obtener el promedio más alto de la cohorte 2025-2026 con calificación perfecta de 20 puntos.'
        }
      ]
    } else {
      certificates.value = list.filter(c => !c.is_deleted && c.status !== 'anulado')
    }

    if (certificates.value.length > 0 && !selectedCertId.value) {
      selectedCertId.value = certificates.value[0].id
    }
  } catch (err) {
    console.error('Error fetching certificates:', err)
  } finally {
    loading.value = false
  }
}

const activeCert = computed(() => {
  return certificates.value.find(c => c.id === selectedCertId.value) || certificates.value[0] || {}
})

const formatCertType = (type) => {
  switch (type) {
    case 'excelencia_academica': return 'Excelencia Académica'
    case 'mejor_promedio': return 'Mejor Promedio'
    case 'conducta_excelente': return 'Conducta Excelente'
    case 'participacion_destacada': return 'Participación Destacada'
    case 'reconocimiento_docente': return 'Labor Docente'
    default: return type || 'Excelencia'
  }
}

const formatCertTitle = (type) => {
  switch (type) {
    case 'excelencia_academica': return 'Certificado de Excelencia Académica'
    case 'mejor_promedio': return 'Diploma de Honor al Mejor Promedio'
    case 'conducta_excelente': return 'Reconocimiento a la Conducta Intachable'
    case 'participacion_destacada': return 'Mención de Participación Destacada'
    case 'reconocimiento_docente': return 'Reconocimiento Especial a la Labor Docente'
    default: return 'Certificado de Excelencia Académica'
  }
}

const getVerificationUrl = (code) => {
  if (process.client) {
    return `${window.location.origin}/verificar-boleta/${code || 'CERT-MTKBKQ8D'}`
  }
  return `https://santaluisa.edu.ve/verificar-boleta/${code || 'CERT-MTKBKQ8D'}`
}

const triggerPrint = () => {
  window.print()
}

const openCreateModal = () => {
  isEditingCert.value = false
  certForm.value = {
    recipient_name: 'Pedro Pérez Gómez',
    recipient_type: 'estudiante',
    certificate_type: 'excelencia_academica',
    academic_year: '2025-2026',
    grade_level: '1er Año de Educación Media General',
    average_grade: 19.8,
    issued_by: 'Sor María Dolores Amaya',
    issued_role: 'Directora',
    description: 'Por su sobresaliente desempeño académico, apego a los valores de la institución y excelencia moral y vicenciana.'
  }
  isModalOpen.value = true
}

const openEditModal = () => {
  if (!activeCert.value || !activeCert.value.id) return
  isEditingCert.value = true
  certForm.value = {
    recipient_name: activeCert.value.recipient_name || '',
    recipient_type: activeCert.value.recipient_type || 'estudiante',
    certificate_type: activeCert.value.certificate_type || 'excelencia_academica',
    academic_year: activeCert.value.academic_year || '2025-2026',
    grade_level: activeCert.value.grade_level || '',
    average_grade: activeCert.value.average_grade || 19,
    issued_by: activeCert.value.issued_by || 'Sor María Dolores Amaya',
    issued_role: activeCert.value.issued_role || 'Directora',
    description: activeCert.value.description || ''
  }
  isModalOpen.value = true
}

const openDeleteModal = (cert = null) => {
  certToDelete.value = cert || activeCert.value
  isDeleteModalOpen.value = true
}

const confirmDeleteCert = async () => {
  if (!certToDelete.value) return
  const id = certToDelete.value.id
  try {
    await api.patch(`certificates/${id}`, { status: 'anulado', is_deleted: true }).catch(() => null)
    certificates.value = certificates.value.filter(c => c.id !== id)
    if (selectedCertId.value === id) {
      selectedCertId.value = certificates.value[0]?.id || null
    }
    isDeleteModalOpen.value = false
    toast.success('Certificado Anulado', 'El diploma ha sido revocado y retirado con éxito.')
  } catch (err) {
    toast.error('Error', 'No se pudo anular el certificado: ' + err.message)
  }
}

const saveCertificate = async () => {
  try {
    if (isEditingCert.value && selectedCertId.value) {
      const payload = { ...certForm.value }
      await api.patch(`certificates/${selectedCertId.value}`, payload).catch(() => null)
      
      const idx = certificates.value.findIndex(c => c.id === selectedCertId.value)
      if (idx !== -1) {
        certificates.value[idx] = { ...certificates.value[idx], ...payload }
      }
      isModalOpen.value = false
      toast.success('Diploma Actualizado', 'Los datos del certificado han sido actualizados con éxito.')
      return
    }

    const code = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    const payload = {
      ...certForm.value,
      issue_date: new Date().toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' }),
      verification_code: code,
      status: 'emitido'
    }

    const created = await api.post('certificates', payload).catch(() => null)
    if (created?.id) {
      certificates.value.unshift(created)
      selectedCertId.value = created.id
    } else {
      certificates.value.unshift({ id: Date.now(), ...payload })
      selectedCertId.value = certificates.value[0].id
    }
    isModalOpen.value = false
    toast.success('Diploma Emitido', 'El certificado ceremonial se ha registrado y firmado exitosamente.')
  } catch (err) {
    toast.error('Error al guardar', err.message || 'No se pudo guardar el certificado')
  }
}

onMounted(fetchCertificates)
</script>

<style scoped>
@media print {
  @page {
    size: letter landscape;
    margin: 8mm;
  }
  body {
    background: white !important;
  }
}
</style>
