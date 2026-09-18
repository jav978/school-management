<template>
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold font-display text-slate-850 dark:text-white transition-colors duration-150">{{ displayTitle }}</h1>
        <p v-if="displaySubtitle" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 transition-colors duration-150">{{ displaySubtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex space-x-3">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const { t } = useLanguage()

const displayTitle = computed(() => {
  return t(props.title, props.title)
})

const displaySubtitle = computed(() => {
  if (!props.subtitle) return ''
  return t(props.subtitle, props.subtitle)
})
</script>

