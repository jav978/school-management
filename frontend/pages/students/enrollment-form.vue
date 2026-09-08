<template>
  <div class="min-h-screen pb-16 font-sans bg-slate-100/60 dark:bg-slate-950/80 transition-colors print:bg-white print:p-0">
    
    <!-- ============================================================ -->
    <!-- SCREEN ONLY: Action Bar & Header Navigation (Hidden on Print) -->
    <!-- ============================================================ -->
    <div class="print:hidden max-w-[1020px] mx-auto px-4 pt-6 space-y-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm">
        <div class="flex items-center gap-3.5">
          <NuxtLink 
            to="/students" 
            class="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Volver al Listado de Estudiantes"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>📋</span>
              <span>Ficha Oficial de Inscripción y Matrícula</span>
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              U.E. Colegio "Santa Luisa" • Año Escolar 2026 - 2027 • Formato Oficial de 2 Páginas
            </p>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Load Existing Student Dropdown -->
          <div v-if="registeredStudents.length > 0" class="relative">
            <select
              v-model="selectedStudentId"
              @change="loadStudentData(selectedStudentId)"
              class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">-- Cargar Expediente Existente --</option>
              <option v-for="s in registeredStudents" :key="s.id" :value="s.id">
                {{ s.student_id || ('EST-' + s.id) }} — {{ s.first_name }} {{ s.last_name }}
              </option>
            </select>
          </div>

          <!-- Download Blank PDF -->
          <button
            type="button"
            @click="downloadPdf(true)"
            :disabled="isGeneratingPdf"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
            title="Descargar PDF oficial en blanco para entregar al representante"
          >
            <span v-if="isGeneratingPdf" class="animate-spin w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full"></span>
            <span v-else>📄</span>
            <span>Descargar PDF (En Blanco)</span>
          </button>

          <!-- Download Filled PDF -->
          <button
            type="button"
            @click="downloadPdf(false)"
            :disabled="isGeneratingPdf"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
            title="Descargar PDF oficial con todos los datos y fotos transcritos"
          >
            <span v-if="isGeneratingPdf" class="animate-spin w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full"></span>
            <span v-else>📥</span>
            <span>Descargar PDF (Con Datos)</span>
          </button>

          <!-- Native Print Dialog -->
          <button
            type="button"
            @click="printClean"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Imprimir directamente desde el navegador de forma aislada"
          >
            <span>🖨️</span>
            <span>Imprimir</span>
          </button>

          <!-- Save to Database -->
          <button
            type="button"
            @click="saveEnrollment"
            :disabled="isSaving"
            class="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-purple hover:to-brand-primary text-white shadow-md shadow-brand-primary/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span v-if="isSaving" class="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>💾</span>
            <span>{{ isSaving ? 'Guardando...' : 'Guardar en Sistema' }}</span>
          </button>

          <!-- Reset / Clear -->
          <button
            type="button"
            @click="resetForm"
            class="px-3 py-2 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Restablecer todos los campos"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Information Card -->
      <div class="p-4 rounded-2xl bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/40 text-sky-800 dark:text-sky-300 text-xs flex items-start gap-3 shadow-xs">
        <span class="text-lg flex-shrink-0">🏛️</span>
        <div class="leading-relaxed">
          <strong>Registro Maestro Oficial de Matrícula (Gestión Escolar 2026 - 2027):</strong>
          Al pulsar <em>"Guardar en Sistema"</em>, se registran automáticamente el Alumno en la base de datos, los Representantes (Padre/Madre/Autorizado con fotos hasta 3MB) y se archiva una copia del PDF oficial en el expediente digital del estudiante.
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MASTER PRINTABLE CONTAINER (Pages 1 and 2) -->
    <!-- ============================================================ -->
    <div id="printable-enrollment-document" class="max-w-[1020px] mx-auto px-4 print:p-0 print:m-0 print:max-w-none">
      
      <!-- ############################################################ -->
      <!-- PÁGINA 1: FILIACIÓN DEL ALUMNO, PADRES Y DOMICILIO -->
      <!-- ############################################################ -->
      <div class="page-sheet bg-white text-slate-900 shadow-xl print:shadow-none rounded-3xl print:rounded-none p-6 sm:p-9 border border-slate-200 print:border-none mb-8 print:mb-0">
        
        <!-- INSTITUTIONAL MPPE & SANTA LUISA HEADER -->
        <div class="border-b-2 border-black pb-3 mb-4">
          <div class="flex items-center justify-between gap-3">
            <!-- Official Logo -->
            <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center p-1 border border-slate-300 print:border-black rounded-xl">
              <img src="/logocolegio.png" alt="Logo Colegio Santa Luisa" class="w-full h-full object-contain" />
            </div>

            <!-- Header Text -->
            <div class="flex-1 text-center leading-tight">
              <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 print:text-black leading-snug">
                REPÚBLICA BOLIVARIANA DE VENEZUELA<br>
                MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
              </p>
              <h2 class="text-base sm:text-lg font-black font-display text-slate-900 print:text-black mt-0.5 tracking-wide">
                U.E. COLEGIO "SANTA LUISA"
              </h2>
              <p class="text-[9px] font-semibold text-slate-700 print:text-black mb-1">
                R.I.F. J-12345678-9 • Código DEA: S0000D0101
              </p>
              <div class="inline-block mt-0.5 px-3 py-0.5 rounded-full bg-slate-100 print:bg-transparent border border-slate-300 print:border-black">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-900 print:text-black">
                  PLANILLA OFICIAL DE INSCRIPCIÓN Y REGISTRO ESCOLAR (PÁG. 1/2)
                </span>
              </div>
            </div>

            <!-- Student 3x4 Photo Card -->
            <div class="w-24 h-32 flex-shrink-0 border-2 border-dashed border-slate-400 print:border-black rounded-lg flex flex-col items-center justify-center text-center p-1 bg-slate-50 print:bg-white relative overflow-hidden">
              <img 
                v-if="form.student.photo_url" 
                :src="resolvePreview(form.student.photo_url)" 
                alt="Foto del Alumno" 
                class="w-full h-full object-cover rounded" 
              />
              <div v-else class="text-[8px] font-bold text-slate-500 print:text-black uppercase leading-tight">
                <span>FOTO CARNET</span>
                <span class="block text-[7px] font-normal mt-0.5">ALUMNO (3x4 cm)</span>
              </div>
            </div>
          </div>

          <!-- Metadata Bar -->
          <div class="flex justify-between items-center text-[9px] font-bold uppercase text-slate-700 print:text-black mt-2 pt-1.5 border-t border-slate-200 print:border-black">
            <div>GESTIÓN ESCOLAR: <span class="font-black text-slate-900 print:text-black">2026 - 2027</span></div>
            <div>FECHA DE REGISTRO: <span class="font-black text-slate-900 print:text-black">{{ currentDateFormatted }}</span></div>
            <div>ESTADO: <span class="font-black text-slate-900 print:text-black">{{ form.student.birth_state || 'DISTRITO CAPITAL (CARACAS)' }}</span></div>
          </div>
        </div>

        <!-- In-Screen Photo Selector for Student (Hidden on Print) -->
        <div class="print:hidden mb-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <UiAvatarUpload
            v-model="form.student.photo_url"
            v-model:stage="form.student.photo_stage"
            label="Foto Carnet del Estudiante (3x4 cm - Máx. 3MB)"
            :show-stage-selector="true"
          />
        </div>

        <!-- ============================================================ -->
        <!-- SECCIÓN A: DATOS DEL ALUMNO -->
        <!-- ============================================================ -->
        <div class="mb-3.5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
          <div class="bg-slate-100 print:bg-slate-200 px-3 py-1 border-b border-slate-300 print:border-black flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-900 print:text-black">
              A. DATOS DEL ALUMNO
            </span>
            <span class="text-[9px] font-bold text-slate-600 print:text-black">
              Cédula / CE: {{ form.student.national_id || 'S/N' }}
            </span>
          </div>

          <div class="p-2.5 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div class="sm:col-span-2">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">1. Apellidos (Según C.I.) *</label>
              <input 
                v-model="form.student.last_name" 
                type="text" 
                placeholder="Ej: VASQUEZ MADRID" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[11px] font-semibold uppercase"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">2. Nombres (Según C.I.) *</label>
              <input 
                v-model="form.student.first_name" 
                type="text" 
                placeholder="Ej: JOSE ALEJANDRO" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[11px] font-semibold uppercase"
              />
            </div>

            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">3. Lugar de Nacimiento</label>
              <input 
                v-model="form.student.birth_place" 
                type="text" 
                placeholder="Ciudad / Municipio" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">4. Estado</label>
              <input 
                v-model="form.student.birth_state" 
                type="text" 
                placeholder="Distrito Capital, Miranda..." 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">5. País</label>
              <input 
                v-model="form.student.birth_country" 
                type="text" 
                placeholder="VENEZUELA" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">6. Fecha de Nacimiento</label>
              <input 
                v-model="form.student.date_of_birth" 
                type="date" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
              />
            </div>

            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">7. Número de CI o CE *</label>
              <input 
                v-model="form.student.national_id" 
                type="text" 
                placeholder="V-33157830 o CE" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-mono font-bold uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">8. Grado a Inscribir *</label>
              <select 
                v-model="form.student.grade" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-bold cursor-pointer"
              >
                <optgroup label="Educación Inicial">
                  <option value="Primer Nivel Inicial">Primer Nivel Inicial</option>
                  <option value="Segundo Nivel Inicial">Segundo Nivel Inicial</option>
                  <option value="Tercer Nivel Inicial">Tercer Nivel Inicial</option>
                </optgroup>
                <optgroup label="Educación Primaria">
                  <option value="Primer Grado">Primer Grado</option>
                  <option value="Segundo Grado">Segundo Grado</option>
                  <option value="Tercer Grado">Tercer Grado</option>
                  <option value="Cuarto Grado">Cuarto Grado</option>
                  <option value="Quinto Grado">Quinto Grado</option>
                  <option value="Sexto Grado">Sexto Grado</option>
                </optgroup>
                <optgroup label="Educación Media General">
                  <option value="1er Año">1er Año</option>
                  <option value="2do Año">2do Año</option>
                  <option value="3er Año">3er Año</option>
                  <option value="4to Año">4to Año</option>
                  <option value="5to Año">5to Año</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Matrícula Gestión Escolar</label>
              <input 
                v-model="form.student.school_year" 
                type="text" 
                placeholder="2026-2027" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-semibold uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Código Matrícula (ID)</label>
              <input 
                v-model="form.student.student_id" 
                type="text" 
                placeholder="EST-001" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-mono font-bold uppercase"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">9. Apellidos y Nombres Responsable Económico</label>
              <input 
                v-model="form.student.economic_responsible_name" 
                type="text" 
                placeholder="Nombre completo del responsable" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">10. Ocupación</label>
              <input 
                v-model="form.student.economic_responsible_occupation" 
                type="text" 
                placeholder="Ocupación / Cargo" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">11. Nivel de Estudio</label>
              <select 
                v-model="form.student.economic_responsible_education" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer"
              >
                <option value="Primaria">Primaria</option>
                <option value="Bachiller">Bachiller</option>
                <option value="TSU">TSU</option>
                <option value="Universitario">Universitario</option>
                <option value="Postgrado">Postgrado</option>
              </select>
            </div>

            <div class="sm:col-span-4">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">12. Apellidos y Nombres de Hermanos en este Plantel y Grado que Cursa cada uno</label>
              <input 
                v-model="form.student.siblings_in_school" 
                type="text" 
                placeholder="Ej: SANTIAGO JOSE VASQUEZ MADRID — 3er Grado (o 'Ninguno')" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- SECCIÓN B: DATOS DE LOS PADRES Y FOTOS DE CONTROL DE RETIRO -->
        <!-- ============================================================ -->
        <div class="mb-3.5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
          <div class="bg-slate-100 print:bg-slate-200 px-3 py-1 border-b border-slate-300 print:border-black flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-900 print:text-black">
              B. DATOS DE LOS PADRES Y CONTROL BIOMÉTRICO DE RETIRO
            </span>
            <span class="text-[9px] font-bold text-amber-700 print:text-black uppercase">
              Verificación Facial de Portería
            </span>
          </div>

          <div class="p-2.5 space-y-3 text-xs">
            <!-- PADRE -->
            <div class="p-2 border border-slate-200 print:border-slate-800 rounded-lg bg-slate-50/50 print:bg-transparent">
              <div class="flex flex-col sm:flex-row gap-3 items-start">
                <div class="flex-shrink-0 flex flex-col items-center">
                  <div class="w-20 h-24 border border-dashed border-slate-400 print:border-black rounded flex items-center justify-center bg-white overflow-hidden text-center p-0.5">
                    <img 
                      v-if="form.father.photo_url" 
                      :src="resolvePreview(form.father.photo_url)" 
                      alt="Foto Padre" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="text-[7px] font-bold text-slate-400 print:text-black uppercase leading-tight">
                      FOTO CARNET<br>PADRE<br>(3x4)
                    </div>
                  </div>
                  <span class="text-[8px] font-black uppercase mt-1 text-slate-700 print:text-black">PADRE</span>
                </div>

                <div class="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                  <div class="sm:col-span-2">
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">1. Apellidos y Nombres del Padre</label>
                    <input 
                      v-model="form.father.full_name" 
                      type="text" 
                      placeholder="JOSE ANTONIO VASQUEZ" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase font-semibold"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">2. Cédula Identidad</label>
                    <input 
                      v-model="form.father.national_id" 
                      type="text" 
                      placeholder="V-14645240" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-mono font-bold uppercase"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-1.5">
                    <div>
                      <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">3. Edad</label>
                      <input 
                        v-model="form.father.age" 
                        type="text" 
                        placeholder="41" 
                        class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                      />
                    </div>
                    <div>
                      <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">4. Nacionalidad</label>
                      <input 
                        v-model="form.father.nationality" 
                        type="text" 
                        placeholder="VENEZOLANO" 
                        class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">5. Ocupación</label>
                    <input 
                      v-model="form.father.occupation" 
                      type="text" 
                      placeholder="TÉCNICO" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">6. Nivel de Estudio</label>
                    <select v-model="form.father.education_level" class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer">
                      <option value="Primaria">Primaria</option>
                      <option value="Bachiller">Bachiller</option>
                      <option value="TSU">TSU</option>
                      <option value="Universitario">Universitario</option>
                      <option value="Postgrado">Postgrado</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">7. Celular</label>
                    <input 
                      v-model="form.father.phone_mobile" 
                      type="text" 
                      placeholder="0426-921-71-18" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-bold"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">8. E-mail</label>
                    <input 
                      v-model="form.father.email" 
                      type="email" 
                      placeholder="correo@ejemplo.com" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                    />
                  </div>

                  <div class="sm:col-span-4">
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">9. Nombre y Dirección de la Empresa donde trabaja</label>
                    <input 
                      v-model="form.father.employer" 
                      type="text" 
                      placeholder="Empresa o institución laboral del padre" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                    />
                  </div>
                </div>
              </div>

              <div class="print:hidden mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <UiAvatarUpload
                  v-model="form.father.photo_url"
                  label="Foto Carnet del Padre (Máx. 3MB)"
                />
              </div>
            </div>

            <!-- MADRE -->
            <div class="p-2 border border-slate-200 print:border-slate-800 rounded-lg bg-slate-50/50 print:bg-transparent">
              <div class="flex flex-col sm:flex-row gap-3 items-start">
                <div class="flex-shrink-0 flex flex-col items-center">
                  <div class="w-20 h-24 border border-dashed border-slate-400 print:border-black rounded flex items-center justify-center bg-white overflow-hidden text-center p-0.5">
                    <img 
                      v-if="form.mother.photo_url" 
                      :src="resolvePreview(form.mother.photo_url)" 
                      alt="Foto Madre" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="text-[7px] font-bold text-slate-400 print:text-black uppercase leading-tight">
                      FOTO CARNET<br>MADRE<br>(3x4)
                    </div>
                  </div>
                  <span class="text-[8px] font-black uppercase mt-1 text-slate-700 print:text-black">MADRE</span>
                </div>

                <div class="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                  <div class="sm:col-span-2">
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">10. Apellidos y Nombres de la Madre</label>
                    <input 
                      v-model="form.mother.full_name" 
                      type="text" 
                      placeholder="PRISCILLA ALEJANDRA MADRID TOVAR" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase font-semibold"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">11. Cédula Identidad</label>
                    <input 
                      v-model="form.mother.national_id" 
                      type="text" 
                      placeholder="V-14163778" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-mono font-bold uppercase"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-1.5">
                    <div>
                      <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">12. Edad</label>
                      <input 
                        v-model="form.mother.age" 
                        type="text" 
                        placeholder="40" 
                        class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                      />
                    </div>
                    <div>
                      <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">13. Nacionalidad</label>
                      <input 
                        v-model="form.mother.nationality" 
                        type="text" 
                        placeholder="VENEZOLANA" 
                        class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">14. Ocupación</label>
                    <input 
                      v-model="form.mother.occupation" 
                      type="text" 
                      placeholder="PLANIFICADORA" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">15. Nivel de Estudio</label>
                    <select v-model="form.mother.education_level" class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer">
                      <option value="Primaria">Primaria</option>
                      <option value="Bachiller">Bachiller</option>
                      <option value="TSU">TSU</option>
                      <option value="Universitario">Universitario</option>
                      <option value="Postgrado">Postgrado</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">16. Celular</label>
                    <input 
                      v-model="form.mother.phone_mobile" 
                      type="text" 
                      placeholder="0426-915-69-12" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-bold"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">17. E-mail</label>
                    <input 
                      v-model="form.mother.email" 
                      type="email" 
                      placeholder="correo@ejemplo.com" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                    />
                  </div>

                  <div class="sm:col-span-4">
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">18. Nombre y Dirección de la Empresa donde trabaja</label>
                    <input 
                      v-model="form.mother.employer" 
                      type="text" 
                      placeholder="Empresa o institución laboral de la madre" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                    />
                  </div>
                </div>
              </div>

              <div class="print:hidden mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <UiAvatarUpload
                  v-model="form.mother.photo_url"
                  label="Foto Carnet de la Madre (Máx. 3MB)"
                />
              </div>
            </div>

            <!-- TERCERO AUTORIZADO A RETIRAR -->
            <div class="p-2 border border-slate-200 print:border-slate-800 rounded-lg bg-slate-50/30 print:bg-transparent">
              <div class="flex flex-col sm:flex-row gap-3 items-start">
                <div class="flex-shrink-0 flex flex-col items-center">
                  <div class="w-20 h-24 border border-dashed border-slate-400 print:border-black rounded flex items-center justify-center bg-white overflow-hidden text-center p-0.5">
                    <img 
                      v-if="form.authorized_pickup.photo_url" 
                      :src="resolvePreview(form.authorized_pickup.photo_url)" 
                      alt="Foto Autorizado" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="text-[7px] font-bold text-slate-400 print:text-black uppercase leading-tight">
                      FOTO CARNET<br>AUTORIZADO<br>(3x4)
                    </div>
                  </div>
                  <span class="text-[7px] font-black uppercase mt-1 text-slate-700 print:text-black">AUTORIZADO</span>
                </div>

                <div class="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                  <div class="sm:col-span-2">
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Tercero Autorizado a Retirar (Nombres y Apellidos)</label>
                    <input 
                      v-model="form.authorized_pickup.full_name" 
                      type="text" 
                      placeholder="Ej: ABUELA MATERNA / FAMILIAR AUTORIZADO" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Cédula de Identidad</label>
                    <input 
                      v-model="form.authorized_pickup.national_id" 
                      type="text" 
                      placeholder="V-0000000" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Parentesco</label>
                    <select v-model="form.authorized_pickup.relationship" class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer">
                      <option value="abuela">Abuelo(a)</option>
                      <option value="tio">Tío(a)</option>
                      <option value="hermano">Hermano(a) Mayor de Edad</option>
                      <option value="transporte">Transportista Escolar</option>
                      <option value="otro">Otro Autorizado</option>
                    </select>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Celular de Contacto</label>
                    <input 
                      v-model="form.authorized_pickup.phone_mobile" 
                      type="text" 
                      placeholder="0416-0000000" 
                      class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                    />
                  </div>
                  <div class="sm:col-span-2 flex items-center gap-2 pt-3">
                    <input 
                      v-model="form.authorized_pickup.authorized" 
                      type="checkbox" 
                      id="auth_chk" 
                      class="w-3.5 h-3.5 rounded border-slate-300 text-brand-primary cursor-pointer" 
                    />
                    <label for="auth_chk" class="text-[9px] font-bold uppercase text-slate-800 print:text-black cursor-pointer">
                      Autorizado formalmente para retirar al estudiante
                    </label>
                  </div>
                </div>
              </div>

              <div class="print:hidden mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <UiAvatarUpload
                  v-model="form.authorized_pickup.photo_url"
                  label="Foto Carnet del Tercero Autorizado (Máx. 3MB)"
                />
              </div>
            </div>

          </div>
        </div>

        <!-- ============================================================ -->
        <!-- SECCIÓN C: DIRECCIÓN COMPLETA DEL DOMICILIO -->
        <!-- ============================================================ -->
        <div class="border border-slate-300 print:border-black rounded-xl overflow-hidden">
          <div class="bg-slate-100 print:bg-slate-200 px-3 py-1 border-b border-slate-300 print:border-black flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-900 print:text-black">
              C. DIRECCIÓN COMPLETA DEL DOMICILIO Y CONTACTOS DE EMERGENCIA
            </span>
          </div>

          <div class="p-2.5 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div class="sm:col-span-4">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">1. Dirección Habitación *</label>
              <input 
                v-model="form.student.address" 
                type="text" 
                placeholder="Av. Bogotá Casa N° 7-1, El Cementerio, Parroquia Santa Rosalía, Caracas" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">2. Teléfono Habitación</label>
              <input 
                v-model="form.student.phone_home" 
                type="text" 
                placeholder="0212-631-63-82" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">3. Teléfono de Otro Familiar o Vecino</label>
              <input 
                v-model="form.student.phone_relative_neighbor" 
                type="text" 
                placeholder="0416-713-28-98" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
              />
            </div>

            <div class="sm:col-span-2 grid grid-cols-3 gap-1.5">
              <div class="col-span-2">
                <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">4. Teléfono Trabajo Papá</label>
                <input 
                  v-model="form.student.work_phone_father" 
                  type="text" 
                  placeholder="0212-0000000" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                />
              </div>
              <div>
                <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Ext. / Dpto.</label>
                <input 
                  v-model="form.student.work_phone_father_ext" 
                  type="text" 
                  placeholder="Ext. 102" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                />
              </div>
            </div>

            <div class="sm:col-span-2 grid grid-cols-3 gap-1.5">
              <div class="col-span-2">
                <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">5. Teléfono Trabajo Mamá</label>
                <input 
                  v-model="form.student.work_phone_mother" 
                  type="text" 
                  placeholder="0212-0000000" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                />
              </div>
              <div>
                <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Ext. / Dpto.</label>
                <input 
                  v-model="form.student.work_phone_mother_ext" 
                  type="text" 
                  placeholder="Ext. 204" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
                />
              </div>
            </div>

            <div class="sm:col-span-4 p-2 bg-rose-50/40 print:bg-transparent rounded border border-rose-200 print:border-black grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="sm:col-span-3 text-[9px] font-bold uppercase text-rose-800 print:text-black">
                6. OTROS TELÉFONOS EN CASO DE CUADRO VIRAL O EMERGENCIA EN EL ALUMNO(A):
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Emergencia 1</label>
                <input 
                  v-model="form.student.emergency_viral_phone1" 
                  type="text" 
                  placeholder="0212-860-84-71" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-bold"
                />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Emergencia 2</label>
                <input 
                  v-model="form.student.emergency_viral_phone2" 
                  type="text" 
                  placeholder="0424-215-60-83" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-bold"
                />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Preguntar por (Contacto)</label>
                <input 
                  v-model="form.student.emergency_contact_ask_for" 
                  type="text" 
                  placeholder="JOSEFINA MONASTERIOS" 
                  class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] font-bold uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- SECCIÓN D: PLANTELES DONDE ESTUDIÓ EL ALUMNO (HISTORIAL) -->
        <!-- ============================================================ -->
        <div class="mt-3.5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
          <div class="bg-slate-100 print:bg-slate-200 px-3 py-1 border-b border-slate-300 print:border-black">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-900 print:text-black">
              D. PLANTELES DONDE ESTUDIÓ EL ALUMNO (HISTORIAL ESCOLAR)
            </span>
          </div>

          <div class="p-2 overflow-x-auto">
            <table class="w-full text-left text-[9px] border-collapse">
              <thead>
                <tr class="border-b border-slate-300 print:border-black font-black uppercase text-slate-700 print:text-black bg-slate-50 print:bg-transparent">
                  <th class="py-1 px-1.5 w-24">GRADO</th>
                  <th class="py-1 px-1.5 w-24">AÑO ESCOLAR</th>
                  <th class="py-1 px-1.5">NOMBRE DEL PLANTEL</th>
                  <th class="py-1 px-1.5 w-28">CIUDAD</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in form.previous_schools" :key="idx" class="border-b border-slate-200 print:border-slate-400">
                  <td class="py-0.5 px-1.5 font-bold uppercase">{{ row.grade }}</td>
                  <td class="py-0.5 px-1.5">
                    <input v-model="row.school_year" type="text" placeholder="2020-2021" class="w-full px-1 py-0.5 border-b border-slate-200 print:border-none text-[9px]" />
                  </td>
                  <td class="py-0.5 px-1.5">
                    <input v-model="row.school_name" type="text" placeholder="Unidad Educativa..." class="w-full px-1 py-0.5 border-b border-slate-200 print:border-none text-[9px] uppercase" />
                  </td>
                  <td class="py-0.5 px-1.5">
                    <input v-model="row.city" type="text" placeholder="CARACAS" class="w-full px-1 py-0.5 border-b border-slate-200 print:border-none text-[9px] uppercase" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PIE DE PÁGINA: PÁGINA 1 -->
        <div class="mt-4 pt-2 border-t border-slate-300 print:border-black flex justify-between items-center text-[9px] font-bold text-slate-600 print:text-black">
          <div>
            Comunidad Educativa Vicenciana • Calle Real del Prado de María, Caracas
          </div>
          <div class="font-black text-slate-900 print:text-black uppercase tracking-wider">
            PÁGINA 1 DE 2
          </div>
        </div>

      </div>

      <!-- ############################################################ -->
      <!-- PÁGINA 2: DATOS FAMILIARES, VIVIENDA, SALUD, RECAUDOS, CRONOLOGÍA Y COMPROMISO -->
      <!-- ############################################################ -->
      <div class="page-sheet page-break-before bg-white text-slate-900 shadow-xl print:shadow-none rounded-3xl print:rounded-none p-6 sm:p-9 border border-slate-200 print:border-none">
        
        <!-- HEADER CONTINUIDAD PÁGINA 2 -->
        <div class="border-b-2 border-black pb-2 mb-3.5 flex justify-between items-center">
          <div>
            <h3 class="text-sm font-black font-display uppercase tracking-wider text-slate-900 print:text-black">
              U.E. COLEGIO "SANTA LUISA" • ESTUDIO SOCIOECONÓMICO Y COMPROMISOS (PÁG. 2/2)
            </h3>
            <p class="text-[9px] font-bold text-slate-600 print:text-black">
              ESTUDIANTE: <span class="uppercase text-slate-900 print:text-black">{{ form.student.last_name || '____________' }}, {{ form.student.first_name || '____________' }}</span> • C.I.: <span class="font-mono">{{ form.student.national_id || '____________' }}</span> • AÑO ESCOLAR: <strong>2026 - 2027</strong>
            </p>
          </div>
          <div class="text-right text-[9px] font-black uppercase text-slate-700 print:text-black">
            EXPEDIENTE OFICIAL DE MATRÍCULA
          </div>
        </div>

        <!-- SECCIÓN E: DATOS FAMILIARES Y SOCIOECONÓMICOS -->
        <div class="mb-3 border border-slate-300 print:border-black rounded-xl overflow-hidden">
          <div class="bg-slate-100 print:bg-slate-200 px-3 py-1 border-b border-slate-300 print:border-black flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-900 print:text-black">
              E. DATOS FAMILIARES, INGRESOS Y NÚCLEO SOCIOECONÓMICO
            </span>
          </div>

          <div class="p-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Total Mensual Ingresos Grupo Familiar</label>
              <input 
                v-model="form.socioeconomic.monthly_income" 
                type="text" 
                placeholder="Ingreso mensual estimado" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">N° Personas que Dependen del Ingreso</label>
              <input 
                v-model.number="form.socioeconomic.dependents_count" 
                type="number" 
                min="1" 
                max="20" 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px]"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold uppercase text-slate-600 print:text-black mb-0.5">El Ingreso Familiar lo Aporta(n)</label>
              <input 
                v-model="form.socioeconomic.income_providers" 
                type="text" 
                placeholder="PAPÁ, MAMÁ, ABUELA..." 
                class="w-full px-2 py-1 border border-slate-300 print:border-black rounded text-[10px] uppercase"
              />
            </div>
          </div>
        </div>

        <!-- SECCIÓN F & G: ANTROPOMETRÍA, CANAIMA Y CARACTERIZACIÓN DE VIVIENDA -->
        <div class="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="border border-slate-300 print:border-black rounded-xl p-2.5 space-y-2">
            <div class="font-black text-[10px] uppercase tracking-wider text-slate-900 print:text-black border-b border-slate-200 print:border-black pb-1">
              F. DATOS ANTROPOMÉTRICOS, SALUD Y TECNOLOGÍA
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Talla (Estudiante)</label>
                <input v-model="form.socioeconomic.height" type="text" placeholder="M / 10" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px] uppercase font-bold" />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Peso (Kg)</label>
                <input v-model="form.socioeconomic.weight" type="text" placeholder="48 kg" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px]" />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Edad</label>
                <input v-model="form.socioeconomic.age" type="text" placeholder="10 Años" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px]" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-200 print:border-slate-400">
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">¿Tiene Canaima?</label>
                <select v-model="form.socioeconomic.has_canaima" class="w-full px-1.5 py-0.5 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer font-bold">
                  <option value="no">NO</option>
                  <option value="si">SÍ</option>
                </select>
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Serial Equipo</label>
                <input v-model="form.socioeconomic.canaima_serial" type="text" placeholder="Serial o N/A" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px] uppercase" />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Estado Equipo</label>
                <input v-model="form.socioeconomic.canaima_condition" type="text" placeholder="Bueno / Regular" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px]" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 print:border-slate-400">
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Seguro Personal (HCM)</label>
                <input v-model="form.socioeconomic.hcm_insurance_name" type="text" placeholder="Compañía Aseguradora o 'No'" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px] uppercase" />
              </div>
              <div class="flex items-center gap-3 pt-2">
                <label class="flex items-center gap-1 text-[8px] font-bold uppercase cursor-pointer">
                  <input v-model="form.socioeconomic.has_school_insurance" type="checkbox" class="w-3 h-3 text-brand-primary" />
                  <span>Seguro Escolar</span>
                </label>
                <label class="flex items-center gap-1 text-[8px] font-bold uppercase cursor-pointer">
                  <input v-model="form.socioeconomic.has_scholarship" type="checkbox" class="w-3 h-3 text-brand-primary" />
                  <span>Tiene Beca</span>
                </label>
              </div>
            </div>
          </div>

          <div class="border border-slate-300 print:border-black rounded-xl p-2.5 space-y-2">
            <div class="font-black text-[10px] uppercase tracking-wider text-slate-900 print:text-black border-b border-slate-200 print:border-black pb-1">
              G. CARACTERIZACIÓN DE LA VIVIENDA
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Su Vivienda es:</label>
                <select v-model="form.socioeconomic.housing_tenure" class="w-full px-1.5 py-0.5 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer">
                  <option value="propia">1. Propia</option>
                  <option value="pagandola">2. Propia pagándola</option>
                  <option value="alquilada">3. Alquilada</option>
                  <option value="compartida">4. Compartida con otra familia</option>
                  <option value="prestada">5. Prestada</option>
                  <option value="otra">6. Otra</option>
                </select>
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Tipo de Vivienda:</label>
                <select v-model="form.socioeconomic.housing_type" class="w-full px-1.5 py-0.5 border border-slate-300 print:border-black rounded text-[10px] cursor-pointer">
                  <option value="apto_ph">1. Apto. Propiedad Horizontal</option>
                  <option value="apto_alquiler">2. Apto. Alquiler</option>
                  <option value="casa_familiar">3. Casa familiar (no quinta)</option>
                  <option value="quinta_lujosa">4. Quinta Lujosa</option>
                  <option value="pieza">5. Pieza o habitación</option>
                  <option value="casita_bloques">6. Casita de Bloques</option>
                  <option value="quinta_pequena">7. Quinta pequeña</option>
                  <option value="otra">8. Otra</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 print:border-slate-400">
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">N° Habitaciones</label>
                <input v-model.number="form.socioeconomic.rooms_count" type="number" min="1" max="15" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px]" />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Pago Mensual Vivienda</label>
                <input v-model="form.socioeconomic.housing_monthly_payment" type="text" placeholder="Monto mensual o 0" class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[10px]" />
              </div>
            </div>

            <div class="pt-1 border-t border-slate-200 print:border-slate-400">
              <label class="block text-[8px] font-bold uppercase text-slate-600 print:text-black mb-1">Con el Alumno Viven:</label>
              <div class="flex flex-wrap gap-2 text-[9px]">
                <label class="flex items-center gap-1 cursor-pointer font-bold">
                  <input v-model="form.socioeconomic.lives_with_mother" type="checkbox" class="w-3 h-3 text-brand-primary" />
                  <span>Mamá</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer font-bold">
                  <input v-model="form.socioeconomic.lives_with_father" type="checkbox" class="w-3 h-3 text-brand-primary" />
                  <span>Papá</span>
                </label>
                <div class="flex items-center gap-1">
                  <span class="text-[8px] font-bold uppercase">Hermanos:</span>
                  <input v-model.number="form.socioeconomic.lives_with_siblings_count" type="number" min="0" max="10" class="w-10 px-1 py-0.5 border border-slate-300 print:border-black rounded text-[9px] text-center" />
                </div>
              </div>
              <div class="mt-1">
                <input v-model="form.socioeconomic.lives_with_others" type="text" placeholder="Otros: ABUELA MATERNA, TÍOS..." class="w-full px-2 py-0.5 border border-slate-300 print:border-black rounded text-[9px] uppercase" />
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN H: SUSCRIPCIÓN DE COMPROMISOS INSTITUCIONALES -->
        <div class="mb-3 border border-slate-300 print:border-black rounded-xl p-2.5 text-[8.5px] leading-snug">
          <div class="font-black text-[9.5px] uppercase tracking-wider text-slate-900 print:text-black border-b border-slate-200 print:border-black pb-1 mb-1.5">
            H. SUSCRIPCIÓN DE COMPROMISOS CON LA U.E. COLEGIO "SANTA LUISA" (AÑO ESCOLAR 2026 - 2027)
          </div>
          <p class="font-bold text-slate-800 print:text-black mb-1">
            Al formalizar la inscripción de mi representado para el año escolar 2026 - 2027 en este Plantel, suscribo formalmente los siguientes compromisos:
          </p>
          <ul class="space-y-0.5 list-disc list-inside text-slate-700 print:text-black text-justify">
            <li>Me comprometo a cubrir el costo completo del año escolar 2026 - 2027 (doce meses).</li>
            <li>Me comprometo a efectuar el pago de las mensualidades de mi representado los 30 de cada mes.</li>
            <li>Me comprometo a efectuar el pago de la mensualidad del mes de Diciembre antes del 15 del mismo.</li>
            <li>Me comprometo a respetar y cumplir las normas de convivencia del Plantel y lineamientos de sus autoridades vicencianas.</li>
            <li>Me comprometo a que mi representado cumplirá estrictamente con el uniforme escolar exigido por la Institución.</li>
            <li>Me comprometo a que mi representado no asistirá al Plantel con prendas de valor, pinturas, gorras, celulares o equipos electrónicos; la Institución no se hace responsable de objetos perdidos en horario de clases.</li>
            <li>Me comprometo a presentar mi tarjeta de pagos cuando la Institución realice operativos de cobranza o auditoría de solvencia.</li>
            <li>Si durante el año escolar en curso se producen aumentos salariales o bonos por decreto oficial, me comprometo a cancelar el ajuste correspondiente que cubra su incidencia en la estructura de costos aprobada en asamblea.</li>
            <li>En caso de anticipo de cuotas, todo mes cancelado por adelantado se considera abono, comprometiéndome a cancelar la diferencia resultante.</li>
            <li>Declaro haber leído detenidamente cada punto de la presente carta compromiso, la cual firmo en aceptación expresa y voluntaria de la misma.</li>
          </ul>
        </div>

        <!-- SECCIONES I & J: VALIDACIÓN DE REQUISITOS Y CRONOLOGÍA ESCOLAR -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
          <!-- I. Validación de Requisitos -->
          <div class="sm:col-span-5 border border-slate-300 print:border-black rounded-xl p-2 text-xs">
            <div class="font-black text-[9.5px] uppercase tracking-wider text-slate-900 print:text-black border-b border-slate-200 print:border-black pb-1 mb-1.5 flex justify-between items-center">
              <span>I. VALIDACIÓN DE REQUISITOS</span>
              <span class="text-[8px] font-bold">RECAUDOS</span>
            </div>

            <div class="space-y-1 text-[9px]">
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Carpeta Manila</span>
                <input v-model="form.requirements.carpeta_manila" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Partida de Nacimiento</span>
                <input v-model="form.requirements.partida_nacimiento" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>C.I. del Alumno</span>
                <input v-model="form.requirements.ci_alumno" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Boleta Original</span>
                <input v-model="form.requirements.boleta_original" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Boleta de Promoción</span>
                <input v-model="form.requirements.boleta_promocion" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Notas Certificadas</span>
                <input v-model="form.requirements.notas_certificadas" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Constancia Cédula Escolar</span>
                <input v-model="form.requirements.constancia_cedula_escolar" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>C.I. Madre</span>
                <input v-model="form.requirements.ci_madre" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>C.I. Padre</span>
                <input v-model="form.requirements.ci_padre" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <label class="flex items-center justify-between p-1 bg-slate-50 print:bg-transparent rounded cursor-pointer">
                <span>Fotos Carnet (Alumno / Reps.)</span>
                <input v-model="form.requirements.fotos_carnet" type="checkbox" class="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer" />
              </label>
              <div class="pt-1">
                <input v-model="form.requirements.otros" type="text" placeholder="Otros recaudos consignados..." class="w-full px-1.5 py-0.5 border border-slate-300 print:border-black rounded text-[8px] uppercase" />
              </div>
            </div>
          </div>

          <!-- J. Cronología Escolar -->
          <div class="sm:col-span-7 border border-slate-300 print:border-black rounded-xl p-2 text-xs">
            <div class="font-black text-[9.5px] uppercase tracking-wider text-slate-900 print:text-black border-b border-slate-200 print:border-black pb-1 mb-1.5 flex justify-between items-center">
              <span>J. CRONOLOGÍA ESCOLAR EN EL PLANTEL</span>
              <span class="text-[8px] font-bold">HISTORIAL DE FIRMAS</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-[8px] border-collapse">
                <thead>
                  <tr class="border-b border-slate-300 print:border-black font-black uppercase bg-slate-50 print:bg-transparent">
                    <th class="py-0.5 px-1 w-20">GRADO / AÑO</th>
                    <th class="py-0.5 px-1 w-24">AÑO ESCOLAR</th>
                    <th class="py-0.5 px-1">FIRMA DEL REPRESENTANTE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(c, idx) in form.chronology" :key="idx" class="border-b border-slate-200 print:border-slate-300">
                    <td class="py-0.5 px-1 font-bold">{{ c.grade }}</td>
                    <td class="py-0.5 px-1">
                      <input v-model="c.school_year" type="text" placeholder="Año escolar" class="w-full px-1 py-0.5 border-b border-slate-200 print:border-none text-[8px]" />
                    </td>
                    <td class="py-0.5 px-1">
                      <div class="h-3 border-b border-dotted border-slate-400 print:border-black"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- SECCIÓN K: BLOQUE OFICIAL DE FIRMAS Y HUELLA DACTILAR -->
        <div class="border border-slate-300 print:border-black rounded-xl p-3 text-xs">
          <div class="grid grid-cols-3 gap-4 items-end text-center">
            <!-- Firma del Representante -->
            <div class="flex flex-col justify-between h-24 border-r border-slate-200 print:border-black pr-2">
              <div class="flex-1 flex items-end justify-center">
                <div class="w-40 border-b-2 border-slate-900 print:border-black"></div>
              </div>
              <div class="mt-1">
                <p class="font-black text-[9px] uppercase text-slate-900 print:text-black">FIRMA DEL REPRESENTANTE</p>
                <p class="text-[8px] text-slate-600 print:text-black">
                  Nombre: {{ form.father.full_name || form.mother.full_name || '________________________' }}
                </p>
                <p class="text-[8px] text-slate-600 print:text-black">
                  C.I.: {{ form.father.national_id || form.mother.national_id || '________________' }}
                </p>
              </div>
            </div>

            <!-- Huella Dactilar -->
            <div class="flex flex-col items-center justify-between h-24 border-r border-slate-200 print:border-black px-1">
              <div class="w-14 h-16 border-2 border-dashed border-slate-400 print:border-black rounded flex items-center justify-center text-[7px] font-bold text-slate-400 print:text-black uppercase text-center p-1 bg-slate-50 print:bg-white">
                PULGAR DERECHO
              </div>
              <p class="font-bold text-[8px] uppercase text-slate-900 print:text-black mt-1">HUELLA DACTILAR</p>
            </div>

            <!-- Dirección / Control de Estudios & Sello -->
            <div class="flex flex-col justify-between h-24 pl-2">
              <div class="flex-1 flex items-end justify-center">
                <div class="w-40 border-b-2 border-slate-900 print:border-black"></div>
              </div>
              <div class="mt-1">
                <p class="font-black text-[9px] uppercase text-slate-900 print:text-black">DIRECCIÓN / CONTROL DE ESTUDIOS</p>
                <p class="text-[8px] text-slate-600 print:text-black">Prof. Graciela Inatty de Poskal</p>
                <p class="text-[8px] text-slate-500 print:text-black">Sello Húmedo del Plantel</p>
              </div>
            </div>
          </div>
        </div>

        <!-- PIE DE PÁGINA: PÁGINA 2 -->
        <div class="mt-4 pt-2 border-t border-slate-300 print:border-black flex justify-between items-center text-[9px] font-bold text-slate-600 print:text-black">
          <div>
            Comunidad Educativa Vicenciana • Calle Real del Prado de María, Caracas
          </div>
          <div class="font-black text-slate-900 print:text-black uppercase tracking-wider">
            PÁGINA 2 DE 2
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '~/composables/useToast'
import UiAvatarUpload from '~/components/ui/AvatarUpload.vue'

