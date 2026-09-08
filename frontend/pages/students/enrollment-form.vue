<template>
  <div class="min-h-screen pb-12 font-sans">
    
    <!-- SCREEN ONLY: Action Bar & Header Navigation (Hidden on Print) -->
    <div class="print:hidden space-y-4 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div class="flex items-center gap-3">
          <NuxtLink 
            to="/students" 
            class="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Volver a Estudiantes"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>📋</span>
              <span>Ficha de Matrícula y Estudio Socioeconómico</span>
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              U.E Colegio "Santa Luisa" • Formato oficial de inscripción física y digital
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Load Existing Student Dropdown -->
          <div v-if="registeredStudents.length > 0" class="relative">
            <select
              v-model="selectedStudentId"
              @change="loadStudentData(selectedStudentId)"
              class="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">-- Cargar Alumno Existente --</option>
              <option v-for="s in registeredStudents" :key="s.id" :value="s.id">
                {{ s.student_id }} - {{ s.first_name }} {{ s.last_name }}
              </option>
            </select>
          </div>

          <!-- Print Blank Sheet -->
          <button
            type="button"
            @click="printBlankSheet"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
          >
            <span>🖨️</span>
            <span>Imprimir en Blanco</span>
          </button>

          <!-- Print With Data -->
          <button
            type="button"
            @click="printWithData"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/40 transition-all cursor-pointer active:scale-95"
          >
            <span>🖨️</span>
            <span>Imprimir con Datos</span>
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
            class="px-3 py-2 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Limpiar campos"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Information Banner -->
      <div class="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 text-sky-800 dark:text-sky-300 text-xs flex items-start gap-3">
        <span class="text-base flex-shrink-0 mt-0.5">ℹ️</span>
        <div class="flex-1 leading-relaxed">
          <strong>Modalidad Dual Físico / Digital:</strong>
          Puede pulsar <em>"Imprimir en Blanco"</em> para entregar la planilla en físico a los representantes durante el proceso de pre-inscripción. Una vez entregada y llenada a mano, el Administrador puede transcribir aquí los datos y pulsar <em>"Guardar en Sistema"</em> para matricular automáticamente al estudiante y sus representantes.
        </div>
      </div>
    </div>

    <!-- PRINTABLE DOCUMENT CONTAINER (Conforms to Carta / A4 in @media print) -->
    <div 
      id="printable-enrollment-document" 
      class="bg-white text-slate-900 shadow-xl rounded-3xl p-6 sm:p-10 border border-slate-200 max-w-[960px] mx-auto print:max-w-none print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none"
    >
      
      <!-- ============================================================ -->
      <!-- INSTITUTIONAL MPPE HEADER (PAGE 1) -->
      <!-- ============================================================ -->
      <div class="border-b-2 border-black pb-4 mb-5">
        <div class="flex items-center justify-between gap-4">
          <!-- Official Logo -->
          <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center p-1 border border-slate-300 rounded-xl print:border-black">
            <img src="/logocolegio.png" alt="Logo Colegio Santa Luisa" class="w-full h-full object-contain" />
          </div>

          <!-- Official Heading -->
          <div class="flex-1 text-center leading-tight">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-700 print:text-black">
              República Bolivariana de Venezuela
            </p>
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-600 print:text-black">
              Ministerio del Poder Popular para la Educación
            </p>
            <h2 class="text-lg sm:text-xl font-black font-display text-slate-900 print:text-black mt-1">
              U.E. COLEGIO "SANTA LUISA"
            </h2>
            <p class="text-[10px] font-medium text-slate-600 print:text-black">
              Comunidad Educativa Vicenciana • Av. San Martín, Caracas • R.I.F. J-12345678-9 • Código DEA: S0000D0101
            </p>
            <div class="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-slate-100 print:bg-transparent border border-slate-300 print:border-black">
              <span class="text-[11px] font-black uppercase tracking-widest text-slate-800 print:text-black">
                PLANILLA OFICIAL DE MATRÍCULA Y ESTUDIO SOCIOECONÓMICO
              </span>
            </div>
          </div>

          <!-- Physical 3x4 cm Photo Placeholder -->
          <div class="w-24 h-32 flex-shrink-0 border-2 border-dashed border-slate-400 print:border-black rounded-lg flex flex-col items-center justify-center text-center p-1 bg-slate-50 print:bg-white relative overflow-hidden">
            <img 
              v-if="form.student.photo_url" 
              :src="resolvePreview(form.student.photo_url)" 
              alt="Foto del Alumno" 
              class="w-full h-full object-cover" 
            />
            <div v-else class="text-[9px] font-bold text-slate-500 print:text-black uppercase leading-tight">
              <span>FOTO TIPO CARNET</span>
              <span class="block text-[8px] font-normal mt-1">(3 x 4 cm)</span>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center text-[10px] font-bold uppercase text-slate-600 print:text-black mt-3 pt-2 border-t border-slate-200 print:border-black">
          <div>AÑO ESCOLAR: <span class="font-black text-slate-900 print:text-black">2025 - 2026</span></div>
          <div>FECHA DE REGISTRO: <span class="font-black text-slate-900 print:text-black">{{ currentDateFormatted }}</span></div>
          <div>ESTADO: <span class="font-black text-slate-900 print:text-black">DISTRITO CAPITAL (CARACAS)</span></div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 1: DATOS FILIATORIOS DEL ESTUDIANTE -->
      <!-- ============================================================ -->
      <div class="mb-5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
        <div class="bg-slate-100 print:bg-slate-200 px-3 py-1.5 border-b border-slate-300 print:border-black flex justify-between items-center">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-900 print:text-black">
            1. DATOS DE IDENTIFICACIÓN DEL ESTUDIANTE
          </span>
          <span class="text-[10px] font-bold text-slate-600 print:text-black">
            Etapa: {{ stageLabel }}
          </span>
        </div>

        <div class="p-3 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <!-- Cédula / Escolar -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Cédula / Cédula Escolar *</label>
            <input 
              v-model="form.student.national_id" 
              type="text" 
              placeholder="Ej: V-32.123.456" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-mono font-bold uppercase"
            />
          </div>

          <!-- N° Carnet / Matrícula ID -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Código Matrícula (ID) *</label>
            <input 
              v-model="form.student.student_id" 
              type="text" 
              placeholder="EST-001" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-mono font-bold uppercase"
            />
          </div>

          <!-- Grado al que ingresa -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Grado / Año a Cursar *</label>
            <input 
              v-model="form.student.grade" 
              type="text" 
              placeholder="Ej: 1er Año Bachillerato" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
            />
          </div>

          <!-- Sección -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Sección</label>
            <input 
              v-model="form.student.section" 
              type="text" 
              placeholder="A, B o C" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
            />
          </div>

          <!-- Nombres -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Nombres Completos *</label>
            <input 
              v-model="form.student.first_name" 
              type="text" 
              placeholder="Nombres del alumno" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
            />
          </div>

          <!-- Apellidos -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Apellidos Completos *</label>
            <input 
              v-model="form.student.last_name" 
              type="text" 
              placeholder="Apellidos del alumno" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
            />
          </div>

          <!-- Fecha Nacimiento -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Fecha de Nacimiento</label>
            <input 
              v-model="form.student.date_of_birth" 
              type="date" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Sexo -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Sexo / Género</label>
            <select 
              v-model="form.student.gender" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs cursor-pointer"
            >
              <option value="male">Masculino (M)</option>
              <option value="female">Femenino (F)</option>
            </select>
          </div>

          <!-- Grupo Sanguíneo (Tipo de Sangre) -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Grupo Sanguíneo *</label>
            <select 
              v-model="form.student.blood_type" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-bold text-rose-700 print:text-black cursor-pointer"
            >
              <option value="unknown">Por Determinar</option>
              <option value="O+">O Positivo (O+)</option>
              <option value="O-">O Negativo (O-)</option>
              <option value="A+">A Positivo (A+)</option>
              <option value="A-">A Negativo (A-)</option>
              <option value="B+">B Positivo (B+)</option>
              <option value="B-">B Negativo (B-)</option>
              <option value="AB+">AB Positivo (AB+)</option>
              <option value="AB-">AB Negativo (AB-)</option>
            </select>
          </div>

          <!-- Teléfono Contacto Estudiante -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Alumno</label>
            <input 
              v-model="form.student.phone_mobile" 
              type="text" 
              placeholder="0412-0000000" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Dirección Completa -->
          <div class="sm:col-span-4">
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Dirección de Habitación del Estudiante *</label>
            <input 
              v-model="form.student.address_line1" 
              type="text" 
              placeholder="Avenida, Calle, Urbanización/Barrio, Edificio/Casa, Número, Parroquia" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 2: FICHA MÉDICA Y ATENCIÓN DE EMERGENCIAS -->
      <!-- ============================================================ -->
      <div class="mb-5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
        <div class="bg-slate-100 print:bg-slate-200 px-3 py-1.5 border-b border-slate-300 print:border-black">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-900 print:text-black">
            2. FICHA MÉDICA, ALERGIAS Y PROTOCOLO DE EMERGENCIA
          </span>
        </div>

        <div class="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <!-- Alergias -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Alergias Conocidas (Medicamentos, Alimentos, etc.)</label>
            <input 
              v-model="form.medical.allergies" 
              type="text" 
              placeholder="Ej: Alérgico a Penicilina, AINES, Mariscos, etc. (o 'Ninguna')" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
            />
          </div>

          <!-- Contacto Emergencia -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono de Emergencia Inmediata *</label>
            <input 
              v-model="form.medical.emergency_phone" 
              type="text" 
              placeholder="Ej: 0414-5550000" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-bold"
            />
          </div>

          <!-- Padecimientos / Condiciones -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Condición de Salud / Tratamiento Permanente</label>
            <input 
              v-model="form.medical.condition" 
              type="text" 
              placeholder="Ej: Asma bronquial, Diabetes, etc. (o 'Sano')" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Médico o Centro Asistencial -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Centro de Salud de Referencia</label>
            <input 
              v-model="form.medical.hospital_reference" 
              type="text" 
              placeholder="Ej: Hospital Militar / Clínica..." 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 3: REPRESENTANTE LEGAL PRINCIPAL (OBLIGATORIO) -->
      <!-- ============================================================ -->
      <div class="mb-5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
        <div class="bg-slate-100 print:bg-slate-200 px-3 py-1.5 border-b border-slate-300 print:border-black flex justify-between items-center">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-900 print:text-black">
            3. DATOS DEL REPRESENTANTE LEGAL PRINCIPAL
          </span>
          <span class="text-[10px] font-bold text-brand-primary print:text-black uppercase">
            Titular Oficial
          </span>
        </div>

        <div class="p-3 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <!-- Cédula -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Cédula de Identidad *</label>
            <input 
              v-model="form.parent1.national_id" 
              type="text" 
              placeholder="V-12.345.678" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-mono font-bold uppercase"
            />
          </div>

          <!-- Parentesco -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Parentesco *</label>
            <select 
              v-model="form.parent1.relationship" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold cursor-pointer"
            >
              <option value="madre">Madre</option>
              <option value="padre">Padre</option>
              <option value="abuela">Abuelo(a)</option>
              <option value="tio">Tío(a)</option>
              <option value="tutor">Tutor Legal Asignado</option>
            </select>
          </div>

          <!-- Nombres y Apellidos -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Nombres y Apellidos Completos *</label>
            <input 
              v-model="form.parent1.full_name" 
              type="text" 
              placeholder="Nombres y Apellidos del representante" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
            />
          </div>

          <!-- Teléfono Celular -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Celular (WhatsApp) *</label>
            <input 
              v-model="form.parent1.phone_mobile" 
              type="text" 
              placeholder="0414-1234567" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-bold"
            />
          </div>

          <!-- Teléfono Habitación / Trabajo -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Fijo / Trabajo</label>
            <input 
              v-model="form.parent1.phone_work" 
              type="text" 
              placeholder="0212-0000000" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Correo Electrónico -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Correo Electrónico *</label>
            <input 
              v-model="form.parent1.email" 
              type="email" 
              placeholder="representante@email.com" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Profesión / Ocupación -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Ocupación / Profesión</label>
            <input 
              v-model="form.parent1.occupation" 
              type="text" 
              placeholder="Ej: Comerciante / Ingeniero" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 4: REPRESENTANTE SECUNDARIO Y AUTORIZACIÓN DE RETIRO -->
      <!-- ============================================================ -->
      <div class="mb-5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
        <div class="bg-slate-100 print:bg-slate-200 px-3 py-1.5 border-b border-slate-300 print:border-black flex justify-between items-center">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-900 print:text-black">
            4. SEGUNDO REPRESENTANTE Y AUTORIZACIÓN EXPRESA DE RETIRO
          </span>
          <span class="text-[10px] font-bold text-amber-700 print:text-black uppercase">
            Injerencia en Retiro del Alumno
          </span>
        </div>

        <div class="p-3 space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <!-- Cédula -->
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Cédula de Identidad</label>
              <input 
                v-model="form.parent2.national_id" 
                type="text" 
                placeholder="V-14.567.890" 
                class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-mono uppercase"
              />
            </div>

            <!-- Parentesco -->
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Parentesco</label>
              <select 
                v-model="form.parent2.relationship" 
                class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs cursor-pointer"
              >
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="abuela">Abuelo(a)</option>
                <option value="tio">Tío(a)</option>
                <option value="hermano">Hermano(a) Mayor de Edad</option>
                <option value="otro">Persona Autorizada</option>
              </select>
            </div>

            <!-- Nombres y Apellidos -->
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Nombres y Apellidos</label>
              <input 
                v-model="form.parent2.full_name" 
                type="text" 
                placeholder="Nombres y Apellidos del segundo contacto" 
                class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
              />
            </div>

            <!-- Teléfono Móvil -->
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Teléfono Móvil de Contacto</label>
              <input 
                v-model="form.parent2.phone_mobile" 
                type="text" 
                placeholder="0424-0000000" 
                class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs font-semibold"
              />
            </div>

            <!-- Ocupación -->
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Ocupación / Lugar de Trabajo</label>
              <input 
                v-model="form.parent2.occupation" 
                type="text" 
                placeholder="Ocupación" 
                class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
              />
            </div>
          </div>

          <!-- Declaración Expresa de Autorización de Retiro -->
          <div class="p-2.5 bg-slate-50 print:bg-transparent rounded-lg border border-slate-200 print:border-black flex items-start gap-2.5">
            <input 
              v-model="form.parent2.authorized_to_pickup" 
              type="checkbox" 
              id="auth_pickup_chk" 
              class="mt-0.5 w-4 h-4 rounded text-brand-primary border-slate-400 focus:ring-0 cursor-pointer" 
            />
            <label for="auth_pickup_chk" class="text-[11px] leading-tight text-slate-800 print:text-black cursor-pointer font-medium">
              <strong class="font-black text-slate-900 print:text-black">AUTORIZACIÓN FORMAL DE RETIRO:</strong>
              Certifico que autorizo expresamente a esta persona para retirar al estudiante de la sede del colegio ante cualquier eventualidad, contingencia o culminación de jornada escolar.
            </label>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 5: ESTUDIO SOCIOECONÓMICO Y NÚCLEO HABITACIONAL -->
      <!-- ============================================================ -->
      <div class="mb-5 border border-slate-300 print:border-black rounded-xl overflow-hidden">
        <div class="bg-slate-100 print:bg-slate-200 px-3 py-1.5 border-b border-slate-300 print:border-black">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-900 print:text-black">
            5. FICHA SOCIOECONÓMICA Y CONDICIONES HABITACIONALES
          </span>
        </div>

        <div class="p-3 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <!-- Tipo de Vivienda -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Tipo de Vivienda</label>
            <select 
              v-model="form.socioeconomic.housing_type" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs cursor-pointer"
            >
              <option value="propia">Casa / Apto Propio</option>
              <option value="alquilada">Alquilada</option>
              <option value="familiar">Familiar / Prestada</option>
              <option value="pagandose">En Proceso de Pago</option>
            </select>
          </div>

          <!-- N° Personas Convivientes -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">N° Habitantes en el Hogar</label>
            <input 
              v-model.number="form.socioeconomic.family_members" 
              type="number" 
              min="1" 
              max="20" 
              placeholder="Ej: 4" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Hermanos en el Plantel -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">Hermanos en el Colegio</label>
            <input 
              v-model="form.socioeconomic.siblings_in_school" 
              type="text" 
              placeholder="Nombres / Grados o 'Ninguno'" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs"
            />
          </div>

          <!-- Con quién reside el estudiante -->
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-600 print:text-black mb-0.5">El Estudiante vive con</label>
            <select 
              v-model="form.socioeconomic.lives_with" 
              class="w-full px-2.5 py-1.5 border border-slate-300 print:border-black rounded-lg text-xs cursor-pointer"
            >
              <option value="ambos_padres">Ambos Padres</option>
              <option value="solo_madre">Solo la Madre</option>
              <option value="solo_padre">Solo el Padre</option>
              <option value="abuelos">Abuelos</option>
              <option value="tutor">Tutor / Otros Familiares</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 6: DECLARACIÓN JURADA, HUELLA Y FIRMAS LEGALES -->
      <!-- ============================================================ -->
      <div class="border border-slate-300 print:border-black rounded-xl p-4 text-[11px] leading-relaxed">
        <p class="font-medium text-slate-700 print:text-black text-justify mb-6">
          Yo, en mi carácter de Representante Legal del estudiante arriba identificado, declaro bajo juramento que los datos suministrados en esta planilla son fidedignos y exactos. Me comprometo formalmente a respetar el Manual de Convivencia Escolar y Comunitaria de la <strong>U.E. Colegio "Santa Luisa"</strong>, asistir puntualmente a las convocatorias de la institución y actualizar cualquier variación en los datos de contacto y salud de mi representado.
        </p>

        <!-- Signature Boxes Grid -->
        <div class="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200 print:border-black text-center">
          <!-- Box 1: Firma del Representante Legal -->
          <div class="flex flex-col justify-between h-28 border-r border-slate-200 print:border-black pr-4">
            <div class="flex-1 flex items-end justify-center">
              <div class="w-44 border-b-2 border-slate-800 print:border-black"></div>
            </div>
            <div>
              <p class="font-bold text-[10px] uppercase text-slate-900 print:text-black">Firma del Representante</p>
              <p class="text-[9px] text-slate-500 print:text-black">C.I: {{ form.parent1.national_id || '________________' }}</p>
            </div>
          </div>

          <!-- Box 2: Huella Dactilar -->
          <div class="flex flex-col items-center justify-between h-28 border-r border-slate-200 print:border-black px-2">
            <div class="w-16 h-20 border-2 border-dashed border-slate-400 print:border-black rounded flex items-center justify-center text-[8px] font-bold text-slate-400 print:text-black uppercase text-center p-1">
              HUELLA DACTILAR (PULGAR DER.)
            </div>
            <p class="font-bold text-[10px] uppercase text-slate-900 print:text-black">Pulgar Derecho</p>
          </div>

          <!-- Box 3: Dirección / Control de Estudios & Sello -->
          <div class="flex flex-col justify-between h-28 pl-4">
            <div class="flex-1 flex items-end justify-center">
              <div class="w-44 border-b-2 border-slate-800 print:border-black"></div>
            </div>
            <div>
              <p class="font-bold text-[10px] uppercase text-slate-900 print:text-black">Dirección / Control de Estudios</p>
              <p class="text-[9px] text-slate-500 print:text-black">Sello Húmedo del Plantel</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const config = useRuntimeConfig()
