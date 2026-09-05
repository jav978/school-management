<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex font-sans transition-colors duration-200">
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
      <main class="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
        <div class="max-w-[1720px] mx-auto w-full">
          <slot />
        </div>
      </main>
    </div>
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


