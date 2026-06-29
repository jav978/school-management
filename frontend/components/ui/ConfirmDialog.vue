<template>
  <ui-modal :show="show" :title="title" @close="$emit('cancel')">
    <p class="text-gray-600">{{ message }}</p>
    
    <template #footer>
      <button @click="$emit('cancel')" class="btn-secondary mr-3">
        {{ cancelText }}
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
