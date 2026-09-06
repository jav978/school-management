<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#0c081e] text-slate-800 dark:text-slate-100 flex font-sans transition-colors duration-300">
    <!-- Sidebar - Desktop (Always visible) & Mobile (Slide-over drawer) -->
    <div 
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-50 w-64 lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out h-full flex-shrink-0'
      ]"
    >
      <layout-sidebar @close="isSidebarOpen = false" />
    </div>

    <!-- Backdrop overlay for mobile drawer -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <layout-header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div class="max-w-[1720px] mx-auto w-full flex-1">
          <slot />
        </div>

        <!-- Global Institutional Footer (Captura 2) -->
        <footer class="mt-10 pt-6 pb-2 border-t border-slate-200/80 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden flex-shrink-0">
          <div class="max-w-[1720px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p class="font-medium">
              © 2026 <strong class="text-slate-800 dark:text-slate-200">U.E Santa Luisa</strong> • Todos los derechos reservados • <span class="font-mono text-[10px] bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 rounded font-bold">Licencia MIT</span>
            </p>
            <p class="font-medium">
              Desarrollado por <strong class="text-amber-700 dark:text-brand-gold font-bold">José Vásquez</strong> (<a href="mailto:jvasquez978@gmail.com" class="hover:underline font-mono text-slate-600 dark:text-slate-300">jvasquez978@gmail.com</a>)
            </p>
          </div>
        </footer>
      </main>
    </div>

    <!-- Global Institutional Toast Notifications -->
    <ui-toast />
  </div>
</template>

<script setup>
const isSidebarOpen = ref(false)

// Close sidebar on route change in mobile mode
const route = useRoute()
watch(() => route.path, () => {
  isSidebarOpen.value = false
})
</script>


