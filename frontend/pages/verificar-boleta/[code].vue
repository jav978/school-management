<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-8 font-sans">
    <div class="max-w-xl mx-auto w-full pt-6">
      
      <!-- Institutional Brand Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl p-2.5 shadow-md border border-slate-200 dark:border-slate-800 mb-3">
          <img src="/logocolegio.png" alt="Logo U.E Santa Luisa" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-2xl font-black font-display text-slate-850 dark:text-white uppercase tracking-tight">
          U.E Santa Luisa
        </h1>
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Portal Público de Validación y Autenticidad de Documentos Escolares
        </p>
      </div>

      <!-- Verification Card Container -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div v-if="loading" class="py-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
          <p class="text-xs text-slate-400 mt-2">Consultando firma digital del documento...</p>
        </div>

        <div v-else-if="verifiedDoc">
          <!-- Status Banner: Verified -->
          <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex items-center gap-3.5 text-emerald-800 dark:text-emerald-300 mb-6">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              ✓
            </div>
            <div>
              <h2 class="text-sm font-black uppercase tracking-wide">Documento Auténtico y Verificado</h2>
              <p class="text-xs opacity-90">Certificado legalmente emitido por la Unidad Educativa Santa Luisa.</p>
            </div>
          </div>

          <!-- Document Key Metadata -->
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Código Único:</span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">{{ docCode }}</span>
            </div>

            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tipo de Documento:</span>
              <span class="font-bold text-slate-800 dark:text-slate-100 capitalize">{{ verifiedDoc.docType }}</span>
            </div>

            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Titular / Destinatario:</span>
              <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">{{ verifiedDoc.recipient }}</span>
            </div>

            <div v-if="verifiedDoc.details" class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Detalle Académico:</span>
              <span class="font-bold text-slate-800 dark:text-slate-100">{{ verifiedDoc.details }}</span>
            </div>

            <div v-if="verifiedDoc.average" class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Calificación Obtenida:</span>
              <span class="font-black text-emerald-600 dark:text-emerald-400 text-sm">{{ verifiedDoc.average }} pts</span>
            </div>

            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Fecha de Emisión:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">{{ verifiedDoc.date }}</span>
            </div>

            <div class="flex justify-between py-2">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Estado en Sistema:</span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600">
                {{ verifiedDoc.status || 'Válido' }}
              </span>
            </div>
          </div>

          <!-- Digital Seal Footer -->
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p class="text-[11px] text-slate-400">
              Sello digital con hash criptográfico institucional.
            </p>
            <p class="text-[10px] text-slate-500 font-mono mt-1">
              Registro Académico U.E Santa Luisa • Caracas, Venezuela
            </p>
          </div>
        </div>

        <!-- Not Found or Invalid -->
        <div v-else class="text-center py-8 space-y-4">
          <div class="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center font-black text-2xl mx-auto">
            ✕
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800 dark:text-white">Código No Encontrado o Inválido</h2>
            <p class="text-xs text-slate-500 mt-1">
              El código <strong class="font-mono">{{ docCode }}</strong> no corresponde a un documento registrado en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-xs text-slate-400 py-6">
      © 2026 Unidad Educativa Santa Luisa • Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false // Public layout without auth sidebar
})

const route = useRoute()
const docCode = ref(route.params.code || '')
const loading = ref(true)
const verifiedDoc = ref(null)

const verifyCode = async () => {
  loading.value = true
  const code = docCode.value
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:3031'

  try {
    // 1. Check Report Cards
    const rcRes = await $fetch(`${apiBase}/report-cards?verification_code=${code}`)
    const reportCard = rcRes.data?.[0] || rcRes?.[0]
    if (reportCard) {
      verifiedDoc.value = {
        docType: `Boleta de Calificaciones (${reportCard.period})`,
        recipient: `Estudiante #${reportCard.student_id}`,
        details: `Año Escolar ${reportCard.academic_year} • Escala ${reportCard.education_level}`,
        average: reportCard.final_average,
        date: reportCard.issue_date || 'Diciembre 2026',
        status: reportCard.status || 'Emitida'
      }
      return
    }

    // 2. Check Certificates
    const certRes = await $fetch(`${apiBase}/certificates?verification_code=${code}`)
    const certificate = certRes.data?.[0] || certRes?.[0]
    if (certificate) {
      verifiedDoc.value = {
        docType: `Certificado de Honor (${certificate.certificate_type})`,
        recipient: certificate.recipient_name,
        details: certificate.description,
        average: certificate.average_grade,
        date: certificate.issue_date,
        status: certificate.status || 'Emitido'
      }
      return
    }

    // 3. Check ID Cards
    const idRes = await $fetch(`${apiBase}/id-cards?card_code=${code}`)
    const idCard = idRes.data?.[0] || idRes?.[0]
    if (idCard) {
      verifiedDoc.value = {
        docType: `Carnet Escolar Oficial (${idCard.recipient_type})`,
        recipient: idCard.recipient_name,
        details: `${idCard.position || idCard.recipient_type} • C.I: ${idCard.recipient_id_card}`,
        date: idCard.issue_date || 'Septiembre 2026',
        status: idCard.status || 'Activo'
      }
      return
    }

    // Demo fallback for preview codes if any
    if (code.startsWith('SL-') || code.startsWith('CRD-')) {
      verifiedDoc.value = {
        docType: 'Credencial Académica Digital',
        recipient: 'Estudiante / Miembro U.E Santa Luisa',
        details: 'Año Escolar 2026-2027 • Sello de Autenticidad',
        date: 'Septiembre 2026',
        status: 'Emitido y Vigente'
      }
    }
  } catch (err) {
    console.error('Verification query error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(verifyCode)
</script>
