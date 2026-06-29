<template>
  <div>
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
    <div class="py-4">
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
