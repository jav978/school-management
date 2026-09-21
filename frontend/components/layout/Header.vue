<template>
  <header class="bg-white/95 dark:bg-[#120b29]/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
    <div class="max-w-[1720px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-4">
      
      <!-- Left: Mobile Menu & Clean Branding on mobile -->
      <div class="flex items-center gap-2.5">
        <button 
          @click="$emit('toggle-sidebar')" 
          type="button" 
          class="lg:hidden w-10 h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-slate-200/60 dark:border-white/10 shadow-xs"
          title="Abrir menú"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="lg:hidden w-10 h-10 rounded-xl bg-white dark:bg-white/10 p-1 border border-slate-200 dark:border-white/15 flex items-center justify-center flex-shrink-0 shadow-xs">
          <img :src="resolvePhotoUrl(institution.logo_url) || '/logocolegio.png'" :alt="institution.name || 'U.E Santa Luisa'" class="w-full h-full object-contain" />
        </div>
      </div>

      <!-- Center-Left: Aligned Search Bar with Omnisearch (Desktop / Tablet) -->
      <div class="hidden sm:block flex-1 max-w-md mr-auto relative" ref="searchContainerRef">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            ref="desktopSearchInputRef"
            v-model="searchQuery" 
            @focus="isDesktopSearchFocused = true"
            type="text" 
            data-testid="header-omnisearch-input"
            :placeholder="t('searchPlaceholder', 'Buscar alumnos, cédulas, materias, módulos... (Ctrl+K)')" 
            class="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 transition-all shadow-xs"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd class="hidden md:inline-block font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-300/50 dark:border-white/10">
              ⌘K
            </kbd>
          </div>
        </div>

        <!-- Desktop Omnisearch Results Dropdown -->
        <div 
          v-if="isDesktopSearchFocused && searchQuery.trim().length >= 1"
          class="absolute top-full left-0 mt-2 w-full max-w-lg bg-white dark:bg-[#1a1238] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-3 z-50 animate-fade-in overflow-hidden"
        >
          <div class="px-4 pb-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span class="flex items-center gap-1.5">
              <span>⚡</span>
              <span>Búsqueda Inteligente Omnisearch</span>
            </span>
            <span class="text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-brand-gold px-2 py-0.5 rounded-full font-bold">
              {{ searchResults.total }} resultado{{ searchResults.total !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 p-1.5">
            <!-- Módulos del Sistema -->
            <div v-if="searchResults.modules.length > 0" class="py-1">
              <p class="px-3 py-1 text-[10px] font-black text-amber-700 dark:text-brand-gold uppercase tracking-wider">
                Módulos del Sistema
              </p>
              <button
                v-for="item in searchResults.modules"
                :key="item.id"
                @mousedown.prevent="handleSelectSearchResult(item)"
                class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-base flex-shrink-0">{{ item.icon }}</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-brand-gold">
                      {{ item.title }}
                    </p>
                    <p class="text-[10px] text-slate-400 truncate">{{ item.subtitle }}</p>
                  </div>
                </div>
                <span class="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">Ir →</span>
              </button>
            </div>

            <!-- Estudiantes -->
            <div v-if="searchResults.students.length > 0" class="py-1">
              <p class="px-3 py-1 text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Estudiantes Matriculados
              </p>
              <button
                v-for="item in searchResults.students"
                :key="item.id"
                @mousedown.prevent="handleSelectSearchResult(item)"
                class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {{ item.icon }}
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      {{ item.title }}
                    </p>
                    <p class="text-[10px] text-slate-400 truncate font-mono">{{ item.subtitle }}</p>
                  </div>
                </div>
                <span class="text-[10px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md flex-shrink-0">
                  Ver Alumno
                </span>
              </button>
            </div>

            <!-- Docentes -->
            <div v-if="searchResults.teachers.length > 0" class="py-1">
              <p class="px-3 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Cuerpo Docente
              </p>
              <button
                v-for="item in searchResults.teachers"
                :key="item.id"
                @mousedown.prevent="handleSelectSearchResult(item)"
                class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {{ item.icon }}
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {{ item.title }}
                    </p>
                    <p class="text-[10px] text-slate-400 truncate">{{ item.subtitle }}</p>
                  </div>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md flex-shrink-0">
                  Ver Docente
                </span>
              </button>
            </div>

            <!-- Sin resultados -->
            <div v-if="searchResults.total === 0" class="p-6 text-center text-xs text-slate-400">
              <p class="text-lg mb-1">🔍</p>
              <p class="font-bold text-slate-600 dark:text-slate-300">Sin coincidencias para "{{ searchQuery }}"</p>
              <p class="text-[11px] mt-0.5">Prueba buscando por nombre, cédula (V-...), materia o módulo.</p>
            </div>
          </div>

          <div class="px-4 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Resultados instantáneos de la U.E Santa Luisa</span>
            <span>Esc para cerrar</span>
          </div>
        </div>
      </div>

      <!-- Right: Actions & Profile - Ultra clean on mobile (no overflow) -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        
        <!-- Mobile Search Toggle Button (Shows on mobile only) -->
        <button 
          @click="isSearchMobileOpen = true"
          type="button" 
          class="sm:hidden w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-brand-gold active:scale-95 transition-all border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer flex items-center justify-center flex-shrink-0"
          title="Buscar en el sistema"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <!-- Language Switcher (EN / ES) - Desktop/Tablet Only -->
        <div class="hidden md:block relative" ref="langDropdownRef">
          <button 
            @click="toggleLangDropdown"
            type="button" 
            class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-brand-gold active:scale-95 transition-all border border-slate-200/60 dark:border-white/10 shadow-xs flex items-center gap-1.5 cursor-pointer font-bold text-xs"
            title="Cambiar idioma del sistema"
          >
            <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="uppercase font-extrabold text-[11px]">{{ (currentLang || 'es').toUpperCase() }}</span>
            <svg class="w-3 h-3 text-slate-400 transition-transform" :class="{ 'rotate-180': isLangOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Language Dropdown -->
          <div 
            v-if="isLangOpen" 
            class="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1a1238] rounded-2xl shadow-xl border border-slate-200 dark:border-white/15 py-1.5 z-50 text-xs font-medium animate-fade-in"
          >
            <button 
              @click="changeLang('es')" 
              class="w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
              :class="currentLang === 'es' ? 'text-amber-600 dark:text-brand-gold font-bold' : 'text-slate-600 dark:text-slate-300'"
            >
              <span>Español (ES)</span>
              <span v-if="currentLang === 'es'">✓</span>
            </button>
            <button 
              @click="changeLang('en')" 
              class="w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
              :class="currentLang === 'en' ? 'text-amber-600 dark:text-brand-gold font-bold' : 'text-slate-600 dark:text-slate-300'"
            >
              <span>English (EN)</span>
              <span v-if="currentLang === 'en'">✓</span>
            </button>
          </div>
        </div>

        <!-- Dark / Light Mode Switcher - Desktop / Tablet Only -->
        <button 
          @click="toggleTheme" 
          type="button" 
          class="hidden sm:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-brand-gold active:scale-95 transition-all border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer items-center justify-center"
          :title="colorMode.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <!-- Sun icon when dark -->
          <svg v-if="colorMode.value === 'dark'" class="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon when light -->
          <svg v-else class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- System Feedback Button - Desktop Only -->
        <button 
          @click="openFeedback('general')"
          type="button" 
          class="hidden md:flex p-2 sm:px-2.5 sm:py-2 rounded-xl text-amber-600 dark:text-brand-gold bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition-all border border-amber-500/20 shadow-xs items-center gap-1.5 cursor-pointer font-bold text-xs"
          title="Calificar la plataforma y enviar sugerencias"
        >
          <span class="text-xs">⭐</span>
          <span class="inline text-[11px] font-bold">Feedback</span>
        </button>

        <!-- Messages Button & Dropdown - Desktop Only -->
        <div class="hidden sm:block relative" ref="messagesDropdownRef">
          <button 
            @click="toggleMessagesDropdown"
            type="button" 
            class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-brand-gold active:scale-95 transition-all relative border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer"
            title="Mensajes y Correspondencia Escolar"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span 
              data-testid="header-mail-badge"
              class="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 bg-amber-500 text-slate-950 font-black text-[10.5px] rounded-full flex items-center justify-center border-2 border-white dark:border-[#120b29] shadow-xs animate-pulse leading-none"
            >
              1
            </span>
          </button>

          <!-- Messages Dropdown -->
          <div 
            v-if="isMessagesOpen" 
            class="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white dark:bg-[#1a1238] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-3 z-50 animate-fade-in"
          >
            <div class="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 dark:text-white text-xs font-display">{{ t('recentMessages', 'Mensajes Recientes') }}</span>
                <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-brand-gold">1 {{ t('newMessages', 'nuevo') }}</span>
              </div>
              <NuxtLink to="/communication" @click="isMessagesOpen = false" class="text-[11px] font-bold text-amber-600 dark:text-brand-gold hover:underline">
                {{ t('viewAll', 'Ver todos') }}
              </NuxtLink>
            </div>

            <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              <div 
                v-for="msg in messagesList" 
                :key="msg.id"
                class="p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {{ msg.senderInitials }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ msg.sender }}</p>
                    <span class="text-[10px] text-slate-400 font-medium">{{ msg.time }}</span>
                  </div>
                  <p class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 truncate">{{ msg.subject }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">{{ msg.preview }}</p>
                </div>
              </div>
            </div>

            <div class="pt-2 px-3 border-t border-slate-100 dark:border-white/10 text-center">
              <NuxtLink 
                to="/communication" 
                @click="isMessagesOpen = false"
                class="inline-block w-full py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-brand-gold dark:hover:text-slate-950 text-slate-700 dark:text-white text-xs font-bold transition-all text-center"
              >
                {{ t('mailbox', 'Ir al Buzón Escolar') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Notifications Bell & Dropdown -->
        <div class="relative" ref="notificationsDropdownRef">
          <button 
            @click="toggleNotificationsDropdown"
            type="button" 
            class="w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-brand-gold active:scale-95 transition-all relative border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer flex items-center justify-center flex-shrink-0"
            title="Notificaciones y Alertas Escolares"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span 
              data-testid="header-bell-badge"
              class="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 bg-rose-500 text-white font-black text-[10.5px] rounded-full flex items-center justify-center border-2 border-white dark:border-[#120b29] shadow-xs animate-pulse leading-none"
            >
              3
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div 
            v-if="isNotificationsOpen" 
            class="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white dark:bg-[#1a1238] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-3 z-50 animate-fade-in"
          >
            <div class="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 dark:text-white text-xs font-display">{{ t('institutionalAlerts', 'Alertas Institucionales') }}</span>
                <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">3 {{ t('pendingAlerts', 'pendientes') }}</span>
              </div>
              <button class="text-[11px] font-bold text-amber-600 dark:text-brand-gold hover:underline cursor-pointer">
                {{ t('markAsRead', 'Marcar leídas') }}
              </button>
            </div>

            <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              <div 
                v-for="notif in notificationsList" 
                :key="notif.id"
                class="p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start"
              >
                <div 
                  class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-xs"
                  :class="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400': notif.type === 'grade',
                    'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-brand-gold': notif.type === 'attendance',
                    'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400': notif.type === 'circular'
                  }"
                >
                  <svg v-if="notif.type === 'grade'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="notif.type === 'attendance'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ notif.title }}</p>
                    <span class="text-[10px] text-slate-400 font-medium">{{ notif.time }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{{ notif.text }}</p>
                </div>
              </div>
            </div>

            <div class="pt-2 px-3 border-t border-slate-100 dark:border-white/10 text-center">
              <NuxtLink 
                to="/communication" 
                @click="isNotificationsOpen = false"
                class="inline-block w-full py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-brand-gold dark:hover:text-slate-950 text-slate-700 dark:text-white text-xs font-bold transition-all text-center"
              >
                Ver Todas las Alertas
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Student Selector for Parents (Representante) -->
        <div v-if="currentRole === 'parent' && representedStudents.length > 0" class="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 dark:bg-brand-gold/10 border border-amber-500/30 dark:border-brand-gold/30 rounded-2xl shadow-xs">
          <span class="text-[10px] font-black uppercase text-amber-700 dark:text-brand-gold tracking-wider">
            Hijo:
          </span>
          <div class="flex items-center gap-1">
            <button
              v-for="student in representedStudents"
              :key="student.id"
              @click="setActiveStudent(student.key)"
              type="button"
              class="flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="activeStudentKey === student.key 
                ? 'bg-amber-500 text-slate-950 dark:bg-brand-gold dark:text-slate-950 shadow-xs scale-105' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-amber-500/20 dark:hover:bg-brand-gold/20'"
            >
              <img 
                :src="student.avatar" 
                :alt="student.first_name" 
                class="w-4 h-4 rounded-full object-cover border border-slate-950/20"
                @error="student.avatar = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'"
              />
              <span>{{ student.first_name }}</span>
              <span class="text-[10px] font-normal opacity-80">({{ student.grade }})</span>
            </button>
          </div>
        </div>

        <div v-if="currentRole === 'parent'" class="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

        <!-- User Profile Avatar & Interactive Dropdown -->
        <div class="relative" ref="profileDropdownRef">
          <button 
            @click.stop="toggleProfileDropdown"
            type="button"
            data-testid="header-user-menu-btn"
            class="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            title="Menú de cuenta y usuario"
          >
            <!-- Avatar with Initials Fallback -->
            <div class="relative flex items-center justify-center">
              <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500/70 dark:border-brand-gold shadow-xs bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs sm:text-sm select-none flex-shrink-0">
                <img 
                  v-if="userAvatarUrl && !avatarError" 
                  :src="userAvatarUrl" 
                  :alt="userDisplayName" 
                  class="w-full h-full object-cover"
                  @error="avatarError = true"
                />
                <span v-else>{{ userInitials }}</span>
              </div>
            </div>

            <!-- Name and Role (Desktop) -->
            <div class="hidden sm:block text-left">
              <p class="text-xs font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                <span>{{ userDisplayName }}</span>
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </p>
              <p class="text-[10px] font-bold text-amber-600 dark:text-brand-gold uppercase tracking-wider">
                {{ userRoleName }}
              </p>
            </div>
          </button>

          <!-- User Profile Dropdown Menu -->
          <div 
            v-if="isProfileOpen" 
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1238] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-2 z-50 animate-fade-in text-xs"
          >
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-slate-100 dark:border-white/10">
              <p class="font-bold text-slate-900 dark:text-white text-sm">{{ userDisplayName }}</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{{ userEmail }}</p>
              <span class="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-brand-gold border border-amber-300/60 dark:border-amber-700/40">
                {{ userRoleName }}
              </span>
            </div>

            <!-- Menu Navigation Links -->
            <div class="py-1">
              <NuxtLink 
                to="/profile" 
                @click="isProfileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mi Perfil</span>
              </NuxtLink>

              <!-- Only show Configuración for Admin / Coordinator -->
              <NuxtLink 
                v-if="['admin', 'coordinator'].includes(currentRole)"
                to="/settings" 
                @click="isProfileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ t('settings', 'Configuración') }}</span>
              </NuxtLink>

              <NuxtLink 
                to="/documentation" 
                @click="isProfileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{{ t('documentation', 'Documentación del Sistema') }}</span>
              </NuxtLink>
            </div>

            <!-- Mobile-only Quick Controls (Language, Dark Mode, Feedback, Messages) -->
            <div class="sm:hidden py-1 border-t border-slate-100 dark:border-white/10">
              <p class="px-4 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Accesos Rápidos
              </p>

              <!-- Dark / Light Mode Toggle -->
              <button 
                @click="toggleTheme" 
                type="button" 
                class="w-full flex items-center justify-between px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <span class="text-base">{{ colorMode.value === 'dark' ? '☀️' : '🌙' }}</span>
                  <span>{{ colorMode.value === 'dark' ? 'Modo Claro' : 'Modo Oscuro' }}</span>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                  {{ colorMode.value === 'dark' ? 'Activo: Oscuro' : 'Activo: Claro' }}
                </span>
              </button>

              <!-- Language Switch -->
              <button 
                @click="changeLang(currentLang === 'es' ? 'en' : 'es')" 
                type="button" 
                class="w-full flex items-center justify-between px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <span class="text-base">🌐</span>
                  <span>Idioma / Language</span>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-brand-gold uppercase">
                  {{ (currentLang || 'es').toUpperCase() }}
                </span>
              </button>

              <!-- Feedback -->
              <button 
                @click="isProfileOpen = false; openFeedback('mobile')" 
                type="button" 
                class="w-full flex items-center gap-3 px-4 py-2.5 text-amber-600 dark:text-brand-gold hover:bg-amber-500/10 font-bold transition-colors cursor-pointer"
              >
                <span class="text-base">⭐</span>
                <span>Calificar y Enviar Feedback</span>
              </button>

              <!-- Messages Shortcut -->
              <NuxtLink 
                to="/communication" 
                @click="isProfileOpen = false"
                class="flex items-center justify-between px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span class="text-base">✉️</span>
                  <span>Mensajes Escolares</span>
                </div>
                <span class="min-w-[18px] h-[18px] px-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center">
                  1
                </span>
              </NuxtLink>
            </div>

            <!-- Logout Link -->
            <div class="py-1 border-t border-slate-100 dark:border-white/10">
              <button 
                @click="handleLogout"
                type="button"
                data-testid="header-logout-btn"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{{ t('logout', 'Cerrar sesión') }}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Expandable Mobile Search Row with Live Omnisearch -->
    <div 
      v-if="isSearchMobileOpen" 
      class="sm:hidden px-3 pb-3 pt-1 border-t border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#120b29]/95 animate-fade-in"
    >
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          autofocus
          data-testid="header-mobile-omnisearch-input"
          :placeholder="t('searchPlaceholder', 'Buscar estudiantes, materias, cédulas...')" 
          class="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-slate-800 dark:text-white placeholder-slate-400 shadow-inner"
        />
        <button 
          @click="isSearchMobileOpen = false" 
          type="button" 
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Live Mobile Omnisearch Results Dropdown -->
      <div 
        v-if="searchQuery.trim().length >= 1" 
        class="mt-2 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 rounded-2xl bg-white dark:bg-[#1a1238] border border-slate-200 dark:border-white/15 p-1.5 shadow-xl"
      >
        <!-- Módulos -->
        <div v-if="searchResults.modules.length > 0" class="py-1">
          <p class="px-2.5 py-1 text-[10px] font-black text-amber-700 dark:text-brand-gold uppercase tracking-wider">
            Módulos del Sistema
          </p>
          <button
            v-for="item in searchResults.modules"
            :key="item.id"
            @click="handleSelectSearchResult(item)"
            class="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-base flex-shrink-0">{{ item.icon }}</span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ item.title }}</p>
                <p class="text-[10px] text-slate-400 truncate">{{ item.subtitle }}</p>
              </div>
            </div>
            <span class="text-xs text-slate-400 flex-shrink-0">Ir →</span>
          </button>
        </div>

        <!-- Estudiantes -->
        <div v-if="searchResults.students.length > 0" class="py-1">
          <p class="px-2.5 py-1 text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Estudiantes Matriculados
          </p>
          <button
            v-for="item in searchResults.students"
            :key="item.id"
            @click="handleSelectSearchResult(item)"
            class="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                {{ item.icon }}
              </span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ item.title }}</p>
                <p class="text-[10px] text-slate-400 truncate font-mono">{{ item.subtitle }}</p>
              </div>
            </div>
            <span class="text-[9px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded-md flex-shrink-0">
              Ver
            </span>
          </button>
        </div>

        <!-- Docentes -->
        <div v-if="searchResults.teachers.length > 0" class="py-1">
          <p class="px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Cuerpo Docente
          </p>
          <button
            v-for="item in searchResults.teachers"
            :key="item.id"
            @click="handleSelectSearchResult(item)"
            class="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                {{ item.icon }}
              </span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ item.title }}</p>
                <p class="text-[10px] text-slate-400 truncate">{{ item.subtitle }}</p>
              </div>
            </div>
            <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md flex-shrink-0">
              Ver
            </span>
          </button>
        </div>

        <!-- Sin resultados -->
        <div v-if="searchResults.total === 0" class="p-4 text-center text-xs text-slate-400">
          <p class="text-base mb-0.5">🔍</p>
          <p class="font-bold text-slate-600 dark:text-slate-300">Sin coincidencias para "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuthStore } from '~/stores/auth'
