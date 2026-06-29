<template>
  <button
    @click="$emit('click')"
    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
  >
    <span v-if="icon" class="mr-2">{{ icon }}</span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>
