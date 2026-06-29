<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Control de Asistencia</h2>
        <p class="text-gray-500">Registra la asistencia diaria</p>
      </div>
      <div class="flex space-x-3">
        <input v-model="selectedDate" type="date" class="input-field" />
        <select v-model="selectedClass" class="input-field">
          <option value="">Seleccionar clase</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
        <button @click="saveAttendance" class="btn-primary">Guardar</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="card">
        <div class="text-center">
          <div class="text-5xl font-bold text-green-600">{{ presentCount }}</div>
          <p class="text-gray-500 mt-2">Presentes</p>
        </div>
      </div>
      <div class="card">
        <div class="text-center">
          <div class="text-5xl font-bold text-red-600">{{ absentCount }}</div>
          <p class="text-gray-500 mt-2">Ausentes</p>
        </div>
      </div>
      <div class="card">
        <div class="text-center">
          <div class="text-5xl font-bold text-yellow-600">{{ lateCount }}</div>
          <p class="text-gray-500 mt-2">Tardanzas</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Estudiante</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-semibold">{{ student.initials }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ student.name }}</p>
                    <p class="text-sm text-gray-500">{{ student.grade }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button
                    @click="setStatus(student.id, 'present')"
                    :class="student.status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Presente
                  </button>
                  <button
                    @click="setStatus(student.id, 'absent')"
                    :class="student.status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ausente
                  </button>
                  <button
                    @click="setStatus(student.id, 'late')"
                    :class="student.status === 'late' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Tardanza
                  </button>
                  <button
                    @click="setStatus(student.id, 'justified')"
                    :class="student.status === 'justified' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Justificado
                  </button>
                </div>
              </td>
              <td class="py-3 px-4">
                <input
                  v-model="student.notes"
                  type="text"
                  placeholder="Agregar nota..."
                  class="input-field"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card mt-6">
      <h3 class="text-lg font-semibold mb-4">Historial de Asistencia</h3>
      <div class="grid grid-cols-7 gap-2">
        <div v-for="day in calendarDays" :key="day.date" class="text-center">
          <div class="text-xs text-gray-500 mb-1">{{ day.label }}</div>
          <div
            :class="getDayClass(day)"
            class="w-10 h-10 rounded-full flex items-center justify-center mx-auto text-sm font-medium"
          >
            {{ day.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedClass = ref('Matemáticas 3ro A')

const classes = ['Matemáticas 3ro A', 'Español 2do B', 'Ciencias 1ro A', 'Historia 3ro B']

const students = ref([
  { id: 1, name: 'Juan Pérez García', grade: '3ro A', initials: 'JP', status: 'present', notes: '' },
  { id: 2, name: 'María López Silva', grade: '3ro A', initials: 'ML', status: 'present', notes: '' },
  { id: 3, name: 'Carlos Rodríguez Luna', grade: '3ro A', initials: 'CR', status: 'absent', notes: 'Enfermedad' },
  { id: 4, name: 'Ana Martínez Ruiz', grade: '3ro A', initials: 'AM', status: 'late', notes: 'Tráfico' },
  { id: 5, name: 'Pedro Gómez Torres', grade: '3ro A', initials: 'PG', status: 'present', notes: '' },
])

const presentCount = computed(() => students.value.filter(s => s.status === 'present').length)
const absentCount = computed(() => students.value.filter(s => s.status === 'absent').length)
const lateCount = computed(() => students.value.filter(s => s.status === 'late').length)

const setStatus = (studentId, status) => {
  const student = students.value.find(s => s.id === studentId)
  if (student) {
    student.status = status
  }
}

const saveAttendance = () => {
  alert('Asistencia guardada exitosamente')
}

const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      label: date.toLocaleDateString('es', { weekday: 'short' }),
      attendance: Math.random() > 0.2 ? 'good' : 'bad'
    })
  }
  return days
})

const getDayClass = (day) => {
  if (day.date === selectedDate.value) return 'bg-primary-500 text-white'
  if (day.attendance === 'good') return 'bg-green-100 text-green-800'
  return 'bg-red-100 text-red-800'
}
</script>