import { useColorMode } from '#imports'
import { useActiveStudent } from '~/composables/useActiveStudent'
import { useInstitution } from '~/composables/useInstitution'
import { resolvePhotoUrl } from '~/composables/usePhotoUrl'
import { useFeedback } from '~/composables/useFeedback'
import { useOmnisearch } from '~/composables/useOmnisearch'

const { currentLang, setLanguage, t } = useLanguage()
const authStore = useAuthStore()
const colorMode = useColorMode()
const { representedStudents, activeStudentKey, setActiveStudent } = useActiveStudent()
const { institution } = useInstitution()
const { openFeedback } = useFeedback()
const { query: searchQuery, searchResults, preloadIndex, selectResult } = useOmnisearch()

const isDesktopSearchFocused = ref(false)
const searchContainerRef = ref(null)
const desktopSearchInputRef = ref(null)

const isSearchMobileOpen = ref(false)
const isLangOpen = ref(false)
const isMessagesOpen = ref(false)
const isNotificationsOpen = ref(false)
const isProfileOpen = ref(false)
const avatarError = ref(false)

const handleSelectSearchResult = (item) => {
  isDesktopSearchFocused.value = false
  isSearchMobileOpen.value = false
  selectResult(item)
}

const handleGlobalKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (typeof window !== 'undefined' && window.innerWidth >= 640 && desktopSearchInputRef.value) {
      desktopSearchInputRef.value.focus()
      isDesktopSearchFocused.value = true
    } else {
      isSearchMobileOpen.value = true
    }
  } else if (e.key === 'Escape') {
    isDesktopSearchFocused.value = false
    isSearchMobileOpen.value = false
  }
}

