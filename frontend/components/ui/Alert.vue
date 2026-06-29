<template>
  <Transition name="alert">
    <div
      v-if="show"
      :class="[
        'alert shadow-sm border border-slate-100/50 rounded-xl mb-4',
        typeClasses[type]
      ]"
      role="alert"
    >
      <svg v-if="type === 'info'" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <svg v-else-if="type === 'success'" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <svg v-else-if="type === 'warning'" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <svg v-else-if="type === 'error'" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      
      <span class="font-medium text-sm">{{ message }}</span>
      
      <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="btn btn-ghost btn-xs btn-circle ml-auto"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])

const typeClasses = {
  info: 'alert-info bg-blue-50 text-blue-800',
  success: 'alert-success bg-green-50 text-green-800',
  warning: 'alert-warning bg-yellow-50 text-yellow-800',
  error: 'alert-error bg-red-50 text-red-800'
}
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

