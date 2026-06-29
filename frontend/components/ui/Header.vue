<template>
  <header class="bg-white shadow-sm border-b">
    <div class="flex items-center justify-between px-6 py-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
      </div>
      <div class="flex items-center space-x-4">
        <ui-notification-bell :count="notifications" />
        <ui-user-menu
          :name="userName"
          :role="userRole"
          :initials="userInitials"
          @profile="$emit('profile')"
          @settings="$emit('settings')"
          @logout="$emit('logout')"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  userInitials: {
    type: String,
    required: true
  },
  notifications: {
    type: Number,
    default: 0
  }
})

defineEmits(['profile', 'settings', 'logout'])
</script>