const langDropdownRef = ref(null)
const messagesDropdownRef = ref(null)
const notificationsDropdownRef = ref(null)
const profileDropdownRef = ref(null)

// Theme Management
const applyThemeToDom = (theme) => {
  if (typeof document === 'undefined') return
  const isDark = theme === 'dark'
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.style.colorScheme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.style.colorScheme = 'light'
  }
}

const toggleTheme = () => {
  const next = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = next
  applyThemeToDom(next)
}

// User details and initials computation
const userDisplayName = computed(() => {
  if (authStore.user?.full_name) {
    return authStore.user.full_name
  }
  if (authStore.user?.first_name || authStore.user?.last_name) {
    return `${authStore.user.first_name || ''} ${authStore.user.last_name || ''}`.trim()
  }
  if (authStore.user?.name) {
    return authStore.user.name
  }
  if (authStore.user?.username) {
    return authStore.user.username
  }
  return authStore.userRole === 'parent' ? 'Representante' : authStore.userRole === 'teacher' ? 'Docente' : 'Administrador'
})

const userEmail = computed(() => {
  return authStore.user?.email || ''
})

const currentRole = computed(() => {
  return authStore.userRole || authStore.user?.role || ''
})

const userRoleName = computed(() => {
  const r = currentRole.value
  if (r === 'admin') return 'Administrador'
  if (r === 'teacher') return 'Docente Titular'
  if (r === 'coordinator') return 'Coordinador'
  if (r === 'control_estudio') return 'Control de Estudios'
  if (r === 'parent') return 'Representante'
  if (r === 'student') return 'Estudiante'
  return 'Usuario'
})


