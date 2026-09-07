<template>
  <div>
    <div class="border-b border-slate-200 dark:border-white/10 mb-6">
      <nav class="-mb-px flex space-x-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-3 px-2 border-b-2 font-bold text-sm transition-all cursor-pointer',
            activeTab === tab.id
              ? 'border-brand-primary text-brand-primary dark:text-brand-gold border-b-2'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
    <div>
      <slot :name="activeTab" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  defaultTab: {
    type: String,
    default: ''
  }
})

const activeTab = ref(props.defaultTab || (props.tabs.length > 0 ? props.tabs[0].id : ''))
</script>
