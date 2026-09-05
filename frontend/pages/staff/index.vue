<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Personal y Colaboradores (Staff)
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Personal administrativo, obrero y profesionales de la U.E Santa Luisa
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Miembro de Personal</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Personal</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center font-bold text-xl">
          👥
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Administrativos</p>
          <p class="text-3xl font-black font-display text-blue-600 dark:text-blue-400 mt-1">{{ stats.administrativos }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center font-bold text-xl">
          💼
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profesionales</p>
          <p class="text-3xl font-black font-display text-purple-600 dark:text-purple-400 mt-1">{{ stats.profesionales }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center font-bold text-xl">
          🎓
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Obreros / Servicios</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-amber-400 mt-1">{{ stats.obreros }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold text-xl">
          🛠️
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre, cédula, cargo, departamento o código..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 dark:text-slate-100"
        />
        <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <select 
          v-model="selectedType" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Roles</option>
          <option value="administrativo">Administrativo</option>
          <option value="profesional">Profesional</option>
          <option value="obrero">Obrero / Servicios</option>
        </select>

        <select 
          v-model="selectedStatus" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Estados</option>
          <option value="activo">Activo</option>
          <option value="licencia">En Licencia</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
    </div>

    <!-- Staff List -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Cargando nómina de personal...</p>
    </div>

    <div v-else-if="filteredStaff.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
      <p class="text-4xl mb-2">📋</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No se encontraron registros de personal</h3>
      <p class="text-xs text-slate-400 mt-1">Añade nuevos colaboradores o ajusta los filtros de búsqueda.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div 
        v-for="person in filteredStaff" 
        :key="person.id"
        class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <!-- Top Row -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                <img 
                  v-if="person.photo_url" 
                  :src="person.photo_url" 
                  :alt="person.first_name" 
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-sm font-bold text-slate-400">
                  {{ person.first_name[0] }}{{ person.last_name[0] }}
                </span>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-850 dark:text-white leading-tight">
                  {{ person.first_name }} {{ person.last_name }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ person.position || 'Colaborador' }}
                </p>
              </div>
            </div>

            <span 
              :class="getStatusBadgeClass(person.status)"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize flex-shrink-0"
            >
              {{ person.status }}
            </span>
          </div>

          <!-- Identification & Type -->
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            <div class="flex justify-between">
              <span class="text-slate-400">Código / Cédula:</span>
              <span class="font-semibold">{{ person.staff_id }} • {{ person.id_card || 'S/C' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Tipo / Depto:</span>
              <span class="font-semibold capitalize">{{ person.staff_type }} ({{ person.department || 'General' }})</span>
            </div>
            <div v-if="person.blood_type" class="flex justify-between">
              <span class="text-slate-400">Tipo de Sangre:</span>
              <span class="font-bold text-rose-500">{{ person.blood_type }}</span>
            </div>
            <div v-if="person.phone" class="flex justify-between">
              <span class="text-slate-400">Teléfono:</span>
              <span class="font-medium">{{ person.phone }}</span>
            </div>
            <div v-if="person.emergency_contact" class="flex justify-between">
              <span class="text-slate-400">Emergencia:</span>
              <span class="font-medium text-slate-500">{{ person.emergency_contact }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <button 
            @click="editPerson(person)"
            class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Editar
          </button>
          <button 
            @click="deletePerson(person)"
            class="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">
          {{ isEditing ? 'Editar Miembro de Personal' : 'Nuevo Miembro de Personal' }}
        </h2>

        <form @submit.prevent="savePerson" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Código Único *</label>
              <input 
                v-model="form.staff_id" 
                required 
                placeholder="STF-001"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Cédula de Identidad *</label>
              <input 
                v-model="form.id_card" 
                required 
                placeholder="V-12345678"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nombre *</label>
              <input 
                v-model="form.first_name" 
                required 
                placeholder="Elena"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Apellido *</label>
              <input 
                v-model="form.last_name" 
                required 
                placeholder="Vargas"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Personal *</label>
              <select 
                v-model="form.staff_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="administrativo">Administrativo</option>
                <option value="profesional">Profesional</option>
                <option value="obrero">Obrero</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Estado</label>
              <select 
                v-model="form.status"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="activo">Activo</option>
                <option value="licencia">En Licencia</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Cargo / Puesto</label>
              <input 
                v-model="form.position" 
                placeholder="Coordinador de Servicios"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Departamento</label>
              <input 
                v-model="form.department" 
                placeholder="Administración"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Teléfono</label>
              <input 
                v-model="form.phone" 
                placeholder="+58 414 123 4567"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Sangre</label>
              <input 
                v-model="form.blood_type" 
                placeholder="O+, A+, B+..."
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Contacto de Emergencia</label>
              <input 
                v-model="form.emergency_contact" 
                placeholder="Nombre (Parentesco)"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tel. Emergencia</label>
              <input 
                v-model="form.emergency_phone" 
                placeholder="+58 412 987 6543"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">URL de Foto</label>
            <input 
              v-model="form.photo_url" 
              placeholder="https://..."
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
            >
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const staff = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const form = ref({
  staff_id: '',
  first_name: '',
  last_name: '',
  id_card: '',
  staff_type: 'administrativo',
  position: '',
  department: '',
  phone: '',
  email: '',
  photo_url: '',
  blood_type: 'O+',
  emergency_contact: '',
  emergency_phone: '',
  status: 'activo'
})

const fetchStaff = async () => {
  loading.value = true
  try {
    const res = await api.get('staff')
    staff.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching staff:', err)
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = staff.value.length
  const administrativos = staff.value.filter(s => s.staff_type === 'administrativo').length
  const profesionales = staff.value.filter(s => s.staff_type === 'profesional').length
  const obreros = staff.value.filter(s => s.staff_type === 'obrero').length
  return { total, administrativos, profesionales, obreros }
})

const filteredStaff = computed(() => {
  return staff.value.filter(s => {
    const term = searchQuery.value.toLowerCase()
    const matchesSearch = !searchQuery.value ||
      (s.first_name?.toLowerCase().includes(term) ||
       s.last_name?.toLowerCase().includes(term) ||
       s.staff_id?.toLowerCase().includes(term) ||
       s.id_card?.toLowerCase().includes(term) ||
       s.position?.toLowerCase().includes(term) ||
       s.department?.toLowerCase().includes(term))
    
    const matchesType = !selectedType.value || s.staff_type === selectedType.value
    const matchesStatus = !selectedStatus.value || s.status === selectedStatus.value

    return matchesSearch && matchesType && matchesStatus
  })
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'activo': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'licencia': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'inactivo': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const openModal = () => {
  isEditing.value = false
  currentId.value = null
  form.value = {
    staff_id: `STF-00${staff.value.length + 1}`,
    first_name: '',
    last_name: '',
    id_card: '',
    staff_type: 'administrativo',
    position: '',
    department: '',
    phone: '',
    email: '',
    photo_url: '',
    blood_type: 'O+',
    emergency_contact: '',
    emergency_phone: '',
    status: 'activo'
  }
  isModalOpen.value = true
}

const editPerson = (person) => {
  isEditing.value = true
  currentId.value = person.id
  form.value = { ...person }
  isModalOpen.value = true
}

const savePerson = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`staff/${currentId.value}`, form.value)
    } else {
      await api.post('staff', form.value)
    }
    isModalOpen.value = false
    await fetchStaff()
  } catch (err) {
    alert('Error al guardar personal: ' + (err.message || 'Verifica los campos'))
  } finally {
    saving.value = false
  }
}

const deletePerson = async (person) => {
  if (!confirm(`¿Eliminar al miembro de personal ${person.first_name} ${person.last_name}?`)) return
  try {
    await api.remove(`staff/${person.id}`)
    await fetchStaff()
  } catch (err) {
    alert('Error al eliminar: ' + err.message)
  }
}

onMounted(fetchStaff)
</script>
