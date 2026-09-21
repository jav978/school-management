<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section (print:hidden) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <span class="text-xl">🏆</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Certificados y Diplomas de Honor
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Emisión de diplomas de excelencia, condecoraciones al mérito, sellos institucionales y firmas autorizadas
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <!-- Emisión por Lote Button -->
        <button 
          @click="isBatchModalOpen = true" 
          type="button"
          data-testid="btn-open-batch-modal"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
          title="Emitir diplomas en lote filtrando por notas (17.50 a 20)"
        >
          <span>🎯 Emisión por Lote (Notas)</span>
        </button>

        <!-- Emitir Individual Button -->
        <button 
          @click="openCreateModal()" 
          type="button"
          data-testid="btn-open-create-cert"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Emitir Diploma</span>
        </button>

        <!-- Personalizar Plantilla Button -->
        <button 
          @click="isCustomizerModalOpen = true" 
          type="button"
          data-testid="btn-open-customizer"
          class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 rounded-2xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          title="Personalizar textos, orlas y sellos"
        >
          <span>⚙️ Personalizar</span>
        </button>

        <!-- Imprimir Button -->
        <button 
          @click="triggerPrint()" 
          type="button"
          data-testid="btn-trigger-print"
          class="px-3.5 py-2.5 bg-slate-850 hover:bg-slate-950 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          title="Imprimir en Formato Horizontal Carta"
        >
          <span>🖨️ {{ isBatchMode ? `Imprimir Lote (${batchCertificates.length})` : $t('printDiplomaBtn', 'Imprimir Diploma') }}</span>
        </button>

        <!-- Descargar PDF Button -->
        <button 
          @click="downloadCertificatePdf()" 
          :disabled="isExporting"
          type="button"
          data-testid="btn-download-cert-pdf"
          class="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          title="Descargar Diploma en archivo PDF"
        >
          <span v-if="isExporting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>📥</span>
          <span>{{ isExporting ? 'Generando...' : $t('downloadPdfBtn', 'Descargar PDF') }}</span>
        </button>
      </div>
    </div>

    <!-- Template Selector & Modality Control Bar (print:hidden) -->
    <div class="bg-white dark:bg-[#170f33] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xs space-y-4 print:hidden">
      
      <!-- Top Row: 3 Design Templates Tabs -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Estilo de Plantilla:
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 w-full md:w-auto">
          <!-- Template 1: Classic -->
          <button 
            type="button"
            data-testid="template-tab-classic"
            @click="selectedTemplateId = 'classic'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
              selectedTemplateId === 'classic'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
            ]"
          >
            <span>🏛️ Clásico Vicenciano</span>
          </button>

          <!-- Template 2: Modern Gold -->
          <button 
            type="button"
            data-testid="template-tab-gold"
            @click="selectedTemplateId = 'modern_gold'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
              selectedTemplateId === 'modern_gold'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30'
                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
            ]"
          >
            <span>👑 Excelencia Dorada</span>
          </button>

          <!-- Template 3: Vibrant Merit -->
          <button 
            type="button"
            data-testid="template-tab-vibrant"
            @click="selectedTemplateId = 'vibrant_merit'"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
              selectedTemplateId === 'vibrant_merit'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-600/30'
                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
            ]"
          >
            <span>🌟 Vanguardia Colorida</span>
          </button>
        </div>
      </div>

      <!-- Second Row: Modality Filter, Stamping Toggles & Certificate Selector -->
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        <!-- Recipient Filter Tabs & Selector -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Modality Pills -->
          <div class="flex items-center p-1 bg-slate-100 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-xs">
            <button 
              type="button"
              data-testid="filter-modality-all"
              @click="recipientFilter = 'all'"
              :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer', recipientFilter === 'all' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500']"
            >
              Todos
            </button>
            <button 
              type="button"
              data-testid="filter-modality-students"
              @click="recipientFilter = 'estudiante'"
              :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer', recipientFilter === 'estudiante' ? 'bg-white dark:bg-white/15 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500']"
            >
              Estudiantes
            </button>
            <button 
              type="button"
              data-testid="filter-modality-teachers"
              @click="recipientFilter = 'docente'"
              :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer', recipientFilter === 'docente' ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500']"
            >
              Docentes
            </button>
            <button 
              type="button"
              data-testid="filter-modality-staff"
              @click="recipientFilter = 'personal'"
              :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer', recipientFilter === 'personal' ? 'bg-white dark:bg-white/15 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500']"
            >
              Personal
            </button>
          </div>

          <!-- Certificate Dropdown -->
          <div v-if="!isBatchMode" class="flex items-center gap-2">
            <select 
              v-model="selectedCertId" 
              data-testid="select-certificate"
              class="px-3.5 py-1.5 text-xs bg-slate-50 dark:bg-[#110926] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-slate-800 dark:text-slate-100 cursor-pointer max-w-[280px] truncate"
            >
              <option v-for="c in filteredCertificates" :key="c.id" :value="c.id">
                {{ c.recipient_name }} ({{ formatCertType(c.certificate_type) }})
              </option>
            </select>
          </div>

          <!-- Batch Indicator if in Batch Mode -->
          <div v-else class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Lote Activo: <strong>{{ batchCertificates.length }} diplomas</strong>
            </span>
            <button 
              type="button"
              @click="exitBatchMode"
              class="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
            >
              Volver a vista individual
            </button>
          </div>
        </div>

        <!-- Stamping Toggles & Edit/Delete actions -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Stamping Toggles -->
          <div class="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
            <label class="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input 
                type="checkbox" 
                v-model="stampSignatures" 
                data-testid="toggle-stamp-signatures"
                class="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <span>✍️ Firmas Digitales</span>
            </label>

            <span class="text-slate-300 dark:text-slate-600">|</span>

            <label class="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input 
                type="checkbox" 
                v-model="stampSeal" 
                data-testid="toggle-stamp-seal"
                class="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <span>🛡️ Sello Oficial</span>
            </label>
          </div>

          <!-- Edit & Delete buttons (only in single mode) -->
          <div v-if="!isBatchMode && activeCert" class="flex items-center gap-2">
            <button
              @click="openEditModal()"
              type="button"
              data-testid="btn-edit-cert"
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
              data-testid="btn-delete-cert"
              class="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Anular diploma"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Anular</span>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Certificate Loading / Empty States -->
    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Cargando certificados...</p>
    </div>

    <div v-else-if="!isBatchMode && (!activeCert || filteredCertificates.length === 0)" class="bg-white dark:bg-[#170f33] rounded-2xl p-12 text-center border border-slate-200 dark:border-white/10">
      <p class="text-4xl mb-2">📜</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay certificados para esta modalidad</h3>
      <p class="text-xs text-slate-400 mt-1">Presione "Emitir Diploma" o cambie el filtro a "Todos".</p>
    </div>

    <!-- BATCH MODE PRINT CANVAS (Sequential Multi-Page Diploma Render) -->
    <div v-else-if="isBatchMode" class="max-w-5xl mx-auto print:max-w-none print:w-full print:m-0 space-y-8 print:space-y-0">
      <div 
        v-for="(batchCert, index) in batchCertificates" 
        :key="batchCert.id || index"
        class="batch-certificate-wrapper print:page-break"
      >
        <component 
          :is="currentTemplateComponent" 
          :cert="batchCert"
          :schoolName="institutionData?.name || 'Unidad Educativa Colegio Santa Luisa'"
          :customLogo="customTemplateSettings.logo || institutionData?.logo_url"
          :officialSealUrl="institutionData?.official_seal_url"
          :signersList="institutionData?.signatures"
          :stampSignatures="stampSignatures"
          :stampSeal="stampSeal"
        />
      </div>
    </div>

    <!-- SINGLE DIPLOMA CANVAS (LANDSCAPE PREVIEW & PRINT) -->
    <div v-else id="certificate-printable-canvas" class="max-w-5xl mx-auto print:max-w-none print:w-full print:m-0">
      <component 
        :is="currentTemplateComponent" 
        :cert="activeCert"
        :schoolName="institutionData?.name || 'Unidad Educativa Colegio Santa Luisa'"
        :customLogo="customTemplateSettings.logo || institutionData?.logo_url"
        :officialSealUrl="institutionData?.official_seal_url"
        :signersList="institutionData?.signatures"
        :stampSignatures="stampSignatures"
        :stampSeal="stampSeal"
      />
    </div>

    <!-- MODAL: Emisión / Edición Individual de Diploma -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-xl flex flex-col overflow-hidden animate-scale-up">
          
          <div class="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <span class="text-lg">📜</span>
              </div>
              <div>
                <h3 class="font-black text-slate-850 dark:text-white">
                  {{ isEditingCert ? 'Editar Certificado' : 'Emitir Nuevo Diploma de Honor' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Configure los datos del destinatario, mención y autoridades firmantes
                </p>
              </div>
            </div>
            <button @click="isModalOpen = false" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer">✕</button>
          </div>

          <form @submit.prevent="saveCertificate" class="p-6 space-y-4 text-xs sm:text-sm">
            
            <!-- Modalidad -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Destinatario</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  type="button" 
                  data-testid="btn-modal-type-estudiante"
                  @click="certForm.recipient_type = 'estudiante'"
                  :class="['py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer text-center', certForm.recipient_type === 'estudiante' ? 'bg-amber-500/10 border-amber-500 text-amber-600' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500']"
                >
                  Estudiante
                </button>
                <button 
                  type="button" 
                  data-testid="btn-modal-type-docente"
                  @click="certForm.recipient_type = 'docente'"
                  :class="['py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer text-center', certForm.recipient_type === 'docente' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500']"
                >
                  Docente
                </button>
                <button 
                  type="button" 
                  data-testid="btn-modal-type-personal"
                  @click="certForm.recipient_type = 'personal'"
                  :class="['py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer text-center', certForm.recipient_type === 'personal' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500']"
                >
                  Personal / Staff
                </button>
              </div>
            </div>

            <!-- Nombre -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo del Galardonado</label>
              <input 
                v-model="certForm.recipient_name" 
                data-testid="input-cert-recipient-name"
                required
                placeholder="Ej. Pedro José Pérez Gómez"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-bold text-slate-850 dark:text-white"
              />
            </div>

            <!-- Tipo de Reconocimiento -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Certificado</label>
                <select 
                  v-model="certForm.certificate_type"
                  data-testid="select-cert-type"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-bold text-amber-600 cursor-pointer"
                >
                  <option value="excelencia_academica">Excelencia Académica</option>
                  <option value="mejor_promedio">Mejor Promedio</option>
                  <option value="conducta_excelente">Conducta Intachable</option>
                  <option value="participacion_destacada">Participación Destacada</option>
                  <option value="reconocimiento_docente">Mérito Pedagógico</option>
                  <option value="merito_personal">Mérito Institucional</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Plantilla Visual</label>
                <select 
                  v-model="certForm.template_id"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-bold text-indigo-600 cursor-pointer"
                >
                  <option value="classic">Clásico Vicenciano</option>
                  <option value="modern_gold">Excelencia Dorada</option>
                  <option value="vibrant_merit">Vanguardia Colorida</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Año Escolar</label>
                <input 
                  v-model="certForm.academic_year" 
                  data-testid="input-cert-academic-year"
                  placeholder="2025-2026"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-medium"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grado / Nivel</label>
                <input 
                  v-model="certForm.grade_level" 
                  placeholder="1er Año de Bachillerato"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-medium"
                />
              </div>
            </div>

            <!-- Conditional: Promedio si Estudiante, o Años si Docente/Personal -->
            <div v-if="certForm.recipient_type === 'estudiante'" class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Promedio (0 - 20 pts)</label>
                <input 
                  v-model.number="certForm.average_grade" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  max="20"
                  data-testid="input-cert-average"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cargo / Departamento</label>
                <input 
                  v-model="certForm.position" 
                  placeholder="Docente de Matemáticas / Control de Estudios"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-medium"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Años de Servicio</label>
                <input 
                  v-model.number="certForm.years_of_service" 
                  type="number" 
                  placeholder="10"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <!-- Texto Conmemorativo -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Texto de Motivación</label>
              <textarea 
                v-model="certForm.description" 
                rows="2"
                data-testid="textarea-cert-description"
                placeholder="Por haber demostrado excelencia académica y apego a los principios éticos..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 resize-none font-serif text-xs"
              ></textarea>
            </div>

            <!-- Footer Buttons -->
            <div class="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="isModalOpen = false"
                class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                data-testid="btn-save-cert"
                class="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-md cursor-pointer"
              >
                {{ isEditingCert ? 'Guardar Cambios' : 'Emitir y Registrar Diploma' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Personalizador de Plantilla (Imágenes Patronales, Títulos) -->
    <Teleport to="body">
      <div 
        v-if="isCustomizerModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
        @click.self="isCustomizerModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg p-6 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 class="font-black text-base text-slate-850 dark:text-white flex items-center gap-2">
              <span>⚙️ Personalizador de Diplomas</span>
            </h3>
            <button @click="isCustomizerModalOpen = false" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Insignia Izquierda</label>
              <select v-model="customTemplateSettings.left_image" class="w-full p-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <option value="/logocolegio.png">Escudo Oficial U.E Santa Luisa</option>
                <option value="/images/santaluisa.png">Efigie de Santa Luisa de Marillac</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Insignia Derecha</label>
              <select v-model="customTemplateSettings.right_image" class="w-full p-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <option value="/images/santaluisa.png">Efigie de Santa Luisa de Marillac</option>
                <option value="/logocolegio.png">Escudo Oficial U.E Santa Luisa</option>
              </select>
            </div>

            <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p class="text-xs text-amber-800 dark:text-amber-300">
                💡 <strong>Bóveda de Sellos y Firmas:</strong> Para actualizar el sello oficial escaneado o las firmas caligráficas autorizadas, diríjase al módulo de <nuxt-link to="/settings" class="underline font-bold">Configuración > Firmas y Sellos</nuxt-link>.
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
            <button 
              @click="isCustomizerModalOpen = false" 
              class="px-5 py-2 bg-slate-850 hover:bg-slate-950 text-white font-bold rounded-xl text-xs"
            >
              Cerrar y Aplicar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Emisión en Lote (BatchPrintModal) -->
    <BatchPrintModal 
      :is-open="isBatchModalOpen"
      academic-year="2025-2026"
      @close="isBatchModalOpen = false"
      @batch-generated="handleBatchGenerated"
    />

    <!-- MODAL: Anular / Eliminar Diploma Confirmation -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white dark:bg-[#170f33] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 text-center animate-scale-up">
          <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200/60">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">¿Anular este Diploma?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
            El certificado de <strong class="text-slate-800 dark:text-slate-100">{{ certToDelete?.recipient_name }}</strong> será invalidado en el sistema y su código QR quedará revocado.
          </p>

          <div class="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
            <button 
              type="button" 
              @click="isDeleteModalOpen = false"
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              data-testid="btn-confirm-delete-cert"
              @click="confirmDeleteCert"
              class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
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
import { useInstitution } from '~/composables/useInstitution'
import { usePdfExport } from '~/composables/usePdfExport'

import ClassicTemplate from '~/components/certificates/templates/ClassicTemplate.vue'
import ModernGoldTemplate from '~/components/certificates/templates/ModernGoldTemplate.vue'
import VibrantMeritTemplate from '~/components/certificates/templates/VibrantMeritTemplate.vue'
import BatchPrintModal from '~/components/certificates/BatchPrintModal.vue'

const api = useApi()
const toast = useToast()
const { institution: institutionData } = useInstitution()
const { downloadPdf, isExporting } = usePdfExport()

// State
const certificates = ref([])
const loading = ref(true)
const selectedCertId = ref(null)
const selectedTemplateId = ref('classic')
const recipientFilter = ref('all')
const stampSignatures = ref(true)
const stampSeal = ref(true)

// Modals
const isModalOpen = ref(false)
const isEditingCert = ref(false)
const isCustomizerModalOpen = ref(false)
const isBatchModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const certToDelete = ref(null)

// Batch mode
const isBatchMode = ref(false)
const batchCertificates = ref([])

// Customizer state
const customTemplateSettings = ref({
  left_image: '/logocolegio.png',
  right_image: '/images/santaluisa.png',
  logo: null
})

// Template dynamic mapper
const templateComponents = {
  classic: ClassicTemplate,
  modern_gold: ModernGoldTemplate,
  vibrant_merit: VibrantMeritTemplate
}

const currentTemplateComponent = computed(() => {
  return templateComponents[selectedTemplateId.value] || ClassicTemplate
})

// Form state
const certForm = ref({
  recipient_name: 'Pedro Pérez Gómez',
  recipient_type: 'estudiante',
  certificate_type: 'excelencia_academica',
  template_id: 'classic',
  academic_year: '2025-2026',
  grade_level: '1er Año de Educación Media General',
  average_grade: 19.8,
  position: '',
  years_of_service: 5,
  issued_by: 'Sor María Dolores Amaya',
  issued_role: 'Directora General',
  description: 'Por haber demostrado excelencia académica, constancia, alto espíritu vicenciano y disciplina ejemplar en sus actividades formativas.'
})

// Fetch all certificates
const fetchCertificates = async () => {
  loading.value = true
  try {
    const res = await api.get('certificates', { $sort: { id: -1 } })
    const list = res?.data || res || []
    certificates.value = list.filter(c => !c.is_deleted && c.status !== 'anulado')

    if (certificates.value.length > 0 && (!selectedCertId.value || !certificates.value.some(c => c.id === selectedCertId.value))) {
      selectedCertId.value = certificates.value[0].id
    }
  } catch (err) {
    console.error('Error fetching certificates:', err)
  } finally {
    loading.value = false
  }
}

// Filtered certificates by modality
const filteredCertificates = computed(() => {
  if (recipientFilter.value === 'all') return certificates.value
  return certificates.value.filter(c => (c.recipient_type || 'estudiante') === recipientFilter.value)
})

// Active certificate
const activeCert = computed(() => {
  if (filteredCertificates.value.length === 0) return null
  return filteredCertificates.value.find(c => c.id === selectedCertId.value) || filteredCertificates.value[0] || null
})

// Format certificate types
const formatCertType = (type) => {
  switch (type) {
    case 'excelencia_academica': return 'Excelencia Académica'
    case 'mejor_promedio': return 'Mejor Promedio'
    case 'conducta_excelente': return 'Conducta Excelente'
    case 'participacion_destacada': return 'Participación Destacada'
    case 'reconocimiento_docente': return 'Mérito Pedagógico'
    case 'merito_personal': return 'Mérito Institucional'
    default: return type || 'Excelencia'
  }
}

// Actions
const triggerPrint = () => {
  window.print()
}

const downloadCertificatePdf = async () => {
  const recipient = (activeCert.value?.recipient_name || 'Diploma').replace(/\s+/g, '_')
  const mention = (activeCert.value?.title || 'Honor').replace(/\s+/g, '_')
  await downloadPdf('certificate-printable-canvas', `Diploma_${recipient}_${mention}_2026_2027`, {
    orientation: 'landscape',
    format: 'letter'
  })
}

const exitBatchMode = () => {
  isBatchMode.value = false
  batchCertificates.value = []
}

const handleBatchGenerated = (batchPayload) => {
  batchCertificates.value = batchPayload.certificates
  if (batchPayload.templateId) {
    selectedTemplateId.value = batchPayload.templateId
  }
  stampSignatures.value = batchPayload.stampSignatures
  stampSeal.value = batchPayload.stampSeal
  isBatchMode.value = true
  
  // Also refresh full list
  fetchCertificates()
}

const openCreateModal = () => {
  isEditingCert.value = false
  certForm.value = {
    recipient_name: '',
    recipient_type: recipientFilter.value !== 'all' ? recipientFilter.value : 'estudiante',
    certificate_type: 'excelencia_academica',
    template_id: selectedTemplateId.value,
    academic_year: '2025-2026',
    grade_level: '1er Año de Educación Media General',
    average_grade: 19.5,
    position: '',
    years_of_service: 5,
    issued_by: 'Sor María Dolores Amaya',
    issued_role: 'Directora General',
    description: 'Por su sobresaliente desempeño académico, apego a los valores de la institución y excelencia moral y vicenciana.'
  }
  isModalOpen.value = true
}

const openEditModal = () => {
  if (!activeCert.value) return
  isEditingCert.value = true
  const c = activeCert.value
  certForm.value = {
    recipient_name: c.recipient_name || '',
    recipient_type: c.recipient_type || 'estudiante',
    certificate_type: c.certificate_type || 'excelencia_academica',
    template_id: c.template_id || selectedTemplateId.value,
    academic_year: c.academic_year || '2025-2026',
    grade_level: c.grade_level || '',
    average_grade: c.average_grade || 19,
    position: c.position || '',
    years_of_service: c.metadata?.years_of_service || 5,
    issued_by: c.issued_by || 'Sor María Dolores Amaya',
    issued_role: c.issued_role || 'Directora General',
    description: c.description || ''
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
    await api.patch(`certificates/${id}`, { status: 'anulado', is_deleted: true })
    certificates.value = certificates.value.filter(c => c.id !== id)
    if (selectedCertId.value === id) {
      selectedCertId.value = certificates.value[0]?.id || null
    }
    isDeleteModalOpen.value = false
    toast.success('Certificado Anulado', 'El diploma ha sido revocado con éxito.')
  } catch (err) {
    toast.error('Error', 'No se pudo anular el certificado: ' + err.message)
  }
}

const saveCertificate = async () => {
  try {
    if (isEditingCert.value && selectedCertId.value) {
      const payload = { 
        ...certForm.value,
        metadata: {
          years_of_service: certForm.value.years_of_service,
          left_image: customTemplateSettings.value.left_image,
          right_image: customTemplateSettings.value.right_image
        }
      }
      await api.patch(`certificates/${selectedCertId.value}`, payload)
      
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
      status: 'emitido',
      metadata: {
        years_of_service: certForm.value.years_of_service,
        left_image: customTemplateSettings.value.left_image,
        right_image: customTemplateSettings.value.right_image
      }
    }

    const created = await api.post('certificates', payload)
    if (created?.id) {
      certificates.value.unshift(created)
      selectedCertId.value = created.id
      if (created.template_id) {
        selectedTemplateId.value = created.template_id
      }
    } else {
      await fetchCertificates()
    }
    isModalOpen.value = false
    toast.success('Diploma Emitido', 'El certificado ceremonial se ha registrado exitosamente.')
  } catch (err) {
    toast.error('Error al guardar', err.message || 'No se pudo guardar el certificado')
  }
}

onMounted(fetchCertificates)
</script>

<style>
@media print {
  @page {
    size: letter landscape;
    margin: 8mm;
  }
  body {
    background: white !important;
  }
  .certificate-sheet {
    page-break-after: always;
    break-after: page;
    width: 100% !important;
    height: 100vh !important;
    max-height: 100vh !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .batch-certificate-wrapper {
    page-break-after: always;
    break-after: page;
  }
}
</style>
