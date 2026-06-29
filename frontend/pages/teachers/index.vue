<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Profesores</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Gestión del personal docente y asignación académica</p>
      </div>
      <button 
        @click="showModal = true" 
        class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300"
      >
        + Nuevo Profesor
      </button>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar profesor..."
            class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
          />
          <span class="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
        </div>
        <select v-model="filterSubject" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
          <option value="">Todas las materias</option>
          <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
        </select>
      </div>
    </div>

    <!-- Teachers Grid layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="teacher in filteredTeachers" :key="teacher.id" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mr-4 font-black text-lg">
                {{ teacher.initials }}
              </div>
              <div>
                <h3 class="font-bold text-slate-850 dark:text-slate-100 leading-snug">{{ teacher.name }}</h3>
                <p class="text-xs text-slate-400">{{ teacher.specialization }}</p>
              </div>
            </div>
            <span :class="[teacher.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400', 'text-[10px] font-bold px-2 py-0.5 rounded-lg']">
              {{ teacher.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          
          <div class="mt-6 space-y-3 border-t border-slate-50 dark:border-slate-850/40 pt-4">
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <span class="mr-2.5">📧</span>
              <span class="truncate font-semibold">{{ teacher.email }}</span>
            </div>
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <span class="mr-2.5">📚</span>
              <span class="font-semibold">{{ teacher.subjects.join(', ') }}</span>
            </div>
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <span class="mr-2.5">📅</span>
              <span class="font-semibold">{{ teacher.classes }} clases asignadas</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-50 dark:border-slate-850/40 flex justify-end gap-2">
          <button @click="editTeacher(teacher)" class="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 active:scale-95 transition-all" title="Editar">
            ✏️
          </button>
          <button @click="viewTeacher(teacher)" class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-bold transition-all" title="Ver Perfil">
            👁️ Perfil
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal Dialog -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="showModal = false" class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"></div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-fade-in">
        <h3 class="text-lg font-black text-slate-800 dark:text-white mb-6">
          {{ editingTeacher ? 'Editar' : 'Nuevo' }} Profesor
        </h3>
        <form @submit.prevent="saveTeacher" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Nombre Completo</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Especialización</label>
            <input v-model="form.specialization" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Materias (Ctrl+Click para seleccionar varias)</label>
            <select v-model="form.subjects" multiple class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 h-28">
              <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
            </select>
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

const search = ref('')
const filterSubject = ref('')
const showModal = ref(false)
const editingTeacher = ref(null)

const subjects = ['Matemáticas', 'Español', 'Ciencias', 'Historia', 'Inglés', 'Educación Física', 'Arte', 'Música']

const form = ref({
  name: '',
  email: '',
  specialization: '',
  subjects: []
})

const teachers = ref([
  { id: 1, name: 'Roberto Sánchez Mora', email: 'roberto@school.com', specialization: 'Matemáticas', subjects: ['Matemáticas', 'Física'], classes: 5, status: 'active', initials: 'RS' },
  { id: 2, name: 'Laura García Pérez', email: 'laura@school.com', specialization: 'Español y Literatura', subjects: ['Español', 'Literatura'], classes: 4, status: 'active', initials: 'LG' },
  { id: 3, name: 'Miguel Torres Ruiz', email: 'miguel@school.com', specialization: 'Ciencias Naturales', subjects: ['Ciencias', 'Biología'], classes: 3, status: 'active', initials: 'MT' },
  { id: 4, name: 'Patricia Luna Vega', email: 'patricia@school.com', specialization: 'Inglés', subjects: ['Inglés'], classes: 6, status: 'active', initials: 'PL' },
])

const filteredTeachers = computed(() => {
  return teachers.value.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.value.toLowerCase()) || 
                         t.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesSubject = !filterSubject.value || t.subjects.includes(filterSubject.value)
    return matchesSearch && matchesSubject
  })
})

const editTeacher = (teacher) => {
  editingTeacher.value = teacher
  form.value = { ...teacher }
  showModal.value = true
}

const viewTeacher = (teacher) => {
  navigateTo(`/teachers/${teacher.id}`)
}

const saveTeacher = () => {
  if (editingTeacher.value) {
    const index = teachers.value.findIndex(t => t.id === editingTeacher.value.id)
    teachers.value[index] = { ...form.value, id: editingTeacher.value.id }
  } else {
    teachers.value.push({
      ...form.value,
      id: Date.now(),
      classes: 0,
      status: 'active',
      initials: form.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })
  }
  showModal.value = false
  form.value = { name: '', email: '', specialization: '', subjects: [] }
  editingTeacher.value = null
}
</script>
