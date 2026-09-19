<template>
  <div class="min-h-screen pb-20 bg-slate-50/60 dark:bg-[#0c071e] text-slate-800 dark:text-slate-100 transition-colors">
    <!-- SCREEN ONLY: Main Interface Header -->
    <div class="print:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-brand-gold uppercase tracking-wider mb-1">
            <span>Gestión Académica</span>
            <span>•</span>
            <span>Listas de Útiles</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Listas Oficiales de Útiles Escolares</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold">
              {{ activeList?.academic_year_name || '2026-2027' }}
            </span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            U. E. Colegio "Santa Luisa" • Documento oficial sin publicidad comercial
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center flex-wrap gap-2.5">
          <!-- Print / PDF Button -->
          <button
            @click="triggerPrint"
            type="button"
            class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            title="Imprimir o Guardar como PDF Oficial"
          >
            <svg class="w-4 h-4 text-amber-400 dark:text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Imprimir / PDF Oficial</span>
          </button>

          <!-- Admin Actions -->
          <template v-if="canManage">
            <!-- Toggle Allow Suggestions switch -->
            <button
              v-if="activeList"
              @click="toggleAllowSuggestions"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
              :class="activeList.allow_suggestions
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-white/10 hover:bg-slate-200'"
              :title="activeList.allow_suggestions ? 'Buzón abierto para representantes. Clic para cerrarlo.' : 'Buzón cerrado. Clic para abrirlo.'"
            >
              <span class="w-2 h-2 rounded-full" :class="activeList.allow_suggestions ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
              <span>{{ activeList.allow_suggestions ? 'Buzón Abierto' : 'Buzón Cerrado' }}</span>
            </button>

            <!-- View Suggestions with pending badge -->
            <button
              @click="openSuggestionsModal"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-brand-gold border border-amber-500/30 hover:bg-amber-500/20 font-bold text-xs transition-all cursor-pointer relative"
              title="Ver sugerencias enviadas por representantes"
            >
              <span>💡 Sugerencias</span>
              <span
                v-if="pendingSuggestionsCount > 0"
                class="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-black"
              >
                {{ pendingSuggestionsCount }}
              </span>
            </button>

            <button
              @click="openEditModal"
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/15 font-semibold text-xs transition-all cursor-pointer"
            >
              <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editar Lista</span>
            </button>

            <button
              @click="openCloneModal"
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/15 font-semibold text-xs transition-all cursor-pointer"
              title="Duplicar para otro año escolar"
            >
              <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>Clonar Lista</span>
            </button>

            <button
              @click="openCreateModal"
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nueva Lista</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Education Levels & Grade Switcher -->
      <div class="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Level Tabs -->
        <div class="inline-flex p-1 rounded-2xl bg-slate-200/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold">
          <button
            v-for="level in levels"
            :key="level.id"
            @click="selectedLevel = level.id"
            :class="[
              selectedLevel === level.id
                ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            class="px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{{ level.icon }}</span>
            <span>{{ level.label }}</span>
          </button>
        </div>

        <!-- Shopping Checklist Mode Switch for Parents -->
        <div class="flex items-center gap-3 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 px-3.5 py-2 rounded-xl">
          <label class="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-brand-gold cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="checklistMode"
              class="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span>Modo Checklist de Compras</span>
          </label>
          <span v-if="checklistMode" class="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300">
            ({{ boughtCount }}/{{ activeItems.length }})
          </span>
        </div>
      </div>

      <!-- Grade Selector Pills -->
      <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          v-for="list in filteredLists"
          :key="list.id"
          @click="activeListId = list.id"
          :class="[
            activeListId === list.id
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border-amber-500'
              : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-400'
          ]"
          class="px-4 py-2 rounded-xl border text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-2"
        >
          <span>{{ list.grade_name }}</span>
          <span
            :class="[
              activeListId === list.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400',
              'text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold'
            ]"
          >
            {{ list.items?.length || 0 }} útiles
          </span>
        </button>
      </div>

      <!-- Parent Shopping Progress Bar -->
      <div v-if="checklistMode && activeItems.length > 0" class="mt-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-amber-500/30 shadow-sm">
        <div class="flex items-center justify-between text-xs font-semibold mb-2">
          <span class="text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span>🛒 Progreso de compra escolar</span>
            <span class="font-bold text-amber-600 dark:text-amber-400">({{ boughtPercentage }}%)</span>
          </span>
          <div class="flex items-center gap-1.5">
            <button
              @click="checklistFilter = 'all'"
              :class="checklistFilter === 'all' ? 'bg-slate-200 dark:bg-white/20 font-bold' : 'text-slate-400'"
              class="px-2 py-0.5 rounded text-[11px]"
            >
              Todos ({{ activeItems.length }})
            </button>
            <button
              @click="checklistFilter = 'pending'"
              :class="checklistFilter === 'pending' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'"
              class="px-2 py-0.5 rounded text-[11px]"
            >
              Pendientes ({{ activeItems.length - boughtCount }})
            </button>
            <button
              @click="checklistFilter = 'bought'"
              :class="checklistFilter === 'bought' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'"
              class="px-2 py-0.5 rounded text-[11px]"
            >
              Comprados ({{ boughtCount }})
            </button>
          </div>
        </div>
        <div class="w-full bg-slate-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            class="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
            :style="{ width: `${boughtPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- MAIN DISPLAY CONTENT (Clean Institutional Card & Printable Sheet) -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 mt-4">
      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">Cargando lista oficial...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!activeList" class="py-16 text-center bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 p-8">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 text-2xl">
          📋
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-white">No hay lista registrada para este grado</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Selecciona otro grado en las pestañas superiores o agrega una lista nueva.</p>
      </div>

      <!-- ACTIVE LIST CARD (Visual Preview on Screen + Official Print on Paper) -->
      <div
        v-else
        class="bg-white dark:bg-[#140e2b] print:bg-white print:text-black rounded-3xl border border-slate-200 dark:border-white/10 print:border-none shadow-sm print:shadow-none p-6 sm:p-10 transition-all"
        id="printable-supply-list"
      >
        <!-- INSTITUTIONAL MEMBRETE (Standard Venezuelan School Official Header) -->
        <div class="border-b-2 border-slate-900/80 dark:border-white/20 print:border-slate-900 pb-5 mb-6 text-center">
          <div class="flex items-center justify-between gap-4 mb-3">
            <!-- Left: National Coat of Arms / MPPE -->
            <div class="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img src="/logomppe.png" alt="MPPE" class="max-w-full max-h-full object-contain" @error="$event.target.style.display='none'" />
            </div>

            <!-- Center: Institutional Names -->
            <div class="flex-1 text-center">
              <p class="text-[11px] sm:text-xs tracking-wide uppercase font-serif text-slate-700 dark:text-slate-300 print:text-slate-800 font-semibold">
                República Bolivariana de Venezuela
              </p>
              <p class="text-[10px] sm:text-[11px] tracking-wide uppercase font-serif text-slate-600 dark:text-slate-400 print:text-slate-700 font-medium">
                Ministerio del Poder Popular para la Educación
              </p>
              <h2 class="text-lg sm:text-2xl font-black font-display text-slate-950 dark:text-white print:text-black tracking-tight mt-1">
                U. E. COLEGIO "SANTA LUISA"
              </h2>
            </div>

            <!-- Right: Official Santa Luisa School Logo -->
            <div class="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img src="/logocolegio.png" alt="Santa Luisa" class="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <!-- Document Title & Grade Header -->
          <div class="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 print:border-slate-300">
            <h3 class="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900 dark:text-white print:text-black">
              {{ activeList.title || `LISTA ESCOLAR ${activeList.academic_year_name} - ${activeList.grade_name.toUpperCase()}` }}
            </h3>
            <p class="text-xs font-bold text-amber-600 dark:text-brand-gold print:text-slate-700 uppercase tracking-widest mt-0.5">
              {{ activeList.grade_name }} • AÑO ESCOLAR {{ activeList.academic_year_name }}
            </p>
          </div>
        </div>

        <!-- SECTION 1: TEXTOS SUGERIDOS (If any) -->
        <div v-if="textbooks.length > 0" class="mb-6">
          <div class="flex items-center gap-2 mb-2.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black font-serif">
              TEXTOS SUGERIDOS:
            </h4>
          </div>
          <div class="grid grid-cols-1 gap-1.5 pl-3 border-l-2 border-amber-500/40">
            <div
              v-for="book in textbooks"
              :key="book.id"
              :class="[
                checklistMode && isItemBought(book.id) ? 'opacity-40 line-through' : '',
                'text-xs flex items-start justify-between py-1 transition-opacity'
              ]"
            >
              <div class="flex items-start gap-2">
                <input
                  v-if="checklistMode"
                  type="checkbox"
                  :checked="isItemBought(book.id)"
                  @change="toggleItemBought(book.id)"
                  class="mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer print:hidden"
                />
                <span class="text-slate-400 font-bold print:text-slate-800">✓</span>
                <div>
                  <span class="font-bold text-slate-900 dark:text-white print:text-black uppercase">
                    {{ book.item_name }}
                  </span>
                  <span v-if="book.specification" class="text-slate-600 dark:text-slate-300 print:text-slate-700 ml-1">
                    . {{ book.specification }}
                  </span>
                </div>
              </div>
              <span v-if="!book.is_mandatory" class="text-[10px] font-medium text-amber-600 dark:text-amber-400 print:text-slate-500 print:italic flex-shrink-0 ml-2">
                (Sugerido)
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: LIBRETAS Y CUADERNOS (If any) -->
        <div v-if="notebooks.length > 0" class="mb-6">
          <div class="flex items-center gap-2 mb-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black font-serif">
              LIBRETAS / CUADERNOS:
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3 border-l-2 border-emerald-500/40">
            <div
              v-for="nb in notebooks"
              :key="nb.id"
              :class="[
                checklistMode && isItemBought(nb.id) ? 'opacity-40 line-through' : '',
                'text-xs flex items-start gap-2 py-1'
              ]"
            >
              <input
                v-if="checklistMode"
                type="checkbox"
                :checked="isItemBought(nb.id)"
                @change="toggleItemBought(nb.id)"
                class="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer print:hidden"
              />
              <span class="font-bold font-mono text-emerald-600 dark:text-emerald-400 print:text-black flex-shrink-0">
                {{ nb.quantity }}
              </span>
              <div>
                <span class="font-medium text-slate-900 dark:text-slate-100 print:text-black">
                  {{ nb.item_name }}
                </span>
                <span v-if="nb.specification" class="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 ml-1">
                  ({{ nb.specification }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: ÚTILES ESCOLARES Y PAPELERÍA (Organized in 2 balanced columns matching user document) -->
        <div v-if="stationeryAndMaterials.length > 0" class="mb-6">
          <div class="flex items-center gap-2 mb-2.5">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black font-serif">
              ÚTILES ESCOLARES Y MATERIALES:
            </h4>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 pl-3 border-l-2 border-sky-500/40">
            <!-- Column 1 -->
            <div class="space-y-1.5">
              <div
                v-for="item in stationeryCol1"
                :key="item.id"
                :class="[
                  checklistMode && isItemBought(item.id) ? 'opacity-40 line-through' : '',
                  'text-xs flex items-start gap-2 py-0.5'
                ]"
              >
                <input
                  v-if="checklistMode"
                  type="checkbox"
                  :checked="isItemBought(item.id)"
                  @change="toggleItemBought(item.id)"
                  class="mt-0.5 rounded border-sky-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 cursor-pointer print:hidden"
                />
                <span class="font-bold font-mono text-slate-900 dark:text-white print:text-black flex-shrink-0 min-w-[20px]">
                  {{ item.quantity }}
                </span>
                <span class="text-slate-800 dark:text-slate-200 print:text-black">
                  {{ item.item_name }}
                  <span v-if="item.specification" class="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                    ({{ item.specification }})
                  </span>
                </span>
              </div>
            </div>

            <!-- Column 2 -->
            <div class="space-y-1.5">
              <div
                v-for="item in stationeryCol2"
                :key="item.id"
                :class="[
                  checklistMode && isItemBought(item.id) ? 'opacity-40 line-through' : '',
                  'text-xs flex items-start gap-2 py-0.5'
                ]"
              >
                <input
                  v-if="checklistMode"
                  type="checkbox"
                  :checked="isItemBought(item.id)"
                  @change="toggleItemBought(item.id)"
                  class="mt-0.5 rounded border-sky-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 cursor-pointer print:hidden"
                />
                <span class="font-bold font-mono text-slate-900 dark:text-white print:text-black flex-shrink-0 min-w-[20px]">
                  {{ item.quantity }}
                </span>
                <span class="text-slate-800 dark:text-slate-200 print:text-black">
                  {{ item.item_name }}
                  <span v-if="item.specification" class="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                    ({{ item.specification }})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 4: ASEO / OTROS (If any) -->
        <div v-if="hygieneAndOther.length > 0" class="mb-6">
          <div class="flex items-center gap-2 mb-2.5">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black font-serif">
              ARTÍCULOS DE ASEO E HIGIENE PERSONAL:
            </h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3 border-l-2 border-purple-500/40">
            <div
              v-for="item in hygieneAndOther"
              :key="item.id"
              :class="[
                checklistMode && isItemBought(item.id) ? 'opacity-40 line-through' : '',
                'text-xs flex items-start gap-2 py-1'
              ]"
            >
              <input
                v-if="checklistMode"
                type="checkbox"
                :checked="isItemBought(item.id)"
                @change="toggleItemBought(item.id)"
                class="mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 cursor-pointer print:hidden"
              />
              <span class="font-bold font-mono text-purple-600 dark:text-purple-400 print:text-black flex-shrink-0">
                {{ item.quantity }}
              </span>
              <div>
                <span class="font-medium text-slate-900 dark:text-slate-100 print:text-black">
                  {{ item.item_name }}
                </span>
                <span v-if="item.specification" class="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 ml-1">
                  ({{ item.specification }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- INSTITUTIONAL OFFICIAL NOTE BOX (Matching user document prompt) -->
        <div class="mt-8 p-4 rounded-2xl border-2 border-slate-900 dark:border-white/20 print:border-slate-900 bg-slate-50 dark:bg-white/5 print:bg-white">
          <p class="text-xs font-black uppercase text-slate-900 dark:text-white print:text-black font-serif">
            NOTA:
          </p>
          <p class="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black mt-1">
            {{ activeList.general_notes || 'TODOS LOS ÚTILES DEBEN ESTAR DEBIDAMENTE FORRADOS E IDENTIFICADOS CON NOMBRE, APELLIDO Y GRADO.' }}
          </p>
          <p v-if="activeList.delivery_instructions" class="text-[11px] text-slate-600 dark:text-slate-400 print:text-slate-700 mt-1">
            {{ activeList.delivery_instructions }}
          </p>
        </div>

        <!-- OFFICIAL SIGNATURE & SEAL FOOTER (Visible on Print and Screen) -->
        <div class="mt-12 pt-6 border-t border-slate-200 dark:border-white/10 print:border-slate-400 flex items-end justify-between gap-8">
          <div class="text-center w-48">
            <div class="border-b border-slate-400 print:border-slate-900 h-12 mb-1.5 flex items-end justify-center">
              <span class="text-[10px] text-slate-400 dark:text-slate-500 italic">Firma y Sello</span>
            </div>
            <p class="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 print:text-black">
              Coordinación Académica
            </p>
            <p class="text-[9px] text-slate-400 print:text-slate-600">U.E. Colegio "Santa Luisa"</p>
          </div>

          <!-- Official School Seal Stamp Badge -->
          <div class="flex flex-col items-center justify-center">
            <div class="w-16 h-16 rounded-full border-2 border-dashed border-amber-600/60 dark:border-brand-gold/60 print:border-slate-700 flex flex-col items-center justify-center text-center p-1">
              <span class="text-[8px] font-black uppercase tracking-tighter text-amber-700 dark:text-brand-gold print:text-black leading-tight">SELLO OFICIAL</span>
              <span class="text-[7px] text-slate-500 print:text-slate-700 font-mono">SANTA LUISA</span>
              <span class="text-[7px] font-bold text-slate-400">{{ activeList.academic_year_name }}</span>
            </div>
          </div>

          <div class="text-center w-48">
            <div class="border-b border-slate-400 print:border-slate-900 h-12 mb-1.5 flex items-end justify-center">
              <span class="text-[10px] text-slate-400 dark:text-slate-500 italic">Firma de Dirección</span>
            </div>
            <p class="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 print:text-black">
              Dirección General
            </p>
            <p class="text-[9px] text-slate-400 print:text-slate-600">U.E. Colegio "Santa Luisa"</p>
          </div>
        </div>
      </div>

      <!-- REPRESENTATIVE OBSERVER SUGGESTIONS BOX (Screen Only) -->
      <div class="mt-8 print:hidden">
        <!-- If suggestions are allowed for this list -->
        <div
          v-if="activeList?.allow_suggestions"
          class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#140c2b] border border-amber-500/30 shadow-sm transition-all"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4 mb-5">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-brand-gold uppercase tracking-wider mb-1">
                <span>💡 Buzón de Observaciones</span>
                <span>•</span>
                <span>Canal Institucional de Representantes</span>
              </div>
              <h3 class="text-lg font-black font-display text-slate-900 dark:text-white tracking-tight">
                ¿Deseas proponer alguna sugerencia sobre esta lista?
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Los textos y útiles se rigen por directrices pedagógicas del MPPE y la Dirección. Si tienes dudas sobre disponibilidad de libros o sugerencias de materiales alternativos, compártela aquí con la Coordinación.
              </p>
            </div>
            
            <div class="flex-shrink-0">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Recepción Abierta</span>
              </span>
            </div>
          </div>

          <!-- Success Alert when sent -->
          <div
            v-if="suggestionSentSuccess"
            class="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 mb-4"
          >
            <div class="flex items-center gap-2">
              <span class="text-base">✓</span>
              <span><strong>¡Sugerencia registrada con éxito!</strong> La Coordinación revisará tu aporte para tomar decisiones informadas.</span>
            </div>
            <button @click="suggestionSentSuccess = false" class="text-xs font-bold hover:underline cursor-pointer">
              Enviar otra
            </button>
          </div>

          <!-- Suggestion Form -->
          <form v-else @submit.prevent="submitSuggestion" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Artículo o Texto en Cuestión (Opcional)
                </label>
                <input
                  v-model="suggestionForm.suggested_item_name"
                  type="text"
                  placeholder="ej. Libro de Física 3er Año o Libreta Cuadriculada"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría del Útil
                </label>
                <select
                  v-model="suggestionForm.suggested_category"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="textbook">Texto Sugerido / Libro</option>
                  <option value="notebook">Libreta / Cuaderno</option>
                  <option value="stationery">Útil Escolar / Papelería</option>
                  <option value="hygiene">Aseo / Higiene Personal</option>
                  <option value="other">Otro Material</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detalle de tu Sugerencia u Observación *
              </label>
              <textarea
                v-model="suggestionForm.suggestion_text"
                required
                rows="3"
                placeholder="Indícanos si se encuentra agotado en librerías, si sugieres una edición alternativa o cualquier consulta para los docentes..."
                class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span class="text-[11px] text-slate-500 dark:text-slate-400">
                Se enviará identificado como <strong class="text-slate-800 dark:text-slate-200">{{ currentUserName }}</strong> ({{ currentUserRoleLabel }}).
              </span>

              <button
                type="submit"
                :disabled="sendingSuggestion || !suggestionForm.suggestion_text.trim()"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span v-if="sendingSuggestion" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Enviar Sugerencia a Coordinación</span>
              </button>
            </div>
          </form>
        </div>

        <!-- If suggestions are disabled for this list -->
        <div
          v-else
          class="p-5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center"
        >
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>El buzón de sugerencias para esta lista de grado se encuentra cerrado por la Dirección. La lista es definitiva.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL: EDIT / CREATE SUPPLY LIST -->
    <Teleport to="body">
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="closeEditModal"
      >
        <div class="bg-white dark:bg-[#150d30] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6">
          <div class="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4 mb-4">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ modalForm.id ? 'Editar Lista de Útiles' : 'Crear Nueva Lista de Útiles' }}
            </h3>
            <button @click="closeEditModal" class="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg">✕</button>
          </div>

          <form @submit.prevent="saveSupplyList" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Grado</label>
                <input
                  v-model="modalForm.grade_name"
                  type="text"
                  required
                  placeholder="ej. Tercer Año"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nivel Educativo</label>
                <select
                  v-model="modalForm.education_level"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="preescolar">Educación Inicial (Preescolar)</option>
                  <option value="primaria">Educación Primaria (1º a 6º)</option>
                  <option value="media_general">Educación Media General (1º a 5º Año)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título de la Lista</label>
              <input
                v-model="modalForm.title"
                type="text"
                required
                placeholder="ej. LISTA ESCOLAR 2026-2027 - TERCER AÑO"
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nota Institucional</label>
              <textarea
                v-model="modalForm.general_notes"
                rows="2"
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                placeholder="ej. TODOS LOS ÚTILES DEBEN ESTAR DEBIDAMENTE FORRADOS E IDENTIFICADOS"
              ></textarea>
            </div>

            <!-- Allow Suggestions toggle in modalForm -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div>
                <p class="text-xs font-bold text-slate-900 dark:text-white">Buzón de Sugerencias para Representantes</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Permite que los padres envíen observaciones sobre textos o materiales de este grado</p>
              </div>
              <input
                type="checkbox"
                v-model="modalForm.allow_suggestions"
                class="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <!-- Items Editor Table -->
            <div class="border-t border-slate-200 dark:border-white/10 pt-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white">Artículos de la Lista ({{ modalForm.items.length }})</span>
                <button
                  @click="addEmptyItem"
                  type="button"
                  class="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-600 dark:text-brand-gold font-bold hover:bg-amber-500/20"
                >
                  + Agregar Artículo
                </button>
              </div>

              <div class="max-h-60 overflow-y-auto space-y-2 pr-1">
                <div
                  v-for="(it, idx) in modalForm.items"
                  :key="idx"
                  class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
                >
                  <select v-model="it.category" class="px-2 py-1 rounded bg-white dark:bg-slate-900 border text-[11px] w-28">
                    <option value="textbook">Texto Sugerido</option>
                    <option value="notebook">Libreta / Cuaderno</option>
                    <option value="stationery">Útil / Papelería</option>
                    <option value="art">Arte / Foami</option>
                    <option value="hygiene">Aseo Personal</option>
                  </select>

                  <input
                    v-model="it.quantity"
                    type="text"
                    placeholder="Cant."
                    class="w-16 px-2 py-1 rounded bg-white dark:bg-slate-900 border text-[11px]"
                  />

                  <input
                    v-model="it.item_name"
                    type="text"
                    placeholder="Nombre del útil o libro"
                    required
                    class="flex-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border text-[11px]"
                  />

                  <input
                    v-model="it.specification"
                    type="text"
                    placeholder="Editorial / Detalle"
                    class="w-32 px-2 py-1 rounded bg-white dark:bg-slate-900 border text-[11px]"
                  />

                  <button
                    @click="removeItem(idx)"
                    type="button"
                    class="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/10">
              <button
                @click="closeEditModal"
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm"
              >
                {{ saving ? 'Guardando...' : 'Guardar Lista' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: CLONE SUPPLY LIST -->
    <Teleport to="body">
      <div
        v-if="isCloneModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs"
        @click.self="isCloneModalOpen = false"
      >
        <div class="bg-white dark:bg-[#150d30] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl">
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Clonar Lista de Útiles</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Duplica todos los artículos de <span class="font-bold text-amber-600">{{ activeList?.grade_name }}</span> para un nuevo año escolar en un solo clic.
          </p>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Año Escolar Destino</label>
              <input
                v-model="cloneTargetYear"
                type="text"
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                placeholder="ej. 2027-2028"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 mt-6">
            <button
              @click="isCloneModalOpen = false"
              type="button"
              class="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              @click="executeClone"
              :disabled="cloning"
              class="px-4 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 shadow-sm"
            >
              {{ cloning ? 'Clonando...' : 'Confirmar Clonación' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: ADMIN SUGGESTIONS REVIEW & 1-CLICK INCORPORATION -->
    <Teleport to="body">
      <div
        v-if="isSuggestionsModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        @click.self="isSuggestionsModalOpen = false"
      >
        <div class="bg-white dark:bg-[#150d30] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl p-6">
          <div class="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4 mb-4">
            <div>
              <div class="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-brand-gold uppercase tracking-wider">
                <span>Gestión de Sugerencias</span>
                <span>•</span>
                <span>{{ activeList?.grade_name }}</span>
              </div>
              <h3 class="text-lg font-black font-display text-slate-900 dark:text-white">
                Sugerencias y Observaciones Recibidas
              </h3>
            </div>
            <button @click="isSuggestionsModalOpen = false" class="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg cursor-pointer">✕</button>
          </div>

          <!-- Filter tabs -->
          <div class="flex items-center gap-2 mb-4 border-b border-slate-200/60 dark:border-white/10 pb-3">
            <button
              v-for="st in [
                { id: 'all', label: 'Todas' },
                { id: 'pending', label: 'Pendientes' },
                { id: 'accepted', label: 'Aceptadas' },
                { id: 'discarded', label: 'Descartadas' }
              ]"
              :key="st.id"
              @click="suggestionsFilter = st.id"
              :class="suggestionsFilter === st.id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              {{ st.label }}
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="loadingSuggestions" class="py-12 text-center text-xs text-slate-400">
            Cargando sugerencias...
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredSuggestions.length === 0" class="py-12 text-center text-xs text-slate-400">
            No hay sugerencias en esta categoría para la lista actual.
          </div>

          <!-- Suggestions List -->
          <div v-else class="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
            <div
              v-for="sug in filteredSuggestions"
              :key="sug.id"
              class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ sug.user_name }}</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-slate-600 dark:text-slate-300">
                      {{ sug.user_role }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ sug.user_email }} • {{ formatDate(sug.created_at) }}</p>
                </div>

                <!-- Status Badge -->
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  :class="[
                    sug.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    sug.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                    sug.status === 'reviewed' ? 'bg-sky-500/10 text-sky-600 border border-sky-500/20' :
                    'bg-slate-200 dark:bg-white/10 text-slate-500'
                  ]"
                >
                  {{ sug.status === 'pending' ? '🟡 Pendiente' : sug.status === 'accepted' ? '🟢 Aceptada' : sug.status === 'reviewed' ? '🔵 Revisada' : '⚪ Descartada' }}
                </span>
              </div>

              <!-- Item info & suggestion text -->
              <div class="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 text-xs">
                <div v-if="sug.suggested_item_name" class="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <span>📌 Artículo:</span>
                  <span class="text-amber-600 dark:text-brand-gold">{{ sug.suggested_item_name }}</span>
                  <span class="text-[10px] text-slate-400 font-normal">({{ sug.suggested_category }})</span>
                </div>
                <p class="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{{ sug.suggestion_text }}"
                </p>
                <p v-if="sug.admin_notes" class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                  ✓ Nota de Coordinación: {{ sug.admin_notes }}
                </p>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center justify-end gap-2 pt-1">
                <!-- 1-Click Incorporation Button -->
                <button
                  v-if="sug.status !== 'accepted'"
                  @click="incorporateSuggestion(sug)"
                  :disabled="incorporatingId === sug.id"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  title="Crea automáticamente el ítem en la lista oficial de útiles y marca como aceptada"
                >
                  <span v-if="incorporatingId === sug.id" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span v-else>➕</span>
                  <span>Incorporar a Lista Oficial</span>
                </button>

                <button
                  v-if="sug.status === 'pending'"
                  @click="updateSuggestionStatus(sug.id, 'reviewed')"
                  type="button"
                  class="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10 cursor-pointer"
                >
                  Marcar Revisada
                </button>

                <button
                  v-if="sug.status !== 'discarded'"
                  @click="updateSuggestionStatus(sug.id, 'discarded')"
                  type="button"
                  class="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()