const userAvatarUrl = computed(() => {
  return authStore.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
})

const userInitials = computed(() => {
  const parts = userDisplayName.value.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return 'SL'
})

// Messages state & handlers
const messagesList = ref([
  {
    id: 1,
    sender: 'Prof. Elena Vargas',
    senderInitials: 'EV',
    subject: 'Planificación de Lapso 2026',
    preview: 'Ya están cargadas las ponderaciones de Matemáticas de 4to Año.',
    time: 'Hace 10 min',
    read: false
  },
  {
    id: 2,
    sender: 'Sra. Carmen Morales',
    senderInitials: 'CM',
    subject: 'Comprobante de Pago #8492',
    preview: 'Adjunto la constancia de transferencia de la mensualidad de Sofía.',
    time: 'Hace 45 min',
    read: false
  },
  {
    id: 3,
    sender: 'Coordinación Pedagógica',
    senderInitials: 'CP',
    subject: 'Consejo Docente Extraordinario',
    preview: 'Convocatoria para el viernes a las 2:00 pm en el Auditorio.',
    time: 'Hace 2 horas',
    read: false
  }
])

const unreadMessagesCount = computed(() => messagesList.value.filter(m => !m.read).length)

const markAllMessagesRead = () => {
  messagesList.value.forEach(m => m.read = true)
}

