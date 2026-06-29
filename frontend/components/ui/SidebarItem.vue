<template>
  <NuxtLink
    :to="to"
    class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
    active-class="bg-primary-50 text-primary-600 border-r-4 border-primary-600"
  >
    <span class="mr-3">{{ icon }}</span>
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>
