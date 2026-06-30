<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Calificaciones</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Gestiona las evaluaciones y notas académicas de los estudiantes</p>
      </div>
      <button 
        @click="showModal = true" 
        class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300"
      >
        + Nueva Evaluación
      </button>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select v-model="filterClass" class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
          <option value="">Todas las clases</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
        <select v-model="filterType" class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
          <option value="">Todos los tipos</option>
          <option value="exam">Examen</option>
          <option value="homework">Tarea</option>
          <option value="project">Proyecto</option>
          <option value="quiz">Quiz</option>
        </select>
        <select v-model="filterPeriod" class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
          <option value="">Todos los periodos</option>
          <option value="1">Primer Periodo</option>
          <option value="2">Segundo Periodo</option>
          <option value="3">Tercer Periodo</option>
        </select>
      </div>
    </div>

    <!-- Grades Table Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="pb-4 pl-2">Estudiante</th>
              <th class="pb-4">Clase</th>
              <th class="pb-4">Evaluación</th>
              <th class="pb-4">Tipo</th>
              <th class="pb-4">Calificación</th>
              <th class="pb-4">Fecha</th>
              <th class="pb-4 text-right pr-4">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-850/40 text-sm">
            <tr v-for="grade in filteredGrades" :key="grade.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
              <td class="py-4 pl-2 font-bold text-slate-855 dark:text-slate-100">{{ grade.student }}</td>
              <td class="py-4 text-slate-500 dark:text-slate-400 font-medium">{{ grade.class }}</td>
              <td class="py-4 text-slate-500 dark:text-slate-400 font-medium">{{ grade.assessment }}</td>
              <td class="py-4">
                <span :class="[getTypeClass(grade.type), 'text-[10px] font-bold px-2 py-0.5 rounded-lg']">
                  {{ getTypeLabel(grade.type) }}
                </span>
              </td>
              <td class="py-4 font-black">
                <span :class="getScoreClass(grade.score)">
                  {{ grade.score }}/{{ grade.maxScore }}
                </span>
              </td>
              <td class="py-4 text-slate-400 font-medium">{{ grade.date }}</td>
              <td class="py-4 text-right pr-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="editGrade(grade)" class="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 active:scale-95 transition-all" title="Editar">
                    ✏️
                  </button>
                  <button @click="deleteGrade(grade)" class="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Widgets Grid (Middle/Bottom summary) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      
      <!-- Promedio General -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm text-center flex flex-col justify-center min-h-[200px]">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Promedio General</h3>
        <div>
          <span class="text-6xl font-black bg-gradient-to-tr from-emerald-400 to-teal-500 bg-clip-text text-transparent">{{ averageScore }}</span>
          <p class="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-2">de 100 puntos</p>
        </div>
      </div>

      <!-- Mejores Estudiantes -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Mejores Estudiantes</h3>
        <div class="space-y-3.5">
          <div v-for="student in topStudents" :key="student.name" class="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-2xl transition-all">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ student.name }}</span>
            <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">{{ student.average }} pts</span>
          </div>
        </div>
      </div>

      <!-- Distribución de Notas -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Distribución de Notas</h3>
        <div class="space-y-3">
          <div v-for="range in scoreDistribution" :key="range.label" class="flex items-center">
            <span class="w-14 text-xs font-semibold text-slate-400 dark:text-slate-500">{{ range.label }}</span>
            <div class="flex-1 bg-slate-50 dark:bg-slate-950/80 rounded-full h-2 ml-2">
              <div
                :class="[range.color, 'rounded-full h-2 transition-all duration-500']"
                :style="{ width: `${range.percentage}%` }"
              ></div>
            </div>
            <span class="ml-3 text-xs font-black text-slate-700 dark:text-slate-200">{{ range.count }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Create/Edit Modal Dialog -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="showModal = false" class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"></div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-fade-in">
        <h3 class="text-lg font-black text-slate-800 dark:text-white mb-6">
          {{ editingGrade ? 'Editar' : 'Nueva' }} Evaluación
        </h3>
        <form @submit.prevent="saveGrade" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Estudiante</label>
            <select v-model="form.student" required class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
              <option v-for="student in students" :key="student" :value="student">{{ student }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Clase</label>
            <select v-model="form.class" required class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
              <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Evaluación</label>
            <input v-model="form.assessment" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Tipo</label>
            <select v-model="form.type" required class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
              <option value="exam">Examen</option>
              <option value="homework">Tarea</option>
              <option value="project">Proyecto</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Calificación</label>
              <input v-model.number="form.score" type="number" min="0" max="100" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Puntaje Máximo</label>
              <input v-model.number="form.maxScore" type="number" min="1" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Fecha</label>
            <input v-model="form.date" type="date" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="button" @click="showModal = false" class="px-5 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold rounded-2xl text-xs transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-300">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  { label: '90-100', count: 2, percentage: 50, color: 'bg-emerald-500' },
  { label: '80-89', count: 1, percentage: 25, color: 'bg-teal-500' },
  { label: '70-79', count: 1, percentage: 25, color: 'bg-amber-500' },
  { label: '< 70', count: 0, percentage: 0, color: 'bg-rose-500' }
])

const getTypeClass = (type) => {
  const classes = {
    exam: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    homework: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    project: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    quiz: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
  }
  return classes[type] || 'bg-slate-500/10 text-slate-650'
}

const getTypeLabel = (type) => {
  const labels = { exam: 'Examen', homework: 'Tarea', project: 'Proyecto', quiz: 'Quiz' }
  return labels[type] || type
}

const getScoreClass = (score) => {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 80) return 'text-teal-600 dark:text-teal-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

const toast = useToast()

const editGrade = (grade) => {
  editingGrade.value = grade
  form.value = { ...grade }
  showModal.value = true
}

const deleteGrade = (grade) => {
  if (confirm('¿Estás seguro de eliminar esta calificación?')) {
    grades.value = grades.value.filter(g => g.id !== grade.id)
    toast.add({
      title: 'Calificación eliminada',
      description: `La calificación fue eliminada satisfactoriamente.`,
      color: 'success'
    })
  }
}

const saveGrade = () => {
  if (editingGrade.value) {
    const index = grades.value.findIndex(g => g.id === editingGrade.value.id)
    grades.value[index] = { ...form.value, id: editingGrade.value.id }
    toast.add({
      title: 'Calificación actualizada',
      description: `La calificación se actualizó satisfactoriamente.`,
      color: 'success'
    })
  } else {
    grades.value.push({ ...form.value, id: Date.now() })
    toast.add({
      title: 'Calificación agregada',
      description: `La calificación se registró satisfactoriamente.`,
      color: 'success'
    })
  }
  showModal.value = false
  form.value = { student: '', class: '', assessment: '', type: 'exam', score: 0, maxScore: 100, date: '' }
  editingGrade.value = null
}
</script>