const config = useRuntimeConfig()

// State
const loading = ref(true)
const lists = ref([])
const activeListId = ref(null)
const selectedLevel = ref('media_general')
const checklistMode = ref(true)
const checklistFilter = ref('all')
const boughtItemIds = ref({})

// Modals
const isEditModalOpen = ref(false)
const isCloneModalOpen = ref(false)
const isSuggestionsModalOpen = ref(false)
const saving = ref(false)
const cloning = ref(false)
const cloneTargetYear = ref('2027-2028')

// Suggestions state
const suggestionsList = ref([])
const suggestionsFilter = ref('all')
const loadingSuggestions = ref(false)
const suggestionForm = ref({
  suggested_item_name: '',
  suggested_category: 'stationery',
  suggestion_text: ''
})
const sendingSuggestion = ref(false)
const suggestionSentSuccess = ref(false)
const incorporatingId = ref(null)

const modalForm = ref({
  id: null,
  grade_level: '',
  grade_name: '',
  education_level: 'media_general',
  academic_year_name: '2026-2027',
  title: '',
  general_notes: '',
  delivery_instructions: '',
  is_published: true,
  allow_suggestions: true,
  items: []
})

const levels = [
  { id: 'preescolar', label: 'Educación Inicial', icon: '🎈' },
  { id: 'primaria', label: 'Primaria', icon: '🎒' },
  { id: 'media_general', label: 'Media General', icon: '🎓' }
]

