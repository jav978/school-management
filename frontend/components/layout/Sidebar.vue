<template>
  <aside class="h-full w-64 bg-white dark:bg-[#120b29] text-slate-700 dark:text-slate-200 border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between transition-colors duration-200 shadow-sm dark:shadow-2xl">
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Brand Header: U.E Santa Luisa -->
      <div class="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <!-- School Logo Image -->
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-white/10 p-1 flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-200/70 dark:border-white/15 overflow-hidden">
            <img 
              src="/logocolegio.png" 
              alt="Logo U.E Santa Luisa" 
              class="w-full h-full object-contain" 
            />
          </div>
          <div class="flex flex-col min-w-0">
            <h1 class="text-base font-black font-display text-brand-primary dark:text-white tracking-tight leading-tight truncate">
              U.E Santa Luisa
            </h1>
            <span class="text-[10px] font-bold text-slate-400 dark:text-brand-gold uppercase tracking-wider">
              Gestión Escolar
            </span>
          </div>
        </div>
        
        <button 
          @click="$emit('close')" 
          type="button" 
          class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white cursor-pointer"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Menu (Expanded height, clean scrollbar) -->
      <nav class="mt-3 px-3 space-y-1 overflow-y-auto flex-1 pb-4">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-brand-primary dark:hover:text-white transition-all group font-medium text-sm cursor-pointer"
          active-class="bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-brand-gold font-bold shadow-xs border-l-4 border-amber-500 dark:border-brand-gold"
        >
          <div class="flex items-center gap-3">
            <!-- Icon -->
            <span class="text-slate-400 group-hover:text-amber-600 dark:group-hover:text-brand-gold group-[.router-link-active]:text-amber-600 dark:group-[.router-link-active]:text-brand-gold transition-colors">
              <component :is="item.icon" class="w-5 h-5" />
            </span>
            <span>{{ t(item.key) }}</span>
          </div>

          <!-- Active dot indicator -->
          <span 
            v-if="route.path === item.path" 
            class="w-2 h-2 rounded-full bg-amber-500 dark:bg-brand-gold shadow-xs"
          ></span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Institutional Footer with System Version -->
    <div class="p-3.5 border-t border-slate-200/80 dark:border-white/10 text-center flex-shrink-0">
      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Versión 1.0.0</span>
      </p>
    </div>
  </aside>
</template>

<script setup>
import { h, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useLanguage } from '~/composables/useLanguage'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useLanguage()

// SVG icon helpers
const createSvgIcon = (d) => ({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '1.8',
        d
      })
    ])
  }
})

const icons = {
  dashboard: createSvgIcon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'),
  students: createSvgIcon('M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'),
  subjects: createSvgIcon('M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'),
  teachers: createSvgIcon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'),
  parents: createSvgIcon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'),
  account: createSvgIcon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'),
  class: createSvgIcon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
  exam: createSvgIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'),
  grades: createSvgIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'),
  attendance: createSvgIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),
  notice: createSvgIcon('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'),
  reports: createSvgIcon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'),
  classrooms: createSvgIcon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'),
  staff: createSvgIcon('M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
  planning: createSvgIcon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
  boletas: createSvgIcon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'),
  certificates: createSvgIcon('M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'),
  idcards: createSvgIcon('M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2H9.17A3.001 3.001 0 0112 14z'),
  users: createSvgIcon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'),
  documentation: createSvgIcon('M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253')
}

// Full menu with role-based visibility & Reports included
const allMenuItems = [
  { path: '/dashboard', key: 'dashboard', icon: icons.dashboard, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/students', key: 'students', icon: icons.students, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/teachers', key: 'teachers', icon: icons.teachers, roles: ['admin', 'control_estudio', 'coordinator'] },
  { path: '/staff', key: 'staff', icon: icons.staff, roles: ['admin', 'control_estudio', 'coordinator'] },
  { path: '/parents', key: 'parents', icon: icons.parents, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/subjects', key: 'subjects', icon: icons.subjects, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student'] },
  { path: '/classrooms', key: 'classrooms', icon: icons.classrooms, roles: ['admin', 'control_estudio', 'coordinator'] },
  { path: '/schedules', key: 'schedules', icon: icons.class, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/planning', key: 'planning', icon: icons.planning, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/exams', key: 'exams', icon: icons.exam, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/grades', key: 'grades', icon: icons.grades, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/boletas', key: 'boletas', icon: icons.boletas, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/certificates', key: 'certificates', icon: icons.certificates, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/reports', key: 'reports', icon: icons.reports, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/idcards', key: 'idcards', icon: icons.idcards, roles: ['admin', 'control_estudio', 'coordinator'] },
  { path: '/attendance', key: 'attendance', icon: icons.attendance, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/finance', key: 'account', icon: icons.account, roles: ['admin', 'parent'] },
  { path: '/communication', key: 'notice', icon: icons.notice, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/users', key: 'users', icon: icons.users, roles: ['admin'] },
  { path: '/documentation', key: 'documentation', icon: icons.documentation, roles: ['admin', 'control_estudio', 'coordinator'] }
]

const currentRole = computed(() => {
  return authStore.userRole || authStore.user?.role || 'admin'
})

const menuItems = computed(() => {
  return allMenuItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true
    return item.roles.includes(currentRole.value) || currentRole.value === 'admin'
  })
})
</script>