const toast = useToast()

const isSaving = ref(false)
const selectedStudentId = ref('')
const registeredStudents = ref([])

// Current date formatted
const currentDateFormatted = computed(() => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
})

// Main Form Model
const form = ref({
  student: {
    id: null,
    student_id: '',
    first_name: '',
    last_name: '',
    national_id: '',
    blood_type: 'unknown',
    date_of_birth: '',
    gender: 'male',
    grade: '1er Año Media General',
    section: 'A',
    phone_mobile: '',
    address_line1: '',
    photo_url: '',
    photo_stage: 'media_general'
  },
  medical: {
    blood_type: 'unknown',
    allergies: '',
    condition: '',
    emergency_phone: '',
    hospital_reference: ''
  },
  parent1: {
    national_id: '',
    relationship: 'madre',
    full_name: '',
    phone_mobile: '',
    phone_work: '',
    email: '',
    occupation: ''
  },
  parent2: {
    national_id: '',
    relationship: 'padre',
    full_name: '',
    phone_mobile: '',
    occupation: '',
    authorized_to_pickup: true
  },
  socioeconomic: {
    housing_type: 'propia',
    family_members: 4,
    siblings_in_school: '',
    lives_with: 'ambos_padres'
  }
})

const stageLabel = computed(() => {
  const s = form.value.student.photo_stage
  if (s === 'preescolar_primaria') return 'Preescolar / Primaria'
  if (s === 'diversificado') return 'Diversificado (4°-5° Año)'
  return 'Media General (1°-3° Año)'
})

