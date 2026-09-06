import { ref } from 'vue'

export interface ToastItem {
  id: number
  title?: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

const toasts = ref<ToastItem[]>([])
let counter = 0

export const useToast = () => {
  const addToast = (
    message: string, 
    type: 'success' | 'warning' | 'error' | 'info' = 'info', 
    title?: string,
    duration = 4000
  ) => {
    const id = ++counter
    const item: ToastItem = { id, message, type, title, duration }
    toasts.value.push(item)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    return id
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (message: string, title = 'Operación Exitosa', duration = 4000) => {
    return addToast(message, 'success', title, duration)
  }

  const warning = (message: string, title = 'Atención', duration = 4500) => {
    return addToast(message, 'warning', title, duration)
  }

  const error = (message: string, title = 'Error', duration = 5000) => {
    return addToast(message, 'error', title, duration)
  }

  const info = (message: string, title = 'Información', duration = 4000) => {
    return addToast(message, 'info', title, duration)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    warning,
    error,
    info
  }
}
