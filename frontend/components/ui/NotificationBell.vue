<template>
  <button class="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
    <span class="text-xl">🔔</span>
    <span
      v-if="count > 0"
      class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
    >
      {{ count > 9 ? '9+' : count }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  }
})
</script>