const config = useRuntimeConfig()
const toast = useToast()
const route = useRoute()

const isSaving = ref(false)
const isGeneratingPdf = ref(false)
const selectedStudentId = ref('')
const registeredStudents = ref([])

// Current date formatted
const currentDateFormatted = computed(() => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
})

// Main Form Model conforming to Santa Luisa Official Document
const form = ref({
  student: {
    id: null,
    student_id: '',
    first_name: '',
    last_name: '',
    birth_place: 'CARACAS',
    birth_state: 'DISTRITO CAPITAL',
    birth_country: 'VENEZUELA',
    date_of_birth: '',
    national_id: '',
    grade: 'Quinto Grado',
    school_year: '2026 - 2027',
    economic_responsible_name: '',
    economic_responsible_occupation: '',
    economic_responsible_education: 'TSU',
    siblings_in_school: '',
    blood_type: 'unknown',
    gender: 'male',
    photo_url: '',
    photo_stage: 'preescolar_primaria',
    address: '',
    phone_home: '',
    phone_relative_neighbor: '',
    work_phone_father: '',
    work_phone_father_ext: '',
    work_phone_mother: '',
    work_phone_mother_ext: '',
    emergency_viral_phone1: '',
    emergency_viral_phone2: '',
    emergency_contact_ask_for: ''
  },
  father: {
    full_name: '',
    national_id: '',
    age: '',
    nationality: 'VENEZOLANO',
    occupation: '',
    education_level: 'TSU',
    phone_mobile: '',
    email: '',
    employer: '',
    photo_url: ''
  },
  mother: {
    full_name: '',
    national_id: '',
    age: '',
    nationality: 'VENEZOLANA',
    occupation: '',
    education_level: 'TSU',
    phone_mobile: '',
    email: '',
    employer: '',
    photo_url: ''
  },
  authorized_pickup: {
    full_name: '',
    national_id: '',
    relationship: 'abuela',
    phone_mobile: '',
    occupation: '',
    authorized: true,
    photo_url: ''
  },
  socioeconomic: {
    monthly_income: '',
    dependents_count: 5,
    income_providers: 'PAPÁ Y MAMÁ',
    housing_tenure: 'propia',
    housing_type: 'casa_familiar',
    rooms_count: 3,
    housing_monthly_payment: '0',
    lives_with_mother: true,
    lives_with_father: true,
    lives_with_siblings_count: 1,
    lives_with_others: '',
    height: '',
    weight: '',
    age: '',
    has_canaima: 'no',
    canaima_serial: '',
    canaima_condition: 'Bueno',
    hcm_insurance_name: '',
    has_school_insurance: true,
    has_scholarship: false
  },
  previous_schools: [
    { grade: 'Educ. Inicial', school_year: '', school_name: '', city: 'CARACAS' },
    { grade: '1º Grado', school_year: '', school_name: '', city: 'CARACAS' },
    { grade: '2º Grado', school_year: '', school_name: '', city: 'CARACAS' },
    { grade: '3º Grado', school_year: '', school_name: '', city: 'CARACAS' },
    { grade: '4º Grado', school_year: '', school_name: '', city: 'CARACAS' },
    { grade: '5º Grado', school_year: '', school_name: '', city: 'CARACAS' },
    { grade: '6º Grado', school_year: '', school_name: '', city: 'CARACAS' }
  ],
  requirements: {
    carpeta_manila: true,
    partida_nacimiento: true,
    ci_alumno: true,
    boleta_original: true,
    boleta_promocion: true,
    notas_certificadas: false,
    constancia_cedula_escolar: true,
    ci_madre: true,
    ci_padre: true,
    fotos_carnet: true,
    otros: ''
  },
  chronology: [
    { grade: '1er Grado', school_year: '' },
    { grade: '2do Grado', school_year: '' },
    { grade: '3er Grado', school_year: '' },
    { grade: '4to Grado', school_year: '' },
    { grade: '5to Grado', school_year: '' },
    { grade: '6to Grado', school_year: '' },
    { grade: '1er Año', school_year: '' },
    { grade: '2do Año', school_year: '' },
    { grade: '3er Año', school_year: '' },
    { grade: '4to Año', school_year: '' },
    { grade: '5to Año', school_year: '' }
  ]
})

