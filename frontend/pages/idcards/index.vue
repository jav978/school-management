<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section (print:hidden) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-purple dark:text-brand-gold border border-brand-purple/20">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Carnets de Identificación Escolar
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Credenciales con foto oficial, código QR de asistencia, marca de agua institucional e impresión dúplex
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <!-- Botón Emisión Individual -->
        <button 
          @click="openCreateModal()" 
          type="button"
          data-testid="btn-open-create-card"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-md shadow-brand-purple/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Emitir Carnet</span>
        </button>

        <!-- Botón Emisión e Impresión por Lote (Sección) -->
        <button 
          @click="openBatchModal()" 
          type="button"
          data-testid="btn-open-batch-modal"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>📦</span>
          <span>Imprimir Lote por Sección</span>
        </button>

        <!-- Botón Impresión de Vista Actual -->
        <button 
          @click="triggerPrintSingle()" 
          type="button"
          class="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>🖨️ Imprimir Vista</span>
        </button>
      </div>
    </div>

    <!-- Toolbar Filters (print:hidden) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Filtrar por Tipo:</span>
        <select 
          v-model="filterType"
          data-testid="select-filter-card-type"
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
        >
          <option value="">Todos los Carnets ({{ idCards.length }})</option>
          <option value="estudiante">Estudiantes</option>
          <option value="profesor">Profesores</option>
          <option value="administrativo">Administrativos</option>
          <option value="obrero">Obreros / Servicios</option>
        </select>
      </div>

      <div class="text-xs text-slate-400">
        Carnets visibles: <strong class="text-slate-700 dark:text-slate-200">{{ filteredCards.length }}</strong>
      </div>
    </div>

    <!-- ID Cards Grid View (Side by side Front & Back for each card) -->
    <div v-if="loading" class="py-16 text-center print:hidden">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-purple border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2 font-medium">Cargando credenciales escolares...</p>
    </div>

    <div v-else-if="filteredCards.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800 print:hidden">
      <p class="text-4xl mb-2">🪪</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay carnets registrados</h3>
      <p class="text-xs text-slate-400 mt-1">Genera credenciales con el botón "Emitir Carnet" o "Imprimir Lote por Sección".</p>
    </div>

    <!-- Vista Individual de Carnets -->
    <div v-else class="space-y-8 single-cards-container">
      <div 
        v-for="card in filteredCards" 
        :key="card.id"
        data-testid="id-card-item"
        class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-sm print:p-0 print:border-none print:shadow-none single-card-wrapper"
      >
        <div class="flex justify-between items-center mb-4 print:hidden border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 class="text-base font-bold text-slate-850 dark:text-white">{{ card.recipient_name }}</h2>
            <p class="text-xs text-slate-400 font-mono">{{ card.card_code }} • C.I: {{ card.recipient_id_card }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-brand-purple dark:text-brand-gold font-bold text-xs rounded-full uppercase">
              {{ card.recipient_type }}
            </span>

            <!-- Edit Button -->
            <button
              @click="openEditModal(card)"
              type="button"
              data-testid="btn-edit-card"
              class="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Modificar datos del carnet"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editar</span>
            </button>

            <!-- Revoke / Delete Button -->
            <button
              @click="openDeleteModal(card)"
              type="button"
              data-testid="btn-revoke-card"
              class="px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Revocar carnet"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Revocar</span>
            </button>
          </div>
        </div>

        <!-- Pair of Front and Back Cards (Standard Vertical CR80 Credential) -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
          
          <!-- 1. FRENTE DEL CARNET -->
          <div class="w-[280px] h-[440px] bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-900 relative print:shadow-none print:border-slate-400 print:break-inside-avoid">
            <!-- Marca de agua de fondo (Watermark institucional calibrada al 11%) -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
              <img 
                src="/logocolegio.png" 
                alt="" 
                class="w-60 h-60 object-contain opacity-[0.11] grayscale contrast-125 select-none transform -rotate-12 pointer-events-none" 
              />
            </div>

            <!-- Header Banner -->
            <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 text-center relative z-10">
              <div class="flex items-center justify-center gap-2">
                <img src="/logocolegio.png" alt="Logo" class="w-8 h-8 object-contain bg-white rounded-lg p-0.5 shadow-xs" />
                <div class="text-left">
                  <h3 class="font-black text-xs uppercase tracking-tight leading-none">U.E Santa Luisa</h3>
                  <span class="text-[8px] font-semibold opacity-90 block leading-tight">Comunidad Educativa Vicenciana</span>
                </div>
              </div>
            </div>

            <!-- Profile Photo -->
            <div class="flex flex-col items-center px-4 pt-2 relative z-10">
              <div class="w-28 h-28 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md bg-slate-100 flex items-center justify-center">
                <img 
                  v-if="card.photo_url" 
                  :src="resolvePhotoUrl(card.photo_url)" 
                  :alt="card.recipient_name"
                  class="w-full h-full object-cover" 
                />
                <span v-else class="text-3xl font-bold text-slate-400">
                  {{ card.recipient_name ? card.recipient_name[0] : '🎓' }}
                </span>
              </div>

              <!-- Name and Details -->
              <h4 class="font-black text-sm text-center leading-tight mt-3 text-slate-900">
                {{ card.recipient_name }}
              </h4>
              <p class="text-[11px] font-bold text-orange-600 uppercase mt-0.5">
                {{ card.position || card.recipient_type }}
              </p>
              <p class="text-[10px] text-slate-500 font-semibold">
                {{ card.grade_level || card.department || 'Educación Media' }}
              </p>
            </div>

            <!-- Footer Section of Front -->
            <div class="p-3 bg-slate-50/90 border-t border-slate-200 text-center space-y-1 relative z-10 backdrop-blur-[1px]">
              <div class="flex justify-between text-[10px] font-bold text-slate-700">
                <span>C.I: {{ card.recipient_id_card || 'V-00000000' }}</span>
                <span>VENCE: {{ formatDate(card.expiry_date || card.valid_until) }}</span>
              </div>
              <p class="font-mono text-[9px] text-slate-400">{{ card.card_code }}</p>
            </div>
          </div>

          <!-- 2. REVERSO DEL CARNET -->
          <div class="w-[280px] h-[440px] bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-800 p-4 relative print:shadow-none print:border-slate-400 print:break-inside-avoid">
            <!-- Marca de agua de fondo (Watermark institucional calibrada al 11%) -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
              <img 
                src="/logocolegio.png" 
                alt="" 
                class="w-60 h-60 object-contain opacity-[0.11] grayscale contrast-125 select-none transform rotate-12 pointer-events-none" 
              />
            </div>

            <!-- Institutional Disclaimer -->
            <div class="relative z-10">
              <div class="text-center pb-2 border-b border-slate-200">
                <p class="text-[9px] font-bold uppercase text-slate-400">Credencial de Identificación</p>
                <p class="text-[8px] text-slate-500 leading-tight">
                  Este carnet es personal e intransferible. Acredita al portador como miembro activo de la institución.
                </p>
              </div>

              <!-- Medical and Emergency Details -->
              <div class="mt-3 space-y-1.5 text-[10px]">
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Tipo de Sangre:</span>
                  <span class="font-bold text-rose-600">{{ card.blood_type || 'O+' }}</span>
                </div>
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Emergencia:</span>
                  <span class="font-semibold text-right truncate max-w-[140px]">{{ card.emergency_contact || 'Representante' }}</span>
                </div>
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Tel. Emergencia:</span>
                  <span class="font-semibold">{{ card.emergency_phone || '+58 414 000 0000' }}</span>
                </div>
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Dirección:</span>
                  <span class="font-medium text-[9px] text-right truncate max-w-[140px]">{{ card.address || 'Caracas, Venezuela' }}</span>
                </div>
              </div>
            </div>

            <!-- QR Code and Scanner Validation -->
            <div class="flex flex-col items-center justify-center my-auto py-2 relative z-10">
              <ui-qr-code 
                :value="getVerificationUrl(card.card_code)"
                :size="80"
              />
              <span class="text-[8px] font-mono text-slate-500 mt-1 font-bold">LECTURA DE ASISTENCIA QR</span>
            </div>

            <!-- Authorized Signature line -->
            <div class="text-center pt-2 border-t border-slate-200 relative z-10">
              <div class="w-24 border-b border-slate-600 mx-auto mb-0.5"></div>
              <p class="text-[8px] font-bold uppercase">Sor Dolores Amaya • Directora</p>
              <p class="text-[7px] text-slate-400">Calle Real del Prado de María, Caracas • (0212) 123-4567</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL DE EMISIÓN / EDICIÓN INDIVIDUAL -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-[#160d33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
          
          <!-- Standardized Institutional Modal Header -->
          <div class="px-6 py-4 bg-brand-purple text-white flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg">
                🪪
              </div>
              <div>
                <h3 class="font-black text-sm text-white tracking-tight leading-tight">
                  {{ isEditingCard ? 'Modificar Carnet Escolar' : 'Emitir Nuevo Carnet' }}
                </h3>
                <span class="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                  U.E Santa Luisa • Identificación Escolar y Control QR
                </span>
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
          <form @submit.prevent="saveCard" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
              <!-- Opcional: Selección rápida de estudiante registrado -->
              <div v-if="!isEditingCard && registeredStudents.length" class="p-3 bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200/80 dark:border-white/10">
                <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Cargar datos desde Estudiante Registrado (Opcional)
                </label>
                <select 
                  v-model="selectedStudentId"
                  @change="onSelectStudent"
                  class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-purple cursor-pointer"
                >
                  <option value="">-- Ingresar datos manualmente --</option>
                  <option v-for="st in registeredStudents" :key="st.id" :value="st.id">
                    {{ st.first_name }} {{ st.last_name }} ({{ formatStudentIdDisplay(st) }}) - {{ st.grade || 'Estudiante' }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo *</label>
                  <input 
                    v-model="cardForm.recipient_name" 
                    required 
                    data-testid="input-card-recipient-name"
                    placeholder="Ej: Sofía Morales"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cédula de Identidad *</label>
                  <input 
                    v-model="cardForm.recipient_id_card" 
                    required 
                    data-testid="input-card-recipient-id"
                    placeholder="V-32456789 o EST-2026-XXXX"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Personal / Rol</label>
                  <select 
                    v-model="cardForm.recipient_type"
                    data-testid="select-card-recipient-type"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor / Docente</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="obrero">Obrero / Servicios</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cargo o Grado</label>
                  <input 
                    v-model="cardForm.position" 
                    data-testid="input-card-position"
                    placeholder="1er Año Sección A / Docente"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Sangre</label>
                  <input 
                    v-model="cardForm.blood_type" 
                    placeholder="O+, A+, B+, etc."
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tel. de Emergencia</label>
                  <input 
                    v-model="cardForm.emergency_phone" 
                    placeholder="+58 414 123 4567"
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
              </div>

              <!-- Upload de Fotografía con Recorte Facial y Autenticación Bearer -->
              <ui-avatar-upload
                v-model="cardForm.photo_url"
                label="Fotografía para el Carnet"
              />
            </div>

            <!-- Modal Footer Actions -->
            <div class="p-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
              <button 
                type="button" 
                @click="isModalOpen = false" 
                class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕ Cancelar
              </button>
              <button 
                type="submit" 
                data-testid="btn-save-card"
                class="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-purple hover:bg-brand-purple/90 text-white dark:bg-brand-gold dark:text-slate-950 dark:hover:bg-brand-gold/90 shadow-md shadow-brand-purple/20 transition-all cursor-pointer"
              >
                ✓ {{ isEditingCard ? 'Guardar Cambios' : 'Emitir Carnet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL DE EMISIÓN E IMPRESIÓN POR LOTE (SECCIÓN / GRADO) -->
    <Teleport to="body">
      <div 
        v-if="isBatchModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in print:hidden"
      >
        <div class="relative w-full max-w-4xl bg-white dark:bg-[#160d33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
          
          <!-- Batch Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-brand-purple to-indigo-900 text-white flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-bold shadow-md">
                📦
              </div>
              <div>
                <h3 class="font-black text-base text-white tracking-tight">
                  Emisión e Impresión por Lote de Sección
                </h3>
                <span class="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                  U.E Santa Luisa • Gestión Masiva de Carnets Dúplex
                </span>
              </div>
            </div>
            <button 
              @click="isBatchModalOpen = false" 
              type="button" 
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Section Selectors and Filters -->
          <div class="p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grado / Año Académico
                </label>
                <select 
                  v-model="batchSelectedGrade"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                >
                  <option value="">Todos los Grados / Años</option>
                  <option v-for="g in availableGrades" :key="g" :value="g">{{ g }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sección
                </label>
                <select 
                  v-model="batchSelectedSection"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                >
                  <option value="">Todas las Secciones</option>
                  <option value="A">Sección A</option>
                  <option value="B">Sección B</option>
                  <option value="C">Sección C</option>
                  <option value="U">Sección Única (U)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Búsqueda Rápida
                </label>
                <input 
                  v-model="batchSearchQuery"
                  placeholder="Buscar estudiante o cédula..."
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                />
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-4">
                <span class="text-slate-500 dark:text-slate-400">
                  Estudiantes listados: <strong class="text-slate-800 dark:text-white">{{ filteredBatchStudents.length }}</strong>
                </span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Carnet Emitido: {{ countExistingBatchCards }}
                </span>
                <span class="text-amber-600 dark:text-amber-400 font-bold">
                  ⏳ Por Emitir: {{ countMissingBatchCards }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="toggleSelectAllBatch"
                  class="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                >
                  {{ isAllBatchSelected ? 'Desmarcar Todos' : 'Seleccionar Todos' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Students Batch Table -->
          <div class="flex-1 overflow-y-auto min-h-0 p-6">
            <div v-if="filteredBatchStudents.length === 0" class="py-12 text-center text-slate-400 text-xs">
              No se encontraron estudiantes para los filtros seleccionados.
            </div>

            <table v-else class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th class="py-2.5 px-3 w-10 text-center">
                    <input 
                      type="checkbox" 
                      :checked="isAllBatchSelected"
                      @change="toggleSelectAllBatch"
                      class="rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
                    />
                  </th>
                  <th class="py-2.5 px-3">Estudiante</th>
                  <th class="py-2.5 px-3">Documento / Cód.</th>
                  <th class="py-2.5 px-3">Grado / Sección</th>
                  <th class="py-2.5 px-3 text-center">Fotografía</th>
                  <th class="py-2.5 px-3 text-right">Estado Carnet</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr 
                  v-for="st in filteredBatchStudents" 
                  :key="st.id"
                  :class="[
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors',
                    selectedBatchStudentIds.includes(st.id) ? 'bg-purple-50/40 dark:bg-purple-950/20' : ''
                  ]"
                >
                  <td class="py-3 px-3 text-center">
                    <input 
                      type="checkbox" 
                      :value="st.id"
                      v-model="selectedBatchStudentIds"
                      class="rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
                    />
                  </td>
                  <td class="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">
                    {{ st.first_name }} {{ st.last_name }}
                  </td>
                  <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {{ formatStudentIdDisplay(st) }}
                  </td>
                  <td class="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {{ st.grade ? `${st.grade} - ${st.section || 'U'}` : 'Educación Media' }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span v-if="st.photo_url || st.avatar_url" class="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>📷</span> Sí
                    </span>
                    <span v-else class="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <span>👤</span> Por defecto
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <span 
                      v-if="getStudentCard(st)" 
                      class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[10px]"
                    >
                      ✓ {{ getStudentCard(st).card_code }}
                    </span>
                    <span 
                      v-else 
                      class="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[10px]"
                    >
                      ⏳ Por emitir
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Batch Modal Footer -->
          <div class="p-4 bg-slate-50 dark:bg-[#110926] border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Seleccionados para impresión: <strong class="text-brand-purple dark:text-brand-gold">{{ selectedBatchStudentIds.length }}</strong>
            </span>

            <div class="flex items-center gap-3">
              <button 
                type="button" 
                @click="isBatchModalOpen = false" 
                class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              <!-- Botón Emitir Faltantes -->
              <button
                v-if="hasMissingBatchCardsSelected"
                type="button"
                @click="emitMissingCardsForBatch"
                :disabled="isEmittingBatch"
                class="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span v-if="isEmittingBatch">⏳ Emitiendo...</span>
                <span v-else>⚡ Emitir Faltantes ({{ missingSelectedCount }})</span>
              </button>

              <!-- Botón Abrir Vista Dúplex -->
              <button 
                type="button" 
                @click="openDuplexPrintSheet"
                :disabled="selectedBatchStudentIds.length === 0"
                class="px-5 py-2.5 rounded-xl text-xs font-black bg-brand-purple hover:bg-purple-800 text-white dark:bg-brand-gold dark:text-slate-950 dark:hover:bg-amber-400 shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>🖨️</span>
                <span>Previsualizar Hoja Carta Dúplex</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- VISTA COMPLETA DE IMPRESIÓN DÚPLEX EN HOJA CARTA -->
    <Teleport to="body">
      <div 
        v-if="isDuplexPrintOpen" 
        class="fixed inset-0 z-[999] overflow-y-auto bg-slate-950/90 backdrop-blur-md animate-fade-in duplex-print-modal"
      >
        <!-- Top Toolbar (print:hidden) -->
        <div class="sticky top-0 z-[1000] bg-slate-900 text-white px-6 py-4 shadow-xl border-b border-white/10 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div class="flex items-center gap-3">
            <button 
              type="button" 
              @click="isDuplexPrintOpen = false"
              data-testid="btn-close-duplex"
              class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>← Volver</span>
            </button>
            <div>
              <h2 class="text-base font-black text-white leading-tight">
                Impresión Dúplex en Hoja Carta (8 Carnets por Hoja)
              </h2>
              <p class="text-[11px] text-amber-300 font-medium">
                Página 1: Anversos • Página 2: Reversos en Espejo Horizontal para Dúplex y Guillotina
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400">
              Total Carnets: <strong class="text-white">{{ activePrintCards.length }}</strong>
            </span>
            <button 
              type="button" 
              @click="triggerPrintDuplex" 
              class="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-brand-gold hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🖨️ Imprimir Hojas Dúplex (Ctrl+P)</span>
            </button>
          </div>
        </div>

        <!-- Print Sheets View -->
        <div class="p-6 flex flex-col items-center gap-10 print:p-0 print:gap-0">
          
          <template v-for="(sheet, sheetIdx) in duplexSheets" :key="'sheet-' + sheetIdx">
            <!-- 1. PÁGINA ANVERSO (FRENTES) -->
            <div class="duplex-page-sheet letter-portrait bg-white shadow-2xl rounded-2xl print:rounded-none print:shadow-none p-6 print:p-0 flex flex-col justify-between border print:border-none">
              <div class="print-sheet-header print:hidden pb-3 border-b border-slate-200 flex justify-between items-center text-xs text-slate-400">
                <span class="font-bold uppercase text-brand-purple">HOJA {{ sheetIdx * 2 + 1 }} — ANVERSO (FRENTES)</span>
                <span>U.E Santa Luisa • Formato Carta</span>
              </div>

              <!-- Grid de 8 Carnets (4 columnas x 2 filas) -->
              <div class="grid grid-cols-4 grid-rows-2 gap-3 my-auto py-2 justify-items-center">
                <div 
                  v-for="(card, cardIdx) in sheet.fronts" 
                  :key="'front-' + card.id + '-' + cardIdx"
                  class="w-[48mm] h-[82mm] bg-white rounded-xl border border-dashed border-slate-300 print:border-slate-400 overflow-hidden flex flex-col justify-between text-slate-900 relative print:break-inside-avoid print:shadow-none"
                >
                  <!-- Marca de agua 11% -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                    <img src="/logocolegio.png" alt="" class="w-28 h-28 object-contain opacity-[0.11] grayscale contrast-125 select-none transform -rotate-12" />
                  </div>

                  <!-- Header Banner -->
                  <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-1 text-center relative z-10">
                    <div class="flex items-center justify-center gap-1">
                      <img src="/logocolegio.png" alt="Logo" class="w-4 h-4 object-contain bg-white rounded p-0.5" />
                      <div class="text-left">
                        <h4 class="font-black text-[8px] uppercase leading-none">U.E Santa Luisa</h4>
                        <span class="text-[6px] opacity-90 block leading-none">Vicenciana</span>
                      </div>
                    </div>
                  </div>

                  <!-- Photo & Name -->
                  <div class="flex flex-col items-center px-1 pt-1 relative z-10">
                    <div class="w-14 h-14 rounded-lg overflow-hidden border border-orange-500 shadow-xs bg-slate-100 flex items-center justify-center">
                      <img 
                        v-if="card.photo_url" 
                        :src="resolvePhotoUrl(card.photo_url)" 
                        :alt="card.recipient_name"
                        class="w-full h-full object-cover" 
                      />
                      <span v-else class="text-lg font-bold text-slate-400">
                        {{ card.recipient_name ? card.recipient_name[0] : '🎓' }}
                      </span>
                    </div>

                    <h5 class="font-black text-[9px] text-center leading-tight mt-1 text-slate-900 truncate w-full px-0.5">
                      {{ card.recipient_name }}
                    </h5>
                    <p class="text-[7.5px] font-bold text-orange-600 uppercase leading-none mt-0.5">
                      {{ card.position || 'Estudiante' }}
                    </p>
                    <p class="text-[7px] text-slate-500 font-semibold leading-none mt-0.5">
                      {{ card.department || 'Educación Media' }}
                    </p>
                  </div>

                  <!-- Footer Front -->
                  <div class="p-1 bg-slate-50/90 border-t border-slate-200 text-center relative z-10 text-[7px] font-bold text-slate-700">
                    <div class="flex justify-between px-0.5">
                      <span>C.I: {{ card.recipient_id_card }}</span>
                      <span>{{ formatDate(card.expiry_date || card.valid_until) }}</span>
                    </div>
                    <p class="font-mono text-[6px] text-slate-400 leading-none mt-0.5">{{ card.card_code }}</p>
                  </div>
                </div>
              </div>

              <div class="text-center text-[8px] text-slate-300 border-t pt-1 print:hidden">
                Líneas punteadas indican guías de corte para guillotina
              </div>
            </div>

            <!-- 2. PÁGINA REVERSO (DORSOS) EN ESPEJO HORIZONTAL -->
            <div class="duplex-page-sheet letter-portrait bg-white shadow-2xl rounded-2xl print:rounded-none print:shadow-none p-6 print:p-0 flex flex-col justify-between border print:border-none">
              <div class="print-sheet-header print:hidden pb-3 border-b border-slate-200 flex justify-between items-center text-xs text-slate-400">
                <span class="font-bold uppercase text-indigo-600">HOJA {{ sheetIdx * 2 + 2 }} — REVERSO (DORSOS EN ESPEJO DÚPLEX)</span>
                <span>Alineado simétrico con Hoja {{ sheetIdx * 2 + 1 }}</span>
              </div>

              <!-- Grid de 8 Carnets en Espejo Horizontal -->
              <div class="grid grid-cols-4 grid-rows-2 gap-3 my-auto py-2 justify-items-center">
                <div 
                  v-for="(card, cardIdx) in sheet.backsMirror" 
                  :key="'back-' + card.id + '-' + cardIdx"
                  class="w-[48mm] h-[82mm] bg-white rounded-xl border border-dashed border-slate-300 print:border-slate-400 overflow-hidden flex flex-col justify-between text-slate-800 p-2 relative print:break-inside-avoid print:shadow-none"
                >
                  <!-- Marca de agua 11% -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                    <img src="/logocolegio.png" alt="" class="w-28 h-28 object-contain opacity-[0.11] grayscale contrast-125 select-none transform rotate-12" />
                  </div>

                  <!-- Disclaimer -->
                  <div class="relative z-10 text-center">
                    <p class="text-[7px] font-bold uppercase text-slate-500">Credencial Escolar</p>
                    <p class="text-[6px] text-slate-400 leading-tight">Personal e intransferible.</p>

                    <!-- Emergency info -->
                    <div class="mt-1 space-y-0.5 text-[6.5px] text-left">
                      <div class="flex justify-between border-b pb-0.5">
                        <span class="text-slate-400 font-bold">Sangre:</span>
                        <span class="font-bold text-rose-600">{{ card.blood_type || 'O+' }}</span>
                      </div>
                      <div class="flex justify-between border-b pb-0.5">
                        <span class="text-slate-400 font-bold">Emergencia:</span>
                        <span class="font-semibold truncate max-w-[85px]">{{ card.emergency_contact || 'Representante' }}</span>
                      </div>
                      <div class="flex justify-between border-b pb-0.5">
                        <span class="text-slate-400 font-bold">Teléfono:</span>
                        <span class="font-semibold">{{ card.emergency_phone || '+58 414 000 0000' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- QR Code -->
                  <div class="flex flex-col items-center justify-center my-auto py-0.5 relative z-10">
                    <ui-qr-code 
                      :value="getVerificationUrl(card.card_code)"
                      :size="48"
                    />
                    <span class="text-[5.5px] font-mono text-slate-400 mt-0.5 font-bold">ASISTENCIA QR</span>
                  </div>

                  <!-- Signature -->
                  <div class="text-center pt-1 border-t border-slate-200 relative z-10">
                    <div class="w-16 border-b border-slate-600 mx-auto mb-0.5"></div>
                    <p class="text-[6px] font-bold uppercase">Sor Dolores Amaya • Directora</p>
                  </div>
                </div>
              </div>

              <div class="text-center text-[8px] text-slate-300 border-t pt-1 print:hidden">
                Reverso ordenado en espejo para coincidir al imprimir a doble cara
              </div>
            </div>
          </template>

        </div>
      </div>
    </Teleport>

    <!-- Confirm Delete / Revoke Modal -->
    <Teleport to="body">
      <div 
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      >
        <div class="relative w-full max-w-md bg-white dark:bg-[#160d33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl mx-auto">
            ⚠️
          </div>

          <div class="text-center">
            <h3 class="font-black text-lg text-slate-900 dark:text-white">¿Revocar este carnet?</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Estás a punto de revocar la credencial de <strong>{{ cardToDelete?.recipient_name }}</strong> 
              (Cód: <span class="font-mono text-brand-purple dark:text-brand-gold font-bold">{{ cardToDelete?.card_code }}</span>). El carnet quedará inactivo e invalidado para acceso.
            </p>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="isDeleteModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              @click="confirmDeleteCard"
              data-testid="btn-confirm-revoke"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Sí, Revocar Carnet
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

const idCards = ref([])
const loading = ref(true)
const filterType = ref('')
const isModalOpen = ref(false)
const isEditingCard = ref(false)
const editingCardId = ref(null)
const isDeleteModalOpen = ref(false)
const cardToDelete = ref(null)

const registeredStudents = ref([])
const selectedStudentId = ref('')

// Batch and Duplex Print States
const isBatchModalOpen = ref(false)
const isDuplexPrintOpen = ref(false)
const batchSelectedGrade = ref('')
const batchSelectedSection = ref('')
const batchSearchQuery = ref('')
const selectedBatchStudentIds = ref([])
const isEmittingBatch = ref(false)

const resolvePhotoUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  const config = useRuntimeConfig()
  return `${config.public.apiBase}${url}`
}

const cardForm = ref({
  recipient_name: '',
  recipient_id_card: '',
  recipient_type: 'estudiante',
  position: 'Estudiante Regular',
  department: 'Educación Media',
  blood_type: 'O+',
  emergency_contact: 'Representante Legal',
  emergency_phone: '+58 414 123 4567',
  address: 'Calle Real del Prado de María, Caracas',
  photo_url: ''
})

const fetchIdCards = async () => {
  loading.value = true
  try {
    const res = await api.get('id-cards', { $limit: 200 })
    const list = res.data || res || []
    idCards.value = list.filter(c => !c.is_deleted && c.status !== 'inactivo')
  } catch (err) {
    console.error('Error fetching id cards:', err)
  } finally {
    loading.value = false
  }
}

const fetchStudents = async () => {
  try {
    const res = await api.get('students', { $limit: 200 })
    registeredStudents.value = res.data || res || []
  } catch (err) {
    console.warn('Error fetching registered students:', err)
  }
}

// Helper: Formatear ID de estudiante en display
const formatStudentIdDisplay = (st) => {
  if (st.national_id && /\d+/.test(st.national_id)) {
    return st.national_id.trim()
  }
  return st.student_id || ('ID ' + st.id)
}

// Helper: Cuando se selecciona un estudiante del desplegable
const onSelectStudent = () => {
  if (!selectedStudentId.value) return
  const st = registeredStudents.value.find(s => s.id === Number(selectedStudentId.value))
  if (st) {
    cardForm.value.recipient_name = `${st.first_name || ''} ${st.last_name || ''}`.trim()
    
    // Si la cédula nacional contiene dígitos la usamos, sino usamos su código escolar student_id
    const hasDigits = st.national_id && /\d+/.test(st.national_id)
    cardForm.value.recipient_id_card = hasDigits ? st.national_id.trim() : (st.student_id || 'V-')
    
    cardForm.value.recipient_type = 'estudiante'
    cardForm.value.position = st.grade ? `${st.grade} Sección ${st.section || 'U'}` : 'Estudiante Regular'
    cardForm.value.department = st.level === 'media' ? 'Educación Media General' : 'Educación Primaria'
    cardForm.value.blood_type = st.blood_type || 'O+'
    if (st.photo_url || st.avatar_url) {
      cardForm.value.photo_url = st.photo_url || st.avatar_url
    }
  }
}

const filteredCards = computed(() => {
  if (!filterType.value) return idCards.value
  return idCards.value.filter(c => c.recipient_type === filterType.value)
})

// Grades available based on registered students
const availableGrades = computed(() => {
  const set = new Set()
  registeredStudents.value.forEach(s => {
    if (s.grade) set.add(s.grade)
  })
  if (set.size === 0) {
    return ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año', '1er Grado', '2do Grado', '3er Grado']
  }
  return Array.from(set)
})

// Batch Filtered Students
const filteredBatchStudents = computed(() => {
  return registeredStudents.value.filter(s => {
    if (batchSelectedGrade.value && s.grade !== batchSelectedGrade.value) {
      return false
    }
    if (batchSelectedSection.value && s.section && s.section !== batchSelectedSection.value) {
      return false
    }
    if (batchSearchQuery.value) {
      const q = batchSearchQuery.value.toLowerCase()
      const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase()
      const id = (s.national_id || s.student_id || '').toLowerCase()
      if (!name.includes(q) && !id.includes(q)) return false
    }
    return true
  })
})

const isAllBatchSelected = computed(() => {
  if (!filteredBatchStudents.value.length) return false
  return filteredBatchStudents.value.every(s => selectedBatchStudentIds.value.includes(s.id))
})

const toggleSelectAllBatch = () => {
  if (isAllBatchSelected.value) {
    selectedBatchStudentIds.value = []
  } else {
    selectedBatchStudentIds.value = filteredBatchStudents.value.map(s => s.id)
  }
}

const getStudentCard = (student) => {
  const normId = (student.national_id || '').trim()
  const studentId = (student.student_id || '').trim()
  return idCards.value.find(c => 
    c.recipient_type === 'estudiante' &&
    ((normId && c.recipient_id_card === normId) || (studentId && c.recipient_id_card === studentId))
  )
}

const countExistingBatchCards = computed(() => {
  return filteredBatchStudents.value.filter(s => !!getStudentCard(s)).length
})

const countMissingBatchCards = computed(() => {
  return filteredBatchStudents.value.filter(s => !getStudentCard(s)).length
})

const hasMissingBatchCardsSelected = computed(() => {
  return selectedBatchStudentIds.value.some(id => {
    const st = registeredStudents.value.find(s => s.id === id)
    return st && !getStudentCard(st)
  })
})

const missingSelectedCount = computed(() => {
  return selectedBatchStudentIds.value.filter(id => {
    const st = registeredStudents.value.find(s => s.id === id)
    return st && !getStudentCard(st)
  }).length
})

// Emitir masivamente carnets para estudiantes seleccionados que no tengan uno activo
const emitMissingCardsForBatch = async () => {
  const missingStudents = selectedBatchStudentIds.value
    .map(id => registeredStudents.value.find(s => s.id === id))
    .filter(st => st && !getStudentCard(st))

  if (!missingStudents.length) return

  isEmittingBatch.value = true
  let createdCount = 0

  try {
    for (const st of missingStudents) {
      const typePrefix = 'EST'
      const year = new Date().getFullYear()
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const code = `CRD-${typePrefix}-${year}-${randomSuffix}`

      const hasDigits = st.national_id && /\d+/.test(st.national_id)
      const idCardVal = hasDigits ? st.national_id.trim() : (st.student_id || `EST-${st.id}`)

      const payload = {
        recipient_name: `${st.first_name || ''} ${st.last_name || ''}`.trim(),
        recipient_id_card: idCardVal,
        recipient_type: 'estudiante',
        position: st.grade ? `${st.grade} Sección ${st.section || 'U'}` : 'Estudiante Regular',
        department: st.level === 'media' ? 'Educación Media General' : 'Educación Primaria',
        blood_type: st.blood_type || 'O+',
        emergency_contact: 'Representante Legal',
        emergency_phone: '+58 414 123 4567',
        address: 'Calle Real del Prado de María, Caracas',
        photo_url: st.photo_url || st.avatar_url || '',
        card_code: code,
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: '2027-07-31',
        status: 'activo',
        is_printed: true
      }

      await api.post('id-cards', payload)
      createdCount++
    }

    await fetchIdCards()
    toast.success('Lote Emitido', `Se emitieron exitosamente ${createdCount} carnets escolares para los alumnos seleccionados.`)
  } catch (err) {
    console.error('Error emitting batch cards:', err)
    toast.error('Error en emisión por lote', err.message || 'No se pudieron emitir todos los carnets')
  } finally {
    isEmittingBatch.value = false
  }
}

// Active cards to print in Duplex Sheet
const activePrintCards = computed(() => {
  const cards = []
  for (const stId of selectedBatchStudentIds.value) {
    const st = registeredStudents.value.find(s => s.id === stId)
    if (!st) continue
    const card = getStudentCard(st)
    if (card) {
      cards.push(card)
    } else {
      // Mocked provisional object for immediate preview if not emitted
      const hasDigits = st.national_id && /\d+/.test(st.national_id)
      cards.push({
        id: 'temp-' + st.id,
        recipient_name: `${st.first_name || ''} ${st.last_name || ''}`.trim(),
        recipient_id_card: hasDigits ? st.national_id.trim() : (st.student_id || `EST-${st.id}`),
        recipient_type: 'estudiante',
        position: st.grade ? `${st.grade} Sección ${st.section || 'U'}` : 'Estudiante Regular',
        department: st.level === 'media' ? 'Educación Media General' : 'Educación Primaria',
        blood_type: st.blood_type || 'O+',
        photo_url: st.photo_url || st.avatar_url || '',
        card_code: `CRD-EST-2026-${String(st.id).padStart(4, '0')}`,
        valid_until: '2027-07-31',
        emergency_contact: 'Representante',
        emergency_phone: '+58 414 000 0000',
        address: 'Caracas, Venezuela'
      })
    }
  }
  return cards
})

// Duplex Sheets Organization: 8 cards per Letter sheet (4 cols x 2 rows)
// Page 1: Fronts [C1, C2, C3, C4, C5, C6, C7, C8]
// Page 2: Backs in Horizontal Mirror:
// Row 1: [C4, C3, C2, C1]
// Row 2: [C8, C7, C6, C5]
const duplexSheets = computed(() => {
  const list = activePrintCards.value
  const sheets = []
  const CHUNK_SIZE = 8

  for (let i = 0; i < list.length; i += CHUNK_SIZE) {
    const chunk = list.slice(i, i + CHUNK_SIZE)
    const fronts = [...chunk]

    // Create Mirror Backs for Duplex Long-Edge Flip
    // Row 1 (indices 0..3): Reverse order
    const row1 = chunk.slice(0, 4).reverse()
    // Row 2 (indices 4..7): Reverse order
    const row2 = chunk.slice(4, 8).reverse()
    const backsMirror = [...row1, ...row2]

    sheets.push({
      fronts,
      backsMirror
    })
  }

  return sheets
})

const openBatchModal = () => {
  isBatchModalOpen.value = true
  if (selectedBatchStudentIds.value.length === 0 && registeredStudents.value.length > 0) {
    selectedBatchStudentIds.value = registeredStudents.value.map(s => s.id)
  }
}

const openDuplexPrintSheet = () => {
  isBatchModalOpen.value = false
  isDuplexPrintOpen.value = true
}

const triggerPrintSingle = () => {
  window.print()
}

const triggerPrintDuplex = () => {
  window.print()
}

const formatDate = (dateStr) => {
  if (!dateStr) return '07/2027'
  return new Date(dateStr).toLocaleDateString('es-VE', {
    month: '2-digit',
    year: 'numeric'
  })
}

const getVerificationUrl = (code) => {
  if (process.client) {
    return `${window.location.origin}/verificar-boleta/${code || 'CRD-2026-001'}`
  }
  return `https://santaluisa.edu.ve/verificar-boleta/${code || 'CRD-2026-001'}`
}

const openCreateModal = () => {
  isEditingCard.value = false
  editingCardId.value = null
  selectedStudentId.value = ''
  cardForm.value = {
    recipient_name: '',
    recipient_id_card: '',
    recipient_type: 'estudiante',
    position: 'Estudiante Regular',
    department: 'Educación Media',
    blood_type: 'O+',
    emergency_contact: 'Representante Legal',
    emergency_phone: '+58 414 123 4567',
    address: 'Calle Real del Prado de María, Caracas',
    photo_url: ''
  }
  isModalOpen.value = true
}

const openEditModal = (card) => {
  isEditingCard.value = true
  editingCardId.value = card.id
  selectedStudentId.value = ''
  cardForm.value = {
    recipient_name: card.recipient_name,
    recipient_id_card: card.recipient_id_card,
    recipient_type: card.recipient_type || 'estudiante',
    position: card.position || 'Estudiante Regular',
    department: card.department || 'Educación Media',
    blood_type: card.blood_type || 'O+',
    emergency_contact: card.emergency_contact || 'Representante Legal',
    emergency_phone: card.emergency_phone || '+58 414 123 4567',
    address: card.address || 'Caracas, Venezuela',
    photo_url: card.photo_url || ''
  }
  isModalOpen.value = true
}

const openDeleteModal = (card) => {
  cardToDelete.value = card
  isDeleteModalOpen.value = true
}

const confirmDeleteCard = async () => {
  if (!cardToDelete.value) return
  const id = cardToDelete.value.id
  try {
    await api.remove(`id-cards/${id}`)
    idCards.value = idCards.value.filter(c => c.id !== id)
    isDeleteModalOpen.value = false
    toast.success('Carnet Revocado', 'El carnet escolar ha sido revocado e inactivado con éxito.')
  } catch (err) {
    toast.error('Error al revocar', err.message || 'No se pudo revocar el carnet')
  }
}

const saveCard = async () => {
  try {
    if (isEditingCard.value && editingCardId.value) {
      const payload = { ...cardForm.value }
      await api.patch(`id-cards/${editingCardId.value}`, payload)
      const idx = idCards.value.findIndex(c => c.id === editingCardId.value)
      if (idx !== -1) {
        idCards.value[idx] = { ...idCards.value[idx], ...payload }
      }
      isModalOpen.value = false
      toast.success('Carnet Actualizado', 'Los datos del carnet escolar han sido actualizados con éxito.')
      return
    }

    const typePrefix = (cardForm.value.recipient_type || 'est').slice(0, 3).toUpperCase()
    const year = new Date().getFullYear()
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const code = `CRD-${typePrefix}-${year}-${randomSuffix}`
    const payload = {
      ...cardForm.value,
      card_code: code,
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: '2027-07-31',
      status: 'activo',
      is_printed: true
    }

    await api.post('id-cards', payload)
    isModalOpen.value = false
    await fetchIdCards()
    toast.success('Carnet Emitido', 'El nuevo carnet escolar fue emitido exitosamente.')
  } catch (err) {
    toast.error('Error al guardar', err.message || 'No se pudo guardar el carnet')
  }
}

onMounted(() => {
  fetchIdCards()
  fetchStudents()
})
</script>

<style scoped>
@media print {
  @page {
    size: letter portrait;
    margin: 6mm;
  }

  body {
    background: white !important;
  }

  /* Force exact background color and watermark printing */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide app navigation and headers */
  .no-print, header, nav, aside, footer {
    display: none !important;
  }

  /* When printing from duplex modal, hide single cards */
  body:has(.duplex-print-modal) .single-cards-container {
    display: none !important;
  }

  /* Page break rules for duplex sheets */
  .duplex-page-sheet {
    page-break-after: always !important;
    break-after: page !important;
    display: flex !important;
    width: 100% !important;
    max-width: 200mm !important;
    height: 265mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
  }
}

.letter-portrait {
  width: 200mm;
  min-height: 265mm;
}
</style>
