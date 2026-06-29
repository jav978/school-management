<template>
  <div class="min-h-screen bg-gray-100">
    <ui-sidebar />
    <div class="ml-64">
      <ui-header
        :title="pageTitle"
        :userName="userName"
        :userRole="userRole"
        :userInitials="userInitials"
        :notifications="notifications"
        @profile="handleProfile"
        @settings="handleSettings"
        @logout="handleLogout"
      />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
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

const handleProfile = () => {
  navigateTo('/profile')
}

const handleSettings = () => {
  navigateTo('/settings')
}

const handleLogout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}
</script>