const resolvePreview = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  return `${config.public.apiBase}${url}`
}

// Session token helper: reads strictly from sessionStorage
const getAuthHeaders = () => {
  if (import.meta.client) {
    const token =
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('feathers-jwt') ||
      sessionStorage.getItem('school_jwt')
    if (token) return { Authorization: `Bearer ${token}` }
  }
  return {}
}

// Fetch list of students for quick select
const fetchStudents = async () => {
  try {
    const headers = getAuthHeaders()
    const res = await $fetch(`${config.public.apiBase}/students?$limit=150`, { headers })
    registeredStudents.value = Array.isArray(res) ? res : (res.data || [])
  } catch (err) {
    registeredStudents.value = []
  }
}

onMounted(async () => {
  await fetchStudents()
  // Check if student_id was passed in URL query
  if (route.query.student_id) {
    selectedStudentId.value = route.query.student_id
    loadStudentData(route.query.student_id)
  }
})

const loadStudentData = (studentId) => {
  if (!studentId) return
  const s = registeredStudents.value.find(st => st.id === parseInt(studentId) || st.id === studentId)
  if (!s) return

  form.value.student = {
    id: s.id,
    student_id: s.student_id || '',
    first_name: s.first_name || '',
    last_name: s.last_name || '',
    birth_place: s.birth_place || 'CARACAS',
    birth_state: s.birth_state || 'DISTRITO CAPITAL',
    birth_country: s.birth_country || 'VENEZUELA',
    date_of_birth: s.date_of_birth ? s.date_of_birth.split('T')[0] : '',
    national_id: s.national_id || '',
    grade: s.grade || 'Quinto Grado',
    school_year: s.school_year || '2026 - 2027',
    economic_responsible_name: s.economic_responsible_name || '',
    economic_responsible_occupation: s.economic_responsible_occupation || '',
    economic_responsible_education: s.economic_responsible_education || 'TSU',
    siblings_in_school: s.siblings_in_school || '',
    blood_type: s.blood_type || 'unknown',
    gender: s.gender || 'male',
    photo_url: s.photo_url || '',
    photo_stage: s.photo_stage || 'preescolar_primaria',
    address: s.address_line1 || '',
    phone_home: s.phone_home || '',
    phone_relative_neighbor: s.phone_relative_neighbor || '',
    work_phone_father: s.work_phone_father || '',
    work_phone_father_ext: s.work_phone_father_ext || '',
    work_phone_mother: s.work_phone_mother || '',
    work_phone_mother_ext: s.work_phone_mother_ext || '',
    emergency_viral_phone1: s.emergency_contact_phone || '',
    emergency_viral_phone2: s.doctor_phone || '',
    emergency_contact_ask_for: s.emergency_contact_name || ''
  }

  if (s.socioeconomic_data) {
    form.value.socioeconomic = { ...form.value.socioeconomic, ...s.socioeconomic_data }
    if (s.socioeconomic_data.father) form.value.father = { ...form.value.father, ...s.socioeconomic_data.father }
    if (s.socioeconomic_data.mother) form.value.mother = { ...form.value.mother, ...s.socioeconomic_data.mother }
    if (s.socioeconomic_data.previous_schools) form.value.previous_schools = s.socioeconomic_data.previous_schools
    if (s.socioeconomic_data.requirements) form.value.requirements = s.socioeconomic_data.requirements
    if (s.socioeconomic_data.chronology) form.value.chronology = s.socioeconomic_data.chronology
  }
  if (s.authorized_pickup) {
    form.value.authorized_pickup = { ...form.value.authorized_pickup, ...s.authorized_pickup }
  }

  toast.success(`Expediente cargado para ${s.first_name} ${s.last_name}`, 'Ficha Oficial')
}