// Notifications state & handlers
const notificationsList = ref([
  {
    id: 1,
    icon: '📄',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700',
    title: 'Nueva Boleta Emitida',
    desc: 'Boleta de Juan Carlos Pérez (1er Año A) lista para revisión.',
    time: 'Hace 15 min',
    read: false
  },
  {
    id: 2,
    icon: '💳',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700',
    title: 'Pago Conciliado',
    desc: 'Transferencia confirmada por Bs. 1.250 en Tesorería.',
    time: 'Hace 1 hora',
    read: false
  },
  {
    id: 3,
    icon: '⚠️',
    iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700',
    title: 'Alerta de Asistencia',
    desc: '3 inasistencias consecutivas registradas en Química 3er Año.',
    time: 'Hace 3 horas',
    read: false
  }
])

const unreadNotificationsCount = computed(() => notificationsList.value.filter(n => !n.read).length)

const markAllNotificationsRead = () => {
  notificationsList.value.forEach(n => n.read = true)
}

// Dropdown Toggles (Mutually Exclusive)
const toggleLangDropdown = () => {
  isLangOpen.value = !isLangOpen.value
  isMessagesOpen.value = false
  isNotificationsOpen.value = false
  isProfileOpen.value = false
}

const toggleMessagesDropdown = () => {
  isMessagesOpen.value = !isMessagesOpen.value
  isLangOpen.value = false
  isNotificationsOpen.value = false
  isProfileOpen.value = false
}

