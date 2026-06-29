<template>
  <div>
    <ui-page-header title="Contacto" subtitle="Información de contacto del colegio" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ui-card title="Información de Contacto">
        <div class="space-y-4">
          <div class="flex items-start">
            <span class="text-2xl mr-4">📍</span>
            <div>
              <h4 class="font-semibold text-gray-800">Dirección</h4>
              <p class="text-gray-600">123 Calle Principal, Ciudad, País</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">📞</span>
            <div>
              <h4 class="font-semibold text-gray-800">Teléfono</h4>
              <p class="text-gray-600">+1 234 567 890</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">📧</span>
            <div>
              <h4 class="font-semibold text-gray-800">Email</h4>
              <p class="text-gray-600">info@colegiosanmartin.edu</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">🕒</span>
            <div>
              <h4 class="font-semibold text-gray-800">Horario de Atención</h4>
              <p class="text-gray-600">Lunes a Viernes: 7:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </ui-card>

      <ui-card title="Envíanos un Mensaje">
        <form @submit.prevent="sendMessage" class="space-y-4">
          <ui-form-input v-model="form.name" label="Nombre" required />
          <ui-form-input v-model="form.email" label="Email" type="email" required />
          <ui-form-input v-model="form.subject" label="Asunto" required />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea v-model="form.message" rows="4" required class="input-field"></textarea>
          </div>
          <button type="submit" class="btn-primary w-full">
            Enviar Mensaje
          </button>
        </form>
      </ui-card>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sendMessage = () => {
  alert('Mensaje enviado exitosamente')
  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>
