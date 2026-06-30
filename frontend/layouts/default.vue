<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 flex font-sans transition-colors duration-200">
    <!-- Sidebar - Desktop (Always visible) & Mobile (Slide-over drawer) -->
    <div 
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-50 w-64 lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out'
      ]"
    >
      <layout-sidebar @close="isSidebarOpen = false" />
    </div>

    <!-- Backdrop overlay for mobile drawer -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 z-40 bg-slate-900/30 dark:bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 min-h-screen">
      <layout-header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-[1800px] w-full mx-auto">
        <slot />
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