const toggleNotificationsDropdown = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  isLangOpen.value = false
  isMessagesOpen.value = false
  isProfileOpen.value = false
}

const toggleProfileDropdown = () => {
  isProfileOpen.value = !isProfileOpen.value
  isLangOpen.value = false
  isMessagesOpen.value = false
  isNotificationsOpen.value = false
}

const changeLang = (lang) => {
  setLanguage(lang)
  isLangOpen.value = false
}

const handleLogout = () => {
  isProfileOpen.value = false
  authStore.logout()
  navigateTo('/auth/login')
}

// Global click-outside listener
const handleGlobalClick = (e) => {
  if (langDropdownRef.value && !langDropdownRef.value.contains(e.target)) isLangOpen.value = false
  if (messagesDropdownRef.value && !messagesDropdownRef.value.contains(e.target)) isMessagesOpen.value = false
  if (notificationsDropdownRef.value && !notificationsDropdownRef.value.contains(e.target)) isNotificationsOpen.value = false
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) isProfileOpen.value = false
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target)) isDesktopSearchFocused.value = false
}

onMounted(() => {
  applyThemeToDom(colorMode.value)
  preloadIndex()
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleGlobalClick)
    window.addEventListener('keydown', handleGlobalKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleGlobalClick)
    window.removeEventListener('keydown', handleGlobalKeydown)
  }
})
</script>
