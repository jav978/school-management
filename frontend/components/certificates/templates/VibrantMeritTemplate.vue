<template>
  <div 
    class="bg-[#FAFCFF] text-slate-900 rounded-3xl shadow-2xl relative overflow-hidden p-3 sm:p-5 print:p-0 print:shadow-none print:rounded-none print:bg-[#FAFCFF] certificate-sheet w-full"
    style="min-height: 580px; aspect-ratio: 1.414 / 1;"
  >
    <!-- Outer Vibrant Border (Royal Blue, Amber & Amethyst Violet) -->
    <div class="w-full h-full border-[5px] border-indigo-600 rounded-2xl relative p-3 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F5F8FF] to-[#EFF4FE] print:border-indigo-700 print:bg-[#FFFFFF]">
      
      <!-- Colorful Ribbon & Guilloché Geometric Accent Bars -->
      <div class="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 via-pink-500 to-amber-500"></div>
      <div class="absolute bottom-0 left-0 right-0 h-2 sm:h-2.5 bg-gradient-to-r from-amber-500 via-pink-500 via-purple-600 via-indigo-600 to-blue-600"></div>

      <!-- Modern Geometric Corner Decors -->
      <div class="absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-none">
        <div class="w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg"></div>
        <div class="w-2 h-2 rounded-full bg-amber-400 absolute top-1 left-1"></div>
      </div>
      <div class="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-none">
        <div class="w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-r-2 border-purple-500 rounded-tr-lg"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-500 absolute top-1 right-1"></div>
      </div>
      <div class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 pointer-events-none">
        <div class="w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-l-2 border-purple-500 rounded-bl-lg"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-500 absolute bottom-1 left-1"></div>
      </div>
      <div class="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 pointer-events-none">
        <div class="w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-r-2 border-indigo-500 rounded-br-lg"></div>
        <div class="w-2 h-2 rounded-full bg-amber-400 absolute bottom-1 right-1"></div>
      </div>

      <!-- Subtle Celebratory Sparkle Background Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-[0.06] print:opacity-[0.08] pointer-events-none z-0">
        <img :src="customLogo || '/logocolegio.png'" alt="Watermark" class="w-[420px] h-[420px] object-contain" />
      </div>

      <!-- DIPLOMA MAIN BODY (z-10) -->
      <div class="relative z-10 flex flex-col items-center justify-between text-center h-full py-2 sm:py-3 px-4 sm:px-8">
        
        <!-- Top Institutional Header -->
        <div class="w-full flex items-center justify-between pt-1 px-4 sm:px-8">
          <!-- Left Badge/Flag -->
          <div class="w-14 h-16 sm:w-18 sm:h-20 p-1 flex items-center justify-center flex-shrink-0">
            <img :src="leftImage" alt="Insignia Izquierda" class="max-h-full max-w-full object-contain filter drop-shadow-xs" />
          </div>

          <!-- Center Heraldry -->
          <div class="flex-1 flex flex-col items-center space-y-0.5">
            <span class="text-[9px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-indigo-700">
              REPÚBLICA BOLIVARIANA DE VENEZUELA
            </span>
            <span class="text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
              MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
            </span>

            <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase pt-0.5 font-sans">
              {{ schoolName }}
            </h2>

            <!-- Colorful Badge Ribbon -->
            <div class="flex items-center justify-center gap-2 pt-0.5">
              <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-900 border border-indigo-200">
                <span class="text-amber-500">★</span> VANGUARDIA & RECONOCIMIENTO AL MÉRITO <span class="text-amber-500">★</span>
              </span>
            </div>
          </div>

          <!-- Right Badge/Flag -->
          <div class="w-14 h-16 sm:w-18 sm:h-20 p-1 flex items-center justify-center flex-shrink-0">
            <img :src="rightImage" alt="Insignia Derecha" class="max-h-full max-w-full object-contain filter drop-shadow-xs" />
          </div>
        </div>

        <!-- Honor Title with Vibrant Gradient Accent -->
        <div class="my-1 sm:my-1.5">
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight uppercase bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
            {{ certTitle }}
          </h3>
          <p class="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mt-0.5">
            Confieren con júbilo y distinción el presente galardón a:
          </p>
        </div>

        <!-- Recipient Big Name -->
        <div class="my-1 w-full">
          <h1 
            data-testid="cert-recipient-canvas"
            class="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight px-4 leading-tight"
          >
            {{ cert.recipient_name || 'Nombre del Galardonado' }}
          </h1>

          <!-- Recipient Subtitle / Grade / Department -->
          <p class="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-indigo-700 mt-1">
            {{ recipientSubtitle }}
          </p>
        </div>

        <!-- Motivation Paragraph -->
        <div class="max-w-2xl px-4 my-0.5">
          <p class="text-[10.5px] sm:text-xs text-slate-700 font-medium leading-relaxed">
            {{ cert.description || 'Por haber demostrado una consagrada vocación, sobresaliente rendimiento académico, apego a los principios éticos y lealtad a la comunidad educativa.' }}
          </p>

          <!-- Average Badge if Student -->
          <div v-if="cert.recipient_type === 'estudiante' && cert.average_grade" class="mt-1 inline-block">
            <span class="px-4 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm border border-indigo-400">
              Promedio de Honor: <strong class="text-amber-300 font-black">{{ Number(cert.average_grade).toFixed(2) }} / 20 pts</strong>
            </span>
          </div>

          <!-- Años de Servicio si Docente / Personal -->
          <div v-else-if="cert.recipient_type !== 'estudiante' && cert.metadata?.years_of_service" class="mt-1 inline-block">
            <span class="px-4 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
              Condecoración Institucional: <strong class="text-amber-300 font-black">{{ cert.metadata.years_of_service }} Años de Trayectoria</strong>
            </span>
          </div>
        </div>

        <!-- Issue Date -->
        <div class="text-[9.5px] sm:text-[10px] text-slate-500 font-medium my-0.5">
          <span>Emitido formalmente en Caracas, el </span>
          <strong class="font-bold text-slate-800">{{ cert.issue_date || 'Septiembre de 2026' }}</strong>
        </div>

        <!-- Footer Grid: QR Code (Left), 3 Signatures (Center), Sello Centrado (Right) -->
        <div class="w-full pt-2 border-t border-indigo-200/70 mt-1">
          <div class="w-full grid grid-cols-12 items-end gap-2">
            
            <!-- Left: QR Code -->
            <div class="col-span-2 flex flex-col items-center justify-center text-center">
              <div class="bg-white p-1 rounded-xl border border-indigo-200 shadow-xs inline-block">
                <ui-qr-code 
                  :value="verificationUrl"
                  :size="52"
                />
              </div>
              <div class="text-[8px] text-slate-600 mt-1 leading-tight text-center">
                <span class="font-mono font-bold text-indigo-700 block">{{ cert.verification_code || 'CERT-MTKBKQ8D' }}</span>
                <span class="text-slate-400">Validación Oficial</span>
              </div>
            </div>

            <!-- Center: 3 Institutional Signatures -->
            <div class="col-span-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div v-for="(sig, i) in signers" :key="i" class="flex flex-col items-center justify-end min-h-[58px]">
                <!-- Digital Signature Image if available -->
                <div v-if="stampSignatures && sig.signature_url" class="h-9 w-full flex items-center justify-center mb-0.5">
                  <img :src="resolvePhotoUrl(sig.signature_url)" alt="Firma" class="max-h-full max-w-[120px] object-contain" />
                </div>
                <div v-else-if="stampSignatures" class="h-9 w-full flex items-center justify-center mb-0.5">
                  <svg class="h-8 w-24 text-slate-800" viewBox="0 0 160 50" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                    <path d="M15 30 Q 35 8, 55 25 T 95 18 T 130 28 Q 145 10, 155 22 M25 38 Q 65 42, 135 34" />
                  </svg>
                </div>
                <div v-else class="h-6 w-full"></div>

                <!-- Signature Line in Indigo -->
                <div class="border-t-2 border-indigo-800 w-24 sm:w-32 mx-auto mb-1"></div>
                <p class="font-bold text-slate-950 text-[10px] sm:text-xs leading-tight">{{ sig.name }}</p>
                <p class="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase leading-none mt-0.5">{{ sig.title || sig.role }}</p>
              </div>
            </div>

            <!-- Right: Sello Oficial 100% Centrado -->
            <div class="col-span-2 flex flex-col items-center justify-center text-center">
              <div 
                v-if="stampSeal"
                data-testid="cert-official-seal"
                class="w-15 h-15 sm:w-16 sm:h-16 rounded-full border-2 border-indigo-400 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-md flex flex-col items-center justify-center text-center mx-auto text-white"
              >
                <!-- Custom Seal -->
                <img 
                  v-if="officialSealUrl" 
                  :src="resolvePhotoUrl(officialSealUrl)" 
                  alt="Sello Oficial" 
                  class="w-full h-full object-contain"
                />
                <!-- Modern Emblem Vector -->
                <div v-else class="flex flex-col items-center justify-center text-center w-full h-full">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/40 flex items-center justify-center bg-white/20 mx-auto">
                    <span class="text-xs">🌟</span>
                  </div>
                  <span class="text-[7px] font-black uppercase tracking-tighter text-white leading-none mt-0.5 text-center block w-full">
                    SELLO INSTITUCIONAL
                  </span>
                </div>
              </div>
              <div v-else class="w-14 h-14 border border-dashed border-slate-300 rounded-full flex items-center justify-center text-[9px] text-slate-400 mx-auto">
                (Sello Físico)
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resolvePhotoUrl } from '~/composables/usePhotoUrl'