const resolvePreview = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  return `${config.public.apiBase}${url}`
}

// Auth helper
const getAuthHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('feathers-jwt') || localStorage.getItem('school_jwt')
    if (token) return { Authorization: `Bearer ${token}` }
  }
  return {}
}

// Fetch list of students for quick select
const fetchStudents = async () => {
  try {
    const headers = getAuthHeaders()
    const res = await $fetch(`${config.public.apiBase}/students?$limit=100`, { headers })
    registeredStudents.value = Array.isArray(res) ? res : (res.data || [])
  } catch (err) {
    // Clean-slate fallback
    registeredStudents.value = []
  }
}

onMounted(() => {
  fetchStudents()
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
    national_id: s.national_id || '',
    blood_type: s.blood_type || 'unknown',
    date_of_birth: s.date_of_birth ? s.date_of_birth.split('T')[0] : '',
    gender: s.gender || 'male',
    grade: s.grade || '1er Año Media General',
    section: s.section || 'A',
    phone_mobile: s.phone_mobile || '',
    address_line1: s.address_line1 || '',
    photo_url: s.photo_url || '',
    photo_stage: s.photo_stage || 'media_general'
  }

  // Populate medical and socioeconomic data if present
  if (s.medical_data) {
    form.value.medical = { ...form.value.medical, ...s.medical_data }
  }
  if (s.socioeconomic_data) {
    form.value.socioeconomic = { ...form.value.socioeconomic, ...s.socioeconomic_data }
  }
  if (s.authorized_pickup) {
    form.value.parent2 = { ...form.value.parent2, ...s.authorized_pickup }
  }

  toast.success(`Datos cargados para ${s.first_name} ${s.last_name}`, 'Expediente Escolar')
}

