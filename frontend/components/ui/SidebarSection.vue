<template>
  <div class="px-4 mt-8 mb-4">
    <p class="text-xs font-semibold text-gray-400 uppercase">{{ title }}</p>
    <div class="mt-2">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
