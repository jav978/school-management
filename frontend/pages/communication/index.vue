<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Comunicación</h2>
        <p class="text-gray-500">Mensajes y notificaciones</p>
      </div>
      <button @click="showMessageModal = true" class="btn-primary">
        + Nuevo Mensaje
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="card">
          <div class="mb-4">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar contactos..."
              class="input-field"
            />
          </div>
          <div class="space-y-2">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectContact(contact)"
              :class="selectedContact?.id === contact.id ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'"
              class="flex items-center p-3 rounded-lg cursor-pointer border"
            >
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold">{{ contact.initials }}</span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ contact.name }}</p>
                <p class="text-sm text-gray-500">{{ contact.role }}</p>
              </div>
              <div v-if="contact.unread" class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ contact.unread }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="card">
          <div v-if="selectedContact" class="mb-4 pb-4 border-b">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span class="text-primary-600 font-bold">{{ selectedContact.initials }}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">{{ selectedContact.name }}</h3>
                <p class="text-sm text-gray-500">{{ selectedContact.role }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedContact" class="h-96 overflow-y-auto mb-4 space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="message.sender === 'me' ? 'flex justify-end' : 'flex justify-start'"
            >
              <div
                :class="message.sender === 'me' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-800'"
                class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
              >
                <p>{{ message.text }}</p>
                <p :class="message.sender === 'me' ? 'text-primary-100' : 'text-gray-500'" class="text-xs mt-1">
                  {{ message.time }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedContact" class="flex gap-3">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Escribe un mensaje..."
              class="input-field flex-1"
              @keyup.enter="sendMessage"
            />
            <button @click="sendMessage" class="btn-primary">Enviar</button>
          </div>

          <div v-if="!selectedContact" class="h-96 flex items-center justify-center text-gray-500">
            Selecciona un contacto para comenzar a chatear
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-6">
      <h3 class="text-lg font-semibold mb-4">Anuncios Recientes</h3>
      <div class="space-y-4">
        <div v-for="announcement in announcements" :key="announcement.id" class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-semibold text-gray-800">{{ announcement.title }}</h4>
              <p class="text-gray-600 mt-1">{{ announcement.content }}</p>
              <p class="text-sm text-gray-500 mt-2">{{ announcement.date }} - {{ announcement.author }}</p>
            </div>
            <span :class="announcement.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ announcement.priority === 'high' ? 'Urgente' : 'Normal' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMessageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Nuevo Mensaje</h3>
        <form @submit.prevent="sendNewMessage" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Para</label>
            <select v-model="messageForm.to" required class="input-field">
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">{{ contact.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
            <input v-model="messageForm.subject" type="text" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea v-model="messageForm.text" rows="4" required class="input-field"></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showMessageModal = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const search = ref('')
const selectedContact = ref(null)
const newMessage = ref('')
const showMessageModal = ref(false)

const messageForm = ref({
  to: '',
  subject: '',
  text: ''
})

const contacts = ref([
  { id: 1, name: 'Roberto Sánchez', role: 'Profesor de Matemáticas', initials: 'RS', unread: 2 },
  { id: 2, name: 'Laura García', role: 'Profesor de Español', initials: 'LG', unread: 0 },
  { id: 3, name: 'María López (Madre)', role: 'Padre de Familia', initials: 'ML', unread: 1 },
  { id: 4, name: 'Pedro Torres (Padre)', role: 'Padre de Familia', initials: 'PT', unread: 0 },
])

const filteredContacts = computed(() => {
  return contacts.value.filter(c => c.name.toLowerCase().includes(search.value.toLowerCase()))
})

const messages = ref([
  { id: 1, sender: 'them', text: 'Buenos días, necesito hablar sobre la calificación de Juan', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'Buenos días, claro. ¿En qué puedo ayudarle?', time: '10:32 AM' },
  { id: 3, sender: 'them', text: '¿Podríamos agendar una reunión para esta semana?', time: '10:35 AM' },
  { id: 4, sender: 'me', text: 'Sí, ¿le parece el jueves a las 3pm?', time: '10:37 AM' },
])

const announcements = ref([
  { id: 1, title: 'Reunión de Padres', content: 'Se convoca a reunión de padres el viernes 22 de marzo a las 5pm.', date: '2024-03-18', author: 'Dirección', priority: 'high' },
  { id: 2, title: 'Semana Cultural', content: 'La semana cultural se realizará del 1 al 5 de abril.', date: '2024-03-15', author: 'Coordinación', priority: 'normal' },
  { id: 3, title: 'Cambio de Horario', content: 'El horario de atención de administración cambia a 8am-4pm.', date: '2024-03-10', author: 'Administración', priority: 'normal' },
])

const selectContact = (contact) => {
  selectedContact.value = contact
  contact.unread = 0
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      sender: 'me',
      text: newMessage.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    newMessage.value = ''
  }
}

const sendNewMessage = () => {
  alert('Mensaje enviado exitosamente')
  showMessageModal.value = false
  messageForm.value = { to: '', subject: '', text: '' }
}
</script>
