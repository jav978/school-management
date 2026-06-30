<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Control de Asistencia</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Registra y monitorea la asistencia diaria de los alumnos</p>
      </div>
      <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <input v-model="selectedDate" type="date" class="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-xs font-bold" />
        <select v-model="selectedClass" class="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 text-xs font-bold">
          <option value="">Seleccionar clase</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
        <button 
          @click="saveAttendance" 
          class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300 ml-auto lg:ml-0"
        >
          Guardar Asistencia
        </button>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Presentes</span>
          <h3 class="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{{ presentCount }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
          ✓
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ausentes</span>
          <h3 class="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{{ absentCount }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
          ✗
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tardanzas</span>
          <h3 class="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{{ lateCount }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
          ⚠
        </div>
      </div>
    </div>

    <!-- Attendance Table Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="pb-4 pl-2">Estudiante</th>
              <th class="pb-4">Estado de Asistencia</th>
              <th class="pb-4 pr-2">Nota / Justificación</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-850/40 text-sm">
            <tr v-for="student in students" :key="student.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
              <td class="py-4 pl-2">
                <div class="flex items-center">
                  <div class="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black text-xs mr-3">
                    <span>{{ student.initials }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-slate-100">{{ student.name }}</p>
                    <p class="text-xs text-slate-400">{{ student.grade }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button
                    @click="setStatus(student.id, 'present')"
                    :class="[student.status === 'present' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10 font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-850 hover:bg-slate-100', 'px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200']"
                  >
                    Presente
                  </button>
                  <button
                    @click="setStatus(student.id, 'absent')"
                    :class="[student.status === 'absent' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10 font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-850 hover:bg-slate-100', 'px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200']"
                  >
                    Ausente
                  </button>
                  <button
                    @click="setStatus(student.id, 'late')"
                    :class="[student.status === 'late' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-850 hover:bg-slate-100', 'px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200']"
                  >
                    Tardanza
                  </button>
                  <button
                    @click="setStatus(student.id, 'justified')"
                    :class="[student.status === 'justified' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10 font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-850 hover:bg-slate-100', 'px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200']"
                  >
                    Justificado
                  </button>
                </div>
              </td>
              <td class="py-4 pr-2">
                <input
                  v-model="student.notes"
                  type="text"
                  placeholder="Agregar justificación..."
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-xs"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Historial de Asistencia Semanal -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
      <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Historial de Asistencia Reciente</h3>
      <div class="grid grid-cols-7 gap-3">
        <div v-for="day in calendarDays" :key="day.date" class="text-center">
          <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{{ day.label }}</div>
          <div
            :class="[
              day.date === selectedDate ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 border-none' : 
              day.attendance === 'good' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
              'w-11 h-11 rounded-2xl flex items-center justify-center mx-auto text-sm font-bold transition-all duration-300'
            ]"
          >
            {{ day.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const toast = useToast()

const setStatus = (studentId, status) => {
  const student = students.value.find(s => s.id === studentId)
  if (student) {
    student.status = status
  }
}

const saveAttendance = () => {
  toast.add({
    title: 'Asistencia guardada',
    description: `La asistencia para el día ${selectedDate.value} en la clase ${selectedClass.value} fue guardada satisfactoriamente.`,
    color: 'success'
  })
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
</script>