const canManage = computed(() => {
  const role = authStore.userRole || authStore.user?.role
  return ['admin', 'coordinator', 'control_estudio', 'teacher'].includes(role)
})

const pendingSuggestionsCount = computed(() => {
  return activeList.value?.suggestions_meta?.pending || 0
})

const currentUserName = computed(() => {
  if (authStore?.user) {
    const u = authStore.user
    return u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.name || u.email)
  }
  return 'Representante'
})

const currentUserRole = computed(() => {
  return authStore?.user?.role || 'parent'
})

const currentUserRoleLabel = computed(() => {
  const roles = {
    admin: 'Administrador',
    director: 'Director',
    coordinator: 'Coordinador',
    teacher: 'Docente',
    parent: 'Representante',
    student: 'Estudiante',
    staff: 'Personal Administrativo'
  }
  return roles[currentUserRole.value] || 'Representante'
})

// Fetch all supply lists from backend
const fetchSupplyLists = async () => {
  loading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/supply-lists`)
    lists.value = Array.isArray(data) ? data : (data.data || [])

    // Set default active list to 3er Año if available
    if (lists.value.length > 0) {
      const thirdYear = lists.value.find(l => l.grade_level === 'secundaria_3')
      activeListId.value = thirdYear ? thirdYear.id : lists.value[0].id
    }
  } catch (err) {
    console.error('Error fetching supply lists:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSupplyLists()
  loadBoughtState()
})

const filteredLists = computed(() => {
  return lists.value.filter(l => l.education_level === selectedLevel.value)
})

watch(selectedLevel, () => {
  const firstInLevel = filteredLists.value[0]
  if (firstInLevel) {
    activeListId.value = firstInLevel.id
  }
})

const activeList = computed(() => {
  return lists.value.find(l => l.id === activeListId.value) || null
})

const activeItems = computed(() => {
  return activeList.value?.items || []
})

// Categorized items
const textbooks = computed(() => {
  return activeItems.value.filter(i => i.category === 'textbook')
})

const notebooks = computed(() => {
  return activeItems.value.filter(i => i.category === 'notebook')
})

const stationeryAndMaterials = computed(() => {
  return activeItems.value.filter(i => i.category === 'stationery' || i.category === 'art')
})

const stationeryCol1 = computed(() => {
  const items = stationeryAndMaterials.value
  const half = Math.ceil(items.length / 2)
  return items.slice(0, half)
})

const stationeryCol2 = computed(() => {
  const items = stationeryAndMaterials.value
  const half = Math.ceil(items.length / 2)
  return items.slice(half)
})

const hygieneAndOther = computed(() => {
  return activeItems.value.filter(i => i.category === 'hygiene' || i.category === 'other')
})

// Shopping Checklist Storage
const loadBoughtState = () => {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem('santa_luisa_bought_supplies')
      if (stored) {
        boughtItemIds.value = JSON.parse(stored)
      }
    } catch (_) {}
  }
}

const saveBoughtState = () => {
  if (import.meta.client) {
    try {
      localStorage.setItem('santa_luisa_bought_supplies', JSON.stringify(boughtItemIds.value))
    } catch (_) {}
  }
}

const isItemBought = (itemId) => {
  return Boolean(boughtItemIds.value[itemId])
}

const toggleItemBought = (itemId) => {
  boughtItemIds.value[itemId] = !boughtItemIds.value[itemId]
  saveBoughtState()
}

const boughtCount = computed(() => {
  return activeItems.value.filter(i => isItemBought(i.id)).length
})

const boughtPercentage = computed(() => {
  if (activeItems.value.length === 0) return 0
  return Math.round((boughtCount.value / activeItems.value.length) * 100)
})

// Print trigger
const triggerPrint = () => {
  window.print()
}

// Modal actions
const openCreateModal = () => {
  modalForm.value = {
    id: null,
    grade_level: selectedLevel.value === 'media_general' ? 'secundaria_4' : 'primaria_2',
    grade_name: '',
    education_level: selectedLevel.value,
    academic_year_name: '2026-2027',
    title: '',
    general_notes: 'TODOS LOS ÚTILES DEBEN ESTAR DEBIDAMENTE FORRADOS E IDENTIFICADOS CON NOMBRE, APELLIDO Y AÑO.',
    delivery_instructions: '',
    is_published: true,
    allow_suggestions: true,
    items: [
      { category: 'stationery', quantity: '1', item_name: 'Caja de lápices', specification: 'Grafito HB' },
      { category: 'notebook', quantity: '1', item_name: 'Cuaderno empastado', specification: 'Una línea' }
    ]
  }
  isEditModalOpen.value = true
}

const openEditModal = () => {
  if (!activeList.value) return
  modalForm.value = {
    id: activeList.value.id,
    grade_level: activeList.value.grade_level,
    grade_name: activeList.value.grade_name,
    education_level: activeList.value.education_level,
    academic_year_name: activeList.value.academic_year_name,
    title: activeList.value.title,
    general_notes: activeList.value.general_notes,
    delivery_instructions: activeList.value.delivery_instructions,
    is_published: activeList.value.is_published,
    allow_suggestions: activeList.value.allow_suggestions !== false,
    items: JSON.parse(JSON.stringify(activeList.value.items || []))
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const addEmptyItem = () => {
  modalForm.value.items.push({
    category: 'stationery',
    quantity: '1',
    item_name: '',
    specification: '',
    is_mandatory: true
  })
}

const removeItem = (index) => {
  modalForm.value.items.splice(index, 1)
}

const saveSupplyList = async () => {
  saving.value = true
  try {
    const isEdit = Boolean(modalForm.value.id)
    const url = isEdit
      ? `${config.public.apiBase}/supply-lists/${modalForm.value.id}`
      : `${config.public.apiBase}/supply-lists`

    const method = isEdit ? 'PATCH' : 'POST'

    const saved = await $fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: modalForm.value
    })

    toast.success(isEdit ? 'Lista actualizada con éxito' : 'Lista creada con éxito')
    await fetchSupplyLists()
    activeListId.value = saved.id
    closeEditModal()
  } catch (err) {
    toast.error('Error al guardar lista', err.data?.message || err.message)
  } finally {
    saving.value = false
  }
}

const openCloneModal = () => {
  isCloneModalOpen.value = true
}

const executeClone = async () => {
  if (!activeList.value) return
  cloning.value = true
  try {
    const cloned = await $fetch(`${config.public.apiBase}/supply-lists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: {
        action: 'clone',
        source_list_id: activeList.value.id,
        target_academic_year: cloneTargetYear.value
      }
    })
    toast.success(`Lista clonada exitosamente para el año ${cloneTargetYear.value}`)
    await fetchSupplyLists()
    activeListId.value = cloned.id
    isCloneModalOpen.value = false
  } catch (err) {
    toast.error('Error al clonar lista', err.data?.message || err.message)
  } finally {
    cloning.value = false
  }
}

