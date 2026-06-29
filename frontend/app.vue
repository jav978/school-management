<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>
