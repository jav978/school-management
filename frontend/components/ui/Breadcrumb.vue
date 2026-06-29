<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li v-for="(item, index) in items" :key="index" class="inline-flex items-center">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-sm font-medium text-gray-500">
          {{ item.label }}
        </span>
        <span v-if="index < items.length - 1" class="mx-2 text-gray-400">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>
