<template>
  <div class="bg-white dark:bg-[#170f33] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-2xl p-6 transition-colors">
    <div v-if="title" class="mb-5 pb-3 border-b border-slate-100 dark:border-white/10">
      <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ title }}</h3>
      <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
