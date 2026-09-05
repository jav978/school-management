<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Planificaciones Académicas
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Planificación curricular por lapsos, temas indispensables y planes de evaluación
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Planificación</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Planes</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold text-xl">
          📑
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aprobadas</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1">{{ stats.aprobadas }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Finalizadas</p>
          <p class="text-3xl font-black font-display text-blue-600 dark:text-blue-400 mt-1">{{ stats.finalizadas }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center font-bold text-xl">
          ⏱️
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Borrador</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-amber-400 mt-1">{{ stats.borrador }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold text-xl">
          ✏️
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por materia, tema indispensable, proyecto o grado..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-slate-100"
        />
        <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <select 
          v-model="selectedPeriod" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Lapsos</option>
          <option value="1er lapso">1er Lapso</option>
          <option value="2do lapso">2do Lapso</option>
          <option value="3er lapso">3er Lapso</option>
        </select>

        <select 
          v-model="selectedStatus" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Estados</option>
          <option value="aprobada">Aprobada</option>
          <option value="finalizada">Finalizada</option>
          <option value="borrador">Borrador</option>
        </select>
      </div>
    </div>

    <!-- Planning Cards List -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Cargando planificaciones curriculares...</p>
    </div>

    <div v-else-if="filteredPlannings.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
      <p class="text-4xl mb-2">📚</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay planificaciones registradas</h3>
      <p class="text-xs text-slate-400 mt-1">Crea la primera planificación docente para el lapso en curso.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="plan in filteredPlannings" 
        :key="plan.id"
        class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all"
      >
        <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                {{ plan.period }} • {{ plan.academic_year }}
              </span>
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {{ plan.grade }} {{ plan.section ? `Secc. ${plan.section}` : '' }}
              </span>
              <span 
                :class="getStatusBadgeClass(plan.status)"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize"
              >
                {{ plan.status }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-850 dark:text-white">
              {{ plan.indispensable_theme || 'Planificación Académica' }}
            </h3>
            <p v-if="plan.project_theme" class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              <strong class="text-slate-700 dark:text-slate-300">Proyecto:</strong> {{ plan.project_theme }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="toggleDetails(plan.id)"
              class="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-all"
            >
              {{ expandedId === plan.id ? 'Ocultar Detalle ▲' : 'Ver Plan Semanal ▼' }}
            </button>
            <button 
              @click="editPlan(plan)"
              class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Editar
            </button>
            <button 
              @click="deletePlan(plan)"
              class="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
            >
              Eliminar
            </button>
          </div>
        </div>

        <!-- Expanded Details: Weekly Schedule & Evaluation Plan -->
        <div v-if="expandedId === plan.id" class="mt-4 pt-4 space-y-4">
          <!-- Weekly Planning -->
          <div v-if="getArray(plan.weekly_planning).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cronograma Semanal:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="(w, idx) in getArray(plan.weekly_planning)" 
                :key="idx"
                class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div class="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  <span>Semana {{ w.week || idx + 1 }}</span>
                </div>
                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">{{ w.topic }}</p>
                <p class="text-[11px] text-slate-500 mt-1">{{ w.activities }}</p>
              </div>
            </div>
          </div>

          <!-- Evaluation Plan -->
          <div v-if="getArray(plan.evaluation_plan).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Plan de Evaluación (Ponderación 100%):</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500">
                  <tr>
                    <th class="p-2.5">Estrategia / Evaluación</th>
                    <th class="p-2.5">Instrumento</th>
                    <th class="p-2.5 text-center">Semana</th>
                    <th class="p-2.5 text-right">Porcentaje</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="(ev, idx) in getArray(plan.evaluation_plan)" :key="idx">
                    <td class="p-2.5 font-bold text-slate-800 dark:text-slate-100">{{ ev.evaluation }}</td>
                    <td class="p-2.5 text-slate-600 dark:text-slate-300">{{ ev.instrument || 'Rúbrica' }}</td>
                    <td class="p-2.5 text-center text-slate-600 dark:text-slate-300">{{ ev.week ? `Sem. ${ev.week}` : '-' }}</td>
                    <td class="p-2.5 text-right font-black text-indigo-600 dark:text-indigo-400">{{ ev.percentage }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">
          {{ isEditing ? 'Editar Planificación' : 'Nueva Planificación Curricular' }}
        </h2>

        <form @submit.prevent="savePlan" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Año Escolar *</label>
              <input 
                v-model="form.academic_year" 
                required 
                placeholder="2026-2027"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Período / Lapso *</label>
              <select 
                v-model="form.period" 
                required
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="1er lapso">1er Lapso</option>
                <option value="2do lapso">2do Lapso</option>
                <option value="3er lapso">3er Lapso</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Estado</label>
              <select 
                v-model="form.status"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="borrador">Borrador</option>
                <option value="finalizada">Finalizada</option>
                <option value="aprobada">Aprobada</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Grado / Nivel *</label>
              <input 
                v-model="form.grade" 
                required 
                placeholder="1er Año"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Sección</label>
              <input 
                v-model="form.section" 
                placeholder="A"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tema Indispensable *</label>
            <input 
              v-model="form.indispensable_theme" 
              required 
              placeholder="Ej: Ciencia, tecnología y soberanía nacional"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tema Generador / Proyecto</label>
            <input 
              v-model="form.project_theme" 
              placeholder="Ej: Aplicaciones del método científico en el huerto escolar"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Horario del Grupo</label>
            <input 
              v-model="form.group_schedule" 
              placeholder="Lunes y Miércoles 07:00 - 08:30"
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
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
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
const plannings = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedPeriod = ref('')
const selectedStatus = ref('')
const expandedId = ref(null)

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const form = ref({
  teacher_id: 1,
  subject_id: 1,
  academic_year: '2026-2027',
  period: '1er lapso',
  grade: '1er Año',
  section: 'A',
  group_schedule: 'Lunes y Miércoles 07:00 - 08:30',
  indispensable_theme: '',
  project_theme: '',
  status: 'borrador'
})

const fetchPlannings = async () => {
  loading.value = true
  try {
    const res = await api.get('academic-plannings')
    plannings.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching plannings:', err)
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const total = plannings.value.length
  const aprobadas = plannings.value.filter(p => p.status === 'aprobada').length
  const finalizadas = plannings.value.filter(p => p.status === 'finalizada').length
  const borrador = plannings.value.filter(p => p.status === 'borrador').length
  return { total, aprobadas, finalizadas, borrador }
})

const filteredPlannings = computed(() => {
  return plannings.value.filter(p => {
    const term = searchQuery.value.toLowerCase()
    const matchesSearch = !searchQuery.value ||
      (p.indispensable_theme?.toLowerCase().includes(term) ||
       p.project_theme?.toLowerCase().includes(term) ||
       p.grade?.toLowerCase().includes(term))
    
    const matchesPeriod = !selectedPeriod.value || p.period === selectedPeriod.value
    const matchesStatus = !selectedStatus.value || p.status === selectedStatus.value

    return matchesSearch && matchesPeriod && matchesStatus
  })
})

const getArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try {
    return JSON.parse(val)
  } catch {
    return []
  }
}

const toggleDetails = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'aprobada': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'finalizada': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    case 'borrador': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const openModal = () => {
  isEditing.value = false
  currentId.value = null
  form.value = {
    teacher_id: 1,
    subject_id: 1,
    academic_year: '2026-2027',
    period: '1er lapso',
    grade: '1er Año',
    section: 'A',
    group_schedule: '',
    indispensable_theme: '',
    project_theme: '',
    status: 'borrador'
  }
  isModalOpen.value = true
}

const editPlan = (plan) => {
  isEditing.value = true
  currentId.value = plan.id
  form.value = { ...plan }
  isModalOpen.value = true
}

const savePlan = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`academic-plannings/${currentId.value}`, form.value)
    } else {
      await api.post('academic-plannings', form.value)
    }
    isModalOpen.value = false
    await fetchPlannings()
  } catch (err) {
    alert('Error al guardar: ' + (err.message || 'Verifica los campos'))
  } finally {
    saving.value = false
  }
}

const deletePlan = async (plan) => {
  if (!confirm('¿Deseas eliminar esta planificación académica?')) return
  try {
    await api.remove(`academic-plannings/${plan.id}`)
    await fetchPlannings()
  } catch (err) {
    alert('Error al eliminar: ' + err.message)
  }
}

onMounted(fetchPlannings)
</script>
