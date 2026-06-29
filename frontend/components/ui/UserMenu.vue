<template>
  <ui-dropdown>
    <template #trigger>
      <div class="flex items-center space-x-3 cursor-pointer">
        <ui-avatar :initials="initials" />
        <div>
          <p class="text-sm font-medium text-gray-700">{{ name }}</p>
          <p class="text-xs text-gray-500">{{ role }}</p>
        </div>
      </div>
    </template>
    
    <ui-dropdown-item icon="👤" @click="$emit('profile')">
      Mi Perfil
    </ui-dropdown-item>
    <ui-dropdown-item icon="⚙️" @click="$emit('settings')">
      Configuración
    </ui-dropdown-item>
    <ui-dropdown-item icon="🚪" @click="$emit('logout')">
      Cerrar Sesión
    </ui-dropdown-item>
  </ui-dropdown>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  initials: {
    type: String,
    required: true
  }
})

defineEmits(['profile', 'settings', 'logout'])
</script>
