<template>
  <div>
    <div v-if="label" class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm text-gray-500">{{ value }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-4">
      <div
        :class="[
          'h-4 rounded-full transition-all duration-300',
          colorClasses[color]
        ]"
        :style="{ width: `${value}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  label: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
  }
})

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
}
</script>
