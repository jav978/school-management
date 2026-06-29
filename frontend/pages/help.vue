<template>
  <div>
    <ui-page-header title="Ayuda" subtitle="Centro de ayuda y soporte" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ui-card title="Preguntas Frecuentes">
        <div class="space-y-4">
          <div v-for="faq in faqs" :key="faq.id" class="border-b pb-4">
            <h4 class="font-semibold text-gray-800 mb-2">{{ faq.question }}</h4>
            <p class="text-gray-600 text-sm">{{ faq.answer }}</p>
          </div>
        </div>
      </ui-card>

      <div class="space-y-6">
        <ui-card title="Contactar Soporte">
          <div class="space-y-4">
            <ui-form-input v-model="supportForm.name" label="Nombre" />
            <ui-form-input v-model="supportForm.email" label="Email" type="email" />
            <ui-form-input v-model="supportForm.subject" label="Asunto" />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea v-model="supportForm.message" rows="4" class="input-field"></textarea>
            </div>
            <button @click="sendSupport" class="btn-primary">
              Enviar Mensaje
            </button>
          </div>
        </ui-card>

        <ui-card title="Recursos">
          <div class="space-y-3">
            <a href="#" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="mr-3">📖</span>
              <span>Manual de Usuario</span>
            </a>
            <a href="#" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="mr-3">🎥</span>
              <span>Tutoriales en Video</span>
            </a>
            <a href="#" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="mr-3">📧</span>
              <span>Email: soporte@schoolms.com</span>
            </a>
          </div>
        </ui-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const faqs = ref([
  { id: 1, question: '¿Cómo agrego un nuevo estudiante?', answer: 'Ve a la sección de Estudiantes y haz clic en "Nuevo Estudiante". Completa el formulario y guarda.' },
  { id: 2, question: '¿Cómo registro calificaciones?', answer: 'Ve a Calificaciones, selecciona la clase y estudiante, luego ingresa la nota.' },
  { id: 3, question: '¿Cómo genero reportes?', answer: 'Ve a la sección de Reportes, selecciona el tipo de reporte y haz clic en "Generar".' },
])

const supportForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sendSupport = () => {
  alert('Mensaje de soporte enviado')
  supportForm.value = { name: '', email: '', subject: '', message: '' }
}
</script>
