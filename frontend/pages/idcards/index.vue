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
          <span>{{ batchButtonLabel }}</span>
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

    <!-- Toolbar Filters & Template Switcher (print:hidden) -->
    <div class="bg-white dark:bg-[#170f33] border border-slate-100 dark:border-white/10 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
        <!-- Selector de Plantilla de Diseño -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Plantilla:</span>
          <div class="inline-flex p-1 bg-slate-100 dark:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10">
            <button 
              type="button"
              data-testid="btn-template-modern-cyan"
              @click="activeTemplate = 'modern_cyan'"
              :class="activeTemplate === 'modern_cyan' ? 'bg-[#0891B2] text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 font-bold'"
              class="px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎨</span>
              <span>Moderna Cyan</span>
            </button>
            <button 
              type="button"
              data-testid="btn-template-classic-gold"
              @click="activeTemplate = 'classic_gold'"
              :class="activeTemplate === 'classic_gold' ? 'bg-orange-600 text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 font-bold'"
              class="px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🏛️</span>
              <span>Clásica Oro</span>
            </button>
          </div>
        </div>

        <!-- Filtro por Tipo de Personal / Rol -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Tipo:</span>
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
        class="bg-white dark:bg-[#170f33] p-3.5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm print:p-0 print:border-none print:shadow-none single-card-wrapper"
      >
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 print:hidden border-b border-slate-100 dark:border-white/10 pb-3">
          <div>
            <h2 class="text-base font-bold text-slate-850 dark:text-white">{{ card.recipient_name }}</h2>
            <p class="text-xs text-slate-400 font-mono">{{ card.card_code }} • C.I: {{ card.recipient_id_card }}</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-brand-purple dark:text-brand-gold font-bold text-xs rounded-full uppercase">
              {{ card.recipient_type }}
            </span>

            <!-- Edit Button -->
            <button
              @click="openEditModal(card)"
              type="button"
              data-testid="btn-edit-card"
              class="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
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
              class="min-h-[40px] px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
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
          
          <!-- ======================================================== -->
          <!-- PLANTILLA 1: MODERNA CYAN / NAVY (Modelo Fotográfico)     -->
          <!-- ======================================================== -->
          <template v-if="activeTemplate === 'modern_cyan'">
            <!-- 1. FRENTE MODERNA CYAN -->
            <div class="w-[280px] h-[450px] rounded-2xl shadow-xl border border-cyan-300/80 overflow-hidden flex flex-col justify-between text-slate-900 relative print:shadow-none print:border-slate-400 print:break-inside-avoid bg-gradient-to-b from-[#E8F5F8] via-[#EDF9FB] to-[#DDF1F5]">
              <!-- Marca de agua de fondo centrada -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                <img 
                  src="/logocolegio.png" 
                  alt="" 
                  class="w-60 h-60 object-contain opacity-10 select-none pointer-events-none" 
                />
              </div>

              <!-- Header Superior Azul Marino con Franja Cian e Icono Circular -->
              <div class="relative z-10">
                <div class="bg-[#0C2340] text-white px-3 py-2 flex items-center justify-between shadow-xs">
                  <div class="flex items-center gap-2">
                    <img src="/logocolegio.png" alt="Logo" class="w-8 h-8 object-contain" />
                    <div class="text-left">
                      <p class="text-[7.5px] tracking-widest text-slate-300 font-bold uppercase leading-none">INSTITUCIÓN EDUCATIVA</p>
                      <h3 class="text-sm font-black text-white tracking-tight uppercase leading-tight mt-0.5">SANTA LUISA</h3>
                    </div>
                  </div>
                  <!-- Ícono circular cian de silueta -->
                  <div class="w-7 h-7 rounded-full bg-[#0891B2] flex items-center justify-center text-white text-xs shadow-xs flex-shrink-0">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
                <!-- Línea de acento cian inferior -->
                <div class="h-1 bg-[#0891B2] w-full"></div>
              </div>

              <!-- Foto con borde grueso cian y Datos del Estudiante / Personal -->
              <div class="flex flex-col items-center px-4 pt-2 pb-2 relative z-10 flex-1 justify-center">
                <!-- Foto con borde cian de 4px -->
                <div class="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#0891B2] shadow-md bg-white flex items-center justify-center relative">
                  <img 
                    v-if="card.photo_url" 
                    :src="resolvePhotoUrl(card.photo_url)" 
                    :alt="card.recipient_name"
                    class="w-full h-full object-cover" 
                  />
                  <span v-else class="text-4xl font-bold text-slate-400">
                    {{ card.recipient_name ? card.recipient_name[0] : '🎓' }}
                  </span>
                </div>

                <!-- Subtítulo de Rol y Nombre -->
                <p class="text-[10px] font-black text-[#0C2340] uppercase tracking-wider mt-2.5 leading-none">
                  {{ card.recipient_type === 'estudiante' ? 'ESTUDIANTE:' : (card.position || 'PERSONAL INSTITUCIONAL') + ':' }}
                </p>
                <h4 class="font-black text-base text-slate-900 tracking-tight leading-tight uppercase px-1 text-center mt-1">
                  {{ card.recipient_name }}
                </h4>

                <!-- Bloque de Emergencia con Ícono Médico (💧+) -->
                <div class="flex items-center gap-2.5 mt-2.5 bg-white/70 backdrop-blur-2xs border border-teal-200/90 rounded-xl px-3 py-1.5 shadow-2xs max-w-[245px] w-full">
                  <div class="w-8 h-8 rounded-lg bg-[#0C2340] text-white flex items-center justify-center text-xs flex-shrink-0 font-black">
                    <span class="text-cyan-300 text-sm leading-none">💧<sup class="text-[9px] font-black text-white">+</sup></span>
                  </div>
                  <div class="text-left min-w-0 flex-1">
                    <p class="text-[9px] font-bold text-slate-800 leading-tight truncate">
                      Emergencia: {{ card.emergency_contact || 'Representante Legal' }}
                    </p>
                    <p class="text-[9.5px] font-black text-[#0C2340] leading-none mt-0.5">
                      {{ card.emergency_phone || '+58 414 123 4567' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer Anverso en Barra Sólida Cian -->
              <div class="bg-[#0891B2] text-white px-3.5 py-2 flex justify-between items-center text-[10.5px] font-bold relative z-10 shadow-inner">
                <span>C.I: {{ card.recipient_id_card || 'V-00000000' }}</span>
                <span>VENCE: <strong class="text-white font-black">{{ formatMonthYear(card.expiry_date || card.valid_until) }}</strong></span>
              </div>
            </div>

            <!-- 2. REVERSO MODERNA CYAN -->
            <div class="w-[280px] h-[450px] rounded-2xl shadow-xl border border-cyan-300/80 overflow-hidden flex flex-col justify-between text-slate-900 relative print:shadow-none print:border-slate-400 print:break-inside-avoid bg-gradient-to-b from-[#E8F5F8] via-[#EDF9FB] to-[#DDF1F5]">
              <!-- Marca de agua centrada -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                <img 
                  src="/logocolegio.png" 
                  alt="" 
                  class="w-60 h-60 object-contain opacity-10 select-none pointer-events-none" 
                />
              </div>

              <!-- Header Superior Azul Marino con Franja Cian -->
              <div class="relative z-10">
                <div class="bg-[#0C2340] text-white py-2 px-3 text-center shadow-xs">
                  <h4 class="text-[11px] font-black uppercase tracking-wider text-white">
                    {{ card.recipient_type === 'estudiante' ? 'CREDENCIAL DEL ESTUDIANTE' : 'CREDENCIAL DEL PERSONAL' }}
                  </h4>
                </div>
                <div class="h-1 bg-[#0891B2] w-full"></div>
              </div>

              <!-- QR Code y Lectura de Verificación -->
              <div class="flex flex-col items-center justify-center pt-2 pb-1 relative z-10">
                <div class="p-2 bg-white rounded-2xl shadow-sm border border-teal-100">
                  <ui-qr-code 
                    :value="getVerificationUrl(card.card_code)"
                    :size="92"
                  />
                </div>
                <span class="text-[9px] font-black text-[#0C2340] tracking-wider uppercase mt-1.5">
                  LEER PARA VERIFICACIÓN
                </span>
              </div>

              <!-- Información de Emergencia y Dirección Institucional -->
              <div class="text-center px-4 space-y-1 relative z-10">
                <div>
                  <p class="text-[10px] font-black text-[#0C2340] tracking-wider uppercase">EMERGENCIA:</p>
                  <p class="text-[10px] font-bold text-slate-700">
                    (Padres) {{ card.emergency_phone || '+58 414 123 4567' }}
                  </p>
                </div>
                <div class="pt-0.5">
                  <p class="text-[10px] font-black text-[#0C2340] tracking-wider uppercase">DIRECCIÓN:</p>
                  <p class="text-[9.5px] font-semibold text-slate-700 leading-tight">
                    Calle Real del Prado de María, Caracas
                  </p>
                </div>
              </div>

              <!-- Firma Caligráfica de la Dirección -->
              <div class="text-center pb-2 relative z-10">
                <p class="text-2xl font-bold text-slate-900 italic select-none" style="font-family: 'Brush Script MT', 'Dancing Script', 'Caveat', cursive, serif;">
                  S. Zambrano
                </p>
                <div class="w-32 border-b border-[#0C2340]/40 mx-auto -mt-0.5 mb-0.5"></div>
                <p class="text-[8px] font-black tracking-widest text-[#0C2340] uppercase">
                  FIRMA DE LA DIRECCIÓN
                </p>
              </div>

              <!-- Footer Inferior Azul Marino -->
              <div class="h-3 bg-[#0C2340] w-full relative z-10"></div>
            </div>
          </template>

          <!-- ======================================================== -->
          <!-- PLANTILLA 2: CLÁSICA ORO / NARANJA (Institucional)        -->
          <!-- ======================================================== -->
          <template v-else>
            <!-- 1. FRENTE DEL CARNET CLÁSICO -->
            <div class="w-[280px] h-[450px] rounded-2xl shadow-xl border border-amber-300/80 overflow-hidden flex flex-col justify-between text-slate-900 relative print:shadow-none print:border-slate-400 print:break-inside-avoid bg-[#FEF9C3]/50">
              <!-- Marca de agua de fondo (Watermark institucional centrada sin rotación) -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                <img 
                  src="/logocolegio.png" 
                  alt="" 
                  class="w-65 h-65 object-contain opacity-[0.10] select-none pointer-events-none" 
                />
              </div>

              <!-- Header Banner Naranja con Logo a la izquierda -->
              <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-3 py-2.5 flex items-center gap-2.5 relative z-10 shadow-xs">
                <div class="w-10 h-10 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center flex-shrink-0">
                  <img src="/logocolegio.png" alt="Logo" class="w-full h-full object-contain" />
                </div>
                <div class="text-left flex-1 min-w-0">
                  <h3 class="font-black text-sm uppercase tracking-tight leading-tight text-white drop-shadow-xs">U.E SANTA LUISA</h3>
                  <span class="text-[10px] font-semibold text-white/95 block leading-tight mt-0.5">Comunidad Educativa Vicenciana</span>
                </div>
              </div>

              <!-- Profile Photo & Student Details (Cuerpo Amarillo Crema) -->
              <div class="flex flex-col items-center px-4 pt-2.5 pb-2 relative z-10 flex-1 justify-center">
                <div class="w-32 h-32 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md bg-white flex items-center justify-center">
                  <img 
                    v-if="card.photo_url" 
                    :src="resolvePhotoUrl(card.photo_url)" 
                    :alt="card.recipient_name"
                    class="w-full h-full object-cover" 
                  />
                  <span v-else class="text-4xl font-bold text-slate-400">
                    {{ card.recipient_name ? card.recipient_name[0] : '🎓' }}
                  </span>
                </div>

                <!-- Name and Details -->
                <h4 class="font-black text-base text-center leading-tight mt-2.5 text-slate-900 px-2">
                  {{ card.recipient_name }}
                </h4>
                <p class="text-xs font-black text-orange-700 uppercase mt-0.5 tracking-wide">
                  {{ card.position || card.recipient_type }}
                </p>
                <p class="text-[11px] text-slate-700 font-bold mt-0.5">
                  {{ card.grade_level || card.department || 'Educación Primaria' }}
                </p>
              </div>

              <!-- Footer Section of Front (Azul Real Institucional) -->
              <div class="p-3 bg-blue-900 border-t border-blue-950 text-center space-y-0.5 relative z-10 text-white shadow-inner">
                <div class="flex justify-between items-center text-[10.5px] font-bold text-white px-1">
                  <span>C.I: {{ card.recipient_id_card || 'V-00000000' }}</span>
                  <span>VENCE: <strong class="text-amber-300 font-bold">{{ formatDate(card.expiry_date || card.valid_until) }}</strong></span>
                </div>
                <p class="font-mono text-[9px] text-amber-300/90 font-bold tracking-wider">{{ card.card_code }}</p>
              </div>
            </div>

            <!-- 2. REVERSO DEL CARNET CLÁSICO -->
            <div class="w-[280px] h-[450px] rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-900 relative print:shadow-none print:border-slate-400 print:break-inside-avoid bg-[#FEF9C3]/40">
              <!-- Marca de agua de fondo (Watermark institucional centrada sin rotación) -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                <img 
                  src="/logocolegio.png" 
                  alt="" 
                  class="w-65 h-65 object-contain opacity-[0.11] select-none pointer-events-none" 
                />
              </div>

              <!-- Institutional Disclaimer (Acento Naranja Superior) -->
              <div class="relative z-10">
                <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-2 px-3 text-center shadow-xs">
                  <p class="text-[10px] font-black uppercase tracking-wider text-amber-200">Credencial de Identificación</p>
                  <p class="text-[8px] text-white/95 leading-tight font-medium">Personal e intransferible. Acredita al portador como miembro activo.</p>
                </div>

                <!-- Medical and Emergency Details -->
                <div class="p-3 space-y-1.5 text-xs">
                  <div class="flex justify-between border-b border-amber-200/80 pb-1">
                    <span class="text-slate-600 font-bold">Tipo de Sangre:</span>
                    <span class="font-black text-rose-600">{{ card.blood_type || 'O+' }}</span>
                  </div>
                  <div class="flex justify-between border-b border-amber-200/80 pb-1">
                    <span class="text-slate-600 font-bold">Emergencia:</span>
                    <span class="font-bold text-slate-800 text-right truncate max-w-[140px]">{{ card.emergency_contact || 'Representante Legal' }}</span>
                  </div>
                  <div class="flex justify-between border-b border-amber-200/80 pb-1">
                    <span class="text-slate-600 font-bold">Tel. Emergencia:</span>
                    <span class="font-bold text-slate-800">{{ card.emergency_phone || '+58 414 000 0000' }}</span>
                  </div>
                  <div class="flex justify-between border-b border-amber-200/80 pb-1">
                    <span class="text-slate-600 font-bold">Dirección:</span>
                    <span class="font-semibold text-[10px] text-slate-800 text-right truncate max-w-[140px]">{{ card.address || 'Caracas, Venezuela' }}</span>
                  </div>
                </div>
              </div>

              <!-- QR Code and Scanner Validation (Ampliado a 92px) -->
              <div class="flex flex-col items-center justify-center my-auto py-1 relative z-10">
                <div class="p-1.5 bg-white rounded-xl shadow-xs border border-amber-200">
                  <ui-qr-code 
                    :value="getVerificationUrl(card.card_code)"
                    :size="92"
                  />
                </div>
                <span class="text-[8.5px] font-mono text-slate-600 mt-1 font-bold tracking-wider">LECTURA DE ASISTENCIA QR</span>
              </div>

              <!-- Authorized Signature line (Azul Real con letras blancas y Sor Yolanda Zambrano) -->
              <div class="bg-blue-900 text-white text-center py-2.5 px-3 relative z-10 border-t border-blue-950">
                <div class="w-24 border-b border-amber-300/80 mx-auto mb-1"></div>
                <p class="text-[9px] font-black uppercase text-amber-300 tracking-wide">Sor Yolanda Zambrano • Directora</p>
                <p class="text-[7.5px] text-blue-100 font-medium leading-tight">Calle Real del Prado de María, Caracas • (0212) 123-4567</p>
              </div>
            </div>
          </template>

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
              <!-- Opcional: Selección rápida de persona registrada según el rol -->
              <div v-if="!isEditingCard && sourcePeople.length" class="p-3.5 bg-slate-50 dark:bg-[#110926] rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {{ sourcePeopleLabel }}
                  </label>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-purple/10 dark:bg-brand-gold/20 text-brand-purple dark:text-brand-gold font-bold">
                    {{ sourcePeople.length }} en BBDD
                  </span>
                </div>
                <select 
                  v-model="selectedPersonId"
                  @change="onSelectPerson"
                  class="w-full px-3 py-2.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                >
                  <option value="">-- Ingresar datos manualmente --</option>
                  <option v-for="p in sourcePeople" :key="p.id" :value="p.id">
                    {{ p.label }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="min-w-0">
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo *</label>
                  <input 
                    v-model="cardForm.recipient_name" 
                    required 
                    data-testid="input-card-recipient-name"
                    :placeholder="cardForm.recipient_type === 'estudiante' ? 'Ej: Valentina Mendoza' : 'Ej: Prof. Marcos Paredes'"
                    class="w-full min-w-0 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
                <div class="min-w-0">
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cédula de Identidad *</label>
                  <input 
                    v-model="cardForm.recipient_id_card" 
                    required 
                    data-testid="input-card-recipient-id"
                    :placeholder="cardForm.recipient_type === 'estudiante' ? 'Ej: V-33123456 o EST-001' : 'Ej: V-14567890'"
                    class="w-full min-w-0 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-mono" 
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="min-w-0">
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Personal / Rol</label>
                  <select 
                    v-model="cardForm.recipient_type"
                    @change="onRecipientTypeChange"
                    data-testid="select-card-recipient-type"
                    class="w-full min-w-0 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor / Docente</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="obrero">Obrero / Servicios</option>
                  </select>
                </div>
                <div class="min-w-0">
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cargo o Grado</label>
                  <input 
                    v-model="cardForm.position" 
                    data-testid="input-card-position"
                    :placeholder="cardForm.recipient_type === 'estudiante' ? '1er Año Sección A' : (cardForm.recipient_type === 'profesor' ? 'Docente de Ciencias' : 'Personal Institucional')"
                    class="w-full min-w-0 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="min-w-0">
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Sangre</label>
                  <input 
                    v-model="cardForm.blood_type" 
                    placeholder="O+, A+, B+, etc."
                    class="w-full min-w-0 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
                  />
                </div>
                <div class="min-w-0">
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tel. de Emergencia</label>
                  <input 
                    v-model="cardForm.emergency_phone" 
                    placeholder="+58 414 123 4567"
                    class="w-full min-w-0 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#110926] rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30" 
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
        <div class="relative w-full max-w-4xl bg-white dark:bg-[#160d33] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Batch Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-brand-purple to-indigo-900 text-white flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-bold shadow-md">
                📦
              </div>
              <div>
                <h3 class="font-black text-base text-white tracking-tight">
                  Emisión e Impresión de Carnets por Lote
                </h3>
                <span class="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                  U.E Santa Luisa • Gestión Masiva Dúplex (8 Carnets por Hoja Carta)
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

          <!-- Group Tabs (Estudiantes / Profesores / Personal) -->
          <div class="px-6 pt-3 pb-0 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto">
            <button 
              type="button" 
              @click="switchBatchTab('estudiantes')"
              :class="batchTargetTab === 'estudiantes' ? 'border-b-2 border-brand-purple dark:border-brand-gold text-brand-purple dark:text-brand-gold font-black bg-white dark:bg-[#160d33]' : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900'"
              class="px-4 py-2.5 text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🎒 Estudiantes</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 font-mono">{{ registeredStudents.length }}</span>
            </button>

            <button 
              type="button" 
              @click="switchBatchTab('profesores')"
              :class="batchTargetTab === 'profesores' ? 'border-b-2 border-brand-purple dark:border-brand-gold text-brand-purple dark:text-brand-gold font-black bg-white dark:bg-[#160d33]' : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900'"
              class="px-4 py-2.5 text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>👨‍🏫 Docentes</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 font-mono">{{ registeredTeachers.length }}</span>
            </button>

            <button 
              type="button" 
              @click="switchBatchTab('personal')"
              :class="batchTargetTab === 'personal' ? 'border-b-2 border-brand-purple dark:border-brand-gold text-brand-purple dark:text-brand-gold font-black bg-white dark:bg-[#160d33]' : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900'"
              class="px-4 py-2.5 text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>💼 Personal (Admin/Obrero)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 font-mono">{{ registeredStaff.length }}</span>
            </button>
          </div>

          <!-- Section Selectors and Filters according to active batch tab -->
          <div class="p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40">
            <!-- Filter for Estudiantes -->
            <div v-if="batchTargetTab === 'estudiantes'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <!-- Filter for Profesores -->
            <div v-else-if="batchTargetTab === 'profesores'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Departamento / Especialidad
                </label>
                <select 
                  v-model="batchSelectedTeacherDept"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                >
                  <option value="">Todos los Departamentos</option>
                  <option v-for="d in availableTeacherDepts" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Búsqueda Rápida
                </label>
                <input 
                  v-model="batchSearchQuery"
                  placeholder="Buscar docente, cédula o código..."
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                />
              </div>
            </div>

            <!-- Filter for Personal -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría
                </label>
                <select 
                  v-model="batchSelectedStaffCategory"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
                >
                  <option value="">Todo el Personal (Administrativo y Obrero)</option>
                  <option value="administrative">Administrativo</option>
                  <option value="worker">Obrero / Servicios Generales</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Búsqueda Rápida
                </label>
                <input 
                  v-model="batchSearchQuery"
                  placeholder="Buscar colaborador, cédula o cargo..."
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                />
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-4">
                <span class="text-slate-500 dark:text-slate-400">
                  Registros listados: <strong class="text-slate-800 dark:text-white">{{ currentBatchList.length }}</strong>
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

          <!-- Batch Table (Unified & Dynamic per tab) -->
          <div class="flex-1 overflow-y-auto min-h-0 p-6">
            <div v-if="currentBatchList.length === 0" class="py-12 text-center text-slate-400 text-xs">
              No se encontraron registros para los filtros seleccionados.
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
                  <th class="py-2.5 px-3">
                    {{ batchTargetTab === 'estudiantes' ? 'Estudiante' : (batchTargetTab === 'profesores' ? 'Docente' : 'Colaborador') }}
                  </th>
                  <th class="py-2.5 px-3">Documento / Cód.</th>
                  <th class="py-2.5 px-3">
                    {{ batchTargetTab === 'estudiantes' ? 'Grado / Sección' : (batchTargetTab === 'profesores' ? 'Departamento / Cargo' : 'Cargo / Área') }}
                  </th>
                  <th class="py-2.5 px-3 text-center">Fotografía</th>
                  <th class="py-2.5 px-3 text-right">Estado Carnet</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr 
                  v-for="row in currentBatchList" 
                  :key="row.id"
                  :class="[
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors',
                    selectedBatchIds.includes(row.id) ? 'bg-purple-50/40 dark:bg-purple-950/20' : ''
                  ]"
                >
                  <td class="py-3 px-3 text-center">
                    <input 
                      type="checkbox" 
                      :value="row.id" 
                      v-model="selectedBatchIds"
                      class="rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
                    />
                  </td>
                  <td class="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">
                    {{ row.first_name }} {{ row.last_name }}
                  </td>
                  <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {{ row.displayId }}
                  </td>
                  <td class="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {{ row.displayRole }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span v-if="row.hasPhoto" class="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>📷</span> Sí
                    </span>
                    <span v-else class="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <span>👤</span> Por defecto
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <span 
                      v-if="row.card" 
                      class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[10px]"
                    >
                      ✓ {{ row.card.card_code }}
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
              Seleccionados para impresión: <strong class="text-brand-purple dark:text-brand-gold">{{ selectedBatchIds.length }}</strong>
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
                :disabled="selectedBatchIds.length === 0"
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
                <template v-for="(card, cardIdx) in sheet.fronts" :key="'front-' + card.id + '-' + cardIdx">
                  <!-- Plantilla Moderna Cyan para anverso de dúplex -->
                  <div 
                    v-if="activeTemplate === 'modern_cyan'"
                    class="w-[48mm] h-[82mm] bg-gradient-to-b from-[#E8F5F8] via-[#EDF9FB] to-[#DDF1F5] rounded-xl border border-dashed border-cyan-400/80 print:border-slate-400 overflow-hidden flex flex-col justify-between text-slate-900 relative print:break-inside-avoid print:shadow-none"
                  >
                    <!-- Marca de agua centrada -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                      <img src="/logocolegio.png" alt="" class="w-28 h-28 object-contain opacity-[0.10] select-none pointer-events-none" />
                    </div>

                    <!-- Header Superior Azul Marino con Franja Cian e Icono -->
                    <div class="relative z-10">
                      <div class="bg-[#0C2340] text-white px-2 py-1 flex items-center justify-between shadow-xs">
                        <div class="flex items-center gap-1">
                          <img src="/logocolegio.png" alt="Logo" class="w-5 h-5 object-contain" />
                          <div class="text-left">
                            <p class="text-[5px] tracking-wider text-slate-300 font-bold uppercase leading-none">INSTITUCIÓN EDUCATIVA</p>
                            <h4 class="text-[7.5px] font-black text-white tracking-tight uppercase leading-tight mt-0.5">SANTA LUISA</h4>
                          </div>
                        </div>
                        <div class="w-4 h-4 rounded-full bg-[#0891B2] flex items-center justify-center text-white text-[7px] flex-shrink-0">
                          <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                      <div class="h-0.5 bg-[#0891B2] w-full"></div>
                    </div>

                    <!-- Foto y Datos del Estudiante / Personal -->
                    <div class="flex flex-col items-center px-1 pt-1 relative z-10 flex-1 justify-center">
                      <div class="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#0891B2] shadow-xs bg-white flex items-center justify-center relative">
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

                      <p class="text-[6.5px] font-black text-[#0C2340] uppercase tracking-wider mt-1 leading-none">
                        {{ card.recipient_type === 'estudiante' ? 'ESTUDIANTE:' : (card.position || 'PERSONAL') + ':' }}
                      </p>
                      <h5 class="font-black text-[8.5px] text-center leading-tight mt-0.5 text-slate-900 truncate w-full px-0.5 uppercase">
                        {{ card.recipient_name }}
                      </h5>

                      <!-- Bloque de Emergencia con Ícono Médico (💧+) -->
                      <div class="flex items-center gap-1 mt-1 bg-white/80 border border-teal-200/90 rounded-md px-1.5 py-0.5 shadow-2xs w-full max-w-[135px]">
                        <div class="w-4 h-4 rounded bg-[#0C2340] text-white flex items-center justify-center text-[7px] flex-shrink-0 font-black">
                          <span class="text-cyan-300 text-[8px] leading-none">💧<sup class="text-[5px] font-black text-white">+</sup></span>
                        </div>
                        <div class="text-left min-w-0 flex-1 leading-none">
                          <p class="text-[5.5px] font-bold text-slate-700 truncate">
                            {{ card.emergency_contact || 'Representante' }}
                          </p>
                          <p class="text-[6px] font-black text-[#0C2340] mt-0.5">
                            {{ card.emergency_phone || '+58 414 000 0000' }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Footer Anverso Sólido Cian -->
                    <div class="bg-[#0891B2] text-white px-2 py-1 flex justify-between items-center text-[6.5px] font-bold relative z-10 shadow-inner">
                      <span>C.I: {{ card.recipient_id_card || 'V-00000000' }}</span>
                      <span>VENCE: <strong class="text-white font-black">{{ formatMonthYear(card.expiry_date || card.valid_until) }}</strong></span>
                    </div>
                  </div>

                  <!-- Plantilla Clásica Oro/Naranja para anverso de dúplex -->
                  <div 
                    v-else
                    class="w-[48mm] h-[82mm] bg-[#FEF9C3]/50 rounded-xl border border-dashed border-amber-400/80 print:border-slate-400 overflow-hidden flex flex-col justify-between text-slate-900 relative print:break-inside-avoid print:shadow-none"
                  >
                    <!-- Marca de agua 11% centrada sin rotación -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                      <img src="/logocolegio.png" alt="" class="w-28 h-28 object-contain opacity-[0.11] select-none pointer-events-none" />
                    </div>

                    <!-- Header Banner Naranja con Escudo a la izquierda -->
                    <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-2 py-1.5 flex items-center gap-1.5 relative z-10 shadow-xs">
                      <div class="w-6 h-6 rounded-md bg-white p-0.5 shadow-xs flex items-center justify-center flex-shrink-0">
                        <img src="/logocolegio.png" alt="Logo" class="w-full h-full object-contain" />
                      </div>
                      <div class="text-left flex-1 min-w-0">
                        <h4 class="font-black text-[8px] uppercase leading-tight text-white drop-shadow-xs">U.E SANTA LUISA</h4>
                        <span class="text-[6px] font-semibold text-white/95 block leading-tight">Comunidad Educativa Vicenciana</span>
                      </div>
                    </div>

                    <!-- Photo & Name -->
                    <div class="flex flex-col items-center px-1 pt-1 relative z-10">
                      <div class="w-14 h-14 rounded-lg overflow-hidden border-2 border-orange-500 shadow-xs bg-white flex items-center justify-center">
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
                      <p class="text-[7.5px] font-black text-orange-700 uppercase leading-none mt-0.5">
                        {{ card.position || card.recipient_type || 'Estudiante' }}
                      </p>
                      <p class="text-[7px] text-slate-700 font-bold leading-none mt-0.5">
                        {{ card.grade_level || card.department || 'Educación Primaria' }}
                      </p>
                    </div>

                    <!-- Footer Front (Azul Real Institucional) -->
                    <div class="p-1.5 bg-blue-900 border-t border-blue-950 text-center relative z-10 text-[7px] font-bold text-white shadow-inner">
                      <div class="flex justify-between px-0.5 text-white">
                        <span>C.I: {{ card.recipient_id_card || 'V-00000000' }}</span>
                        <span>{{ formatDate(card.expiry_date || card.valid_until) }}</span>
                      </div>
                      <p class="font-mono text-[6px] text-amber-300 font-bold leading-none mt-0.5 tracking-wider">{{ card.card_code }}</p>
                    </div>
                  </div>
                </template>
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
                <template v-for="(card, cardIdx) in sheet.backsMirror" :key="'back-' + card.id + '-' + cardIdx">
                  <!-- Plantilla Moderna Cyan para reverso de dúplex -->
                  <div 
                    v-if="activeTemplate === 'modern_cyan'"
                    class="w-[48mm] h-[82mm] bg-gradient-to-b from-[#E8F5F8] via-[#EDF9FB] to-[#DDF1F5] rounded-xl border border-dashed border-slate-300 print:border-slate-400 overflow-hidden flex flex-col justify-between text-slate-900 relative print:break-inside-avoid print:shadow-none"
                  >
                    <!-- Marca de agua centrada -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                      <img src="/logocolegio.png" alt="" class="w-28 h-28 object-contain opacity-[0.10] select-none pointer-events-none" />
                    </div>

                    <!-- Header Superior Azul Marino con Franja Cian -->
                    <div class="relative z-10 text-center">
                      <div class="bg-[#0C2340] text-white py-1 px-1.5 text-center shadow-xs">
                        <h4 class="text-[7px] font-black uppercase tracking-wider text-white">
                          {{ card.recipient_type === 'estudiante' ? 'CREDENCIAL DEL ESTUDIANTE' : 'CREDENCIAL DEL PERSONAL' }}
                        </h4>
                      </div>
                      <div class="h-0.5 bg-[#0891B2] w-full"></div>
                    </div>

                    <!-- QR Code y Lectura de Verificación -->
                    <div class="flex flex-col items-center justify-center pt-1 pb-0.5 relative z-10">
                      <div class="p-1 bg-white rounded-lg shadow-xs border border-teal-100">
                        <ui-qr-code 
                          :value="getVerificationUrl(card.card_code)"
                          :size="52"
                        />
                      </div>
                      <span class="text-[6px] font-black text-[#0C2340] tracking-wider uppercase mt-0.5">
                        LEER PARA VERIFICACIÓN
                      </span>
                    </div>

                    <!-- Emergencia y Dirección -->
                    <div class="text-center px-1 space-y-0.5 relative z-10">
                      <div>
                        <p class="text-[6px] font-black text-[#0C2340] tracking-wider uppercase">EMERGENCIA:</p>
                        <p class="text-[6px] font-bold text-slate-700 leading-tight">
                          (Padres) {{ card.emergency_phone || '+58 414 000 0000' }}
                        </p>
                      </div>
                      <div>
                        <p class="text-[6px] font-black text-[#0C2340] tracking-wider uppercase">DIRECCIÓN:</p>
                        <p class="text-[5.5px] font-semibold text-slate-700 leading-tight truncate px-1">
                          Calle Real del Prado de María, Caracas
                        </p>
                      </div>
                    </div>

                    <!-- Firma Caligráfica de la Dirección -->
                    <div class="text-center pb-1 relative z-10">
                      <p class="text-base font-bold text-slate-900 italic select-none" style="font-family: 'Brush Script MT', 'Dancing Script', 'Caveat', cursive, serif;">
                        S. Zambrano
                      </p>
                      <div class="w-16 border-b border-[#0C2340]/40 mx-auto -mt-0.5 mb-0.5"></div>
                      <p class="text-[5.5px] font-black tracking-widest text-[#0C2340] uppercase">
                        FIRMA DE LA DIRECCIÓN
                      </p>
                    </div>

                    <!-- Footer Inferior Azul Marino -->
                    <div class="h-2 bg-[#0C2340] w-full relative z-10"></div>
                  </div>

                  <!-- Plantilla Clásica Oro/Naranja para reverso de dúplex -->
                  <div 
                    v-else
                    class="w-[48mm] h-[82mm] bg-[#FEF9C3]/40 rounded-xl border border-dashed border-slate-300 print:border-slate-400 overflow-hidden flex flex-col justify-between text-slate-900 relative print:break-inside-avoid print:shadow-none"
                  >
                    <!-- Marca de agua 11% centrada sin rotación -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
                      <img src="/logocolegio.png" alt="" class="w-28 h-28 object-contain opacity-[0.11] select-none pointer-events-none" />
                    </div>

                    <!-- Disclaimer con Banner Naranja Superior -->
                    <div class="relative z-10 text-center">
                      <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-1 px-1.5 text-center shadow-xs">
                        <p class="text-[7.5px] font-black uppercase tracking-wider text-amber-200">Credencial Escolar</p>
                        <p class="text-[5.5px] text-white/95 leading-tight font-medium">Personal e intransferible.</p>
                      </div>

                      <!-- Emergency info -->
                      <div class="p-1.5 space-y-0.5 text-[6.5px] text-left">
                        <div class="flex justify-between border-b border-amber-200/80 pb-0.5">
                          <span class="text-slate-600 font-bold">Sangre:</span>
                          <span class="font-black text-rose-600">{{ card.blood_type || 'O+' }}</span>
                        </div>
                        <div class="flex justify-between border-b border-amber-200/80 pb-0.5">
                          <span class="text-slate-600 font-bold">Emergencia:</span>
                          <span class="font-bold text-slate-800 truncate max-w-[85px]">{{ card.emergency_contact || 'Representante' }}</span>
                        </div>
                        <div class="flex justify-between border-b border-amber-200/80 pb-0.5">
                          <span class="text-slate-600 font-bold">Teléfono:</span>
                          <span class="font-bold text-slate-800">{{ card.emergency_phone || '+58 414 000 0000' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- QR Code (Ampliado) -->
                    <div class="flex flex-col items-center justify-center my-auto py-0.5 relative z-10">
                      <div class="p-1 bg-white rounded-lg shadow-xs border border-amber-200">
                        <ui-qr-code 
                          :value="getVerificationUrl(card.card_code)"
                          :size="54"
                        />
                      </div>
                      <span class="text-[5.5px] font-mono text-slate-600 mt-0.5 font-bold tracking-wider">ASISTENCIA QR</span>
                    </div>

                    <!-- Signature Bar (Azul Real con Sor Yolanda Zambrano) -->
                    <div class="bg-blue-900 text-white text-center py-1.5 px-1 relative z-10 border-t border-blue-950">
                      <div class="w-14 border-b border-amber-300/80 mx-auto mb-0.5"></div>
                      <p class="text-[6.5px] font-black uppercase text-amber-300 tracking-wide">Sor Yolanda Zambrano • Directora</p>
                      <p class="text-[5.5px] text-blue-100 font-medium leading-tight">U.E Santa Luisa • Caracas</p>
                    </div>
                  </div>
                </template>
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
const activeTemplate = ref('modern_cyan')
const isModalOpen = ref(false)
const isEditingCard = ref(false)
const editingCardId = ref(null)
const isDeleteModalOpen = ref(false)
const cardToDelete = ref(null)

// Registros de la institución por rol
const registeredStudents = ref([])
const registeredTeachers = ref([])
const registeredStaff = ref([])
const selectedPersonId = ref('')

// Batch and Duplex Print States
const isBatchModalOpen = ref(false)
const isDuplexPrintOpen = ref(false)
const batchTargetTab = ref('estudiantes')
const batchSelectedGrade = ref('')
const batchSelectedSection = ref('')
const batchSelectedTeacherDept = ref('')
const batchSelectedStaffCategory = ref('')
const batchSearchQuery = ref('')
const selectedBatchIds = ref([])
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
  address: 'Caracas, Venezuela',
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

const fetchTeachers = async () => {
  try {
    const res = await api.get('teachers', { $limit: 200 })
    registeredTeachers.value = res.data || res || []
  } catch (err) {
    console.warn('Error fetching registered teachers:', err)
  }
}

const fetchStaff = async () => {
  try {
    const res = await api.get('staff', { $limit: 200 })
    registeredStaff.value = res.data || res || []
  } catch (err) {
    console.warn('Error fetching registered staff:', err)
  }
}

// Helper: Formatear documento de identidad de estudiante
const formatStudentIdDisplay = (st) => {
  if (st.national_id && /\d+/.test(st.national_id)) {
    return st.national_id.trim()
  }
  return st.student_id || ('ID ' + st.id)
}

// Opciones dinámicas para el selector del modal individual según el rol
const sourcePeople = computed(() => {
  const role = cardForm.value.recipient_type
  if (role === 'profesor') {
    return registeredTeachers.value.map(t => ({
      id: t.id,
      label: `${t.first_name || ''} ${t.last_name || ''} (${t.department || t.position_title || 'Docente'} - ${t.national_id || t.employee_id || ('ID ' + t.id)})`.trim(),
      raw: t
    }))
  }
  if (role === 'administrativo' || role === 'obrero') {
    const matched = registeredStaff.value.filter(s => {
      const cat = (s.category || '').toLowerCase()
      if (role === 'obrero') return cat === 'worker' || cat === 'obrero'
      return cat !== 'worker' && cat !== 'obrero'
    })
    const listToMap = matched.length > 0 ? matched : registeredStaff.value
    return listToMap.map(s => ({
      id: s.id,
      label: `${s.first_name || ''} ${s.last_name || ''} (${s.position_title || (s.category === 'worker' ? 'Obrero' : 'Administrativo')} - ${s.national_id || s.employee_id || ('ID ' + s.id)})`.trim(),
      raw: s
    }))
  }
  // Default: estudiante
  return registeredStudents.value.map(st => ({
    id: st.id,
    label: `${st.first_name || ''} ${st.last_name || ''} (${st.grade || 'N/A'}${st.section ? ' ' + st.section : ''} - ${formatStudentIdDisplay(st)})`.trim(),
    raw: st
  }))
})

const sourcePeopleLabel = computed(() => {
  switch (cardForm.value.recipient_type) {
    case 'profesor':
      return 'Cargar datos desde Docente Registrado'
    case 'administrativo':
      return 'Cargar datos desde Personal Administrativo'
    case 'obrero':
      return 'Cargar datos desde Personal Obrero / Servicios'
    default:
      return 'Cargar datos desde Estudiante Registrado'
  }
})

// Cuando se cambia el tipo de personal en el modal individual
const onRecipientTypeChange = () => {
  selectedPersonId.value = ''
  switch (cardForm.value.recipient_type) {
    case 'profesor':
      cardForm.value.position = 'Docente de Aula'
      cardForm.value.department = 'Coordinación Pedagógica'
      break
    case 'administrativo':
      cardForm.value.position = 'Asistente Administrativo'
      cardForm.value.department = 'Administración y Dirección'
      break
    case 'obrero':
      cardForm.value.position = 'Mantenimiento y Servicios'
      cardForm.value.department = 'Servicios Generales'
      break
    default:
      cardForm.value.position = 'Estudiante Regular'
      cardForm.value.department = 'Educación Media'
      break
  }
}

// Cuando se selecciona una persona del selector dinámico
const onSelectPerson = () => {
  if (!selectedPersonId.value) return
  const found = sourcePeople.value.find(p => p.id === Number(selectedPersonId.value) || p.id === selectedPersonId.value)
  if (!found || !found.raw) return
  const raw = found.raw
  const role = cardForm.value.recipient_type

  if (role === 'profesor') {
    cardForm.value.recipient_name = `${raw.first_name || ''} ${raw.last_name || ''}`.trim()
    cardForm.value.recipient_id_card = (raw.national_id || raw.employee_id || `DOC-${raw.id}`).trim()
    cardForm.value.position = raw.position_title || raw.specialization || 'Docente Titular'
    cardForm.value.department = raw.department || 'Coordinación Pedagógica'
    cardForm.value.blood_type = raw.blood_type || 'O+'
    cardForm.value.emergency_contact = raw.emergency_contact_name || 'Contacto Familiar'
    cardForm.value.emergency_phone = raw.emergency_contact_phone || raw.phone_mobile || '+58 414 123 4567'
    cardForm.value.address = raw.address_line1 || 'Caracas, Venezuela'
    if (raw.photo_url) {
      cardForm.value.photo_url = raw.photo_url
    }
  } else if (role === 'administrativo' || role === 'obrero') {
    cardForm.value.recipient_name = `${raw.first_name || ''} ${raw.last_name || ''}`.trim()
    cardForm.value.recipient_id_card = (raw.national_id || raw.employee_id || `PER-${raw.id}`).trim()
    cardForm.value.position = raw.position_title || (role === 'obrero' ? 'Personal de Apoyo' : 'Personal Administrativo')
    cardForm.value.department = raw.department || (role === 'obrero' ? 'Servicios Generales' : 'Administración')
    cardForm.value.blood_type = raw.blood_type || 'O+'
    cardForm.value.emergency_contact = raw.emergency_contact_name || 'Contacto Familiar'
    cardForm.value.emergency_phone = raw.emergency_contact_phone || raw.phone_mobile || '+58 414 123 4567'
    cardForm.value.address = raw.address_line1 || 'Caracas, Venezuela'
    if (raw.photo_url) {
      cardForm.value.photo_url = raw.photo_url
    }
  } else {
    // Estudiante
    cardForm.value.recipient_name = `${raw.first_name || ''} ${raw.last_name || ''}`.trim()
    const hasDigits = raw.national_id && /\d+/.test(raw.national_id)
    cardForm.value.recipient_id_card = hasDigits ? raw.national_id.trim() : (raw.student_id || `EST-${raw.id}`)
    cardForm.value.position = raw.grade ? `${raw.grade} Sección ${raw.section || 'U'}` : 'Estudiante Regular'
    cardForm.value.department = raw.level === 'media' ? 'Educación Media General' : 'Educación Primaria'
    cardForm.value.blood_type = raw.blood_type || 'O+'
    cardForm.value.emergency_contact = raw.emergency_contact || 'Representante Legal'
    cardForm.value.emergency_phone = raw.emergency_phone || '+58 414 123 4567'
    if (raw.photo_url || raw.avatar_url) {
      cardForm.value.photo_url = raw.photo_url || raw.avatar_url
    }
  }
}

const filteredCards = computed(() => {
  if (!filterType.value) return idCards.value
  return idCards.value.filter(c => c.recipient_type === filterType.value)
})

// Dinámico: Etiqueta del botón de lote en el header principal
const batchButtonLabel = computed(() => {
  if (filterType.value === 'profesor') return 'Imprimir Lote de Docentes'
  if (filterType.value === 'administrativo' || filterType.value === 'obrero') return 'Imprimir Lote de Personal'
  if (filterType.value === 'estudiante') return 'Imprimir Lote de Estudiantes'
  return 'Imprimir Lote / Sección'
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

// Departamentos disponibles de profesores
const availableTeacherDepts = computed(() => {
  const set = new Set()
  registeredTeachers.value.forEach(t => {
    if (t.department) set.add(t.department)
  })
  if (set.size === 0) {
    return ['Ciencias y Matemáticas', 'Humanidades y Lengua', 'Educación Física', 'Primaria / Inicial']
  }
  return Array.from(set)
})

// Card lookup helpers
const getStudentCard = (student) => {
  const normId = (student.national_id || '').trim().toLowerCase()
  const studentId = (student.student_id || '').trim().toLowerCase()
  return idCards.value.find(c => 
    c.recipient_type === 'estudiante' &&
    ((normId && c.recipient_id_card?.toLowerCase() === normId) || (studentId && c.recipient_id_card?.toLowerCase() === studentId))
  )
}

const getTeacherCard = (teacher) => {
  const normId = (teacher.national_id || '').trim().toLowerCase()
  const empId = (teacher.employee_id || '').trim().toLowerCase()
  return idCards.value.find(c => 
    c.recipient_type === 'profesor' &&
    ((normId && c.recipient_id_card?.toLowerCase() === normId) || (empId && c.recipient_id_card?.toLowerCase() === empId))
  )
}

const getStaffCard = (staff) => {
  const normId = (staff.national_id || '').trim().toLowerCase()
  const empId = (staff.employee_id || '').trim().toLowerCase()
  return idCards.value.find(c => 
    (c.recipient_type === 'administrativo' || c.recipient_type === 'obrero') &&
    ((normId && c.recipient_id_card?.toLowerCase() === normId) || (empId && c.recipient_id_card?.toLowerCase() === empId))
  )
}

// Current Unified Batch List depending on active batch tab
const currentBatchList = computed(() => {
  const query = batchSearchQuery.value.trim().toLowerCase()

  if (batchTargetTab.value === 'profesores') {
    return registeredTeachers.value
      .filter(t => {
        if (batchSelectedTeacherDept.value && t.department !== batchSelectedTeacherDept.value) {
          return false
        }
        if (query) {
          const name = `${t.first_name || ''} ${t.last_name || ''}`.toLowerCase()
          const id = (t.national_id || t.employee_id || '').toLowerCase()
          const dept = (t.department || t.position_title || '').toLowerCase()
          if (!name.includes(query) && !id.includes(query) && !dept.includes(query)) return false
        }
        return true
      })
      .map(t => ({
        id: t.id,
        first_name: t.first_name || '',
        last_name: t.last_name || '',
        displayId: (t.national_id || t.employee_id || `DOC-${t.id}`).trim(),
        displayRole: `${t.position_title || 'Docente'}${t.department ? ' • ' + t.department : ''}`,
        hasPhoto: Boolean(t.photo_url),
        card: getTeacherCard(t),
        type: 'profesor',
        raw: t
      }))
  }

  if (batchTargetTab.value === 'personal') {
    return registeredStaff.value
      .filter(s => {
        if (batchSelectedStaffCategory.value) {
          const cat = (s.category || '').toLowerCase()
          if (batchSelectedStaffCategory.value === 'worker') {
            if (cat !== 'worker' && cat !== 'obrero') return false
          } else if (batchSelectedStaffCategory.value === 'administrative') {
            if (cat === 'worker' || cat === 'obrero') return false
          }
        }
        if (query) {
          const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase()
          const id = (s.national_id || s.employee_id || '').toLowerCase()
          const role = (s.position_title || s.category || '').toLowerCase()
          if (!name.includes(query) && !id.includes(query) && !role.includes(query)) return false
        }
        return true
      })
      .map(s => {
        const isWorker = (s.category || '').toLowerCase() === 'worker' || (s.category || '').toLowerCase() === 'obrero'
        const roleType = isWorker ? 'obrero' : 'administrativo'
        return {
          id: s.id,
          first_name: s.first_name || '',
          last_name: s.last_name || '',
          displayId: (s.national_id || s.employee_id || `PER-${s.id}`).trim(),
          displayRole: `${s.position_title || (isWorker ? 'Obrero / Servicios' : 'Administrativo')}${s.department ? ' • ' + s.department : ''}`,
          hasPhoto: Boolean(s.photo_url),
          card: getStaffCard(s),
          type: roleType,
          raw: s
        }
      })
  }

  // Default: 'estudiantes'
  return registeredStudents.value
    .filter(s => {
      if (batchSelectedGrade.value && s.grade !== batchSelectedGrade.value) {
        return false
      }
      if (batchSelectedSection.value && s.section && s.section !== batchSelectedSection.value) {
        return false
      }
      if (query) {
        const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase()
        const id = (s.national_id || s.student_id || '').toLowerCase()
        if (!name.includes(query) && !id.includes(query)) return false
      }
      return true
    })
    .map(s => {
      const hasDigits = s.national_id && /\d+/.test(s.national_id)
      return {
        id: s.id,
        first_name: s.first_name || '',
        last_name: s.last_name || '',
        displayId: hasDigits ? s.national_id.trim() : (s.student_id || `EST-${s.id}`),
        displayRole: s.grade ? `${s.grade} (${s.section || 'U'})` : 'Estudiante Regular',
        hasPhoto: Boolean(s.photo_url || s.avatar_url),
        card: getStudentCard(s),
        type: 'estudiante',
        raw: s
      }
    })
})

const isAllBatchSelected = computed(() => {
  if (!currentBatchList.value.length) return false
  return currentBatchList.value.every(row => selectedBatchIds.value.includes(row.id))
})

const toggleSelectAllBatch = () => {
  if (isAllBatchSelected.value) {
    const listIds = new Set(currentBatchList.value.map(r => r.id))
    selectedBatchIds.value = selectedBatchIds.value.filter(id => !listIds.has(id))
  } else {
    const combined = new Set([...selectedBatchIds.value, ...currentBatchList.value.map(r => r.id)])
    selectedBatchIds.value = Array.from(combined)
  }
}

const switchBatchTab = (tab) => {
  batchTargetTab.value = tab
  batchSearchQuery.value = ''
  // Preseleccionar los IDs de la nueva pestaña
  selectedBatchIds.value = currentBatchList.value.map(r => r.id)
}

const countExistingBatchCards = computed(() => {
  return currentBatchList.value.filter(r => !!r.card).length
})

const countMissingBatchCards = computed(() => {
  return currentBatchList.value.filter(r => !r.card).length
})

const hasMissingBatchCardsSelected = computed(() => {
  return currentBatchList.value.some(r => selectedBatchIds.value.includes(r.id) && !r.card)
})

const missingSelectedCount = computed(() => {
  return currentBatchList.value.filter(r => selectedBatchIds.value.includes(r.id) && !r.card).length
})

// Emitir masivamente carnets para registros seleccionados que no tengan uno activo
const emitMissingCardsForBatch = async () => {
  const missingRows = currentBatchList.value.filter(r => selectedBatchIds.value.includes(r.id) && !r.card)

  if (!missingRows.length) return

  isEmittingBatch.value = true
  let createdCount = 0

  try {
    for (const row of missingRows) {
      const raw = row.raw
      let typePrefix = 'EST'
      if (row.type === 'profesor') typePrefix = 'PRO'
      else if (row.type === 'obrero') typePrefix = 'OBR'
      else if (row.type === 'administrativo') typePrefix = 'ADM'

      const year = new Date().getFullYear()
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const code = `CRD-${typePrefix}-${year}-${randomSuffix}`

      let payload = {
        recipient_name: `${row.first_name} ${row.last_name}`.trim(),
        recipient_id_card: row.displayId,
        recipient_type: row.type,
        card_code: code,
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: '2027-07-31',
        status: 'activo',
        is_printed: true
      }

      if (row.type === 'profesor') {
        payload.position = raw.position_title || raw.specialization || 'Docente Titular'
        payload.department = raw.department || 'Coordinación Pedagógica'
        payload.blood_type = raw.blood_type || 'O+'
        payload.emergency_contact = raw.emergency_contact_name || 'Contacto Familiar'
        payload.emergency_phone = raw.emergency_contact_phone || raw.phone_mobile || '+58 414 123 4567'
        payload.address = raw.address_line1 || 'Caracas, Venezuela'
        payload.photo_url = raw.photo_url || ''
      } else if (row.type === 'administrativo' || row.type === 'obrero') {
        payload.position = raw.position_title || (row.type === 'obrero' ? 'Personal de Apoyo' : 'Personal Administrativo')
        payload.department = raw.department || (row.type === 'obrero' ? 'Servicios Generales' : 'Administración')
        payload.blood_type = raw.blood_type || 'O+'
        payload.emergency_contact = raw.emergency_contact_name || 'Contacto Familiar'
        payload.emergency_phone = raw.emergency_contact_phone || raw.phone_mobile || '+58 414 123 4567'
        payload.address = raw.address_line1 || 'Caracas, Venezuela'
        payload.photo_url = raw.photo_url || ''
      } else {
        // Estudiante
        payload.position = raw.grade ? `${raw.grade} Sección ${raw.section || 'U'}` : 'Estudiante Regular'
        payload.department = raw.level === 'media' ? 'Educación Media General' : 'Educación Primaria'
        payload.blood_type = raw.blood_type || 'O+'
        payload.emergency_contact = raw.emergency_contact || 'Representante Legal'
        payload.emergency_phone = raw.emergency_phone || '+58 414 123 4567'
        payload.address = 'Calle Real del Prado de María, Caracas'
        payload.photo_url = raw.photo_url || raw.avatar_url || ''
      }

      await api.post('id-cards', payload)
      createdCount++
    }

    await fetchIdCards()
    toast.success('Lote Emitido', `Se emitieron exitosamente ${createdCount} credenciales para los registros seleccionados.`)
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
  for (const id of selectedBatchIds.value) {
    const row = currentBatchList.value.find(r => r.id === id)
    if (!row) continue
    if (row.card) {
      cards.push(row.card)
    } else {
      // Mocked provisional object for immediate preview if not yet emitted in DB
      let prefix = 'EST'
      if (row.type === 'profesor') prefix = 'PRO'
      else if (row.type === 'obrero') prefix = 'OBR'
      else if (row.type === 'administrativo') prefix = 'ADM'

      cards.push({
        id: 'temp-' + row.id,
        recipient_name: `${row.first_name} ${row.last_name}`.trim(),
        recipient_id_card: row.displayId,
        recipient_type: row.type,
        position: row.displayRole,
        department: row.raw?.department || (row.type === 'profesor' ? 'Docencia' : 'Administración'),
        blood_type: row.raw?.blood_type || 'O+',
        photo_url: row.raw?.photo_url || row.raw?.avatar_url || '',
        card_code: `CRD-${prefix}-2026-${String(row.id).padStart(4, '0')}`,
        valid_until: '2027-07-31',
        emergency_contact: row.raw?.emergency_contact_name || row.raw?.emergency_contact || 'Contacto Familiar',
        emergency_phone: row.raw?.emergency_contact_phone || row.raw?.emergency_phone || row.raw?.phone_mobile || '+58 414 000 0000',
        address: row.raw?.address_line1 || row.raw?.address || 'Caracas, Venezuela'
      })
    }
  }
  return cards
})

// Duplex Sheets Organization: 8 cards per Letter sheet (4 cols x 2 rows)
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
  if (filterType.value === 'profesor') {
    batchTargetTab.value = 'profesores'
  } else if (filterType.value === 'administrativo' || filterType.value === 'obrero') {
    batchTargetTab.value = 'personal'
  } else {
    batchTargetTab.value = 'estudiantes'
  }
  isBatchModalOpen.value = true
  selectedBatchIds.value = currentBatchList.value.map(r => r.id)
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

const formatMonthYear = (dateStr) => {
  if (!dateStr) return '07/2027'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '07/2027'
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${month}/${year}`
  } catch {
    return '07/2027'
  }
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
  selectedPersonId.value = ''
  
  // Contexto inteligente: Si hay un filtro activo por rol, asignarlo de una vez
  const initialType = filterType.value || 'estudiante'
  let initialPosition = 'Estudiante Regular'
  let initialDept = 'Educación Media'
  if (initialType === 'profesor') {
    initialPosition = 'Docente de Aula'
    initialDept = 'Coordinación Pedagógica'
  } else if (initialType === 'administrativo') {
    initialPosition = 'Asistente Administrativo'
    initialDept = 'Administración y Dirección'
  } else if (initialType === 'obrero') {
    initialPosition = 'Mantenimiento y Servicios'
    initialDept = 'Servicios Generales'
  }

  cardForm.value = {
    recipient_name: '',
    recipient_id_card: '',
    recipient_type: initialType,
    position: initialPosition,
    department: initialDept,
    blood_type: 'O+',
    emergency_contact: initialType === 'estudiante' ? 'Representante Legal' : 'Contacto Familiar',
    emergency_phone: '+58 414 123 4567',
    address: 'Caracas, Venezuela',
    photo_url: ''
  }
  isModalOpen.value = true
}

const openEditModal = (card) => {
  isEditingCard.value = true
  editingCardId.value = card.id
  selectedPersonId.value = ''
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

    let typePrefix = 'EST'
    if (cardForm.value.recipient_type === 'profesor') typePrefix = 'PRO'
    else if (cardForm.value.recipient_type === 'obrero') typePrefix = 'OBR'
    else if (cardForm.value.recipient_type === 'administrativo') typePrefix = 'ADM'

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
  const route = useRoute()
  if (route.query.type) {
    filterType.value = String(route.query.type)
  }
  fetchIdCards()
  fetchStudents()
  fetchTeachers()
  fetchStaff()
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
