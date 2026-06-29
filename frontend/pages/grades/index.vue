<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Calificaciones</h2>
        <p class="text-gray-500">Gestiona las evaluaciones y notas</p>
      </div>
      <button @click="showModal = true" class="btn-primary">
        + Nueva Evaluación
      </button>
    </div>

    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <select v-model="filterClass" class="input-field md:w-1/4">
          <option value="">Todas las clases</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
        <select v-model="filterType" class="input-field md:w-1/4">
          <option value="">Todos los tipos</option>
          <option value="exam">Examen</option>
          <option value="homework">Tarea</option>
          <option value="project">Proyecto</option>
          <option value="quiz">Quiz</option>
        </select>
        <select v-model="filterPeriod" class="input-field md:w-1/4">
          <option value="">Todos los periodos</option>
          <option value="1">Primer Periodo</option>
          <option value="2">Segundo Periodo</option>
          <option value="3">Tercer Periodo</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Estudiante</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Clase</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Evaluación</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Tipo</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Calificación</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Fecha</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in filteredGrades" :key="grade.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 font-medium text-gray-800">{{ grade.student }}</td>
              <td class="py-3 px-4 text-gray-600">{{ grade.class }}</td>
              <td class="py-3 px-4 text-gray-600">{{ grade.assessment }}</td>
              <td class="py-3 px-4">
                <span :class="getTypeClass(grade.type)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getTypeLabel(grade.type) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="getScoreClass(grade.score)" class="font-semibold">
                  {{ grade.score }}/{{ grade.maxScore }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ grade.date }}</td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="editGrade(grade)" class="text-blue-600 hover:text-blue-800">✏️</button>
                  <button @click="deleteGrade(grade)" class="text-red-600 hover:text-red-800">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Promedio General</h3>
        <div class="text-center">
          <div class="text-5xl font-bold text-primary-600">{{ averageScore }}</div>
          <p class="text-gray-500 mt-2">de 100 puntos</p>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Mejores Estudiantes</h3>
        <div class="space-y-3">
          <div v-for="student in topStudents" :key="student.name" class="flex items-center justify-between">
            <span class="text-sm text-gray-700">{{ student.name }}</span>
            <span class="font-semibold text-primary-600">{{ student.average }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Distribución de Notas</h3>
        <div class="space-y-2">
          <div v-for="range in scoreDistribution" :key="range.label" class="flex items-center">
            <span class="w-20 text-sm text-gray-600">{{ range.label }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-4 ml-3">
              <div
                :class="range.color"
                class="rounded-full h-4"
                :style="{ width: `${range.percentage}%` }"
              ></div>
            </div>
            <span class="ml-3 text-sm font-medium">{{ range.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">{{ editingGrade ? 'Editar' : 'Nueva' }} Evaluación</h3>
        <form @submit.prevent="saveGrade" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
            <select v-model="form.student" required class="input-field">
              <option v-for="student in students" :key="student" :value="student">{{ student }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Clase</label>
            <select v-model="form.class" required class="input-field">
              <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Evaluación</label>
            <input v-model="form.assessment" type="text" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select v-model="form.type" required class="input-field">
              <option value="exam">Examen</option>
              <option value="homework">Tarea</option>
              <option value="project">Proyecto</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
              <input v-model.number="form.score" type="number" min="0" max="100" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Puntaje Máximo</label>
              <input v-model.number="form.maxScore" type="number" min="1" required class="input-field" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input v-model="form.date" type="date" required class="input-field" />
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
const filterClass = ref('')
const filterType = ref('')
const filterPeriod = ref('')
const showModal = ref(false)
const editingGrade = ref(null)

const classes = ['Matemáticas 3ro A', 'Español 2do B', 'Ciencias 1ro A', 'Historia 3ro B']
const students = ['Juan Pérez García', 'María López Silva', 'Carlos Rodríguez Luna', 'Ana Martínez Ruiz']

const form = ref({
  student: '',
  class: '',
  assessment: '',
  type: 'exam',
  score: 0,
  maxScore: 100,
  date: ''
})

const grades = ref([
  { id: 1, student: 'Juan Pérez García', class: 'Matemáticas 3ro A', assessment: 'Examen Parcial', type: 'exam', score: 85, maxScore: 100, date: '2024-03-15' },
  { id: 2, student: 'María López Silva', class: 'Español 2do B', assessment: 'Ensayo Literario', type: 'homework', score: 92, maxScore: 100, date: '2024-03-14' },
  { id: 3, student: 'Carlos Rodríguez Luna', class: 'Ciencias 1ro A', assessment: 'Proyecto Ciencias', type: 'project', score: 78, maxScore: 100, date: '2024-03-13' },
  { id: 4, student: 'Ana Martínez Ruiz', class: 'Historia 3ro B', assessment: 'Quiz Historia', type: 'quiz', score: 95, maxScore: 100, date: '2024-03-12' },
])

const filteredGrades = computed(() => {
  return grades.value.filter(g => {
    const matchesClass = !filterClass.value || g.class === filterClass.value
    const matchesType = !filterType.value || g.type === filterType.value
    return matchesClass && matchesType
  })
})

const averageScore = computed(() => {
  const sum = grades.value.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0)
  return Math.round(sum / grades.value.length)
})

const topStudents = ref([
  { name: 'Ana Martínez Ruiz', average: 95 },
  { name: 'María López Silva', average: 92 },
  { name: 'Juan Pérez García', average: 85 }
])

const scoreDistribution = ref([
  { label: '90-100', count: 2, percentage: 50, color: 'bg-green-500' },
  { label: '80-89', count: 1, percentage: 25, color: 'bg-blue-500' },
  { label: '70-79', count: 1, percentage: 25, color: 'bg-yellow-500' },
  { label: '< 70', count: 0, percentage: 0, color: 'bg-red-500' }
])

const getTypeClass = (type) => {
  const classes = {
    exam: 'bg-purple-100 text-purple-800',
    homework: 'bg-blue-100 text-blue-800',
    project: 'bg-orange-100 text-orange-800',
    quiz: 'bg-teal-100 text-teal-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getTypeLabel = (type) => {
  const labels = { exam: 'Examen', homework: 'Tarea', project: 'Proyecto', quiz: 'Quiz' }
  return labels[type] || type
}

const getScoreClass = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const editGrade = (grade) => {
  editingGrade.value = grade
  form.value = { ...grade }
  showModal.value = true
}

const deleteGrade = (grade) => {
  if (confirm('¿Estás seguro de eliminar esta calificación?')) {
    grades.value = grades.value.filter(g => g.id !== grade.id)
  }
}

const saveGrade = () => {
  if (editingGrade.value) {
    const index = grades.value.findIndex(g => g.id === editingGrade.value.id)
    grades.value[index] = { ...form.value, id: editingGrade.value.id }
  } else {
    grades.value.push({ ...form.value, id: Date.now() })
  }
  showModal.value = false
  form.value = { student: '', class: '', assessment: '', type: 'exam', score: 0, maxScore: 100, date: '' }
  editingGrade.value = null
}
</script>
