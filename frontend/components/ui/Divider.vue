<template>
  <div :class="['border-t', classes]"></div>
</template>

<script setup>
defineProps({
  classes: {
    type: String,
    default: 'border-gray-200 my-4'
  }
})
</script>
