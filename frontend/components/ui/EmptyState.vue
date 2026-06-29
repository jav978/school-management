<template>
  <div class="text-center py-12">
    <div class="text-6xl mb-4">{{ icon }}</div>
    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-6">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📭'
  },
  title: {
    type: String,
    default: 'No hay datos'
  },
  message: {
    type: String,
    default: 'No se encontraron registros para mostrar.'
  }
})
</script>
