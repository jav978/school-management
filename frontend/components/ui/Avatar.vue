<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center',
      sizeClasses[size],
      colorClasses[color]
    ]"
  >
    <span :class="['font-semibold', textSizeClasses[size]]">
      {{ initials }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  initials: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  }
})

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600',
  secondary: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  danger: 'bg-red-100 text-red-600'
}
</script>
