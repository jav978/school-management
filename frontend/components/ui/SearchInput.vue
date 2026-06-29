<template>
  <div class="relative">
    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      🔍
    </span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
})

defineEmits(['update:modelValue'])
</script>
