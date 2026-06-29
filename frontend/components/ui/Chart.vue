<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 v-if="title" class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="h-64 flex items-center justify-center text-gray-500">
      <div class="text-center">
        <p class="text-4xl mb-2">📊</p>
        <p>Gráfico: {{ type }}</p>
        <p class="text-sm">Datos: {{ data.length }} elementos</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'bar'
  },
  data: {
    type: Array,
    default: () => []
  }
})
</script>
