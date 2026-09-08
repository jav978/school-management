<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 flex items-center justify-center text-brand-primary dark:text-brand-gold border border-brand-primary/20 dark:border-brand-purple/40 text-xl shadow-xs">
            💰
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Finanzas y Tesorería
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestión de ingresos, conciliación de pagos, transferencias y control de mensualidades
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2.5">
        <button 
          v-if="canManage"
          @click="openCreateModal($event)" 
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Registrar Pago</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards - Standardized Glass Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Recaudado -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Recaudado</p>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">$</span>
            <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">{{ totalCollectedFormatted }}</p>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Pagos Verificados -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Verificados</p>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black font-display text-slate-850 dark:text-white leading-tight tracking-tight">{{ verifiedCount }}</p>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
              {{ verifiedRate }}%
            </span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Pagos Pendientes / Por Conciliar -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Por Conciliar</p>
          <p class="text-3xl font-black font-display text-amber-500 mt-1 leading-tight tracking-tight">{{ pendingCount }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Total Operaciones -->
      <div class="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between min-h-[104px]">
        <div class="flex flex-col justify-center">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Operaciones</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1 leading-tight tracking-tight">{{ payments.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 min-w-[240px]">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por pagador, cédula o N° de referencia..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Status Filter -->
        <select
          v-model="filterStatus"
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todos los estados</option>
          <option value="verificado">Verificados</option>
          <option value="pendiente">Pendientes</option>
          <option value="rechazado">Rechazados</option>
        </select>

        <!-- Method Filter -->
        <select
          v-model="filterType"
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todos los métodos</option>
          <option value="pago movil">Pago Móvil</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo Divisas</option>
          <option value="otro">Otro</option>
        </select>

        <!-- View Mode Toggle -->
        <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
          <button
            @click="switchViewMode('table')"
            type="button"
            :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            class="p-1.5 rounded-lg text-xs transition-all"
            title="Vista de Tabla"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            @click="switchViewMode('grid')"
            type="button"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            class="p-1.5 rounded-lg text-xs transition-all"
            title="Vista de Cuadrícula"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 mb-3 animate-spin">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando registros de tesorería...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPayments.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-750 dark:text-white">No se encontraron pagos</h3>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
        No hay registros que coincidan con los filtros aplicados en tesorería.
      </p>
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th class="py-3.5 px-4 sm:px-6">Pagador / Titular</th>
              <th class="py-3.5 px-4">Método & Referencia</th>
              <th class="py-3.5 px-4 text-center">Monto</th>
              <th class="py-3.5 px-4">Fecha</th>
              <th class="py-3.5 px-4 text-center">Estado</th>
              <th class="py-3.5 px-4 text-center">Comprobante</th>
              <th class="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="p in filteredPayments"
              :key="p.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <!-- Payer Info -->
              <td class="py-3.5 px-4 sm:px-6">
                <div>
                  <p class="text-xs sm:text-sm font-bold text-slate-850 dark:text-white">
                    {{ p.payer_first_name }} {{ p.payer_last_name }}
                  </p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {{ p.payer_id_card }}
                    </span>
                    <span v-if="p.payer_phone" class="text-[10px] text-slate-400 dark:text-slate-500">
                      • {{ p.payer_phone }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Method & Reference -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2">
                  <span 
                    :class="getMethodBadgeClass(p.payment_type)"
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                  >
                    {{ p.payment_type }}
                  </span>
                  <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {{ p.bank_name }}
                  </span>
                </div>
                <p class="font-mono text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Ref: {{ p.reference_number }}
                </p>
              </td>

              <!-- Amount -->
              <td class="py-3.5 px-4 text-center">
                <span class="text-xs sm:text-sm font-black text-slate-850 dark:text-white">
                  ${{ formatAmount(p.amount) }}
                </span>
              </td>

              <!-- Date -->
              <td class="py-3.5 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ formatDate(p.payment_date) }}
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4 text-center">
                <span
                  :class="getStatusClass(p.status)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(p.status)"></span>
                  {{ p.status }}
                </span>
              </td>

              <!-- Comprobante / Recibo -->
              <td class="py-3.5 px-4 text-center">
                <button
                  v-if="p.receipt_image_url"
                  @click="openReceiptViewer(p, $event)"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-orange-950/30 text-slate-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 text-xs font-bold transition-all border border-slate-200/80 dark:border-white/10 group cursor-pointer"
                  title="Ver comprobante adjunto"
                >
                  <span class="text-sm group-hover:scale-110 transition-transform">📄</span>
                  <span>Ver Recibo</span>
                </button>
                <span v-else class="text-[11px] text-slate-400 italic">
                  Sin adjunto
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 sm:px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <!-- Quick Verify if pending -->
                  <button
                    v-if="p.status === 'pendiente'"
                    @click="updateStatus(p, 'verificado')"
                    type="button"
                    class="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold transition-colors"
                    title="Aprobar pago"
                  >
                    Aprobar
                  </button>
                  <!-- Quick Reject if pending -->
                  <button
                    v-if="p.status === 'pendiente'"
                    @click="updateStatus(p, 'rechazado')"
                    type="button"
                    class="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-[11px] font-bold transition-colors"
                    title="Rechazar pago"
                  >
                    Rechazar
                  </button>

                  <button
                    @click="openEditPaymentModal(p, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Editar datos del pago"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    @click="promptDeletePayment(p, $event)"
                    type="button"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar registro"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View of Payment Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="p in filteredPayments"
        :key="p.id"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
      >
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span 
              :class="getMethodBadgeClass(p.payment_type)"
              class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
            >
              {{ p.payment_type }}
            </span>
            <span
              :class="getStatusClass(p.status)"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(p.status)"></span>
              {{ p.status }}
            </span>
          </div>

          <!-- Body -->
          <div class="mt-3">
            <div class="flex items-baseline justify-between">
              <h4 class="text-sm font-bold text-slate-850 dark:text-white">
                {{ p.payer_first_name }} {{ p.payer_last_name }}
              </h4>
              <span class="text-base font-black text-slate-850 dark:text-white">
                ${{ formatAmount(p.amount) }}
              </span>
            </div>
            <p class="font-mono text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {{ p.payer_id_card }} • Ref: {{ p.reference_number }}
            </p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Banco: {{ p.bank_name }} | Fecha: {{ formatDate(p.payment_date) }}
            </p>
          </div>

          <!-- Notes -->
          <div v-if="p.admin_notes" class="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 italic">
            "{{ p.admin_notes }}"
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span class="font-mono text-[10px] text-slate-400">
            ID: {{ p.id }}
          </span>

          <div class="flex items-center gap-1.5">
            <button
              v-if="p.receipt_image_url"
              @click="openReceiptViewer(p, $event)"
              type="button"
              class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Ver comprobante"
            >
              <span>📄</span>
              <span>Recibo</span>
            </button>
            <button
              v-if="p.status === 'pendiente'"
              @click="updateStatus(p, 'verificado')"
              type="button"
              class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs"
            >
              Aprobar
            </button>
            <button
              @click="openEditPaymentModal(p, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Editar datos del pago"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              @click="promptDeletePayment(p, $event)"
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Eliminar registro"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Standardized Modal: Registrar / Editar Pago -->
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                  {{ isEditingPayment ? 'Editar Registro de Pago' : 'Registrar Operación de Pago' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ isEditingPayment ? 'Actualice los datos del comprobante y conciliación bancaria' : 'Ingrese los datos del comprobante y conciliación bancaria' }}
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
          <form @submit.prevent="submitPayment" class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Payer Name & Last Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre del Titular *
                </label>
                <input
                  v-model="form.payer_first_name"
                  type="text"
                  required
                  placeholder="Ej. Roberto"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Apellido del Titular *
                </label>
                <input
                  v-model="form.payer_last_name"
                  type="text"
                  required
                  placeholder="Ej. Sánchez"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <!-- ID Card & Phone -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Cédula / Documento *
                </label>
                <input
                  v-model="form.payer_id_card"
                  type="text"
                  required
                  placeholder="Ej. V-18294821"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Teléfono Móvil
                </label>
                <input
                  v-model="form.payer_phone"
                  type="text"
                  placeholder="+58 414 1234567"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <!-- Method & Bank -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Método de Pago *
                </label>
                <select
                  v-model="form.payment_type"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="pago movil">Pago Móvil</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo en Divisas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Banco *
                </label>
                <select
                  v-model="form.bank_name"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Banesco">Banesco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Mercantil">Banco Mercantil</option>
                  <option value="BNC">Banco Nacional de Crédito (BNC)</option>
                  <option value="Provincial">BBVA Provincial</option>
                  <option value="Bancaribe">Bancaribe</option>
                  <option value="Caja Principal">Caja Principal (Efectivo)</option>
                </select>
              </div>
            </div>

            <!-- Reference & Amount -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  N° de Referencia *
                </label>
                <input
                  v-model="form.reference_number"
                  type="text"
                  required
                  placeholder="Ej. REF-938210"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Monto ($ USD) *
                </label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="75.00"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-black text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <!-- Payment Date & Status (Status visible only for staff) -->
            <div class="grid grid-cols-1 gap-3" :class="isStaff ? 'sm:grid-cols-2' : 'sm:grid-cols-1'">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Fecha de Operación *
                </label>
                <input
                  v-model="form.payment_date"
                  type="date"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div v-if="isStaff">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Estado Inicial
                </label>
                <select
                  v-model="form.status"
                  class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="verificado">Verificado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Concepto / Observaciones
              </label>
              <textarea
                v-model="form.admin_notes"
                rows="2"
                placeholder="Ej. Mensualidad Septiembre 2026 - Estudiante Juan Pérez"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              ></textarea>
            </div>

            <!-- Adjuntar Comprobante de Pago (Recibo / Capture) -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Comprobante de Pago (Capture / PDF)</span>
                <span class="text-[10px] font-normal text-slate-400">Opcional pero recomendado</span>
              </label>

              <!-- Upload Drag & Drop Area -->
              <div 
                class="relative border-2 border-dashed rounded-2xl p-3 sm:p-4 text-center transition-all"
                :class="isDragging ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20' : 'border-slate-200 dark:border-slate-700/80 hover:border-orange-400/60 dark:hover:border-orange-500/40 bg-slate-50/50 dark:bg-slate-800/40'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleReceiptDrop"
              >
                <input 
                  type="file" 
                  ref="receiptFileInputRef"
                  @change="handleReceiptFileChange"
                  accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
                  class="hidden"
                />

                <!-- File Preview / Upload Status -->
                <div v-if="form.receipt_image_url" class="flex items-center gap-3 text-left">
                  <!-- Thumbnail / Icon -->
                  <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <img 
                      v-if="isImageUrl(form.receipt_image_url)" 
                      :src="form.receipt_image_url" 
                      alt="Comprobante" 
                      class="w-full h-full object-cover cursor-pointer"
                      @click="previewReceiptFull(form.receipt_image_url)"
                    />
                    <div v-else class="w-full h-full flex flex-col items-center justify-center text-rose-500">
                      <span class="text-xl">📄</span>
                      <span class="text-[9px] font-bold uppercase">PDF</span>
                    </div>
                  </div>

                  <!-- File Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {{ receiptFileName || 'Comprobante_adjunto' }}
                    </p>
                    <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <span>✓</span> Listo para registrar
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <button 
                        type="button" 
                        @click="triggerFileInput"
                        class="text-[11px] text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
                      >
                        Cambiar
                      </button>
                      <button 
                        type="button" 
                        @click="removeAttachedReceipt"
                        class="text-[11px] text-rose-500 hover:text-rose-700 font-bold underline cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty State Dropzone -->
                <div v-else class="cursor-pointer py-2" @click="triggerFileInput">
                  <div class="w-10 h-10 mx-auto rounded-full bg-orange-100/80 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Arrastra el comprobante o <span class="text-orange-600 dark:text-orange-400 underline">haz clic aquí</span>
                  </p>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Captura Pago Móvil, transferencia bancaria (PNG, JPG, PDF máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
          </form>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="closeModal"
              type="button"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/60 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              @click="submitPayment"
              :disabled="isSubmitting"
              type="button"
              class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {{ isSubmitting ? 'Guardando...' : (isEditingPayment ? 'Guardar Cambios' : 'Registrar Pago') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Eliminar Pago -->
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
              ¿Eliminar este registro de pago?
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Se eliminará el registro con referencia <strong class="text-slate-700 dark:text-slate-200">{{ paymentToDelete?.reference_number }}</strong> por ${{ paymentToDelete?.amount }}.
            </p>
          </div>

          <!-- Permanent Sticky Footer -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              @click="isDeleteModalOpen = false"
              type="button"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/90 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              @click="confirmDeletePayment"
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

    <!-- Modal: Inspección de Comprobante / Recibo de Pago -->
    <Teleport to="body">
      <div 
        v-if="isReceiptModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-200"
        @click.self="closeReceiptViewer"
      >
        <div 
          class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all transform animate-in fade-in zoom-in-95"
          :style="modalSpatialStyle"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-orange-100/80 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-lg">
                📄
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-black text-slate-850 dark:text-white">
                  Comprobante de Operación
                </h3>
                <p class="text-xs text-slate-400">
                  Ref: <span class="font-mono font-bold text-slate-600 dark:text-slate-300">{{ selectedReceiptPayment?.reference_number }}</span>
                  • {{ selectedReceiptPayment?.bank_name }}
                </p>
              </div>
            </div>
            <button 
              @click="closeReceiptViewer"
              type="button"
              class="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Body: Image / Document Viewer & Payment Details -->
          <div class="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <!-- Payment Quick Summary Card -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-white/5 text-xs">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Titular</span>
                <span class="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {{ selectedReceiptPayment?.payer_first_name }} {{ selectedReceiptPayment?.payer_last_name }}
                </span>
                <span class="text-[10px] font-mono text-slate-400">{{ selectedReceiptPayment?.payer_id_card }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monto</span>
                <span class="text-sm font-black text-slate-850 dark:text-white block">
                  ${{ formatAmount(selectedReceiptPayment?.amount) }}
                </span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha</span>
                <span class="font-semibold text-slate-700 dark:text-slate-300 block">
                  {{ formatDate(selectedReceiptPayment?.payment_date) }}
                </span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estado Actual</span>
                <span 
                  :class="getStatusClass(selectedReceiptPayment?.status)"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize mt-0.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(selectedReceiptPayment?.status)"></span>
                  {{ selectedReceiptPayment?.status }}
                </span>
              </div>
            </div>

            <!-- Notes if any -->
            <div v-if="selectedReceiptPayment?.admin_notes" class="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              <span class="font-bold">Observación:</span> {{ selectedReceiptPayment?.admin_notes }}
            </div>

            <!-- Full-view Receipt Container -->
            <div class="relative bg-slate-900/90 dark:bg-black/80 rounded-2xl p-2 sm:p-4 min-h-[300px] flex items-center justify-center overflow-hidden border border-slate-800">
              <template v-if="isImageUrl(selectedReceiptPayment?.receipt_image_url)">
                <img 
                  :src="selectedReceiptPayment?.receipt_image_url" 
                  alt="Capture de Comprobante" 
                  class="max-h-[50vh] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-200 hover:scale-105"
                />
              </template>
              <div v-else class="text-center py-10 px-4 text-white">
                <span class="text-5xl block mb-3">📑</span>
                <p class="text-sm font-bold">Documento Adjunto (PDF o Archivo Externo)</p>
                <a 
                  :href="selectedReceiptPayment?.receipt_image_url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
                >
                  <span>Abrir Documento Completo</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Sticky Footer Actions: Admin verification actions + Close -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
            <!-- Left: Download or View Original -->
            <a 
              :href="selectedReceiptPayment?.receipt_image_url" 
              target="_blank" 
              download 
              class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>📥</span>
              <span>Descargar Comprobante</span>
            </a>

            <!-- Right: Admin Approval / Rejection Controls & Cancel Button -->
            <div class="flex items-center gap-2">
              <template v-if="isStaff && selectedReceiptPayment?.status === 'pendiente'">
                <button
                  @click="updateStatus(selectedReceiptPayment, 'rechazado'); closeReceiptViewer()"
                  type="button"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
                >
                  ✕ Rechazar Pago
                </button>
                <button
                  @click="updateStatus(selectedReceiptPayment, 'verificado'); closeReceiptViewer()"
                  type="button"
                  class="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>✓</span>
                  <span>Verificar y Aprobar</span>
                </button>
              </template>

              <button
                @click="closeReceiptViewer"
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/60 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const nuxtApp = useNuxtApp()
const authStore = useAuthStore()

const userRole = computed(() => authStore.userRole || authStore.user?.role || 'parent')
const isStaff = computed(() => {
  const r = userRole.value
  return r === 'admin' || r === 'control_estudio' || r === 'coordinator'
})

const canManage = computed(() => {
  return isStaff.value
})

// State
const payments = ref([])
const search = ref('')
const filterStatus = ref('')
const filterType = ref('')
const viewMode = ref('table') // 'table' | 'grid'
const isLoading = ref(false)
const isSubmitting = ref(false)
const toastMessage = ref('')

// Receipt file attachment state
const receiptFileInputRef = ref(null)
const isDragging = ref(false)
const receiptFileName = ref('')

// Receipt full inspection modal state
const isReceiptModalOpen = ref(false)
const selectedReceiptPayment = ref(null)

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const paymentToDelete = ref(null)

const triggerOrigin = ref({ x: 50, y: 50 })
const modalSpatialStyle = computed(() => ({
  transformOrigin: `${triggerOrigin.value.x}% ${triggerOrigin.value.y}%`
}))

const form = ref({
  payer_first_name: '',
  payer_last_name: '',
  payer_id_card: '',
  payer_phone: '',
  payment_type: 'pago movil',
  bank_name: 'Banesco',
  reference_number: '',
  amount: 75.00,
  payment_date: new Date().toISOString().split('T')[0],
  status: isStaff.value ? 'verificado' : 'pendiente',
  receipt_image_url: '',
  admin_notes: '',
  caller_role: userRole.value
})

// KPIs
const totalCollected = computed(() => {
  return payments.value
    .filter(p => p.status === 'verificado')
    .reduce((acc, p) => acc + Number(p.amount || 0), 0)
})

const totalCollectedFormatted = computed(() => {
  return totalCollected.value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const verifiedCount = computed(() => payments.value.filter(p => p.status === 'verificado').length)
const pendingCount = computed(() => payments.value.filter(p => p.status === 'pendiente').length)

const verifiedRate = computed(() => {
  if (payments.value.length === 0) return 0
  return Math.round((verifiedCount.value / payments.value.length) * 100)
})

// Filtered payments
const filteredPayments = computed(() => {
  let list = payments.value

  if (filterStatus.value) {
    list = list.filter(p => p.status === filterStatus.value)
  }

  if (filterType.value) {
    list = list.filter(p => p.payment_type === filterType.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(p => 
      `${p.payer_first_name} ${p.payer_last_name}`.toLowerCase().includes(q) ||
      (p.payer_id_card && p.payer_id_card.toLowerCase().includes(q)) ||
      (p.reference_number && p.reference_number.toLowerCase().includes(q)) ||
      (p.bank_name && p.bank_name.toLowerCase().includes(q))
    )
  }

  return list
})

const formatAmount = (val) => {
  if (val === null || val === undefined) return '0.00'
  return Number(val).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (d) => {
  if (!d) return ''
  const str = typeof d === 'string' ? d.split('T')[0] : new Date(d).toISOString().split('T')[0]
  return str
}

const getStatusClass = (status) => {
  if (status === 'verificado') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
  if (status === 'pendiente') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
}

const getStatusDotClass = (status) => {
  if (status === 'verificado') return 'bg-emerald-500'
  if (status === 'pendiente') return 'bg-amber-500'
  return 'bg-rose-500'
}

const getMethodBadgeClass = (type) => {
  if (type === 'pago movil') return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
  if (type === 'transferencia') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
  if (type === 'efectivo') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

const switchViewMode = (mode) => {
  viewMode.value = mode
}

// Modal actions
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

const isEditingPayment = ref(false)
const editingPaymentId = ref(null)

const openCreateModal = (event) => {
  captureTriggerOrigin(event)
  isEditingPayment.value = false
  editingPaymentId.value = null
  receiptFileName.value = ''
  
  // Default values based on current logged in user
  const u = authStore.user || {}
  const defaultFirstName = u.first_name || (u.name ? u.name.split(' ')[0] : '')
  const defaultLastName = u.last_name || (u.name ? u.name.split(' ').slice(1).join(' ') : '')

  form.value = {
    payer_first_name: defaultFirstName,
    payer_last_name: defaultLastName,
    payer_id_card: u.id_card || '',
    payer_phone: u.phone || '',
    payment_type: 'pago movil',
    bank_name: 'Banesco',
    reference_number: `REF-${Date.now().toString().slice(-6)}`,
    amount: 75.00,
    payment_date: new Date().toISOString().split('T')[0],
    status: isStaff.value ? 'verificado' : 'pendiente',
    receipt_image_url: '',
    admin_notes: '',
    caller_role: userRole.value
  }
  isModalOpen.value = true
}

const openEditPaymentModal = (payment, event) => {
  captureTriggerOrigin(event)
  isEditingPayment.value = true
  editingPaymentId.value = payment.id
  receiptFileName.value = payment.receipt_image_url ? 'Comprobante_registrado' : ''
  form.value = {
    payer_first_name: payment.payer_first_name || '',
    payer_last_name: payment.payer_last_name || '',
    payer_id_card: payment.payer_id_card || '',
    payer_phone: payment.payer_phone || '',
    payment_type: payment.payment_type || 'pago movil',
    bank_name: payment.bank_name || 'Banesco',
    reference_number: payment.reference_number || '',
    amount: Number(payment.amount) || 0,
    payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : new Date().toISOString().split('T')[0],
    status: payment.status || 'verificado',
    receipt_image_url: payment.receipt_image_url || '',
    admin_notes: payment.admin_notes || '',
    caller_role: userRole.value
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEditingPayment.value = false
  editingPaymentId.value = null
  receiptFileName.value = ''
}

// Receipt File Upload & Drop Handlers
const triggerFileInput = () => {
  if (receiptFileInputRef.value) {
    receiptFileInputRef.value.click()
  }
}

const handleReceiptFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    processReceiptFile(file)
  }
}

const handleReceiptDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) {
    processReceiptFile(file)
  }
}

const processReceiptFile = (file) => {
  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('El archivo supera el límite de 5 MB')
    return
  }

  receiptFileName.value = file.name

  const reader = new FileReader()
  reader.onload = (event) => {
    form.value.receipt_image_url = event.target.result
    showToast('Comprobante adjuntado con éxito')
  }
  reader.onerror = () => {
    showToast('Error al leer el archivo')
  }
  reader.readAsDataURL(file)
}

const removeAttachedReceipt = () => {
  form.value.receipt_image_url = ''
  receiptFileName.value = ''
  if (receiptFileInputRef.value) {
    receiptFileInputRef.value.value = ''
  }
}

const isImageUrl = (url) => {
  if (!url) return false
  if (url.startsWith('data:image/')) return true
  if (url.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i)) return true
  return !url.includes('.pdf') && !url.startsWith('data:application/pdf')
}

// Full Receipt Viewer Modal
const openReceiptViewer = (payment, event) => {
  captureTriggerOrigin(event)
  selectedReceiptPayment.value = payment
  isReceiptModalOpen.value = true
}

const closeReceiptViewer = () => {
  isReceiptModalOpen.value = false
  selectedReceiptPayment.value = null
}

// Submit payment (Create or Edit)
const submitPayment = async () => {
  isSubmitting.value = true
  try {
    if (isEditingPayment.value && editingPaymentId.value) {
      await nuxtApp.$api.service('payments').patch(editingPaymentId.value, form.value)
      showToast('Pago actualizado exitosamente')
    } else {
      await nuxtApp.$api.service('payments').create(form.value)
      showToast('Pago registrado exitosamente')
    }
    await fetchPayments()
    closeModal()
  } catch (error) {
    console.error('Error submitting payment:', error)
    showToast(error.message || 'Error al procesar el pago')
  } finally {
    isSubmitting.value = false
  }
}

// Status quick update
const updateStatus = async (payment, newStatus) => {
  try {
    await nuxtApp.$api.service('payments').patch(payment.id, { status: newStatus })
    payment.status = newStatus
    showToast(`Pago marcado como ${newStatus}`)
  } catch (error) {
    console.error('Error updating status:', error)
    showToast(error.message || 'Error al actualizar el estado')
  }
}

// Delete payment
const promptDeletePayment = (payment, event) => {
  captureTriggerOrigin(event)
  paymentToDelete.value = payment
  isDeleteModalOpen.value = true
}

const confirmDeletePayment = async () => {
  if (!paymentToDelete.value) return
  try {
    await nuxtApp.$api.service('payments').remove(paymentToDelete.value.id)
    showToast('Registro de pago eliminado')
    await fetchPayments()
  } catch (error) {
    console.error('Error removing payment:', error)
    showToast(error.message || 'Error al eliminar el pago')
  } finally {
    isDeleteModalOpen.value = false
    paymentToDelete.value = null
  }
}

// Fetch Payments
const fetchPayments = async () => {
  isLoading.value = true
  try {
    const res = await nuxtApp.$api.service('payments').find({
      query: {
        $limit: 100
      }
    })
    payments.value = res.data || res || []
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    isLoading.value = false
  }
}

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

onMounted(async () => {
  await fetchPayments()
})
</script>
