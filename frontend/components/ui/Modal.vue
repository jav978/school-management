<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal modal-open fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Dialog Box -->
        <div class="modal-box bg-white max-w-lg w-full rounded-2xl border border-slate-100 shadow-2xl transform transition-all p-6 relative z-10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold font-display text-slate-800">{{ title }}</h3>
            <button @click="$emit('close')" class="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <!-- Body -->
          <div class="text-sm text-slate-600 space-y-4">
            <slot />
          </div>

          <!-- Footer Actions -->
          <div v-if="$slots.footer" class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>

