<template>
  <div 
    class="bg-white text-slate-900 rounded-3xl shadow-2xl relative overflow-hidden p-3 sm:p-5 print:p-0 print:shadow-none print:rounded-none print:bg-white certificate-sheet w-full"
    style="min-height: 580px; aspect-ratio: 1.414 / 1;"
  >
    <!-- Outer Ceremonial Double Border -->
    <div class="w-full h-full border-4 sm:border-[5px] border-indigo-900/90 rounded-2xl relative p-3 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FAFAFE] via-[#FFFFFF] to-[#F8F7FF] print:border-indigo-900 print:bg-white">
      
      <!-- Geometric Corner Brackets -->
      <div class="absolute top-2 left-2 sm:top-3 sm:left-3 pointer-events-none">
        <div class="w-8 h-8 sm:w-12 sm:h-12 border-t-4 border-l-4 border-indigo-600 print:border-indigo-800"></div>
      </div>
      <div class="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none">
        <div class="w-8 h-8 sm:w-12 sm:h-12 border-t-4 border-r-4 border-indigo-600 print:border-indigo-800"></div>
      </div>
      <div class="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 pointer-events-none">
        <div class="w-8 h-8 sm:w-12 sm:h-12 border-b-4 border-l-4 border-indigo-600 print:border-indigo-800"></div>
      </div>
      <div class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 pointer-events-none">
        <div class="w-8 h-8 sm:w-12 sm:h-12 border-b-4 border-r-4 border-indigo-600 print:border-indigo-800"></div>
      </div>

      <!-- Thin Inner Border Frame -->
      <div class="absolute inset-4 sm:inset-6 border border-amber-400/40 pointer-events-none"></div>

      <!-- Translucent Watermark -->
      <div class="absolute inset-0 flex items-center justify-center opacity-[0.08] print:opacity-[0.10] pointer-events-none z-0">
        <img :src="customLogo || '/logocolegio.png'" alt="Watermark" class="w-[430px] h-[430px] object-contain rotate-[-2deg]" />
      </div>

      <!-- DIPLOMA CONTENT -->
      <div class="relative z-10 flex flex-col items-center justify-between text-center h-full py-2 sm:py-3 px-4 sm:px-8">
        
        <!-- Header Section -->
        <div class="w-full flex items-center justify-between gap-4 pt-1 sm:pt-2 px-2 sm:px-6">
          <!-- Left: Santa Luisa or Custom Image -->
          <div class="flex flex-col items-center flex-shrink-0">
            <div class="w-16 h-20 sm:w-20 sm:h-24 p-1 rounded-xl bg-white border border-amber-400/40 shadow-xs flex items-center justify-center">
              <img :src="leftImage" alt="Patrono Izquierdo" class="w-full h-full object-contain rounded-lg" />
            </div>
            <span class="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{{ leftImageLabel }}</span>
          </div>

          <!-- Center: Institutional Hierarchy Heading -->
          <div class="flex-1 flex flex-col items-center space-y-0.5 text-center">
            <span class="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-700">
              República Bolivariana de Venezuela
            </span>
            <span class="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Ministerio del Poder Popular para la Educación
            </span>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-black font-display text-indigo-950 tracking-tight uppercase pt-0.5">
              {{ schoolName }}
            </h2>
            <p class="text-[10px] sm:text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              Hijas de la Caridad de San Vicente de Paúl
            </p>

            <!-- Golden Accent Divider -->
            <div class="flex items-center justify-center gap-2 pt-1 w-48 mx-auto">
              <div class="h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1"></div>
              <div class="w-2 h-2 rotate-45 bg-amber-600"></div>
              <div class="h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1"></div>
            </div>
          </div>

          <!-- Right: San Vicente or Custom Image -->
          <div class="flex flex-col items-center flex-shrink-0">
            <div class="w-16 h-20 sm:w-20 sm:h-24 p-1 rounded-xl bg-white border border-amber-400/40 shadow-xs flex items-center justify-center">
              <img :src="rightImage" alt="Patrono Derecho" class="w-full h-full object-contain rounded-lg" />
            </div>
            <span class="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{{ rightImageLabel }}</span>
          </div>
        </div>

        <!-- Title of Honor -->
        <div class="my-1.5 sm:my-2">
          <h3 class="text-lg sm:text-2xl lg:text-3xl font-black font-display tracking-tight text-indigo-950 uppercase">
            {{ certTitle }}
          </h3>
          <p class="text-[10px] sm:text-xs font-black tracking-widest text-slate-600 uppercase mt-0.5">
            Se otorga el presente reconocimiento a:
          </p>
        </div>

        <!-- Recipient Big Name -->
        <div class="my-1 sm:my-2 w-full">
          <h1 
            data-testid="cert-recipient-canvas"
            class="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight px-4 leading-tight"
          >
            {{ cert.recipient_name || 'Nombre del Galardonado' }}
          </h1>

          <!-- Subtitle / Grade / Department -->
          <p class="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-indigo-900 mt-1">
            {{ recipientSubtitle }}
          </p>
        </div>

        <!-- Descriptive Reason / Motivation -->
        <div class="max-w-2xl px-4 my-1">
          <p class="text-[10px] sm:text-xs text-slate-700 leading-relaxed font-serif italic">
            {{ cert.description || 'Por su sobresaliente desempeño, apego a los valores de la institución y excelencia moral y vicenciana.' }}
          </p>

          <!-- Average Badge if Student -->
          <div v-if="cert.recipient_type === 'estudiante' && cert.average_grade" class="mt-1.5 inline-block">
            <span class="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-900 border border-amber-500/30">
              Obteniendo un promedio de: <strong class="font-black">{{ Number(cert.average_grade).toFixed(2) }} / 20 pts</strong>
            </span>
          </div>

          <!-- Años de Servicio si Docente o Personal -->
          <div v-else-if="cert.recipient_type !== 'estudiante' && cert.metadata?.years_of_service" class="mt-1.5 inline-block">
            <span class="px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-900 border border-indigo-200">
              Trayectoria Institucional: <strong class="font-black">{{ cert.metadata.years_of_service }} Años de Servicio</strong>
            </span>
          </div>
        </div>

        <!-- Issue Date -->
        <div class="text-[9px] sm:text-[10px] text-slate-500 font-medium my-0.5">
          <span>Fecha de emisión: </span>
          <strong class="text-slate-700 font-bold">{{ cert.issue_date || 'Septiembre de 2026' }}</strong>
        </div>

        <!-- Bottom Footer: QR Code (Left), 3 Signatures (Center), Sello Oficial Centrado (Right) -->
        <div class="w-full pt-2 border-t border-amber-300/40 mt-1">
          <div class="w-full grid grid-cols-12 items-end gap-2">
            
            <!-- Left: Verification QR Code -->
            <div class="col-span-2 flex flex-col items-center justify-center text-center">
              <div class="bg-white p-1 rounded-xl border border-slate-200 shadow-xs inline-block">
                <ui-qr-code 
                  :value="verificationUrl"
                  :size="52"
                />
              </div>
              <div class="text-[8px] text-slate-500 mt-1 leading-tight text-center">
                <span class="font-mono text-indigo-900 font-bold block">{{ cert.verification_code || 'CERT-MTKBKQ8D' }}</span>
                <span class="text-slate-400">Escanear para validar</span>
              </div>
            </div>

            <!-- Center: 3 Institutional Signatures -->
            <div class="col-span-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div v-for="(sig, i) in signers" :key="i" class="flex flex-col items-center justify-end min-h-[58px]">
                <!-- Stamped Digital Signature Image -->
                <div v-if="stampSignatures && sig.signature_url" class="h-9 w-full flex items-center justify-center mb-0.5">
                  <img :src="resolvePhotoUrl(sig.signature_url)" alt="Firma" class="max-h-full max-w-[120px] object-contain" />
                </div>
                <div v-else-if="stampSignatures" class="h-9 w-full flex items-center justify-center mb-0.5">
                  <!-- Vector Calligraphic default stroke -->
                  <svg class="h-8 w-24 text-indigo-900/80" viewBox="0 0 160 50" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                    <path d="M10 35 Q 25 5, 45 28 T 80 20 T 115 32 Q 130 10, 150 25 M30 42 Q 70 46, 140 38" />
                  </svg>
                </div>
                <div v-else class="h-6 w-full"></div>

                <!-- Signature Line -->
                <div class="border-t-2 border-slate-900 w-24 sm:w-32 mx-auto mb-1"></div>
                <p class="font-black text-slate-950 text-[10px] sm:text-xs leading-tight">{{ sig.name }}</p>
                <p class="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase leading-none mt-0.5">{{ sig.title || sig.role }}</p>
              </div>
            </div>

            <!-- Right: Sello Oficial 100% Centrado -->
            <div class="col-span-2 flex flex-col items-center justify-center text-center">
              <div 
                v-if="stampSeal" 
                data-testid="cert-official-seal"
                class="w-15 h-15 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-amber-500 bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-1 shadow-sm text-center mx-auto"
              >
                <!-- Custom Uploaded Seal -->
                <img 
                  v-if="officialSealUrl" 
                  :src="resolvePhotoUrl(officialSealUrl)" 
                  alt="Sello Oficial" 
                  class="w-full h-full object-contain"
                />
                <!-- Vector Centered Seal -->
                <div v-else class="flex flex-col items-center justify-center text-center w-full h-full">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span class="text-[8px] font-black uppercase tracking-tighter text-amber-900 leading-none mt-0.5 text-center block w-full">
                    Sello Oficial
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
    case 'excelencia_academica': return 'Certificado de Excelencia Académica'
    case 'mejor_promedio': return 'Diploma de Honor al Mejor Promedio'
    case 'conducta_excelente': return 'Reconocimiento a la Conducta Intachable'
    case 'participacion_destacada': return 'Mención de Participación Destacada'
    case 'reconocimiento_docente': return 'Reconocimiento a la Labor Docente'
    case 'merito_personal': return 'Reconocimiento al Mérito Laboral'
    default: return 'Certificado de Honor y Excelencia'
  }
})

const recipientSubtitle = computed(() => {
  if (props.cert.recipient_type === 'docente') {
    return props.cert.department || 'Cuerpo Docente de Excelencia'
  }
  if (props.cert.recipient_type === 'personal') {
    return props.cert.position || props.cert.department || 'Personal y Colaboradores'
  }
  return props.cert.grade_level || '5to Año de Educación Media General'
})

const leftImage = computed(() => {
  return props.cert.metadata?.left_image || '/images/santaluisa.png'
})

const leftImageLabel = computed(() => {
  return props.cert.metadata?.left_label || 'Sta. Luisa de Marillac'
})

const rightImage = computed(() => {
  return props.cert.metadata?.right_image || '/images/sanvicente.png'
})

const rightImageLabel = computed(() => {
  return props.cert.metadata?.right_label || 'San Vicente de Paúl'
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