const props = defineProps({
  cert: { type: Object, required: true },
  schoolName: { type: String, default: 'Unidad Educativa Colegio Santa Luisa' },
  customLogo: { type: String, default: null },
  officialSealUrl: { type: String, default: null },
  signersList: { type: Array, default: () => [] },
  stampSignatures: { type: Boolean, default: true },
  stampSeal: { type: Boolean, default: true }
})

const verificationUrl = computed(() => {
  const code = props.cert.verification_code || 'CERT-MTKBKQ8D'
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/verificar-boleta/${code}`
  }
  return `https://santaluisa.edu.ve/verificar-boleta/${code}`
})

const certTitle = computed(() => {
  if (props.cert.title) return props.cert.title
  switch (props.cert.certificate_type) {
    case 'excelencia_academica': return 'Diploma de Excelencia Académica'
    case 'mejor_promedio': return 'Galardón al Mejor Promedio'
    case 'conducta_excelente': return 'Reconocimiento a la Conducta Ejemplar'
    case 'participacion_destacada': return 'Mención Honorífica de Participación'
    case 'reconocimiento_docente': return 'Reconocimiento al Mérito Pedagógico'
    case 'merito_personal': return 'Reconocimiento a la Excelencia Operativa'
    default: return 'Diploma de Honor y Mérito'
  }
})

const recipientSubtitle = computed(() => {
  if (props.cert.recipient_type === 'docente') {
    return props.cert.department || 'Cuerpo Docente de Excelencia'
  }
  if (props.cert.recipient_type === 'personal') {
    return props.cert.position || props.cert.department || 'Personal y Colaboradores'
  }
  return props.cert.grade_level || 'Educación Media General'
})

const leftImage = computed(() => {
  return props.cert.metadata?.left_image || '/logocolegio.png'
})

const rightImage = computed(() => {
  return props.cert.metadata?.right_image || '/images/santaluisa.png'
})

const signers = computed(() => {
  if (props.signersList && props.signersList.length > 0) {
    return props.signersList
  }
  return [
    { role: 'Directora', name: props.cert.issued_by || 'Sor María Dolores Amaya', title: props.cert.issued_role || 'Directora General', signature_url: null },
    { role: 'Control de Estudios', name: 'Prof. Elena Vargas', title: 'Control de Estudios', signature_url: null },
    { role: 'Docente Guía', name: 'Prof. Carlos Mendoza', title: 'Docente Guía', signature_url: null }
  ]
})
</script>
