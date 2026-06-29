<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Horarios escolares</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Planifica y gestiona las clases y aulas por cada nivel académico</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select v-model="selectedGrade" class="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-xs font-bold w-full sm:w-auto">
          <option value="">Seleccionar grado</option>
          <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
        </select>
        <button 
          @click="showModal = true" 
          class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300 flex-shrink-0"
        >
          + Nuevo Horario
        </button>
      </div>
    </div>

    <!-- Schedules Grid Calendar Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="pb-4 pl-2 w-24">Hora</th>
              <th v-for="day in weekDays" :key="day" class="pb-4 text-center">
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-850/40 text-sm">
            <tr v-for="time in timeSlots" :key="time" class="hover:bg-slate-50/20 dark:hover:bg-slate-850/10 transition-colors">
              <td class="py-4 pl-2 font-bold text-slate-400 dark:text-slate-500 text-xs">{{ time }}</td>
              <td v-for="day in weekDays" :key="day" class="py-2 px-1 text-center">
                <div
                  v-if="getSchedule(day, time)"
                  :class="[
                    getScheduleColor(getSchedule(day, time).subject),
                    'p-3 rounded-2xl cursor-pointer hover:-translate-y-0.5 active:scale-98 transition-all duration-300 shadow-sm'
                  ]"
                  @click="editSchedule(getSchedule(day, time))"
                >
                  <p class="font-bold text-xs">{{ getSchedule(day, time).subject }}</p>
                  <p class="text-[10px] opacity-80 mt-0.5 font-medium">{{ getSchedule(day, time).teacher }}</p>
                  <span class="inline-block text-[9px] font-extrabold uppercase mt-1.5 px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded">
                    {{ getSchedule(day, time).room }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Summary Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      
      <!-- Resumen Semanal -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Resumen de Horas</h3>
        <div class="space-y-4">
          <div v-for="subject in subjectSummary" :key="subject.name" class="flex items-center justify-between p-1 hover:bg-slate-50 dark:hover:bg-slate-850/40 rounded-xl transition-all">
            <div class="flex items-center">
              <span :class="[getSubjectDotColor(subject.name), 'w-3 h-3 rounded-full mr-3']"></span>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-350">{{ subject.name }}</span>
            </div>
            <span class="text-xs font-black text-slate-500 dark:text-slate-400">{{ subject.hours }} hrs / sem</span>
          </div>
        </div>
      </div>

      <!-- Próximas Clases -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Clases a Continuación</h3>
        <div class="space-y-4">
          <div v-for="cls in upcomingClasses" :key="cls.id" class="flex items-center p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl hover:bg-slate-100/50 transition-all">
            <div :class="[getSubjectIconBg(cls.subject), 'w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-black text-lg']">
              {{ cls.subject.charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ cls.subject }}</p>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{{ cls.time }} • {{ cls.room }}</p>
            </div>
            <span class="text-xs font-bold text-slate-400">{{ cls.teacher.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Create/Edit Modal Dialog -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="showModal = false" class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"></div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-fade-in">
        <h3 class="text-lg font-black text-slate-800 dark:text-white mb-6">
          {{ editingSchedule ? 'Editar' : 'Nuevo' }} Horario
        </h3>
        <form @submit.prevent="saveSchedule" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Materia</label>
            <select v-model="form.subject" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Profesor</label>
            <select v-model="form.teacher" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Día</label>
            <select v-model="form.day" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option v-for="day in weekDays" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Hora</label>
            <select v-model="form.time" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Aula</label>
            <input v-model="form.room" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
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
  { id: 1, subject: 'Matemáticas', teacher: 'Roberto Sánchez', day: 'Lunes', time: '7:00 - 7:45', room: 'Aula 301' },
  { id: 2, subject: 'Español', teacher: 'Laura García', day: 'Lunes', time: '7:45 - 8:30', room: 'Aula 302' },
  { id: 3, subject: 'Ciencias', teacher: 'Miguel Torres', day: 'Martes', time: '8:30 - 9:15', room: 'Lab 101' },
  { id: 4, subject: 'Inglés', teacher: 'Patricia Luna', day: 'Miércoles', time: '9:30 - 10:15', room: 'Aula 303' },
])

const getSchedule = (day, time) => {
  return schedules.value.find(s => s.day === day && s.time === time)
}

const getScheduleColor = (subject) => {
  const colors = {
    Matemáticas: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    Español: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Ciencias: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    Inglés: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
  }
  return colors[subject] || 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
}

const getSubjectDotColor = (subject) => {
  const colors = {
    Matemáticas: 'bg-blue-550',
    Español: 'bg-emerald-500',
    Ciencias: 'bg-purple-500',
    Inglés: 'bg-orange-500'
  }
  return colors[subject] || 'bg-slate-400'
}

const getSubjectIconBg = (subject) => {
  const colors = {
    Matemáticas: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    Español: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    Ciencias: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    Inglés: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
  }
  return colors[subject] || 'bg-slate-500/10 text-slate-500'
}

const subjectSummary = computed(() => {
  const summary = {}
  schedules.value.forEach(s => {
    if (!summary[s.subject]) {
      summary[s.subject] = { name: s.subject, hours: 0 }
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
    schedules.value[index] = { ...form.value, id: editingSchedule.value.id }
  } else {
    schedules.value.push({ ...form.value, id: Date.now() })
  }
  showModal.value = false
  form.value = { subject: '', teacher: '', day: '', time: '', room: '' }
  editingSchedule.value = null
}
</script>
