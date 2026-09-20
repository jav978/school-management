<template>
  <nav 
    class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#120b29]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] shadow-lg shadow-black/10 dark:shadow-black/40 transition-colors duration-200 print:hidden"
    aria-label="Navegación inferior móvil"
  >
    <div class="max-w-md mx-auto grid grid-cols-5 items-center justify-around gap-1">
      
      <!-- 1. Inicio / Dashboard -->
      <NuxtLink
        to="/dashboard"
        class="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 group cursor-pointer text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white"
        active-class="!text-amber-600 dark:!text-brand-gold font-bold"
      >
        <div class="relative p-1 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span 
            v-if="route.path === '/dashboard'" 
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-brand-gold"
          ></span>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-0.5">Inicio</span>
      </NuxtLink>

      <!-- 2. Horarios -->
      <NuxtLink
        to="/schedules"
        class="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 group cursor-pointer text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white"
        active-class="!text-amber-600 dark:!text-brand-gold font-bold"
      >
        <div class="relative p-1 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span 
            v-if="route.path.startsWith('/schedules')" 
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-brand-gold"
          ></span>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-0.5">Horarios</span>
      </NuxtLink>

      <!-- 3. Estudiantes -->
      <NuxtLink
        to="/students"
        class="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 group cursor-pointer text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white"
        active-class="!text-amber-600 dark:!text-brand-gold font-bold"
      >
        <div class="relative p-1 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span 
            v-if="route.path.startsWith('/students')" 
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-brand-gold"
          ></span>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-0.5">Alumnos</span>
      </NuxtLink>

      <!-- 4. Materias -->
      <NuxtLink
        to="/subjects"
        class="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 group cursor-pointer text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white"
        active-class="!text-amber-600 dark:!text-brand-gold font-bold"
      >
        <div class="relative p-1 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span 
            v-if="route.path.startsWith('/subjects')" 
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-brand-gold"
          ></span>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-0.5">Materias</span>
      </NuxtLink>

      <!-- 5. Más (Abre el Drawer Completo) -->
      <button
        @click="$emit('open-menu')"
        type="button"
        class="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 group cursor-pointer text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white active:scale-95"
      >
        <div class="p-1 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
        <span class="text-[10px] font-bold tracking-tight mt-0.5">Más</span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineEmits(['open-menu'])
const route = useRoute()
</script>
