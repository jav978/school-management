<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Carnets de Identificación Escolar
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Credenciales con foto, código QR, diseño frente y reverso imprimibles en formato estándar
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openCreateModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Emitir Nuevo Carnet</span>
        </button>

        <button 
          @click="triggerPrint()" 
          type="button"
          class="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2"
        >
          <span>🖨️ Imprimir Carnet(s)</span>
        </button>
      </div>
    </div>

    <!-- Toolbar Filters (print:hidden) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Filtrar por Tipo:</span>
        <select 
          v-model="filterType"
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100"
        >
          <option value="">Todos los Carnets</option>
          <option value="estudiante">Estudiantes</option>
          <option value="profesor">Profesores</option>
          <option value="administrativo">Administrativos</option>
          <option value="obrero">Obreros / Servicios</option>
        </select>
      </div>

      <div class="text-xs text-slate-400">
        Carnets listados: <strong class="text-slate-700 dark:text-slate-200">{{ filteredCards.length }}</strong>
      </div>
    </div>

    <!-- ID Cards Grid View (Side by side Front & Back for each card) -->
    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <div v-else-if="filteredCards.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border">
      <p class="text-4xl mb-2">🪪</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay carnets registrados</h3>
      <p class="text-xs text-slate-400 mt-1">Genera credenciales con el botón "Emitir Nuevo Carnet".</p>
    </div>

    <div v-else class="space-y-8">
      <div 
        v-for="card in filteredCards" 
        :key="card.id"
        class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-sm print:p-0 print:border-none print:shadow-none"
      >
        <div class="flex justify-between items-center mb-4 print:hidden border-b pb-3">
          <div>
            <h2 class="text-base font-bold text-slate-850 dark:text-white">{{ card.recipient_name }}</h2>
            <p class="text-xs text-slate-400 font-mono">{{ card.card_code }} • C.I: {{ card.recipient_id_card }}</p>
          </div>
          <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-full uppercase">
            {{ card.recipient_type }}
          </span>
        </div>

        <!-- Pair of Front and Back Cards (Standard Vertical CR80 Credential) -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
          
          <!-- 1. FRENTE DEL CARNET -->
          <div class="w-[280px] h-[440px] bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-900 relative print:shadow-none print:border-slate-400">
            <!-- Header Banner -->
            <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 text-center relative">
              <div class="flex items-center justify-center gap-2">
                <img src="/logocolegio.png" alt="Logo" class="w-8 h-8 object-contain bg-white rounded-lg p-0.5" />
                <div class="text-left">
                  <h3 class="font-black text-xs uppercase tracking-tight leading-none">U.E Santa Luisa</h3>
                  <span class="text-[8px] font-semibold opacity-90 block leading-tight">Comunidad Educativa Vicenciana</span>
                </div>
              </div>
            </div>

            <!-- Profile Photo -->
            <div class="flex flex-col items-center px-4 pt-2">
              <div class="w-28 h-28 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md bg-slate-100 flex items-center justify-center">
                <img 
                  v-if="card.photo_url" 
                  :src="card.photo_url" 
                  :alt="card.recipient_name"
                  class="w-full h-full object-cover" 
                />
                <span v-else class="text-3xl font-bold text-slate-400">
                  {{ card.recipient_name[0] }}
                </span>
              </div>

              <!-- Name and Details -->
              <h4 class="font-black text-sm text-center leading-tight mt-3 text-slate-900">
                {{ card.recipient_name }}
              </h4>
              <p class="text-[11px] font-bold text-orange-600 uppercase mt-0.5">
                {{ card.position || card.recipient_type }}
              </p>
              <p class="text-[10px] text-slate-500 font-semibold">
                {{ card.grade_level || card.department || 'Educación Media' }}
              </p>
            </div>

            <!-- Footer Section of Front -->
            <div class="p-3 bg-slate-50 border-t border-slate-200 text-center space-y-1">
              <div class="flex justify-between text-[10px] font-bold text-slate-700">
                <span>C.I: {{ card.recipient_id_card || 'V-00000000' }}</span>
                <span>VENCE: {{ formatDate(card.expiry_date) }}</span>
              </div>
              <p class="font-mono text-[9px] text-slate-400">{{ card.card_code }}</p>
            </div>
          </div>

          <!-- 2. REVERSO DEL CARNET -->
          <div class="w-[280px] h-[440px] bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between text-slate-800 p-4 relative print:shadow-none print:border-slate-400">
            <!-- Institutional Disclaimer -->
            <div>
              <div class="text-center pb-2 border-b border-slate-200">
                <p class="text-[9px] font-bold uppercase text-slate-400">Credencial de Identificación</p>
                <p class="text-[8px] text-slate-500 leading-tight">
                  Este carnet es personal e intransferible. Acredita al portador como miembro activo de la institución.
                </p>
              </div>

              <!-- Medical and Emergency Details -->
              <div class="mt-3 space-y-1.5 text-[10px]">
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Tipo de Sangre:</span>
                  <span class="font-bold text-rose-600">{{ card.blood_type || 'O+' }}</span>
                </div>
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Emergencia:</span>
                  <span class="font-semibold text-right truncate max-w-[140px]">{{ card.emergency_contact || 'Representante' }}</span>
                </div>
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Tel. Emergencia:</span>
                  <span class="font-semibold">{{ card.emergency_phone || '+58 414 000 0000' }}</span>
                </div>
                <div class="flex justify-between border-b pb-1">
                  <span class="text-slate-400 font-bold">Dirección:</span>
                  <span class="font-medium text-[9px] text-right truncate max-w-[140px]">{{ card.address || 'Caracas, Venezuela' }}</span>
                </div>
              </div>
            </div>

            <!-- QR Code and Scanner Validation -->
            <div class="flex flex-col items-center justify-center my-auto py-2">
              <ui-qr-code 
                :value="getVerificationUrl(card.card_code)"
                :size="80"
              />
              <span class="text-[8px] font-mono text-slate-500 mt-1 font-bold">LECTURA DE ASISTENCIA QR</span>
            </div>

            <!-- Authorized Signature line -->
            <div class="text-center pt-2 border-t border-slate-200">
              <div class="w-24 border-b border-slate-600 mx-auto mb-0.5"></div>
              <p class="text-[8px] font-bold uppercase">Sor Dolores Amaya • Directora</p>
              <p class="text-[7px] text-slate-400">Av. San Martín, Caracas • (0212) 123-4567</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">Emitir Nuevo Carnet</h2>

        <form @submit.prevent="saveCard" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nombre Completo *</label>
              <input 
                v-model="cardForm.recipient_name" 
                required 
                placeholder="Ej: Sofía Morales"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Cédula de Identidad *</label>
              <input 
                v-model="cardForm.recipient_id_card" 
                required 
                placeholder="V-32456789"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Personal / Rol</label>
              <select 
                v-model="cardForm.recipient_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor / Docente</option>
                <option value="administrativo">Administrativo</option>
                <option value="obrero">Obrero / Servicios</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Cargo o Grado</label>
              <input 
                v-model="cardForm.position" 
                placeholder="1er Año Sección A / Docente"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Sangre</label>
              <input 
                v-model="cardForm.blood_type" 
                placeholder="O+, A+, B+..."
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tel. de Emergencia</label>
              <input 
                v-model="cardForm.emergency_phone" 
                placeholder="+58 414 123 4567"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">URL Foto Carnet</label>
            <input 
              v-model="cardForm.photo_url" 
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
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
            >
              Emitir Carnet
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
const idCards = ref([])
const loading = ref(true)
const filterType = ref('')
const isModalOpen = ref(false)

