<template>
  <span :class="['inline-flex items-center', sizeClasses[size]]">
    <span :class="['rounded-full', dotSizeClasses[size], statusClasses[status]]"></span>
    <span v-if="label" class="ml-2">{{ label }}</span>
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'inactive', 'pending', 'warning', 'error'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

const dotSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
}

const statusClasses = {
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  pending: 'bg-yellow-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500'
}
</script>