// Admin Toggle: Allow Suggestions
const toggleAllowSuggestions = async () => {
  if (!activeList.value) return
  const currentVal = activeList.value.allow_suggestions !== false
  const newVal = !currentVal
  try {
    await $fetch(`${config.public.apiBase}/supply-lists/${activeList.value.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: {
        allow_suggestions: newVal
      }
    })
    activeList.value.allow_suggestions = newVal
    toast.success(newVal ? 'Buzón de sugerencias abierto para esta lista' : 'Buzón de sugerencias cerrado para esta lista')
  } catch (err) {
    console.error('Error toggling suggestions:', err)
    toast.error('Error', 'No se pudo actualizar el estado del buzón')
  }
}

// Open Suggestions Management Modal
const openSuggestionsModal = async () => {
  isSuggestionsModalOpen.value = true
  await fetchSuggestions()
}

const fetchSuggestions = async () => {
  if (!activeList.value) return
  loadingSuggestions.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/supply-suggestions`, {
      params: {
        list_id: activeList.value.id
      }
    })
    suggestionsList.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err) {
    console.error('Error fetching suggestions:', err)
  } finally {
    loadingSuggestions.value = false
  }
}

const filteredSuggestions = computed(() => {
  if (suggestionsFilter.value === 'all') return suggestionsList.value
  return suggestionsList.value.filter(s => s.status === suggestionsFilter.value)
})