const cardForm = ref({
  recipient_name: '',
  recipient_id_card: '',
  recipient_type: 'estudiante',
  position: 'Estudiante Regular',
  department: 'Educación Media',
  blood_type: 'O+',
  emergency_contact: 'Representante Legal',
  emergency_phone: '+58 414 123 4567',
  address: 'Av. San Martín, Caracas',
  photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'
})

const fetchIdCards = async () => {
  loading.value = true
  try {
    const res = await api.get('id-cards')
    idCards.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching id cards:', err)
  } finally {
    loading.value = false
  }
}

const filteredCards = computed(() => {
  if (!filterType.value) return idCards.value
  return idCards.value.filter(c => c.recipient_type === filterType.value)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '07/2027'
  return new Date(dateStr).toLocaleDateString('es-VE', {
    month: '2-digit',
    year: 'numeric'
  })
}

const getVerificationUrl = (code) => {
  if (process.client) {
    return `${window.location.origin}/verificar-boleta/${code || 'CRD-2026-001'}`
  }
  return `https://santaluisa.edu.ve/verificar-boleta/${code || 'CRD-2026-001'}`
}

const triggerPrint = () => {
  window.print()
}

const openCreateModal = () => {
  cardForm.value = {
    recipient_name: '',
    recipient_id_card: '',
    recipient_type: 'estudiante',
    position: 'Estudiante Regular',
    department: 'Educación Media',
    blood_type: 'O+',
    emergency_contact: 'Representante Legal',
    emergency_phone: '+58 414 123 4567',
    address: 'Av. San Martín, Caracas',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  }
  isModalOpen.value = true
}

const saveCard = async () => {
  const code = `CRD-${cardForm.value.recipient_type.slice(0, 3).toUpperCase()}-2026-${String(idCards.value.length + 1).padStart(3, '0')}`
  const payload = {
    ...cardForm.value,
    card_code: code,
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: '2027-07-31',
    status: 'activo',
    is_printed: true
  }

  try {
    await api.post('id-cards', payload)
    isModalOpen.value = false
    await fetchIdCards()
  } catch (err) {
    alert('Error al guardar carnet: ' + err.message)
  }
}

onMounted(fetchIdCards)
</script>
