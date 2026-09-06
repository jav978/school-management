<template>
  <header class="bg-white/95 dark:bg-[#120b29]/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
    <div class="max-w-[1720px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-4">
      
      <!-- Left: Mobile Menu & Clean Branding on mobile -->
      <div class="flex items-center gap-3">
        <button 
          @click="$emit('toggle-sidebar')" 
          type="button" 
          class="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100 active:scale-95 transition-all cursor-pointer"
          title="Abrir menú"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="lg:hidden w-8 h-8 rounded-lg bg-white dark:bg-white/10 p-0.5 border border-slate-200 dark:border-white/15 flex items-center justify-center flex-shrink-0 shadow-xs">
          <img src="/logocolegio.png" alt="U.E Santa Luisa" class="w-full h-full object-contain" />
        </div>
      </div>

      <!-- Center-Left: Aligned Search Bar -->
      <div class="flex-1 max-w-md mr-auto">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="t('searchPlaceholder') || 'Buscar estudiantes, materias, cédulas...'" 
            class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-[#1a1238] border border-slate-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 transition-all shadow-xs"
          />
        </div>
      </div>

      <!-- Right: Actions, Language, Messages, Notifications, Profile (Perfect Horizontal Alignment) -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        
        <!-- Language Switcher (EN / ES) -->
        <div class="relative" ref="langDropdownRef">
          <button 
            @click="toggleLangDropdown"
            type="button" 
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-xs transition-all border border-slate-200 dark:border-white/10 shadow-xs cursor-pointer"
            title="Seleccionar idioma / Select language"
          >
            <svg class="w-4 h-4 text-amber-600 dark:text-brand-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <!-- Dark / Light Mode Switcher -->
        <button 
          @click="toggleTheme" 
          type="button" 
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-brand-gold active:scale-95 transition-all border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer"
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

        <!-- Messages Button & Dropdown -->
        <div class="relative" ref="messagesDropdownRef">
          <button 
            @click="toggleMessagesDropdown"
            type="button" 
            class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-white transition-all border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer"
            title="Bandeja de Mensajes y Correo"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span v-if="unreadMessagesCount > 0" class="absolute -top-1 -right-1 bg-amber-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {{ unreadMessagesCount }}
            </span>
          </button>

          <!-- Messages Popover -->
          <div 
            v-if="isMessagesOpen" 
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1a1238] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-3 z-50 animate-fade-in"
          >
            <div class="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Mensajería Institucional</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-brand-gold">
                  {{ unreadMessagesCount }} nuevos
                </span>
              </div>
              <button 
                @click="markAllMessagesRead" 
                class="text-[11px] text-amber-600 dark:text-brand-gold hover:underline font-bold cursor-pointer"
              >
                Marcar leídos
              </button>
            </div>

            <div class="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto">
              <div 
                v-for="msg in messagesList" 
                :key="msg.id" 
                class="p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3"
                :class="{ 'bg-amber-50/40 dark:bg-white/[0.02]': !msg.read }"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {{ msg.senderInitials }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{{ msg.sender }}</p>
                    <span class="text-[10px] text-slate-400">{{ msg.time }}</span>
                  </div>
                  <p class="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">{{ msg.subject }}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{{ msg.preview }}</p>
                </div>
              </div>
            </div>

            <div class="pt-2 px-4 border-t border-slate-100 dark:border-white/10 text-center">
              <NuxtLink 
                to="/communication" 
                @click="isMessagesOpen = false"
                class="text-xs font-bold text-amber-600 dark:text-brand-gold hover:underline block py-1"
              >
                Ver todos los mensajes en Comunicación →
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Notifications Button & Dropdown -->
        <div class="relative" ref="notificationsDropdownRef">
          <button 
            @click="toggleNotificationsDropdown"
            type="button" 
            class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-white transition-all border border-slate-200/60 dark:border-white/10 shadow-xs cursor-pointer"
            title="Centro de Notificaciones y Alertas"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadNotificationsCount > 0" class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {{ unreadNotificationsCount }}
            </span>
          </button>

          <!-- Notifications Popover -->
          <div 
            v-if="isNotificationsOpen" 
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1a1238] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-3 z-50 animate-fade-in"
          >
            <div class="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Alertas del Plantel</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                  {{ unreadNotificationsCount }} pendientes
                </span>
              </div>
              <button 
                @click="markAllNotificationsRead" 
                class="text-[11px] text-rose-500 hover:underline font-bold cursor-pointer"
              >
                Limpiar alertas
              </button>
            </div>

            <div class="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto">
              <div 
                v-for="notif in notificationsList" 
                :key="notif.id" 
                class="p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3"
                :class="{ 'bg-rose-50/40 dark:bg-white/[0.02]': !notif.read }"
              >
                <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0" :class="notif.iconBg">
                  {{ notif.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ notif.title }}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{{ notif.desc }}</p>
                  <span class="text-[10px] text-slate-400 block mt-1">{{ notif.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-1"></div>

        <!-- User Profile Avatar & Interactive Dropdown -->
        <div class="relative" ref="profileDropdownRef">
          <button 
            @click="toggleProfileDropdown"
            type="button"
            class="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            title="Menú de cuenta y usuario"
          >
            <!-- Avatar with Initials Fallback -->
            <div class="relative">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-amber-500/70 dark:border-brand-gold shadow-xs bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs sm:text-sm select-none">
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
                to="/settings" 
                @click="isProfileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mi Perfil</span>
              </NuxtLink>

              <NuxtLink 
                to="/settings" 
                @click="isProfileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Configuración</span>
              </NuxtLink>

              <NuxtLink 
                to="/documentation" 
                @click="isProfileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Documentación del Sistema</span>
              </NuxtLink>
            </div>

            <div class="pt-1 border-t border-slate-100 dark:border-white/10">
              <button 
                @click="handleLogout"
                type="button"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useLanguage } from '~/composables/useLanguage'

const authStore = useAuthStore()
const { currentLang, setLanguage, t } = useLanguage()
const colorMode = useColorMode()

const searchQuery = ref('')
const isLangOpen = ref(false)
const isMessagesOpen = ref(false)
const isNotificationsOpen = ref(false)
const isProfileOpen = ref(false)
const avatarError = ref(false)

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

// User details and initials computation
const userDisplayName = computed(() => {
  if (authStore.user?.first_name || authStore.user?.last_name) {
    return `${authStore.user.first_name || ''} ${authStore.user.last_name || ''}`.trim()
  }
  return authStore.user?.name || 'Steven Jhon'
})

const userEmail = computed(() => {
  return authStore.user?.email || 'director@santaluisa.edu.ve'
})

const userRoleName = computed(() => {
  const r = authStore.userRole || authStore.user?.role || 'admin'
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
}

onMounted(() => {
  applyThemeToDom(colorMode.value)
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleGlobalClick)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleGlobalClick)
  }
})
</script>
