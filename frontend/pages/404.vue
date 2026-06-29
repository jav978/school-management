<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Página no encontrada</p>
      <NuxtLink to="/" class="btn-primary">
        Volver al Inicio
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>
