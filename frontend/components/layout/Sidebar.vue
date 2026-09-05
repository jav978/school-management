<template>
  <aside class="h-full w-64 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors duration-200">
    <div>
      <!-- Brand Header: U.E Santa Luisa -->
      <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <!-- School Logo Image -->
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-200/70 dark:border-slate-700/60 overflow-hidden">
            <img 
              src="/logocolegio.png" 
              alt="Logo U.E Santa Luisa" 
              class="w-full h-full object-contain" 
            />
          </div>
          <div class="flex flex-col min-w-0">
            <h1 class="text-base font-black font-display text-slate-850 dark:text-white tracking-tight leading-tight truncate">
              U.E Santa Luisa
            </h1>
            <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Gestión Escolar
            </span>
          </div>
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
      <nav class="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center justify-between px-4 py-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all group font-medium text-sm"
          active-class="bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold"
        >
          <div class="flex items-center gap-3.5">
            <!-- Icon -->
            <span class="text-slate-400 group-hover:text-orange-500 group-[.router-link-active]:text-orange-600 transition-colors">
              <component :is="item.icon" class="w-5 h-5" />
            </span>
            <span>{{ t(item.key) }}</span>
          </div>

          <!-- Active dot indicator -->
          <span 
            v-if="route.path === item.path" 
            class="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-xs"
          ></span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Bottom Actions: Settings & Log out -->
    <div class="p-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
      <NuxtLink
        to="/settings"
        class="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all font-medium text-sm group"
        active-class="bg-orange-500/10 text-orange-600 font-bold"
      >
        <span class="text-slate-400 group-hover:text-orange-500 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <span>{{ t('settings') }}</span>
      </NuxtLink>

      <button
        @click="logout"
        type="button"
        class="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all font-medium text-sm group"
      >
        <span class="text-slate-400 group-hover:text-rose-500 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </span>
        <span>{{ t('logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { h } from 'vue'
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
  attendance: createSvgIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),
  notice: createSvgIcon('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'),
  reports: createSvgIcon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z')
}

// Full menu with role-based visibility
const allMenuItems = [
  { path: '/dashboard', key: 'dashboard', icon: icons.dashboard, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/students', key: 'students', icon: icons.students, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/parents', key: 'parents', icon: icons.parents, roles: ['admin', 'control_estudio', 'coordinator', 'teacher'] },
  { path: '/subjects', key: 'subjects', icon: icons.subjects, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student'] },
  { path: '/teachers', key: 'teachers', icon: icons.teachers, roles: ['admin', 'control_estudio', 'coordinator'] },
  { path: '/schedules', key: 'schedules', icon: icons.class, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/grades', key: 'grades', icon: icons.exam, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/attendance', key: 'attendance', icon: icons.attendance, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/finance', key: 'account', icon: icons.account, roles: ['admin', 'parent'] },
  { path: '/communication', key: 'notice', icon: icons.notice, roles: ['admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent'] },
  { path: '/reports', key: 'reports', icon: icons.reports, roles: ['admin', 'control_estudio', 'coordinator'] }
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

const logout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}
</script>

