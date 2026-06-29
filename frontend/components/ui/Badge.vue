<template>
  <span
    :class="[
      'badge font-medium px-2.5 py-1 rounded-lg text-xs border border-transparent shadow-sm/50',
      variantClasses[variant]
    ]"
  >
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
  }
})

const variantClasses = {
  default: 'badge-neutral bg-slate-100 text-slate-700',
  primary: 'badge-primary bg-primary-50 text-primary-700 border-primary-100',
  success: 'badge-success bg-green-50 text-green-700 border-green-100',
  warning: 'badge-warning bg-amber-50 text-amber-700 border-amber-100',
  danger: 'badge-error bg-red-50 text-red-700 border-red-100'
}
</script>

