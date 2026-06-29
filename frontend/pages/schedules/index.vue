<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Horarios</h2>
        <p class="text-gray-500">Gestiona los horarios escolares</p>
      </div>
      <div class="flex space-x-3">
        <select v-model="selectedGrade" class="input-field">
          <option value="">Seleccionar grado</option>
          <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
        </select>
        <button @click="showModal = true" class="btn-primary">+ Nuevo Horario</button>
      </div>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-semibold text-gray-600 w-24">Hora</th>
              <th v-for="day in weekDays" :key="day" class="text-center py-3 px-4 font-semibold text-gray-600">
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="time in timeSlots" :key="time" class="border-b">
              <td class="py-3 px-4 text-sm font-medium text-gray-600">{{ time }}</td>
              <td v-for="day in weekDays" :key="day" class="py-3 px-4 text-center">
                <div
                  v-if="getSchedule(day, time)"
                  :class="getSchedule(day, time).color"
                  class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  @click="editSchedule(getSchedule(day, time))"
                >
                  <p class="font-medium text-sm">{{ getSchedule(day, time).subject }}</p>
                  <p class="text-xs opacity-75">{{ getSchedule(day, time).teacher }}</p>
                  <p class="text-xs opacity-75">{{ getSchedule(day, time).room }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Resumen Semanal</h3>
        <div class="space-y-3">
          <div v-for="subject in subjectSummary" :key="subject.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="subject.color" class="w-3 h-3 rounded-full mr-3"></div>
              <span class="text-gray-700">{{ subject.name }}</span>
            </div>
            <span class="font-medium text-gray-600">{{ subject.hours }} hrs</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Próximas Clases</h3>
        <div class="space-y-3">
          <div v-for="cls in upcomingClasses" :key="cls.id" class="flex items-center p-3 bg-gray-50 rounded-lg">
            <div :class="cls.color" class="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold">{{ cls.time.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ cls.subject }}</p>
              <p class="text-sm text-gray-500">{{ cls.time }} - {{ cls.room }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">{{ editingSchedule ? 'Editar' : 'Nuevo' }} Horario</h3>
        <form @submit.prevent="saveSchedule" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <select v-model="form.subject" required class="input-field">
              <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
            <select v-model="form.teacher" required class="input-field">
              <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Día</label>
            <select v-model="form.day" required class="input-field">
              <option v-for="day in weekDays" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <select v-model="form.time" required class="input-field">
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Aula</label>
            <input v-model="form.room" type="text" required class="input-field" />
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showModal = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedGrade = ref('3ro Secundaria')
const showModal = ref(false)
const editingSchedule = ref(null)

const grades = ['1ro Primaria', '2do Primaria', '3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria', '1ro Secundaria', '2do Secundaria', '3ro Secundaria']
const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const timeSlots = ['7:00 - 7:45', '7:45 - 8:30', '8:30 - 9:15', '9:30 - 10:15', '10:15 - 11:00', '11:00 - 11:45', '12:00 - 12:45', '1:00 - 1:45']
const subjects = ['Matemáticas', 'Español', 'Ciencias', 'Historia', 'Inglés', 'Educación Física', 'Arte']
const teachers = ['Roberto Sánchez', 'Laura García', 'Miguel Torres', 'Patricia Luna']

const form = ref({
  subject: '',
  teacher: '',
  day: '',
  time: '',
  room: ''
})

const schedules = ref([
  { id: 1, subject: 'Matemáticas', teacher: 'Roberto Sánchez', day: 'Lunes', time: '7:00 - 7:45', room: 'Aula 301', color: 'bg-blue-100 text-blue-800' },
  { id: 2, subject: 'Español', teacher: 'Laura García', day: 'Lunes', time: '7:45 - 8:30', room: 'Aula 302', color: 'bg-green-100 text-green-800' },
  { id: 3, subject: 'Ciencias', teacher: 'Miguel Torres', day: 'Martes', time: '8:30 - 9:15', room: 'Lab 101', color: 'bg-purple-100 text-purple-800' },
  { id: 4, subject: 'Inglés', teacher: 'Patricia Luna', day: 'Miércoles', time: '9:30 - 10:15', room: 'Aula 303', color: 'bg-orange-100 text-orange-800' },
])

const getSchedule = (day, time) => {
  return schedules.value.find(s => s.day === day && s.time === time)
}

const subjectSummary = computed(() => {
  const summary = {}
  schedules.value.forEach(s => {
    if (!summary[s.subject]) {
      summary[s.subject] = { name: s.subject, hours: 0, color: s.color.split(' ')[0] }
    }
    summary[s.subject].hours += 0.75
  })
  return Object.values(summary)
})

const upcomingClasses = computed(() => {
  return schedules.value.slice(0, 3)
})

const editSchedule = (schedule) => {
  editingSchedule.value = schedule
  form.value = { ...schedule }
  showModal.value = true
}

const saveSchedule = () => {
  if (editingSchedule.value) {
    const index = schedules.value.findIndex(s => s.id === editingSchedule.value.id)
    schedules.value[index] = { ...form.value, id: editingSchedule.value.id, color: 'bg-blue-100 text-blue-800' }
  } else {
    schedules.value.push({ ...form.value, id: Date.now(), color: 'bg-blue-100 text-blue-800' })
  }
  showModal.value = false
  form.value = { subject: '', teacher: '', day: '', time: '', room: '' }
  editingSchedule.value = null
}
</script>
