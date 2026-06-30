<template>
  <header class="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 dark:border-slate-900 transition-colors duration-200">
    <div class="flex items-center justify-between px-4 sm:px-6 py-[21px]">
      <div class="flex items-center gap-3">
        <!-- Hamburger menu button (Visible only on mobile) -->
        <button 
          @click="$emit('toggle-sidebar')" 
          type="button" 
          class="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-100 active:scale-95 transition-all"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 class="text-lg sm:text-xl font-bold font-display text-slate-800 dark:text-slate-100">{{ pageTitle }}</h2>
      </div>

      <div class="flex items-center space-x-3 sm:space-x-4">
        <!-- Buscador General -->
        <div class="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Buscar en el sistema..." 
            class="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-250 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 w-64"
          />
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Theme Toggle Switch -->
        <button 
          @click="toggleTheme" 
          class="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
          title="Cambiar tema"
        >
          <svg v-if="$colorMode.preference === 'dark'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Notifications button -->
        <button class="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="notifications > 0" class="absolute top-1 right-1 bg-emerald-500 ring-2 ring-white dark:ring-slate-950 text-[10px] text-white dark:text-slate-950 font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {{ notifications }}
          </span>
        </button>

        <div class="h-6 w-[1px] bg-slate-100 dark:bg-slate-900"></div>

        <!-- User Profile Menu -->
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-xl flex items-center justify-center">
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-xs">{{ userInitials }}</span>
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{{ userName }}</p>
            <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500 capitalize">{{ userRole }}</p>
          </div>
          <button 
            @click="logout" 
            class="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 active:scale-95 transition-all"
            title="Cerrar sesión"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/students': 'Gestión de Estudiantes',
    '/teachers': 'Gestión de Profesores',
    '/grades': 'Calificaciones',
    '/attendance': 'Control de Asistencia',
    '/schedules': 'Horarios',
    '/finance': 'Gestión Financiera',
    '/communication': 'Comunicación',
    '/reports': 'Reportes'
  }
  return titles[route.path] || 'School Management'
})

const userName = computed(() => authStore.user?.name || 'Usuario')
const userRole = computed(() => authStore.user?.role || 'admin')
const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
const notifications = ref(3)

const logout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}

const colorMode = useColorMode()
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
