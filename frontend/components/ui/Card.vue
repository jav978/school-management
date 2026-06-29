<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div v-if="title" class="mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
