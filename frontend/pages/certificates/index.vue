<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Certificados Académicos y Menciones
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Emisión de diplomas de honor, excelencia vicenciana y reconocimientos docentes con código QR
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openCreateModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Emitir Certificado</span>
        </button>

        <button 
          @click="triggerPrint()" 
          type="button"
          class="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2"
        >
          <span>🖨️ Imprimir Diploma</span>
        </button>
      </div>
    </div>

    <!-- Certificate Selection Toolbar (print:hidden) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Certificado a Visualizar:</span>
        <select 
          v-model="selectedCertId" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100"
        >
          <option v-for="c in certificates" :key="c.id" :value="c.id">
            {{ c.recipient_name }} — {{ formatCertType(c.certificate_type) }}
          </option>
        </select>
      </div>

      <div class="text-xs text-slate-400">
        Total emitidos: <strong class="text-slate-700 dark:text-slate-200">{{ certificates.length }}</strong>
      </div>
    </div>

    <!-- Diploma View in Landscape Aspect -->
    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
    </div>

    <div v-else-if="!activeCert" class="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border">
      <p class="text-4xl mb-2">📜</p>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No hay certificados registrados</h3>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Diploma Canvas (Landscape Preview & Print) -->
      <div class="bg-gradient-to-b from-[#FFFDF9] to-[#FFF9EE] text-slate-900 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600/60 shadow-2xl relative overflow-hidden print:border-4 print:shadow-none print:p-8">
        
        <!-- Ornate Background Watermark Shield -->
        <div class="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <img src="/logocolegio.png" alt="watermark" class="w-96 h-96 object-contain" />
        </div>

        <div class="relative z-10 text-center space-y-6">
          <!-- Institutional Crest & Title -->
          <div class="flex flex-col items-center justify-center">
            <img src="/logocolegio.png" alt="U.E Santa Luisa Logo" class="w-20 h-20 object-contain mb-3 drop-shadow-sm" />
            <span class="text-[11px] font-bold uppercase tracking-widest text-slate-500">República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación</span>
            <h2 class="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight uppercase mt-0.5">Unidad Educativa Santa Luisa</h2>
            <p class="text-xs italic text-amber-800 font-serif mt-0.5">Hijas de la Caridad de San Vicente de Paúl • Caracas, Venezuela</p>
          </div>

          <!-- Diploma Type Header -->
          <div class="pt-2">
            <span class="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-300">
              Certificado de {{ formatCertType(activeCert.certificate_type) }}
            </span>
          </div>

          <p class="text-xs uppercase tracking-widest text-slate-500 font-semibold">Se otorga el presente reconocimiento a:</p>

          <!-- Recipient Name -->
          <div class="py-2">
            <h3 class="text-3xl sm:text-4xl font-black font-display text-amber-900 tracking-tight border-b-2 border-amber-300 pb-2 inline-block min-w-[320px]">
              {{ activeCert.recipient_name }}
            </h3>
            <p class="text-xs text-slate-600 font-bold mt-2 capitalize">
              {{ activeCert.recipient_type === 'estudiante' ? `Estudiante de ${activeCert.grade_level || 'Media General'}` : `Docente de ${activeCert.department || 'Ciencias'}` }}
            </p>
          </div>

          <!-- Description Text -->
          <p class="text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed italic font-serif">
            "{{ activeCert.description || 'Por su destacada trayectoria y compromiso con los valores de excelencia de nuestra institución.' }}"
          </p>

          <p v-if="activeCert.average_grade" class="text-xs font-black text-amber-900">
            Índice de Rendimiento Académico: {{ activeCert.average_grade }} / 20 puntos
          </p>

          <!-- Footer: QR Code & Signatures -->
          <div class="grid grid-cols-12 gap-4 items-end pt-8 border-t border-amber-200 mt-6">
            <!-- Signatures (Col 8) -->
            <div class="col-span-9 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div class="border-t-2 border-slate-700 w-44 mx-auto mb-1"></div>
                <p class="font-bold text-slate-850">{{ activeCert.issued_by || 'Sor Dolores Amaya' }}</p>
                <p class="text-[10px] text-slate-500 uppercase">{{ activeCert.issued_role || 'Directora General' }}</p>
              </div>
              <div>
                <div class="border-t-2 border-slate-700 w-44 mx-auto mb-1"></div>
                <p class="font-bold text-slate-850">Prof. Elena Vargas</p>
                <p class="text-[10px] text-slate-500 uppercase">Control de Estudios y Evaluación</p>
              </div>
            </div>

            <!-- Verification QR Code (Col 3) -->
            <div class="col-span-3 flex flex-col items-center justify-center">
              <ui-qr-code 
                :value="getVerificationUrl(activeCert.verification_code)"
                :size="64"
              />
              <span class="font-mono text-[9px] text-amber-900 font-bold mt-1">{{ activeCert.verification_code }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue Certificate Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">Emitir Certificado</h2>

        <form @submit.prevent="saveCertificate" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nombre del Destinatario *</label>
            <input 
              v-model="certForm.recipient_name" 
              required 
              placeholder="Ej: Sofía Valentina Morales"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Destinatario</label>
              <select 
                v-model="certForm.recipient_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor / Docente</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tipo de Certificado</label>
              <select 
                v-model="certForm.certificate_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="excelencia_academica">Excelencia Académica</option>
                <option value="mejor_promedio">Mejor Promedio</option>
                <option value="conducta_excelente">Conducta Excelente</option>
                <option value="participacion_destacada">Participación Destacada</option>
                <option value="reconocimiento_docente">Reconocimiento Docente</option>
                <option value="tiempo_servicio">Años de Servicio</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Año Escolar</label>
              <input 
                v-model="certForm.academic_year" 
                placeholder="2026-2027"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Promedio Obtenido</label>
              <input 
                v-model.number="certForm.average_grade" 
                type="number" 
                step="0.01" 
                placeholder="19.5"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Descripción del Logro</label>
            <textarea 
              v-model="certForm.description" 
              rows="3"
              placeholder="Motivo del otorgamiento..."
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
              class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20"
            >
              Emitir Diploma
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
const certificates = ref([])
const loading = ref(true)
const selectedCertId = ref(null)
const isModalOpen = ref(false)

const certForm = ref({
  recipient_name: '',
  recipient_type: 'estudiante',
  certificate_type: 'excelencia_academica',
  academic_year: '2026-2027',
  grade_level: '1er Año Media General',
  average_grade: 19.5,
  issued_by: 'Sor María Dolores Amaya',
  issued_role: 'Directora General',
  description: 'Por haber demostrado excelencia académica y virtudes humanas ejemplares durante el período escolar.'
})

const fetchCertificates = async () => {
  loading.value = true
  try {
    const res = await api.get('certificates')
    certificates.value = res.data || res || []
    if (certificates.value.length > 0 && !selectedCertId.value) {
      selectedCertId.value = certificates.value[0].id
    }
  } catch (err) {
    console.error('Error fetching certificates:', err)
  } finally {
    loading.value = false
  }
}

const activeCert = computed(() => {
  return certificates.value.find(c => c.id === selectedCertId.value) || certificates.value[0]
})

const formatCertType = (type) => {
  switch (type) {
    case 'excelencia_academica': return 'Excelencia Académica'
    case 'mejor_promedio': return 'Mejor Promedio'
    case 'conducta_excelente': return 'Conducta Excelente'
    case 'participacion_destacada': return 'Participación Destacada'
    case 'reconocimiento_docente': return 'Reconocimiento Docente'
    case 'tiempo_servicio': return 'Años de Servicio'
    default: return type || 'Mérito'
  }
}

const getVerificationUrl = (code) => {
  if (process.client) {
    return `${window.location.origin}/verificar-boleta/${code || 'SL-CERT-2026-001'}`
  }
  return `https://santaluisa.edu.ve/verificar-boleta/${code || 'SL-CERT-2026-001'}`
}

const triggerPrint = () => {
  window.print()
}

const openCreateModal = () => {
  certForm.value = {
    recipient_name: '',
    recipient_type: 'estudiante',
    certificate_type: 'excelencia_academica',
    academic_year: '2026-2027',
    grade_level: '1er Año Media General',
    average_grade: 19.5,
    issued_by: 'Sor María Dolores Amaya',
    issued_role: 'Directora General',
    description: 'Por su destacada disciplina, constancia y rendimiento académico sobresaliente.'
  }
  isModalOpen.value = true
}

const saveCertificate = async () => {
  const code = `SL-CERT-2026-${String(certificates.value.length + 1).padStart(3, '0')}`
  const payload = {
    ...certForm.value,
    issue_date: new Date().toISOString().split('T')[0],
    verification_code: code,
    status: 'emitido'
  }

  try {
    const created = await api.post('certificates', payload)
    isModalOpen.value = false
    await fetchCertificates()
    if (created?.id) selectedCertId.value = created.id
  } catch (err) {
    alert('Error al emitir certificado: ' + err.message)
  }
}

onMounted(fetchCertificates)
</script>
