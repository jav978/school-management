<template>
  <div :class="['animate-pulse', classes]">
    <div :class="['bg-gray-200 rounded', sizeClasses[size]]"></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  classes: {
    type: String,
    default: ''
  }
})

const sizeClasses = {
  sm: 'h-4 w-20',
  md: 'h-6 w-32',
  lg: 'h-8 w-48',
  xl: 'h-10 w-64'
}
</script>
