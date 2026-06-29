<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-800 mt-1">{{ value }}</p>
      </div>
      <div class="text-4xl">{{ icon }}</div>
    </div>
    <div v-if="showTrend" class="mt-4">
      <span :class="trend > 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium">
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </span>
      <span class="text-gray-500 text-sm ml-2">vs mes anterior</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: '📊'
  },
  trend: {
    type: Number,
    default: 0
  },
  showTrend: {
    type: Boolean,
    default: true
  }
})
</script>