// Submit Suggestion as Parent
const submitSuggestion = async () => {
  if (!activeList.value || !suggestionForm.value.suggestion_text.trim()) return
  sendingSuggestion.value = true
  try {
    await $fetch(`${config.public.apiBase}/supply-suggestions`, {
      method: 'POST',
      headers: authStore?.token ? { Authorization: `Bearer ${authStore.token}` } : {},
      body: {
        list_id: activeList.value.id,
        suggested_item_name: suggestionForm.value.suggested_item_name,
        suggested_category: suggestionForm.value.suggested_category,
        suggestion_text: suggestionForm.value.suggestion_text,
        user_name: currentUserName.value,
        user_email: authStore?.user?.email || null,
        user_role: currentUserRole.value,
        user_id: authStore?.user?.id || null
      }
    })
    suggestionSentSuccess.value = true
    suggestionForm.value = {
      suggested_item_name: '',
      suggested_category: 'stationery',
      suggestion_text: ''
    }
    if (activeList.value.suggestions_meta) {
      activeList.value.suggestions_meta.pending++
      activeList.value.suggestions_meta.total++
    }
  } catch (err) {
    console.error('Error enviando sugerencia:', err)
    toast.error('Error al enviar sugerencia', err.data?.message || err.message)
  } finally {
    sendingSuggestion.value = false
  }
}

