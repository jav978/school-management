<template>
  <aside class="h-full w-64 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors duration-200">
    <div>
      <!-- Brand & Mobile close button -->
      <div class="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-sm">
            A
          </div>
          <h1 class="text-lg font-black font-display text-slate-850 dark:text-white tracking-wider">
            APOLLO
          </h1>
        </div>
        <button 
          @click="$emit('close')" 
          type="button" 
          class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6 px-3 space-y-7 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div v-if="filteredMainMenu.length">
          <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Principal</p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in filteredMainMenu"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-all group"
              active-class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              <span class="mr-3 text-lg group-hover:scale-110 transition-transform">{{ item.icon }}</span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="filteredAcademicMenu.length">
          <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Académico</p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in filteredAcademicMenu"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-all group"
              active-class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              <span class="mr-3 text-lg group-hover:scale-110 transition-transform">{{ item.icon }}</span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="filteredAdminMenu.length">
          <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Administración</p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in filteredAdminMenu"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-all group"
              active-class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              <span class="mr-3 text-lg group-hover:scale-110 transition-transform">{{ item.icon }}</span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <!-- Footer info -->
    <div class="p-4 border-t border-slate-100 dark:border-slate-800/40 text-center">
      <p class="text-[10px] text-slate-400 dark:text-slate-600 font-medium">v1.0.0 • Gestión Escolar</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const mainMenu = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'teacher', 'student', 'parent'] },
]

const academicMenu = [
  { path: '/students', label: 'Estudiantes', icon: '👨‍🎓', roles: ['admin', 'teacher'] },
  { path: '/teachers', label: 'Profesores', icon: '👨‍🏫', roles: ['admin'] },
  { path: '/grades', label: 'Calificaciones', icon: '📝', roles: ['admin', 'teacher', 'student', 'parent'] },
  { path: '/attendance', label: 'Asistencia', icon: '✅', roles: ['admin', 'teacher', 'student', 'parent'] },
  { path: '/schedules', label: 'Horarios', icon: '📅', roles: ['admin', 'teacher', 'student', 'parent'] },
]

const adminMenu = [
  { path: '/finance', label: 'Finanzas', icon: '💰', roles: ['admin'] },
  { path: '/communication', label: 'Comunicación', icon: '💬', roles: ['admin', 'teacher', 'student', 'parent'] },
  { path: '/reports', label: 'Reportes', icon: '📈', roles: ['admin'] },
]

const filteredMainMenu = computed(() => {
  const role = authStore.userRole
  return mainMenu.filter(item => item.roles.includes(role))
})

const filteredAcademicMenu = computed(() => {
  const role = authStore.userRole
  return academicMenu.filter(item => item.roles.includes(role))
})

const filteredAdminMenu = computed(() => {
  const role = authStore.userRole
  return adminMenu.filter(item => item.roles.includes(role))
})
</script>
