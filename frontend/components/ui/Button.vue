<template>
  <button
    :class="[
      'btn font-display font-medium rounded-xl transition-all active:scale-95 duration-200',
      variantClasses[variant],
      sizeClasses[size],
      { 'btn-disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading loading-spinner loading-xs mr-1"></span>
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClasses = {
  primary: 'btn-primary bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-none shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/25',
  secondary: 'btn-outline border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white',
  danger: 'btn-error bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-slate-950 hover:border-transparent',
  success: 'btn-success bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 hover:border-transparent'
}

const sizeClasses = {
  sm: 'btn-sm text-xs px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'btn-lg text-base px-7 py-3.5'
}
</script>

