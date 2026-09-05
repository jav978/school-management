<template>
  <div class="space-y-6">

    <!-- 1. Top KPI Row (4 Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Students -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            {{ t('students') }}
          </p>
          <h3 class="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
            1260
          </h3>
        </div>
        <NuxtLink 
          to="/students" 
          class="w-11 h-11 rounded-full bg-[#272F47] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
          title="Ver Estudiantes"
        >
          <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Teachers -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            {{ t('teachers') }}
          </p>
          <h3 class="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
            224
          </h3>
        </div>
        <NuxtLink 
          to="/teachers" 
          class="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Ver Profesores"
        >
          <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Parents -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            {{ t('parents') }}
          </p>
          <h3 class="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
            840
          </h3>
        </div>
        <NuxtLink 
          to="/students" 
          class="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Ver Padres"
        >
          <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Earnings -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            {{ t('earnings') }}
          </p>
          <h3 class="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
            $54000
          </h3>
        </div>
        <NuxtLink 
          to="/finance" 
          class="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Ver Finanzas"
        >
          <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </NuxtLink>
      </div>

    </div>

    <!-- 2. Middle Grid: Earnings Chart & Students Ratio (Left 8 cols) | Event Calendar & Community (Right 4 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Middle Left: Earnings Bar Chart & Students Gender Ratio (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <!-- Earnings Chart Card (8 cols) -->
          <div class="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">
                    {{ t('earnings') }}
                  </h3>
                  <!-- Year Selector -->
                  <div class="relative inline-block mt-0.5">
                    <select 
                      v-model="selectedYear"
                      class="text-xs font-semibold text-slate-500 bg-transparent outline-none cursor-pointer pr-4"
                    >
                      <option value="2023">2023 ⌵</option>
                      <option value="2024">2024 ⌵</option>
                      <option value="2025">2025 ⌵</option>
                    </select>
                  </div>
                </div>

                <!-- Legend & Actions -->
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3 text-xs font-medium">
                    <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span class="w-2.5 h-2.5 rounded-full bg-[#F9956C]"></span>
                      {{ t('earnings') }}
                    </span>
                    <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span class="w-2.5 h-2.5 rounded-full bg-[#2B3353]"></span>
                      {{ t('expanse') }}
                    </span>
                  </div>

                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Bar Chart SVG Container -->
              <div class="mt-6 h-56 flex">
                <!-- Y-Axis Labels -->
                <div class="flex flex-col justify-between text-[11px] font-semibold text-slate-350 dark:text-slate-500 pr-3 pb-6">
                  <span>50k</span>
                  <span>40k</span>
                  <span>30k</span>
                  <span>20k</span>
                  <span>10k</span>
                  <span>0</span>
                </div>

                <!-- Bars & Grid -->
                <div class="flex-1 flex flex-col justify-between relative">
                  <!-- Horizontal Grid Lines -->
                  <div class="absolute inset-x-0 top-0 border-b border-slate-100 dark:border-slate-800/60"></div>
                  <div class="absolute inset-x-0 top-[20%] border-b border-slate-100 dark:border-slate-800/60"></div>
                  <div class="absolute inset-x-0 top-[40%] border-b border-slate-100 dark:border-slate-800/60"></div>
                  <div class="absolute inset-x-0 top-[60%] border-b border-slate-100 dark:border-slate-800/60"></div>
                  <div class="absolute inset-x-0 top-[80%] border-b border-slate-100 dark:border-slate-800/60"></div>
                  <div class="absolute inset-x-0 bottom-6 border-b border-slate-200 dark:border-slate-700"></div>

                  <!-- Bars Area -->
                  <div class="flex-1 flex items-end justify-between px-1 sm:px-2 pb-6 z-10">
                    <div 
                      v-for="(item, idx) in monthlyData" 
                      :key="idx" 
                      class="flex flex-col items-center gap-1 group"
                    >
                      <!-- Paired Bars -->
                      <div class="flex items-end gap-1 h-44">
                        <!-- Orange Bar: Earnings -->
                        <div 
                          class="w-2 sm:w-2.5 bg-[#F9956C] rounded-full transition-all duration-300 hover:brightness-105" 
                          :style="{ height: `${item.earnings}%` }"
                          :title="`Earnings: ${item.earnings * 500}`"
                        ></div>
                        <!-- Slate Blue Bar: Expense -->
                        <div 
                          class="w-2 sm:w-2.5 bg-[#2B3353] rounded-full transition-all duration-300 hover:brightness-125" 
                          :style="{ height: `${item.expanse}%` }"
                          :title="`Expense: ${item.expanse * 500}`"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- X-Axis Month Labels -->
                  <div class="flex justify-between px-1 sm:px-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    <span v-for="(m, i) in monthNames" :key="i" class="w-5 text-center">{{ m }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Students Gender Gauge Card (4 cols) -->
          <div class="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">
                {{ t('students') }}
              </h3>
              <button class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            <!-- Concentric Radial Gauge Chart -->
            <div class="my-6 relative flex items-center justify-center">
              <div class="relative w-44 h-44 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-110" viewBox="0 0 120 120">
                  <!-- Background Track Rings -->
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" class="dark:stroke-slate-800" stroke-width="6" stroke-dasharray="240" stroke-dashoffset="60" stroke-linecap="round" />
                  <circle cx="60" cy="60" r="38" fill="none" stroke="#F1F5F9" class="dark:stroke-slate-800" stroke-width="6" stroke-dasharray="190" stroke-dashoffset="50" stroke-linecap="round" />
                  
                  <!-- Outer Ring: Female (Slate Navy 45%) -->
                  <circle 
                    cx="60" cy="60" r="48" 
                    fill="none" 
                    stroke="#2B3353" 
                    stroke-width="6" 
                    stroke-dasharray="301" 
                    stroke-dashoffset="165" 
                    stroke-linecap="round" 
                  />
                  <!-- Outer Dot on Tip -->
                  <circle cx="108" cy="60" r="3.5" fill="#2B3353" class="transform origin-center" />

                  <!-- Inner Ring: Male (Orange 55%) -->
                  <circle 
                    cx="60" cy="60" r="38" 
                    fill="none" 
                    stroke="#F9956C" 
                    stroke-width="6" 
                    stroke-dasharray="238" 
                    stroke-dashoffset="107" 
                    stroke-linecap="round" 
                  />
                  <!-- Inner Dot on Tip -->
                  <circle cx="98" cy="60" r="3.5" fill="#F9956C" class="transform origin-center" />
                </svg>

                <!-- Center Avatar Icon -->
                <div class="absolute w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-500 shadow-inner">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Legend Percentages -->
            <div class="flex items-center justify-around pt-2 border-t border-slate-50 dark:border-slate-800/60">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#F9956C]"></span>
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {{ t('male') }} <strong class="text-slate-850 dark:text-white">55%</strong>
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#2B3353]"></span>
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {{ t('female') }} <strong class="text-slate-850 dark:text-white">45%</strong>
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- 3. Notice Board Section (Inside main column) -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-850 dark:text-white font-display">
                {{ t('noticeBoard') }}
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ t('noticeBoardSub') }}
              </p>
            </div>
            <button class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>

          <!-- Notices List -->
          <div class="mt-6 divide-y divide-slate-100 dark:divide-slate-800/60">
            <div 
              v-for="(item, idx) in noticeList" 
              :key="idx" 
              class="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-2xl px-2 transition-all"
            >
              <!-- Left: Image Thumbnail & Title -->
              <div class="flex items-center gap-4 min-w-0">
                <img 
                  :src="item.image" 
                  :alt="item.title" 
                  class="w-14 h-14 rounded-2xl object-cover shadow-xs flex-shrink-0"
                />
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate hover:text-orange-600 cursor-pointer transition-colors">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center gap-3 mt-1.5">
                    <!-- Date Badge -->
                    <span class="px-2.5 py-0.5 rounded-full bg-[#FFEADC] dark:bg-orange-950/50 text-[#EA580C] text-[11px] font-bold">
                      {{ item.date }}
                    </span>
                    <!-- Social icons -->
                    <div class="flex items-center gap-1.5 text-slate-350 dark:text-slate-600 text-xs">
                      <span>📸</span>
                      <span>📘</span>
                      <span>💬</span>
                      <span>🐦</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: View Counter & Action -->
              <div class="flex items-center gap-5 justify-end flex-shrink-0">
                <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <span class="text-[#EA580C] text-sm">👁</span>
                  <span class="text-slate-600 dark:text-slate-300">{{ item.views }}</span>
                </div>
                <button class="text-slate-400 hover:text-slate-600 p-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (4 cols): Event Calendar & Join Community Card -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Dark Event Calendar Card -->
        <div class="bg-[#272F47] text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold font-display">
                {{ t('eventCalendar') }}
              </h3>
              <button class="text-slate-400 hover:text-white">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            <!-- Tab Switcher -->
            <div class="mt-4 p-1 bg-[#1F263A] rounded-2xl flex items-center gap-1">
              <button 
                @click="calendarTab = 'dayToDay'"
                :class="calendarTab === 'dayToDay' ? 'bg-[#F9956C] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'"
                class="flex-1 py-2 text-xs rounded-xl transition-all text-center"
              >
                {{ t('dayToDay') }}
              </button>
              <button 
                @click="calendarTab = 'socialMedia'"
                :class="calendarTab === 'socialMedia' ? 'bg-[#F9956C] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'"
                class="flex-1 py-2 text-xs rounded-xl transition-all text-center"
              >
                {{ t('socialMedia') }}
              </button>
            </div>

            <!-- Month & Nav Header -->
            <div class="mt-6 flex items-center justify-between px-1">
              <span class="text-sm font-bold text-slate-200">Feb 2023</span>
              <div class="flex items-center gap-1 text-slate-400">
                <button class="p-1 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button class="p-1 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Days Grid -->
            <div class="mt-4">
              <!-- Weekday Headers -->
              <div class="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span>MO</span>
                <span>TU</span>
                <span>WE</span>
                <span>TH</span>
                <span>FR</span>
                <span>SA</span>
                <span>SU</span>
              </div>

              <!-- Days Matrix -->
              <div class="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-slate-300">
                <!-- Empty padding for Feb 2023 (Starts on Wednesday) -->
                <span></span>
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
                <span class="py-1">15</span>
                <!-- Active Day: 16 in Orange Circle -->
                <span class="py-1">
                  <span class="w-7 h-7 rounded-full bg-[#F9956C] text-white flex items-center justify-center mx-auto shadow-sm">
                    16
                  </span>
                </span>
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
                <span class="py-1">28</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Warm Apricot Community / Promo Card -->
        <div class="bg-[#FFEADA] rounded-3xl p-6 relative overflow-hidden shadow-xs">
          <!-- Text content -->
          <div class="relative z-10">
            <h3 class="text-base font-extrabold text-slate-900 leading-snug font-display">
              {{ t('joinCommunityTitle') }}
            </h3>
            <p class="text-xs text-slate-700 mt-2 leading-relaxed max-w-[260px]">
              {{ t('joinCommunityDesc') }}
            </p>

            <div class="mt-5">
              <button class="px-5 py-2.5 bg-[#23293F] text-white text-xs font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-sm">
                {{ t('exploreNow') }}
              </button>
            </div>
          </div>

          <!-- Bottom Illustrated Avatars decoration -->
          <div class="mt-6 flex items-center justify-between pt-2">
            <div class="flex -space-x-2 overflow-hidden">
              <img class="inline-block h-8 w-8 rounded-full ring-2 ring-[#FFEADA]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="" />
              <img class="inline-block h-8 w-8 rounded-full ring-2 ring-[#FFEADA]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="" />
              <img class="inline-block h-8 w-8 rounded-full ring-2 ring-[#FFEADA]" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=80" alt="" />
              <div class="h-8 w-8 rounded-full ring-2 ring-[#FFEADA] bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                +5k
              </div>
            </div>

            <!-- Stylized Doodle/Art Icon -->
            <div class="text-3xl opacity-80 select-none">
              🎓
            </div>
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

const selectedYear = ref('2023')
const calendarTab = ref('dayToDay')

// Month abbreviations
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Monthly paired bars data: Earnings (orange) vs Expanse (dark navy)
const monthlyData = [
  { earnings: 78, expanse: 64 }, // Jan
  { earnings: 55, expanse: 30 }, // Feb
  { earnings: 72, expanse: 62 }, // Mar
  { earnings: 88, expanse: 25 }, // Apr
  { earnings: 58, expanse: 50 }, // May
  { earnings: 32, expanse: 20 }, // Jun
  { earnings: 45, expanse: 48 }, // Jul
  { earnings: 68, expanse: 56 }, // Aug
  { earnings: 82, expanse: 54 }, // Sep
  { earnings: 48, expanse: 76 }, // Oct
  { earnings: 52, expanse: 60 }, // Nov
  { earnings: 62, expanse: 78 }, // Dec
]

// Notices List matching Image 1
const noticeList = [
  {
    title: 'Inter-school competition (sports/singing/drawing/drama)',
    date: '10 Feb, 2023',
    views: '7k',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Disciplinary action if school discipline is not followed',
    date: '6 Feb, 2023',
    views: '7k',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'School Annual function celebration 2023-24',
    date: '2 Feb, 2023',
    views: '7k',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Returning library books timely (Usually pinned on notice...)',
    date: '31 Jan, 2023',
    views: '7k',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=120'
  }
]
</script>

