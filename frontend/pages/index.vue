<template>
  <div></div>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isLoggedIn) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/auth/login')
  }
})
</script>
