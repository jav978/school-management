<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Estudiantes</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Administración central de matrículas y expedientes académicos</p>
      </div>
      <button 
        @click="showModal = true" 
        class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300"
      >
        + Nuevo Estudiante
      </button>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar estudiante..."
            class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
          />
          <span class="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
        </div>
        <select v-model="filterGrade" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
          <option value="">Todos los grados</option>
          <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
        </select>
        <select v-model="filterStatus" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
    </div>

    <!-- Students Table Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="pb-4 pl-2">Estudiante</th>
              <th class="pb-4">Matrícula</th>
              <th class="pb-4">Grado</th>
              <th class="pb-4">Estado</th>
              <th class="pb-4 text-right pr-4">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-850/40 text-sm">
            <tr v-for="item in filteredStudents" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
              <td class="py-4 pl-2">
                <div class="flex items-center">
                  <div class="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black text-xs mr-3">
                    <span>{{ item.initials }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-slate-100">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">{{ item.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 text-slate-500 dark:text-slate-400 font-medium">{{ item.enrollment }}</td>
              <td class="py-4 text-slate-500 dark:text-slate-400 font-medium">{{ item.grade }}</td>
              <td class="py-4">
                <span :class="[item.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400', 'text-xs font-bold px-2.5 py-1 rounded-lg']">
                  {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-4 text-right pr-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="editStudent(item)" class="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 active:scale-95 transition-all" title="Editar">
                    ✏️
                  </button>
                  <button @click="deleteStudent(item)" class="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal Dialog -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop overlay -->
      <div @click="closeModal" class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"></div>

      <!-- Dialog Panel -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-fade-in">
        <h3 class="text-lg font-black text-slate-800 dark:text-white mb-6">
          {{ editingStudent ? 'Editar' : 'Nuevo' }} Estudiante
        </h3>

        <form @submit.prevent="saveStudent" class="space-y-5">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Nombre Completo</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" placeholder="Ej. Juan Pérez" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" placeholder="ejemplo@school.com" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Grado</label>
            <select v-model="form.grade" required class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-350 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300">
              <option value="" disabled>Seleccionar grado</option>
              <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="button" @click="closeModal" class="px-5 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold rounded-2xl text-xs transition-colors">
              Cancelar
            </button>
            <button type="submit" class="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-300">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingStudent = ref(null)

const grades = ['1ro Primaria', '2do Primaria', '3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria', '1ro Secundaria', '2do Secundaria', '3ro Secundaria']

const form = ref({
  name: '',
  email: '',
  grade: ''
})

const students = ref([
  { id: 1, name: 'Juan Pérez García', email: 'juan@estudiante.edu', enrollment: 'EST-001', grade: '3ro Secundaria', status: 'active', initials: 'JP' },
  { id: 2, name: 'María López Silva', email: 'maria@estudiante.edu', enrollment: 'EST-002', grade: '2do Secundaria', status: 'active', initials: 'ML' },
  { id: 3, name: 'Carlos Rodríguez Luna', email: 'carlos@estudiante.edu', enrollment: 'EST-003', grade: '1ro Secundaria', status: 'active', initials: 'CR' },
  { id: 4, name: 'Ana Martínez Ruiz', email: 'ana@padre.com', enrollment: 'EST-004', grade: '6to Primaria', status: 'inactive', initials: 'AM' },
])

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.value.toLowerCase()) || 
                          s.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesGrade = !filterGrade.value || s.grade === filterGrade.value
    const matchesStatus = !filterStatus.value || s.status === filterStatus.value
    return matchesSearch && matchesGrade && matchesStatus
  })
})

const toast = useToast()

const editStudent = (student) => {
  editingStudent.value = student
  form.value = { ...student }
  showModal.value = true
}

const deleteStudent = (student) => {
  if (confirm(`¿Estás seguro de eliminar a ${student.name}?`)) {
    students.value = students.value.filter(s => s.id !== student.id)
    toast.add({
      title: 'Estudiante eliminado',
      description: `El estudiante ${student.name} fue eliminado satisfactoriamente.`,
      color: 'success'
    })
  }
}

const saveStudent = () => {
  if (editingStudent.value) {
    const index = students.value.findIndex(s => s.id === editingStudent.value.id)
    students.value[index] = { ...form.value, id: editingStudent.value.id }
    toast.add({
      title: 'Estudiante actualizado',
      description: `Los datos del estudiante ${form.value.name} se actualizaron satisfactoriamente.`,
      color: 'success'
    })
  } else {
    students.value.push({
      ...form.value,
      id: Date.now(),
      enrollment: `EST-${String(students.value.length + 1).padStart(3, '0')}`,
      status: 'active',
      initials: form.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })
    toast.add({
      title: 'Estudiante creado',
      description: `El estudiante ${form.value.name} se registró satisfactoriamente.`,
      color: 'success'
    })
  }
  closeModal()
}

const closeModal = () => {
  showModal.value = false
  form.value = { name: '', email: '', grade: '' }
  editingStudent.value = null
}
</script>
