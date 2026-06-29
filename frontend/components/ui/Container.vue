<template>
  <div :class="['mx-auto px-4', sizeClasses[size]]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  }
})

const sizeClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full'
}
</script>
