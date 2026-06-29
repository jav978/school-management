<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center">
          <ui-avatar :initials="initials" :size="avatarSize" />
          <div class="ml-4">
            <h3 class="font-semibold text-gray-800">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
          </div>
        </div>
        <ui-badge v-if="badge" :variant="badgeVariant">{{ badge }}</ui-badge>
      </div>
      
      <div v-if="description" class="mt-4">
        <p class="text-gray-600">{{ description }}</p>
      </div>
      
      <div v-if="details.length > 0" class="mt-4 space-y-2">
        <div v-for="detail in details" :key="detail.label" class="flex items-center text-sm">
          <span class="text-gray-500 w-24">{{ detail.label }}:</span>
          <span class="text-gray-700">{{ detail.value }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="$slots.actions" class="px-6 py-4 bg-gray-50 border-t">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  initials: {
    type: String,
    required: true
  },
  avatarSize: {
    type: String,
    default: 'md'
  },
  badge: {
    type: String,
    default: ''
  },
  badgeVariant: {
    type: String,
    default: 'default'
  },
  details: {
    type: Array,
    default: () => []
  }
})
</script>
