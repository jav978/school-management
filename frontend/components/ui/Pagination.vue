<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
    <div class="text-sm text-gray-600">
      Mostrando {{ (currentPage - 1) * perPage + 1 }} a {{ Math.min(currentPage * perPage, total) }} de {{ total }} registros
    </div>
    <div class="flex space-x-2">
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('page-change', page)"
        :class="[
          'px-3 py-1 rounded border',
          page === currentPage ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    required: true
  }
})

defineEmits(['page-change'])

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
