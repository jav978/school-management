<template>
  <div>
    <ui-page-header title="Mi Perfil" subtitle="Gestiona tu información personal">
      <template #actions>
        <button @click="editMode = !editMode" class="btn-secondary">
          {{ editMode ? 'Cancelar' : 'Editar' }}
        </button>
        <button v-if="editMode" @click="saveProfile" class="btn-primary">
          Guardar Cambios
        </button>
      </template>
    </ui-page-header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <ui-card>
          <div class="text-center">
            <ui-avatar :initials="userInitials" size="xl" />
            <h2 class="text-xl font-semibold mt-4">{{ form.name }}</h2>
            <p class="text-gray-500">{{ form.role }}</p>
          </div>
          <ui-divider />
          <div class="space-y-3">
            <div class="flex items-center text-sm">
              <span class="text-gray-500 w-20">Email:</span>
              <span class="text-gray-700">{{ form.email }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-gray-500 w-20">Teléfono:</span>
              <span class="text-gray-700">{{ form.phone }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-gray-500 w-20">Dirección:</span>
              <span class="text-gray-700">{{ form.address }}</span>
            </div>
          </div>
        </ui-card>
      </div>

      <div class="lg:col-span-2">
        <ui-card title="Información Personal">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ui-form-input
                v-model="form.name"
                label="Nombre Completo"
                :disabled="!editMode"
              />
              <ui-form-input
                v-model="form.email"
                label="Correo Electrónico"
                type="email"
                :disabled="!editMode"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ui-form-input
                v-model="form.phone"
                label="Teléfono"
                :disabled="!editMode"
              />
              <ui-form-input
                v-model="form.address"
                label="Dirección"
                :disabled="!editMode"
              />
            </div>
          </div>
        </ui-card>

        <ui-card title="Cambiar Contraseña" class="mt-6">
          <div class="space-y-4">
            <ui-form-input
              v-model="passwordForm.current"
              label="Contraseña Actual"
              type="password"
              :disabled="!editMode"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ui-form-input
                v-model="passwordForm.new"
                label="Nueva Contraseña"
                type="password"
                :disabled="!editMode"
              />
              <ui-form-input
                v-model="passwordForm.confirm"
                label="Confirmar Contraseña"
                type="password"
                :disabled="!editMode"
              />
            </div>
          </div>
        </ui-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const editMode = ref(false)

const form = ref({
  name: 'Juan Pérez García',
  email: 'juan@school.com',
  phone: '+1 234 567 890',
  address: '123 Calle Principal, Ciudad',
  role: 'Administrador'
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const userInitials = computed(() => {
  return form.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const saveProfile = () => {
  editMode.value = false
  alert('Perfil actualizado exitosamente')
}
</script>
