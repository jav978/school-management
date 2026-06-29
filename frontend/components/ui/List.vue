<template>
  <ul :class="['divide-y divide-gray-200', classes]">
    <li v-for="(item, index) in items" :key="index" class="py-4">
      <slot :item="item" :index="index" />
    </li>
    <li v-if="items.length === 0" class="py-8 text-center text-gray-500">
      {{ emptyMessage }}
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  },
  emptyMessage: {
    type: String,
    default: 'No hay elementos para mostrar'
  },
  classes: {
    type: String,
    default: ''
  }
})
</script>
