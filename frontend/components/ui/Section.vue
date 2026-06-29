<template>
  <section :class="['py-8', classes]">
    <div v-if="title" class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
      <p v-if="subtitle" class="text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <slot />
  </section>
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
  },
  classes: {
    type: String,
    default: ''
  }
})
</script>
