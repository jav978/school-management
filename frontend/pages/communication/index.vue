<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Comunicación</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Envía mensajes, chatea y comparte anuncios con la comunidad escolar</p>
      </div>
      <button 
        @click="showMessageModal = true" 
        class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300"
      >
        + Nuevo Mensaje
      </button>
    </div>

    <!-- Chat & Contact Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Contact List -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
          <div class="relative mb-5">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar contactos..."
              class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-xs"
            />
            <span class="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
          </div>
          
          <div class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectContact(contact)"
              :class="[
                selectedContact?.id === contact.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'border-slate-50 dark:border-slate-850/60 hover:bg-slate-50 dark:hover:bg-slate-850/40',
                'flex items-center p-3 rounded-2xl cursor-pointer border transition-all duration-200'
              ]"
            >
              <div class="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black text-xs mr-3">
                {{ contact.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-800 dark:text-slate-100 text-sm truncate leading-snug">{{ contact.name }}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{{ contact.role }}</p>
              </div>
              <div v-if="contact.unread" class="bg-rose-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-rose-500/20">
                {{ contact.unread }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Chat Window -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between min-h-[492px]">
          
          <div v-if="selectedContact">
            <!-- Chat Header -->
            <div class="mb-6 pb-4 border-b border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black text-xs mr-4">
                  {{ selectedContact.initials }}
                </div>
                <div>
                  <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">{{ selectedContact.name }}</h3>
                  <p class="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mt-0.5">{{ selectedContact.role }}</p>
                </div>
              </div>
            </div>

            <!-- Messages Stream -->
            <div class="h-80 overflow-y-auto mb-6 space-y-4 pr-1">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="[message.sender === 'me' ? 'flex justify-end' : 'flex justify-start']"
              >
                <div
                  :class="[
                    message.sender === 'me' ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 font-medium' : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-850/60',
                    'max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-xs shadow-sm'
                  ]"
                >
                  <p class="leading-relaxed">{{ message.text }}</p>
                  <p :class="[message.sender === 'me' ? 'text-slate-950/60' : 'text-slate-400', 'text-[9px] text-right font-bold mt-1.5']">
                    {{ message.time }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Chat Inputs -->
            <div class="flex gap-3">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Escribe un mensaje..."
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-xs flex-1"
                @keyup.enter="sendMessage"
              />
              <button 
                @click="sendMessage" 
                class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-6 rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-300"
              >
                Enviar
              </button>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
            <span class="text-4xl mb-3">💬</span>
            <p class="text-sm font-bold">Bandeja de Mensajes</p>
            <p class="text-xs text-slate-450 mt-1">Selecciona un contacto para comenzar a chatear</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Anuncios Recientes -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm mt-6">
      <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Anuncios Recientes de la Institución</h3>
      <div class="space-y-4">
        <div v-for="announcement in announcements" :key="announcement.id" class="p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850/60 rounded-2xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{{ announcement.title }}</h4>
              <p class="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">{{ announcement.content }}</p>
              <p class="text-[10px] font-medium text-slate-400 dark:text-slate-550 mt-3">{{ announcement.date }} • Publicado por {{ announcement.author }}</p>
            </div>
            <span :class="[
              announcement.priority === 'high' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
              'text-[9px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 uppercase tracking-wider'
            ]">
              {{ announcement.priority === 'high' ? 'Urgente' : 'Normal' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Message Modal Dialog -->
    <div v-if="showMessageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="showMessageModal = false" class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-350"></div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-fade-in">
        <h3 class="text-lg font-black text-slate-800 dark:text-white mb-6">Nuevo Mensaje</h3>
        <form @submit.prevent="sendNewMessage" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Para</label>
            <select v-model="messageForm.to" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">{{ contact.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Asunto</label>
            <input v-model="messageForm.subject" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Mensaje</label>
            <textarea v-model="messageForm.text" rows="4" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="button" @click="showMessageModal = false" class="px-5 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold rounded-2xl text-xs transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-300">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  { id: 1, title: 'Reunión de Padres de Familia', content: 'Se convoca a la reunión general del primer trimestre escolar este viernes 22 de marzo a las 5:00 PM. Se tratarán asuntos académicos clave.', date: '2024-03-18', author: 'Dirección', priority: 'high' },
  { id: 2, title: 'Semana Cultural y Deportiva', content: 'La semana cultural de primavera se realizará del 1 al 5 de abril. El calendario detallado de eventos se enviará a la brevedad.', date: '2024-03-15', author: 'Coordinación', priority: 'normal' },
  { id: 3, title: 'Modificación en Horario de Atención', content: 'Se informa que el horario de atención administrativa cambiará temporalmente a partir de la próxima semana a 8:00 AM - 4:00 PM.', date: '2024-03-10', author: 'Administración', priority: 'normal' },
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
