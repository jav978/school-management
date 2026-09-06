<template>
  <header class="bg-white/95 dark:bg-[#120b29]/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
    <div class="max-w-[1720px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 gap-4">
      
      <!-- Left: Mobile Menu & Page Title -->
      <div class="flex items-center gap-3 min-w-max">
        <button 
          @click="$emit('toggle-sidebar')" 
          type="button" 
          class="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100 active:scale-95 transition-all"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="lg:hidden w-8 h-8 rounded-lg bg-white dark:bg-white/10 p-0.5 border border-slate-200 dark:border-white/15 flex items-center justify-center flex-shrink-0 shadow-xs">
          <img src="/logocolegio.png" alt="U.E Santa Luisa" class="w-full h-full object-contain" />
        </div>
        <h2 class="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          {{ pageTitle }}
        </h2>
      </div>

      <!-- Center: Search Bar -->
      <div class="hidden md:flex flex-1 max-w-md mx-4">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="t('searchPlaceholder')" 
            class="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 transition-all shadow-xs"
          />
        </div>
      </div>

      <!-- Right: Actions, Language, Badges, Profile -->
      <div class="flex items-center space-x-3 sm:space-x-4">
        
        <!-- Language Switcher (EN / ES) -->
        <div class="relative" ref="langDropdownRef">
          <button 
            @click="isLangOpen = !isLangOpen"
            type="button" 
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-xs transition-all border border-slate-200 dark:border-white/10 shadow-xs"
          >
            <svg class="w-4 h-4 text-brand-purple dark:text-brand-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="uppercase font-bold">{{ currentLang }}</span>
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Language Dropdown -->
          <div 
            v-if="isLangOpen" 
            class="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1a1238] rounded-xl shadow-xl border border-slate-200 dark:border-white/15 py-1 z-50 text-xs font-medium"
          >
            <button 
              @click="changeLang('en')" 
              class="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5"
              :class="currentLang === 'en' ? 'text-brand-primary dark:text-brand-gold font-bold' : 'text-slate-600 dark:text-slate-300'"
            >
              <span>English</span>
              <span v-if="currentLang === 'en'">✓</span>
            </button>
            <button 
              @click="changeLang('es')" 
              class="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5"
              :class="currentLang === 'es' ? 'text-brand-primary dark:text-brand-gold font-bold' : 'text-slate-600 dark:text-slate-300'"
            >
              <span>Español</span>
              <span v-if="currentLang === 'es'">✓</span>
            </button>
          </div>
        </div>

        <!-- Dark / Light Mode Switcher -->
        <button 
          @click="toggleTheme" 
          type="button" 
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-brand-gold active:scale-95 transition-all border border-slate-200/60 dark:border-white/10 shadow-xs"
          :title="colorMode.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <!-- Sun icon when dark -->
          <svg v-if="colorMode.value === 'dark'" class="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon when light -->
          <svg v-else class="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Messages Button (Badge 8) -->
        <button 
          type="button" 
          class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-white transition-all border border-slate-200/60 dark:border-white/10 shadow-xs"
          title="Mensajes"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="absolute -top-0.5 -right-0.5 bg-brand-purple text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            8
          </span>
        </button>

        <!-- Notifications Button (Badge 6) -->
        <button 
          type="button" 
          class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-white transition-all border border-slate-200/60 dark:border-white/10 shadow-xs"
          title="Notificaciones"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute -top-0.5 -right-0.5 bg-brand-red text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            6
          </span>
        </button>

        <div class="h-6 w-[1px] bg-slate-200 dark:border-white/10"></div>

        <!-- User Profile Card (Steven Jhon / Admin) -->
        <div class="flex items-center gap-3 pl-1">
          <div class="relative">
            <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-gold/60 dark:border-brand-gold/80 shadow-xs bg-slate-100 dark:bg-white/10 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
                alt="Steven Jhon" 
                class="w-full h-full object-cover"
                @error="$event.target.style.display='none'"
              />
              <span class="text-brand-primary font-bold text-xs absolute">SJ</span>
            </div>
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-800 dark:text-white leading-tight">Steven Jhon</p>
            <p class="text-[10px] font-bold text-brand-purple dark:text-brand-gold uppercase tracking-wide">{{ t('admin') }}</p>
          </div>

          <!-- Quick logout button -->
          <button 
            @click="logout" 
            class="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition-all ml-1"
            title="Cerrar sesión"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useLanguage } from '~/composables/useLanguage'

const route = useRoute()
const authStore = useAuthStore()
const { currentLang, setLanguage, t } = useLanguage()

const colorMode = useColorMode()

const applyThemeToDom = (theme) => {
  if (typeof document === 'undefined') return
  const isDark = theme === 'dark'
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

const toggleTheme = () => {
  const next = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = next
  applyThemeToDom(next)
}

onMounted(() => {
  applyThemeToDom(colorMode.value)
})

const searchQuery = ref('')
const isLangOpen = ref(false)

const changeLang = (lang) => {
  setLanguage(lang)
  isLangOpen.value = false
}

const pageTitle = computed(() => {
  const p = route.path
  if (p === '/dashboard' || p === '/') return t('dashboard')
  if (p.startsWith('/subjects')) return t('subjects') || 'Materias'
  if (p.startsWith('/students')) return t('students') || 'Estudiantes'
  if (p.startsWith('/teachers')) return t('teachers') || 'Profesores'
  if (p.startsWith('/parents')) return t('parents') || 'Padres'
  if (p.startsWith('/finance')) return t('account') || 'Finanzas'
  if (p.startsWith('/schedules')) return t('schedules') || 'Horarios'
  if (p.startsWith('/grades')) return t('grades') || 'Calificaciones'
  if (p.startsWith('/attendance')) return t('attendance') || 'Asistencias'
  if (p.startsWith('/communication')) return t('notice') || 'Avisos'
  if (p.startsWith('/reports')) return t('reports') || 'Reportes'
  if (p.startsWith('/settings')) return t('settings') || 'Configuración'
  return t('dashboard') || 'Panel'
})

const logout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}
</script>


