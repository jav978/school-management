<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 border border-amber-200/60 dark:border-amber-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Aulas y Espacios Escolares
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestión de infraestructura, laboratorios y auditorios de la U.E Santa Luisa
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Aula / Espacio</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Espacios</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold text-xl">
          🏫
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disponibles</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1">{{ stats.disponibles }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capacidad Total</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1">{{ stats.totalCapacity }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center font-bold text-xl">
          👥
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Mantenimiento</p>
          <p class="text-3xl font-black font-display text-rose-600 dark:text-rose-400 mt-1">{{ stats.mantenimiento }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center font-bold text-xl">
          ⚠️
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por código, nombre, edificio o equipamiento..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 dark:text-slate-100"
        />
        <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Type Filter -->
        <select 
          v-model="selectedType" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Tipos</option>
          <option value="aula_regular">Aulas Regulares</option>
          <option value="laboratorio">Laboratorios</option>
          <option value="biblioteca">Biblioteca</option>
          <option value="auditorio">Auditorio</option>
          <option value="gimnasio">Gimnasio</option>
        </select>

        <!-- Status Filter -->
        <select 
          v-model="selectedStatus" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Estados</option>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="mantenimiento">En Mantenimiento</option>
        </select>
      </div>
    </div>

    <!-- Classrooms Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Cargando espacios...</p>
    </div>

    <div v-else-if="filteredClassrooms.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
      <p class="text-4xl mb-2">🔍</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No se encontraron espacios</h3>
      <p class="text-xs text-slate-400 mt-1">Prueba a cambiar los filtros o agrega una nueva aula.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div 
        v-for="room in filteredClassrooms" 
        :key="room.id"
        class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <!-- Top Row: Room Code & Status Badge -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl font-black text-xs font-display">
              {{ room.room_number }}
            </span>
            <span 
              :class="getStatusBadgeClass(room.status)"
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize"
            >
              {{ room.status }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-850 dark:text-white leading-snug">
            {{ room.name }}
          </h3>
          <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span>📍 {{ room.building || 'Edificio Principal' }}</span>
            <span v-if="room.floor !== null && room.floor !== undefined">• Piso {{ room.floor }}</span>
          </p>

          <!-- Capacity & Type Chips -->
          <div class="flex items-center gap-2 mt-4 text-xs font-semibold">
            <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
              👥 {{ room.capacity }} puestos
            </span>
            <span class="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg capitalize">
              {{ formatType(room.type) }}
            </span>
          </div>

          <!-- Equipment Info -->
          <div v-if="room.equipment" class="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60">
            <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Equipamiento:</p>
            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{{ room.equipment }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <button 
            @click="editRoom(room)"
            class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Editar
          </button>
          <button 
            @click="deleteRoom(room)"
            class="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">
          {{ isEditing ? 'Editar Aula / Espacio' : 'Nueva Aula o Espacio' }}
        </h2>

        <form @submit.prevent="saveRoom" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Número / Código *</label>
              <input 
                v-model="form.room_number" 
                required 
                placeholder="Ej: A-101"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Capacidad *</label>
              <input 
                v-model.number="form.capacity" 
                type="number" 
                required 
                placeholder="35"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nombre del Espacio *</label>
            <input 
              v-model="form.name" 
              required 
              placeholder="Ej: Laboratorio de Química y Biología"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Espacio</label>
              <select 
                v-model="form.type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="aula_regular">Aula Regular</option>
                <option value="laboratorio">Laboratorio</option>
                <option value="biblioteca">Biblioteca</option>
                <option value="auditorio">Auditorio</option>
                <option value="gimnasio">Gimnasio</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Estado</label>
              <select 
                v-model="form.status"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Edificio</label>
              <input 
                v-model="form.building" 
                placeholder="Edificio San Vicente"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Piso</label>
              <input 
                v-model.number="form.floor" 
                type="number" 
                placeholder="1"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Equipamiento e Instalaciones</label>
            <textarea 
              v-model="form.equipment" 
              rows="3"
              placeholder="Proyector multimedia, pizarra acrílica, pupitres, aire acondicionado..."
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
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
              class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20"
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
const classrooms = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const form = ref({
  room_number: '',
  name: '',
  capacity: 35,
  type: 'aula_regular',
  status: 'disponible',
  building: 'Edificio Central San Vicente',
  floor: 1,
  equipment: ''
})

const fetchClassrooms = async () => {
  loading.value = true
  try {
    const res = await api.get('classrooms')
    classrooms.value = res.data || res || []
  } catch (err) {
    console.error('Error loading classrooms:', err)
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = classrooms.value.length
  const disponibles = classrooms.value.filter(c => c.status === 'disponible').length
  const mantenimiento = classrooms.value.filter(c => c.status === 'mantenimiento').length
  const totalCapacity = classrooms.value.reduce((acc, c) => acc + (parseInt(c.capacity, 10) || 0), 0)
  return { total, disponibles, mantenimiento, totalCapacity }
})

const filteredClassrooms = computed(() => {
  return classrooms.value.filter(c => {
    const matchesSearch = !searchQuery.value || 
      (c.room_number?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
       c.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
       c.building?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
       c.equipment?.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesType = !selectedType.value || c.type === selectedType.value
    const matchesStatus = !selectedStatus.value || c.status === selectedStatus.value

    return matchesSearch && matchesType && matchesStatus
  })
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'disponible': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'ocupada': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    case 'mantenimiento': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const formatType = (type) => {
  switch (type) {
    case 'aula_regular': return 'Aula Regular'
    case 'laboratorio': return 'Laboratorio'
    case 'biblioteca': return 'Biblioteca'
    case 'auditorio': return 'Auditorio'
    case 'gimnasio': return 'Gimnasio'
    default: return type || 'Espacio'
  }
}

const openModal = () => {
  isEditing.value = false
  currentId.value = null
  form.value = {
    room_number: '',
    name: '',
    capacity: 35,
    type: 'aula_regular',
    status: 'disponible',
    building: 'Edificio Central San Vicente',
    floor: 1,
    equipment: ''
  }
  isModalOpen.value = true
}

const editRoom = (room) => {
  isEditing.value = true
  currentId.value = room.id
  form.value = { ...room }
  isModalOpen.value = true
}

const saveRoom = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`classrooms/${currentId.value}`, form.value)
    } else {
      await api.post('classrooms', form.value)
    }
    isModalOpen.value = false
    await fetchClassrooms()
  } catch (err) {
    alert('Error al guardar el espacio: ' + (err.message || 'Verifica los campos'))
  } finally {
    saving.value = false
  }
}

const deleteRoom = async (room) => {
  if (!confirm(`¿Eliminar el aula ${room.name} (${room.room_number})?`)) return
  try {
    await api.remove(`classrooms/${room.id}`)
    await fetchClassrooms()
  } catch (err) {
    alert('Error al eliminar: ' + err.message)
  }
}

onMounted(fetchClassrooms)
</script>
