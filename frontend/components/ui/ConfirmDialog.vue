<template>
  <ui-modal :show="show" :title="title" @close="$emit('cancel')">
    <p class="text-gray-600">{{ message }}</p>
    
    <template #footer>
      <button 
        type="button" 
        @click="$emit('cancel')" 
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-rose-100/80 hover:bg-rose-200/90 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60 rounded-xl transition-all active:scale-[0.98] cursor-pointer mr-2 shadow-xs"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>{{ cancelText }}</span>
      </button>
      <button @click="$emit('confirm')" :class="confirmClass">
        {{ confirmText }}
      </button>
    </template>
  </ui-modal>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirmar'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmClass: {
    type: String,
    default: 'btn-primary'
  }
})

defineEmits(['confirm', 'cancel'])
</script>