// Dedicated PDF Download Function
const downloadPdf = async (isBlank = false) => {
  isGeneratingPdf.value = true
  try {
    const res = await fetch(`${config.public.apiBase}/enrollment-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        isBlank,
        data: isBlank ? {} : form.value,
        student_id: form.value.student.id || undefined
      })
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error en la respuesta del motor de PDF.')
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const lastName = form.value.student.last_name ? form.value.student.last_name.replace(/\s+/g, '_') : 'Alumno'
    const firstName = form.value.student.first_name ? form.value.student.first_name.replace(/\s+/g, '_') : 'Inscripcion'
    link.download = isBlank 
      ? 'Ficha_Inscripcion_Santa_Luisa_Blanco_2026_2027.pdf' 
      : `Ficha_Inscripcion_${lastName}_${firstName}_2026_2027.pdf`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Documento PDF oficial generado y descargado exitosamente.', 'Descarga Completa')
  } catch (err) {
    toast.error(err.message || 'No se pudo generar el archivo PDF.', 'Error PDF')
  } finally {
    isGeneratingPdf.value = false
  }
}

// Clean browser print
const printClean = () => {
  window.print()
}

const resetForm = () => {
  selectedStudentId.value = ''
  form.value = {
    student: {
      id: null,
      student_id: '',
      first_name: '',
      last_name: '',
      birth_place: '',
      birth_state: '',
      birth_country: '',
      date_of_birth: '',
      national_id: '',
      grade: 'Quinto Grado',
      school_year: '2026 - 2027',
      economic_responsible_name: '',
      economic_responsible_occupation: '',
      economic_responsible_education: 'TSU',
      siblings_in_school: '',
      blood_type: 'unknown',
      gender: 'male',
      photo_url: '',
      photo_stage: 'preescolar_primaria',
      address: '',
      phone_home: '',
      phone_relative_neighbor: '',
      work_phone_father: '',
      work_phone_father_ext: '',
      work_phone_mother: '',
      work_phone_mother_ext: '',
      emergency_viral_phone1: '',
      emergency_viral_phone2: '',
      emergency_contact_ask_for: ''
    },
    father: {
      full_name: '',
      national_id: '',
      age: '',
      nationality: 'VENEZOLANO',
      occupation: '',
      education_level: 'TSU',
      phone_mobile: '',
      email: '',
      employer: '',
      photo_url: ''
    },
    mother: {
      full_name: '',
      national_id: '',
      age: '',
      nationality: 'VENEZOLANA',
      occupation: '',
      education_level: 'TSU',
      phone_mobile: '',
      email: '',
      employer: '',
      photo_url: ''
    },
    authorized_pickup: {
      full_name: '',
      national_id: '',
      relationship: 'abuela',
      phone_mobile: '',
      occupation: '',
      authorized: true,
      photo_url: ''
    },
    socioeconomic: {
      monthly_income: '',
      dependents_count: 5,
      income_providers: '',
      housing_tenure: 'propia',
      housing_type: 'casa_familiar',
      rooms_count: 3,
      housing_monthly_payment: '',
      lives_with_mother: true,
      lives_with_father: true,
      lives_with_siblings_count: 0,
      lives_with_others: '',
      height: '',
      weight: '',
      age: '',
      has_canaima: 'no',
      canaima_serial: '',
      canaima_condition: '',
      hcm_insurance_name: '',
      has_school_insurance: true,
      has_scholarship: false
    },
    previous_schools: [
      { grade: 'Educ. Inicial', school_year: '', school_name: '', city: '' },
      { grade: '1º Grado', school_year: '', school_name: '', city: '' },
      { grade: '2º Grado', school_year: '', school_name: '', city: '' },
      { grade: '3º Grado', school_year: '', school_name: '', city: '' },
      { grade: '4º Grado', school_year: '', school_name: '', city: '' },
      { grade: '5º Grado', school_year: '', school_name: '', city: '' },
      { grade: '6º Grado', school_year: '', school_name: '', city: '' }
    ],
    requirements: {
      carpeta_manila: false,
      partida_nacimiento: false,
      ci_alumno: false,
      boleta_original: false,
      boleta_promocion: false,
      notas_certificadas: false,
      constancia_cedula_escolar: false,
      ci_madre: false,
      ci_padre: false,
      fotos_carnet: false,
      otros: ''
    },
    chronology: [
      { grade: '1er Grado', school_year: '' },
      { grade: '2do Grado', school_year: '' },
      { grade: '3er Grado', school_year: '' },
      { grade: '4to Grado', school_year: '' },
      { grade: '5to Grado', school_year: '' },
      { grade: '6to Grado', school_year: '' },
      { grade: '1er Año', school_year: '' },
      { grade: '2do Año', school_year: '' },
      { grade: '3er Año', school_year: '' },
      { grade: '4to Año', school_year: '' },
      { grade: '5to Año', school_year: '' }
    ]
  }
}

// Save directly to Backend Database and archive PDF
const saveEnrollment = async () => {
  if (!form.value.student.first_name || !form.value.student.last_name) {
    toast.error('Ingrese los nombres y apellidos del estudiante.', 'Validación')
    return
  }
  if (!form.value.father.full_name && !form.value.mother.full_name) {
    toast.error('Ingrese los datos de al menos un representante (Padre o Madre).', 'Validación')
    return
  }

  isSaving.value = true
  const headers = getAuthHeaders()

  try {
    const studentPayload = {
      student_id: form.value.student.student_id || undefined,
      first_name: form.value.student.first_name,
      last_name: form.value.student.last_name,
      national_id: form.value.student.national_id || null,
      blood_type: form.value.student.blood_type || 'unknown',
      date_of_birth: form.value.student.date_of_birth || null,
      gender: form.value.student.gender || 'male',
      grade: form.value.student.grade,
      school_year: form.value.student.school_year || '2026 - 2027',
      phone_mobile: form.value.father.phone_mobile || form.value.mother.phone_mobile || null,
      address_line1: form.value.student.address || null,
      photo_url: form.value.student.photo_url || null,
      emergency_contact_name: form.value.student.emergency_contact_ask_for || null,
      emergency_contact_phone: form.value.student.emergency_viral_phone1 || null,
      doctor_phone: form.value.student.emergency_viral_phone2 || null,
      insurance_provider: form.value.socioeconomic.hcm_insurance_name || null,
      socioeconomic_data: {
        ...form.value.socioeconomic,
        father: form.value.father,
        mother: form.value.mother,
        previous_schools: form.value.previous_schools,
        requirements: form.value.requirements,
        chronology: form.value.chronology,
        birth_place: form.value.student.birth_place,
        birth_state: form.value.student.birth_state,
        birth_country: form.value.student.birth_country,
        school_year: form.value.student.school_year || '2026 - 2027',
        economic_responsible_name: form.value.student.economic_responsible_name,
        economic_responsible_occupation: form.value.student.economic_responsible_occupation,
        economic_responsible_education: form.value.student.economic_responsible_education,
        siblings_in_school: form.value.student.siblings_in_school,
        phone_home: form.value.student.phone_home,
        phone_relative_neighbor: form.value.student.phone_relative_neighbor,
        work_phone_father: form.value.student.work_phone_father,
        work_phone_father_ext: form.value.student.work_phone_father_ext,
        work_phone_mother: form.value.student.work_phone_mother,
        work_phone_mother_ext: form.value.student.work_phone_mother_ext
      },
      authorized_pickup: form.value.authorized_pickup,
      status: 'active'
    }

    let savedStudent
    if (form.value.student.id) {
      savedStudent = await $fetch(`${config.public.apiBase}/students/${form.value.student.id}`, {
        method: 'PATCH',
        headers,
        body: studentPayload
      })
    } else {
      savedStudent = await $fetch(`${config.public.apiBase}/students`, {
        method: 'POST',
        headers,
        body: studentPayload
      })
    }

    form.value.student.id = savedStudent?.id || form.value.student.id

    // Save Father in school.parents
    if (form.value.father.full_name) {
      const names = form.value.father.full_name.trim().split(' ')
      const parentPayload = {
        first_name: names[0] || 'Padre',
        last_name: names.slice(1).join(' ') || 'Representante',
        national_id: form.value.father.national_id || undefined,
        id_number: form.value.father.national_id ? form.value.father.national_id.replace(/^[VEPGJ]-?/i, '') : undefined,
        email_primary: form.value.father.email || `padre_${Date.now()}@santaluisa.edu.ve`,
        phone_mobile: form.value.father.phone_mobile || null,
        occupation: form.value.father.occupation || null,
        employer: form.value.father.employer || null,
        education_level: form.value.father.education_level || null,
        photo_url: form.value.father.photo_url || null,
        student_id: savedStudent?.id || form.value.student.id || undefined,
        status: 'active'
      }

      await $fetch(`${config.public.apiBase}/parents`, {
        method: 'POST',
        headers,
        body: parentPayload
      }).catch(e => console.warn('Father save warning:', e))
    }

    // Save Mother in school.parents
    if (form.value.mother.full_name) {
      const names = form.value.mother.full_name.trim().split(' ')
      const parentPayload = {
        first_name: names[0] || 'Madre',
        last_name: names.slice(1).join(' ') || 'Representante',
        national_id: form.value.mother.national_id || undefined,
        id_number: form.value.mother.national_id ? form.value.mother.national_id.replace(/^[VEPGJ]-?/i, '') : undefined,
        email_primary: form.value.mother.email || `madre_${Date.now()}@santaluisa.edu.ve`,
        phone_mobile: form.value.mother.phone_mobile || null,
        occupation: form.value.mother.occupation || null,
        employer: form.value.mother.employer || null,
        education_level: form.value.mother.education_level || null,
        photo_url: form.value.mother.photo_url || null,
        student_id: savedStudent?.id || form.value.student.id || undefined,
        status: 'active'
      }

      await $fetch(`${config.public.apiBase}/parents`, {
        method: 'POST',
        headers,
        body: parentPayload
      }).catch(e => console.warn('Mother save warning:', e))
    }

    // Automatically trigger PDF archive in backend
    try {
      await fetch(`${config.public.apiBase}/enrollment-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          isBlank: false,
          data: form.value,
          student_id: savedStudent?.id || form.value.student.id
        })
      })
    } catch (_) {}

    toast.success('Expediente oficial 2026-2027 guardado y archivado exitosamente.', 'Inscripción Exitosa')
    await fetchStudents()
  } catch (err) {
    toast.error(err.data?.message || err.message || 'Error al guardar el expediente.', 'Error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
@media print {
  body, html {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  
  @page {
    size: letter portrait;
    margin: 8mm 10mm;
  }

  .page-sheet {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 0 !important;
    background: #ffffff !important;
    color: #000000 !important;
  }

  .page-break-before {
    break-before: page !important;
    page-break-before: always !important;
  }

  input, select, textarea {
    border-color: #000000 !important;
    color: #000000 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>
