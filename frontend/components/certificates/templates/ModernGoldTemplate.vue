<template>
  <div 
    class="bg-[#FCFAF2] text-slate-900 rounded-3xl shadow-2xl relative overflow-hidden p-3 sm:p-5 print:p-0 print:shadow-none print:rounded-none print:bg-[#FCFAF2] certificate-sheet w-full"
    style="min-height: 580px; aspect-ratio: 1.414 / 1;"
  >
    <!-- Outer Luxury Gilded Border (Gold & Emerald) -->
    <div class="w-full h-full border-[6px] border-[#C5A059] rounded-2xl relative p-3 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EC] to-[#F7F2E2] print:border-[#A67C1E] print:bg-[#FFFDF9]">
      
      <!-- Inner Thin Gold & Emerald Double Fillet -->
      <div class="absolute inset-2 sm:inset-3 border-2 border-[#D4AF37]/70 rounded-xl pointer-events-none"></div>
      <div class="absolute inset-3 sm:inset-4 border border-[#065F46]/60 rounded-lg pointer-events-none"></div>

      <!-- Baroque / Luxury Corner Ornaments (SVG) -->
      <div class="absolute top-2 left-2 sm:top-4 sm:left-4 pointer-events-none text-[#C5A059]">
        <svg class="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0 0 L25 0 C15 5 5 15 0 25 Z" opacity="0.9"/>
          <circle cx="8" cy="8" r="3" fill="#065F46"/>
        </svg>
      </div>
      <div class="absolute top-2 right-2 sm:top-4 sm:right-4 pointer-events-none text-[#C5A059] rotate-90">
        <svg class="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0 0 L25 0 C15 5 5 15 0 25 Z" opacity="0.9"/>
          <circle cx="8" cy="8" r="3" fill="#065F46"/>
        </svg>
      </div>
      <div class="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 pointer-events-none text-[#C5A059] -rotate-90">
        <svg class="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0 0 L25 0 C15 5 5 15 0 25 Z" opacity="0.9"/>
          <circle cx="8" cy="8" r="3" fill="#065F46"/>
        </svg>
      </div>
      <div class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 pointer-events-none text-[#C5A059] rotate-180">
        <svg class="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0 0 L25 0 C15 5 5 15 0 25 Z" opacity="0.9"/>
          <circle cx="8" cy="8" r="3" fill="#065F46"/>
        </svg>
      </div>

      <!-- Watermark Crest -->
      <div class="absolute inset-0 flex items-center justify-center opacity-[0.07] print:opacity-[0.09] pointer-events-none z-0">
        <img :src="customLogo || '/logocolegio.png'" alt="Watermark" class="w-[450px] h-[450px] object-contain" />
      </div>

      <!-- DIPLOMA MAIN BODY (z-10) -->
      <div class="relative z-10 flex flex-col items-center justify-between text-center h-full py-2 sm:py-3 px-4 sm:px-10">
        
        <!-- Top Institutional Header with Golden Laurels -->
        <div class="w-full flex items-center justify-between pt-1 px-4 sm:px-8">
          <!-- Left Badge/Flag -->
          <div class="w-14 h-16 sm:w-18 sm:h-20 p-1 flex items-center justify-center flex-shrink-0">
            <img :src="leftImage" alt="Insignia Izquierda" class="max-h-full max-w-full object-contain filter drop-shadow-xs" />
          </div>

          <!-- Center Heraldry -->
          <div class="flex-1 flex flex-col items-center space-y-0.5">
            <span class="text-[9px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#065F46]">
              REPÚBLICA BOLIVARIANA DE VENEZUELA
            </span>
            <span class="text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider text-slate-600">
              MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
            </span>

            <h2 class="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-slate-900 tracking-tight uppercase pt-0.5">
              {{ schoolName }}
            </h2>

            <!-- Gold Wreath Accent -->
            <div class="flex items-center justify-center gap-3 pt-1">
              <span class="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></span>
              <span class="text-xs font-serif text-[#C5A059]">✦ DIPLOMA DE EXCELENCIA ✦</span>
              <span class="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></span>
            </div>
          </div>

          <!-- Right Badge/Flag -->
          <div class="w-14 h-16 sm:w-18 sm:h-20 p-1 flex items-center justify-center flex-shrink-0">
            <img :src="rightImage" alt="Insignia Derecha" class="max-h-full max-w-full object-contain filter drop-shadow-xs" />
          </div>
        </div>

        <!-- Honor Title -->
        <div class="my-1 sm:my-1.5">
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-serif font-black tracking-normal text-[#92400E] dark:text-[#B45309] uppercase">
            {{ certTitle }}
          </h3>
          <p class="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-600 uppercase mt-0.5">
            Otorgado con el más alto honor y distinción a:
          </p>
        </div>

        <!-- Recipient Big Name -->
        <div class="my-1 w-full">
          <h1 
            data-testid="cert-recipient-canvas"
            class="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-950 tracking-tight px-4 leading-tight italic"
          >
            {{ cert.recipient_name || 'Nombre del Galardonado' }}
          </h1>

          <!-- Recipient Subtitle / Grade / Department -->
          <p class="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#065F46] mt-1">
            {{ recipientSubtitle }}
          </p>
        </div>

        <!-- Motivation Paragraph -->
        <div class="max-w-2xl px-4 my-0.5">
          <p class="text-[10px] sm:text-xs text-slate-750 font-serif leading-relaxed italic">
            {{ cert.description || 'Por haber demostrado una consagrada vocación, sobresaliente rendimiento académico, apego a los principios éticos y lealtad a la comunidad educativa.' }}
          </p>

          <!-- Average Badge if Student -->
          <div v-if="cert.recipient_type === 'estudiante' && cert.average_grade" class="mt-1 inline-block">
            <span class="px-3.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/50 shadow-xs">
              Promedio Final de Excelencia: <strong class="text-slate-950 font-black">{{ Number(cert.average_grade).toFixed(2) }} / 20 pts</strong>
            </span>
          </div>

          <!-- Años de Servicio si Docente / Personal -->
          <div v-else-if="cert.recipient_type !== 'estudiante' && cert.metadata?.years_of_service" class="mt-1 inline-block">
            <span class="px-3.5 py-1 rounded-full text-[11px] font-black bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/40 shadow-xs">
              Condecoración Institucional: <strong class="text-slate-950 font-black">{{ cert.metadata.years_of_service }} Años de Trayectoria</strong>
            </span>
          </div>
        </div>

        <!-- Issue Date -->
        <div class="text-[9px] sm:text-[10px] text-slate-600 font-serif my-0.5">
          <span>Dado y firmado en Caracas, a los </span>
          <strong class="font-bold text-slate-800">{{ cert.issue_date || 'Septiembre de 2026' }}</strong>
        </div>

        <!-- Footer Grid: QR Code (Left), 3 Signatures (Center), Sello Centrado (Right) -->
        <div class="w-full pt-2 border-t border-[#C5A059]/40 mt-1">
          <div class="w-full grid grid-cols-12 items-end gap-2">
            
            <!-- Left: QR Code -->
            <div class="col-span-2 flex flex-col items-center justify-center text-center">
              <div class="bg-white p-1 rounded-xl border border-[#C5A059]/50 shadow-xs inline-block">
                <ui-qr-code 
                  :value="verificationUrl"
                  :size="52"
                />
              </div>
              <div class="text-[8px] text-slate-600 mt-1 leading-tight text-center">
                <span class="font-mono font-bold text-[#065F46] block">{{ cert.verification_code || 'CERT-MTKBKQ8D' }}</span>
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

                <!-- Signature Line in Emerald/Gold -->
                <div class="border-t-2 border-slate-900 w-24 sm:w-32 mx-auto mb-1"></div>
                <p class="font-bold text-slate-950 text-[10px] sm:text-xs leading-tight font-serif">{{ sig.name }}</p>
                <p class="text-[8px] sm:text-[9px] font-bold text-[#065F46] uppercase leading-none mt-0.5">{{ sig.title || sig.role }}</p>
              </div>
            </div>

            <!-- Right: Sello Oficial 100% Centrado -->
            <div class="col-span-2 flex flex-col items-center justify-center text-center">
              <div 
                v-if="stampSeal"
                data-testid="cert-official-seal"
                class="w-15 h-15 sm:w-16 sm:h-16 rounded-full border-2 border-[#C5A059] bg-gradient-to-tr from-[#C5A059] via-[#FDF6C7] to-[#B38728] p-1 shadow-md flex flex-col items-center justify-center text-center mx-auto"
              >
                <!-- Custom Seal -->
                <img 
                  v-if="officialSealUrl" 
                  :src="resolvePhotoUrl(officialSealUrl)" 
                  alt="Sello Oficial" 
                  class="w-full h-full object-contain"
                />
                <!-- Embossed Golden Medal Vector -->
                <div v-else class="flex flex-col items-center justify-center text-center w-full h-full">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-800/40 flex items-center justify-center bg-amber-600/10 mx-auto">
                    <span class="text-xs">🏆</span>
                  </div>
                  <span class="text-[7.5px] font-black uppercase tracking-tighter text-[#78350F] leading-none mt-0.5 text-center block w-full">
                    SELLO DORADO
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
    case 'excelencia_academica': return 'Gran Certificado de Excelencia Académica'
    case 'mejor_promedio': return 'Máximo Galardón al Mejor Promedio'
    case 'conducta_excelente': return 'Condecoración a la Conducta y Mérito Cívico'
    case 'participacion_destacada': return 'Distinción Especial de Participación'
    case 'reconocimiento_docente': return 'Medalla de Honor a la Excelencia Docente'
    case 'merito_personal': return 'Condecoración Institucional al Personal'
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
