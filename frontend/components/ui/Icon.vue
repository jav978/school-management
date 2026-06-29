<template>
  <span :class="['inline-flex', sizeClasses[size]]">
    {{ icon }}
  </span>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl'
}
</script>
