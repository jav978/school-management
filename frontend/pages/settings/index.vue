<template>
  <div>
    <ui-page-header title="Configuración" subtitle="Administra la configuración del sistema" />

    <ui-tabs :tabs="tabs">
      <template #general>
        <ui-card title="Configuración General">
          <div class="space-y-4">
            <ui-form-input
              v-model="settings.schoolName"
              label="Nombre del Colegio"
            />
            <ui-form-input
              v-model="settings.schoolEmail"
              label="Email del Colegio"
              type="email"
            />
            <ui-form-input
              v-model="settings.schoolPhone"
              label="Teléfono"
            />
            <ui-form-input
              v-model="settings.schoolAddress"
              label="Dirección"
            />
            <button @click="saveSettings" class="btn-primary">
              Guardar Cambios
            </button>
          </div>
        </ui-card>
      </template>

      <template #notifications>
        <ui-card title="Configuración de Notificaciones">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-800">Notificaciones por Email</p>
                <p class="text-sm text-gray-500">Recibir notificaciones por correo electrónico</p>
              </div>
              <button
                @click="settings.emailNotifications = !settings.emailNotifications"
                :class="settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-800">Notificaciones Push</p>
                <p class="text-sm text-gray-500">Recibir notificaciones en el navegador</p>
              </div>
              <button
                @click="settings.pushNotifications = !settings.pushNotifications"
                :class="settings.pushNotifications ? 'bg-primary-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
          </div>
        </ui-card>
      </template>

      <template #security>
        <ui-card title="Seguridad">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-800">Autenticación de Dos Factores</p>
                <p class="text-sm text-gray-500">Agregar una capa extra de seguridad</p>
              </div>
              <button
                @click="settings.twoFactor = !settings.twoFactor"
                :class="settings.twoFactor ? 'bg-primary-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="settings.twoFactor ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
            <button @click="saveSettings" class="btn-primary">
              Guardar Cambios
            </button>
          </div>
        </ui-card>
      </template>
    </ui-tabs>
  </div>
</template>

<script setup>
const tabs = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notificaciones' },
  { id: 'security', label: 'Seguridad' }
]

const settings = ref({
  schoolName: 'U.E Santa Luisa',
  schoolEmail: 'contacto@santaluisa.edu.ve',
  schoolPhone: '+58 212 123 4567',
  schoolAddress: 'Av. San Martín, Caracas, Venezuela',
  emailNotifications: true,
  pushNotifications: true,
  twoFactor: false
})

const saveSettings = () => {
  alert('Configuración guardada exitosamente')
}
</script>
