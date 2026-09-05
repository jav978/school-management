<template>
  <div class="space-y-6">

    <!-- 1. Top KPI Row (4 Cards) - Perfectly Aligned Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
      
      <!-- Students KPI with Gender Breakdown -->
      <div class="glass-card rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {{ t('students') }}
            </p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
              1,260
            </h3>
          </div>
          <NuxtLink 
            to="/students" 
            class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
            title="Ver Estudiantes"
          >
            <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Gender Breakdown Submetrics (Requested by User) -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div class="flex items-center justify-between text-[11px] font-bold mb-1.5">
            <span class="text-sky-600 dark:text-brand-secondary flex items-center gap-1">
              <span>♂</span> Masc: 693 (55%)
            </span>
            <span class="text-amber-600 dark:text-brand-gold flex items-center gap-1">
              <span>♀</span> Fem: 567 (45%)
            </span>
          </div>
          <!-- Dual Bar Indicator -->
          <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div class="h-full bg-brand-secondary" style="width: 55%" title="Masculino: 55%"></div>
            <div class="h-full bg-brand-gold" style="width: 45%" title="Femenino: 45%"></div>
          </div>
        </div>
      </div>

      <!-- Teachers KPI -->
      <div class="glass-card rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {{ t('teachers') }}
            </p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
              224
            </h3>
          </div>
          <NuxtLink 
            to="/teachers" 
            class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
            title="Ver Profesores"
          >
            <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </NuxtLink>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 100% Cátedras activas
          </span>
          <span>32 Especialistas</span>
        </div>
      </div>

      <!-- Parents KPI -->
      <div class="glass-card rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {{ t('parents') }}
            </p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
              840
            </h3>
          </div>
          <NuxtLink 
            to="/parents" 
            class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
            title="Ver Padres"
          >
            <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </NuxtLink>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span class="text-brand-purple dark:text-brand-secondary">Familias activas</span>
          <span>Año 2025-2026</span>
        </div>
      </div>

      <!-- Earnings KPI -->
      <div class="glass-card rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {{ t('earnings') }}
            </p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
              $54,000
            </h3>
          </div>
          <NuxtLink 
            to="/finance" 
            class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
            title="Ver Finanzas"
          >
            <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </NuxtLink>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span class="text-emerald-600 dark:text-emerald-400 font-extrabold">+8.4% vs mes anterior</span>
          <span class="text-slate-400">94.2% meta</span>
        </div>
      </div>

    </div>

    <!-- 2. Middle Row: Earnings Bar Chart (8 cols) & Students Gender Ratio (4 cols) - Sincronizadas a 420px de altura -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- Earnings Chart Card (8 cols) -->
      <div class="lg:col-span-8 glass-card rounded-3xl p-6 shadow-xs flex flex-col justify-between h-[420px]">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {{ t('earnings') }} & Gastos Operativos
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-gold/15 text-amber-700 dark:text-brand-gold border border-brand-gold/30">
                  Año 2025-2026
                </span>
              </div>
              <!-- Year Selector -->
              <div class="relative inline-block mt-1">
                <select 
                  v-model="selectedYear"
                  class="text-xs font-bold text-slate-500 bg-transparent outline-none cursor-pointer pr-4 hover:text-brand-primary dark:hover:text-white transition-colors"
                >
                  <option value="2024">Año Escolar 2024-2025 ⌵</option>
                  <option value="2025">Año Escolar 2025-2026 ⌵</option>
                  <option value="2026">Año Escolar 2026-2027 ⌵</option>
                </select>
              </div>
            </div>

            <!-- Legend & Actions with institutional colors -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-3 text-xs font-bold">
                <span class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <span class="w-3 h-3 rounded-full bg-brand-gold shadow-xs"></span>
                  {{ t('earnings') }}
                </span>
                <span class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <span class="w-3 h-3 rounded-full bg-brand-purple shadow-xs"></span>
                  {{ t('expanse') }}
                </span>
              </div>

              <NuxtLink to="/finance" class="p-1.5 text-slate-400 hover:text-brand-primary dark:hover:text-white transition-colors" title="Ver detalle financiero">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- Bar Chart SVG Container -->
          <div class="mt-6 h-60 flex">
            <!-- Y-Axis Labels -->
            <div class="flex flex-col justify-between text-[11px] font-bold text-slate-400 dark:text-slate-400 pr-3 pb-6 select-none">
              <span>$50k</span>
              <span>$40k</span>
              <span>$30k</span>
              <span>$20k</span>
              <span>$10k</span>
              <span>$0</span>
            </div>

            <!-- Bars & Grid -->
            <div class="flex-1 flex flex-col justify-between relative">
              <!-- Horizontal Grid Lines -->
              <div class="absolute inset-x-0 top-0 border-b border-slate-100 dark:border-slate-800/60"></div>
              <div class="absolute inset-x-0 top-[20%] border-b border-slate-100 dark:border-slate-800/60"></div>
              <div class="absolute inset-x-0 top-[40%] border-b border-slate-100 dark:border-slate-800/60"></div>
              <div class="absolute inset-x-0 top-[60%] border-b border-slate-100 dark:border-slate-800/60"></div>
              <div class="absolute inset-x-0 top-[80%] border-b border-slate-100 dark:border-slate-800/60"></div>
              <div class="absolute inset-x-0 bottom-6 border-b-2 border-slate-200 dark:border-slate-700"></div>

              <!-- Bars Area -->
              <div class="flex-1 flex items-end justify-between px-1 sm:px-2 pb-6 z-10">
                <div 
                  v-for="(item, idx) in monthlyData" 
                  :key="idx" 
                  class="flex flex-col items-center gap-1 group relative cursor-pointer"
                >
                  <!-- Paired Bars -->
                  <div class="flex items-end gap-1.5 h-44">
                    <!-- Brand Gold Bar: Earnings -->
                    <div 
                      class="w-2.5 sm:w-3 bg-brand-gold rounded-t-full transition-all duration-300 hover:brightness-110 shadow-xs" 
                      :style="{ height: `${item.earnings}%` }"
                      :title="`Ingresos: $${item.earnings * 600}`"
                    ></div>
                    <!-- Brand Purple Bar: Expense -->
                    <div 
                      class="w-2.5 sm:w-3 bg-brand-purple rounded-t-full transition-all duration-300 hover:brightness-125 shadow-xs" 
                      :style="{ height: `${item.expanse}%` }"
                      :title="`Gastos: $${item.expanse * 600}`"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- X-Axis Month Labels -->
              <div class="flex justify-between px-1 sm:px-2 text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase">
                <span v-for="(m, i) in monthNames" :key="i" class="w-5 text-center">{{ m }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span>Promedio mensual: <strong class="text-slate-900 dark:text-white">$45,200</strong></span>
          <span class="text-brand-purple dark:text-brand-secondary font-bold">Balance positivo en curso</span>
        </div>
      </div>

      <!-- Students Gender Ratio Card (4 cols) - Sincronizada a 420px de altura -->
      <div class="lg:col-span-4 glass-card rounded-3xl p-6 shadow-xs flex flex-col justify-between h-[420px]">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display">
              Matrícula por Género
            </h3>
            <p class="text-xs text-slate-400">Total: 1,260 alumnos matriculados</p>
          </div>
          <NuxtLink to="/students" class="text-slate-400 hover:text-brand-primary dark:hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Concentric Radial Gauge Chart with Brand Colors -->
        <div class="my-2 relative flex items-center justify-center">
          <div class="relative w-48 h-48 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-110" viewBox="0 0 120 120">
              <!-- Background Track Rings -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" class="text-slate-100 dark:text-slate-800/80" stroke-width="7" stroke-dasharray="240" stroke-dashoffset="60" stroke-linecap="round" />
              <circle cx="60" cy="60" r="37" fill="none" stroke="currentColor" class="text-slate-100 dark:text-slate-800/80" stroke-width="7" stroke-dasharray="190" stroke-dashoffset="50" stroke-linecap="round" />
              
              <!-- Outer Ring: Female (Brand Gold 45%) -->
              <circle 
                cx="60" cy="60" r="48" 
                fill="none" 
                stroke="#f7c301" 
                stroke-width="7" 
                stroke-dasharray="301" 
                stroke-dashoffset="165" 
                stroke-linecap="round" 
              />
              <circle cx="108" cy="60" r="4" fill="#f7c301" />

              <!-- Inner Ring: Male (Brand Secondary Celeste 55%) -->
              <circle 
                cx="60" cy="60" r="37" 
                fill="none" 
                stroke="#38bdf8" 
                stroke-width="7" 
                stroke-dasharray="232" 
                stroke-dashoffset="104" 
                stroke-linecap="round" 
              />
              <circle cx="97" cy="60" r="4" fill="#38bdf8" />
            </svg>

            <!-- Center Avatar Icon -->
            <div class="absolute w-16 h-16 rounded-full bg-brand-primary/10 dark:bg-brand-purple/20 flex flex-col items-center justify-center text-brand-primary dark:text-brand-secondary shadow-inner border border-brand-primary/20 dark:border-brand-secondary/30">
              <span class="text-lg font-black">🎓</span>
              <span class="text-[10px] font-extrabold uppercase">1.2k</span>
            </div>
          </div>
        </div>

        <!-- Legend & Absolute Numbers -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-brand-secondary shadow-xs"></span>
              Masculino (♂)
            </span>
            <span class="text-slate-900 dark:text-white font-extrabold">693 (55%)</span>
          </div>

          <div class="flex items-center justify-between text-xs font-bold">
            <span class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-brand-gold shadow-xs"></span>
              Femenino (♀)
            </span>
            <span class="text-slate-900 dark:text-white font-extrabold">567 (45%)</span>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. Bottom Row: Notice Board (8 cols) & Event Calendar / Community (4 cols) - Sincronizadas y Alineadas -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- Notice Board Section (8 cols) -->
      <div class="lg:col-span-8 glass-card rounded-3xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display">
                {{ t('noticeBoard') }}
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Circulares oficiales y comunicados de la U.E Santa Luisa
              </p>
            </div>
            <NuxtLink to="/communication" class="text-xs font-bold text-brand-primary dark:text-brand-secondary hover:underline">
              Ver todos →
            </NuxtLink>
          </div>

          <!-- Notices List -->
          <div class="mt-5 divide-y divide-slate-100 dark:divide-slate-800/60">
            <div 
              v-for="(item, idx) in noticeList" 
              :key="idx" 
              class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 rounded-2xl px-2.5 transition-all"
            >
              <!-- Left: Image Thumbnail & Title -->
              <div class="flex items-center gap-3.5 min-w-0">
                <img 
                  :src="item.image" 
                  :alt="item.title" 
                  class="w-12 h-12 rounded-xl object-cover shadow-xs flex-shrink-0 border border-slate-200 dark:border-slate-700"
                />
                <div class="min-w-0">
                  <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate hover:text-brand-primary dark:hover:text-brand-gold cursor-pointer transition-colors">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center gap-2.5 mt-1">
                    <!-- Date Badge with Brand Accent -->
                    <span class="px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-amber-800 dark:text-brand-gold text-[10px] font-extrabold">
                      {{ item.date }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-semibold">• Dirección Académica</span>
                  </div>
                </div>
              </div>

              <!-- Right: View Counter & Action -->
              <div class="flex items-center gap-4 justify-end flex-shrink-0">
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <span class="text-brand-gold text-sm">👁</span>
                  <span class="text-slate-600 dark:text-slate-300">{{ item.views }}</span>
                </div>
                <NuxtLink to="/communication" class="text-slate-400 hover:text-brand-primary p-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Actualizado en tiempo real por Secretaría General</span>
          <span class="font-bold text-brand-primary dark:text-brand-secondary">4 comunicados activos</span>
        </div>
      </div>

      <!-- Right Column (4 cols): Event Calendar & Join Community Card -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        
        <!-- School Calendar Card -->
        <div class="glass-card rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold font-display text-slate-900 dark:text-white">
                {{ t('eventCalendar') }}
              </h3>
              <span class="text-xs font-bold text-brand-gold">Año 2025-2026</span>
            </div>

            <!-- Tab Switcher -->
            <div class="mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-1">
              <button 
                @click="calendarTab = 'dayToDay'"
                :class="calendarTab === 'dayToDay' ? 'bg-brand-primary text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="flex-1 py-1.5 text-xs rounded-xl transition-all text-center"
              >
                {{ t('dayToDay') }}
              </button>
              <button 
                @click="calendarTab = 'socialMedia'"
                :class="calendarTab === 'socialMedia' ? 'bg-brand-primary text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="flex-1 py-1.5 text-xs rounded-xl transition-all text-center"
              >
                Efemérides
              </button>
            </div>

            <!-- Month & Nav Header -->
            <div class="mt-5 flex items-center justify-between px-1">
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Septiembre 2026</span>
              <div class="flex items-center gap-1 text-slate-400">
                <button class="p-1 hover:text-brand-primary dark:hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button class="p-1 hover:text-brand-primary dark:hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Days Grid -->
            <div class="mt-3">
              <!-- Weekday Headers -->
              <div class="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span>LU</span>
                <span>MA</span>
                <span>MI</span>
                <span>JU</span>
                <span>VI</span>
                <span>SA</span>
                <span>DO</span>
              </div>

              <!-- Days Matrix -->
              <div class="grid grid-cols-7 gap-y-1.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span></span>
                <span class="py-1">01</span>
                <span class="py-1">02</span>
                <span class="py-1">03</span>
                <span class="py-1">04</span>
                <span class="py-1">05</span>
                <span class="py-1">06</span>

                <span class="py-1">07</span>
                <span class="py-1">08</span>
                <span class="py-1">09</span>
                <span class="py-1">10</span>
                <span class="py-1">11</span>
                <span class="py-1">12</span>
                <span class="py-1">13</span>

                <span class="py-1">14</span>
                <!-- Active Day: 15 Inicio de Clases en Dorado/Azul -->
                <span class="py-1">
                  <span class="w-6 h-6 rounded-full bg-brand-gold text-slate-900 font-extrabold flex items-center justify-center mx-auto shadow-xs">
                    15
                  </span>
                </span>
                <span class="py-1">16</span>
                <span class="py-1">17</span>
                <span class="py-1">18</span>
                <span class="py-1">19</span>
                <span class="py-1">20</span>

                <span class="py-1">21</span>
                <span class="py-1">22</span>
                <span class="py-1">23</span>
                <span class="py-1">24</span>
                <span class="py-1">25</span>
                <span class="py-1">26</span>
                <span class="py-1">27</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-brand-gold">
            <span>⭐ 15 Sep: Inicio del 1er Lapso</span>
          </div>
        </div>

        <!-- Community Card (Rediseñada con los colores de docs/global.css) -->
        <div class="bg-gradient-to-br from-brand-primary via-brand-purple to-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
          <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-brand-gold/15 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
              Comunidad Vicenciana
            </span>
            <h3 class="text-base font-black text-white mt-2 leading-snug font-display">
              {{ t('joinCommunityTitle') }}
            </h3>
            <p class="text-xs text-slate-200 mt-1.5 leading-relaxed">
              {{ t('joinCommunityDesc') }}
            </p>

            <div class="mt-4">
              <NuxtLink 
                to="/communication"
                class="inline-block px-5 py-2 bg-brand-gold text-slate-950 text-xs font-black rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95"
              >
                {{ t('exploreNow') }} →
              </NuxtLink>
            </div>
          </div>

          <!-- Bottom Avatars Decoration -->
          <div class="mt-5 flex items-center justify-between pt-2 border-t border-white/10">
            <div class="flex -space-x-2 overflow-hidden">
              <img class="inline-block h-7 w-7 rounded-full ring-2 ring-brand-purple" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="" />
              <img class="inline-block h-7 w-7 rounded-full ring-2 ring-brand-purple" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="" />
              <img class="inline-block h-7 w-7 rounded-full ring-2 ring-brand-purple" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=80" alt="" />
              <div class="h-7 w-7 rounded-full ring-2 ring-brand-purple bg-brand-gold text-slate-950 flex items-center justify-center text-[10px] font-black">
                +1.2k
              </div>
            </div>

            <span class="text-xl">🇻🇪 🎓</span>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const selectedYear = ref('2025')
const calendarTab = ref('dayToDay')

// Month abbreviations
const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Monthly paired bars data: Earnings (brand-gold) vs Expanse (brand-purple)
const monthlyData = [
  { earnings: 78, expanse: 64 }, // Ene
  { earnings: 55, expanse: 30 }, // Feb
  { earnings: 72, expanse: 62 }, // Mar
  { earnings: 88, expanse: 25 }, // Abr
  { earnings: 58, expanse: 50 }, // May
  { earnings: 32, expanse: 20 }, // Jun
  { earnings: 45, expanse: 48 }, // Jul
  { earnings: 82, expanse: 40 }, // Ago
  { earnings: 92, expanse: 55 }, // Sep (Inicio clases)
  { earnings: 60, expanse: 35 }, // Oct
  { earnings: 74, expanse: 48 }, // Nov
  { earnings: 85, expanse: 60 }  // Dic
]

// Mock notice items for Santa Luisa
const noticeList = [
  {
    title: 'Cronograma de Entrega de Boletas del 1er Lapso Pedagógico',
    date: '18 Dic, 2026',
    views: '12.4k',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Normativa sobre el uso del uniforme y carnet estudiantil institucional',
    date: '12 Ene, 2026',
    views: '8.1k',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Conmemoración del Natalicio de Santa Luisa de Marillac y Semana Vicenciana',
    date: '15 Mar, 2026',
    views: '9.8k',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Apertura de inscripciones para actividades extracurriculares y robótica',
    date: '02 Feb, 2026',
    views: '6.5k',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120'
  }
]
</script>
