<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-lg shadow-lg max-w-sm',
          typeClasses[toast.type]
        ]"
      >
        <div class="flex items-center">
          <span class="mr-2">{{ icons[toast.type] }}</span>
          <span class="font-medium">{{ toast.message }}</span>
          <button @click="removeToast(toast.id)" class="ml-auto">✕</button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
const toasts = ref([])
let toastId = 0

const typeClasses = {
  info: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800'
}

const icons = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌'
}

const addToast = (message, type = 'info', duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

defineExpose({ addToast })
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