// 1-Click Incorporation into Official Supply List
const incorporateSuggestion = async (sug) => {
  incorporatingId.value = sug.id
  try {
    await $fetch(`${config.public.apiBase}/supply-suggestions/${sug.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: {
        action: 'incorporate'
      }
    })
    toast.success('¡Artículo incorporado exitosamente a la lista oficial!')
    await fetchSupplyLists()
    await fetchSuggestions()
  } catch (err) {
    console.error('Error incorporando sugerencia:', err)
    toast.error('Error', err.data?.message || 'No se pudo incorporar el artículo')
  } finally {
    incorporatingId.value = null
  }
}

// Update Status
const updateSuggestionStatus = async (sugId, newStatus) => {
  try {
    await $fetch(`${config.public.apiBase}/supply-suggestions/${sugId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: {
        status: newStatus
      }
    })
    toast.success(`Estado actualizado a ${newStatus}`)
    await fetchSuggestions()
    await fetchSupplyLists()
  } catch (err) {
    console.error('Error actualizando estado:', err)
    toast.error('Error al actualizar estado')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch (_) {
    return dateStr
  }
}
</script>

<style>
@media print {
  @page {
    size: letter portrait;
    margin: 12mm 15mm;
  }
  body {
    background-color: white !important;
    color: black !important;
  }
  .print\:hidden {
    display: none !important;
  }
  #printable-supply-list {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    width: 100% !important;
  }
}
</style>