// Print Functions
const printBlankSheet = () => {
  // Temporarily reset inputs, trigger browser print dialog, and restore
  const currentBackup = JSON.parse(JSON.stringify(form.value))
  resetForm()
  setTimeout(() => {
    window.print()
    form.value = currentBackup
  }, 100)
}

const printWithData = () => {
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
      national_id: '',
      blood_type: 'unknown',
      date_of_birth: '',
      gender: 'male',
      grade: '1er Año Media General',
      section: 'A',
      phone_mobile: '',
      address_line1: '',
      photo_url: '',
      photo_stage: 'media_general'
    },
    medical: {
      blood_type: 'unknown',
      allergies: '',
      condition: '',
      emergency_phone: '',
      hospital_reference: ''
    },
    parent1: {
      national_id: '',
      relationship: 'madre',
      full_name: '',
      phone_mobile: '',
      phone_work: '',
      email: '',
      occupation: ''
    },
    parent2: {
      national_id: '',
      relationship: 'padre',
      full_name: '',
      phone_mobile: '',
      occupation: '',
      authorized_to_pickup: true
    },
    socioeconomic: {
      housing_type: 'propia',
      family_members: 4,
      siblings_in_school: '',
      lives_with: 'ambos_padres'
    }
  }
}

// Save directly to Feathers backend
const saveEnrollment = async () => {
  // Minimal required validations
  if (!form.value.student.first_name || !form.value.student.last_name) {
    toast.error('Ingrese los nombres y apellidos del estudiante.', 'Validación')
    return
  }
  if (!form.value.parent1.full_name) {
    toast.error('Ingrese el nombre del representante legal principal.', 'Validación')
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
      section: form.value.student.section,
      phone_mobile: form.value.student.phone_mobile || null,
      address_line1: form.value.student.address_line1 || null,
      photo_url: form.value.student.photo_url || null,
      medical_data: form.value.medical,
      socioeconomic_data: form.value.socioeconomic,
      authorized_pickup: form.value.parent2,
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

    // Save or register Parent 1 if data present
    if (form.value.parent1.full_name) {
      const names = form.value.parent1.full_name.trim().split(' ')
      const parentPayload = {
        first_name: names[0] || 'Representante',
        last_name: names.slice(1).join(' ') || 'Legal',
        national_id: form.value.parent1.national_id || undefined,
        id_number: form.value.parent1.national_id ? form.value.parent1.national_id.replace(/^[VEPGJ]-?/i, '') : undefined,
        email_primary: form.value.parent1.email || `rep_${Date.now()}@santaluisa.edu.ve`,
        phone_mobile: form.value.parent1.phone_mobile || null,
        occupation: form.value.parent1.occupation || null,
        student_id: savedStudent?.id || form.value.student.id || undefined,
        status: 'active'
      }

      await $fetch(`${config.public.apiBase}/parents`, {
        method: 'POST',
        headers,
        body: parentPayload
      }).catch(e => console.warn('Parent save note:', e))
    }

    toast.success('Expediente y matrícula guardados exitosamente en la base de datos.', 'Inscripción Completada')
    await fetchStudents()
  } catch (err) {
    toast.error(err.data?.message || err.message || 'Error al guardar la matrícula.', 'Error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
@media print {
  body {
    background-color: white !important;
    color: black !important;
  }
  @page {
    size: letter portrait;
    margin: 10mm 12mm;
  }
  input, select, textarea {
    border-color: #000000 !important;
    color: #000000 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>
