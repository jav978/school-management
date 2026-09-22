<template>
  <div class="official-letterhead w-full bg-white text-slate-900 border-b-2 border-slate-900" :class="compact ? 'pb-2 mb-2' : 'pb-5 mb-5'">
    <!-- Modo 1: Membrete Gráfico (Banner oficial si existe o se activa) -->
    <div v-if="useGraphicBanner && bannerSrc" class="w-full flex justify-center mb-2">
      <img :src="bannerSrc" alt="Membrete Oficial" class="w-full max-h-24 sm:max-h-28 object-contain" />
    </div>

    <!-- Modo 2: Membrete Tipográfico Institucional Oficial MPPE -->
    <div v-else class="flex items-center justify-between gap-3">
      <!-- Escudo del Colegio y Datos Institucionales -->
      <div class="flex items-center gap-3">
        <img 
          src="/logocolegio.png" 
          alt="Colegio Santa Luisa" 
          :class="compact ? 'w-11 h-11' : 'w-14 h-14 sm:w-16 sm:h-16'" 
          class="object-contain flex-shrink-0" 
        />
        <div>
          <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 leading-tight">
            República Bolivariana de Venezuela • MPPE
          </p>
          <h1 
            :class="compact ? 'text-sm sm:text-base font-black' : 'text-base sm:text-xl font-black'" 
            class="font-display tracking-tight text-slate-900 leading-snug"
          >
            Unidad Educativa Colegio "Santa Luisa"
          </h1>
          <p class="text-[9.5px] sm:text-[11px] text-slate-600 font-serif leading-tight">
            Hijas de la Caridad de San Vicente de Paúl • Distrito Escolar N° 1
          </p>
          <p class="text-[8.5px] sm:text-[10px] text-slate-500 font-mono mt-0.5 leading-tight">
            DEA: S0098D0101 • RIF: J-315628015 • Calle Real del Prado de María, Caracas
          </p>
        </div>
      </div>

      <!-- Escudo MPPE y Código Oficial -->
      <div class="flex flex-col items-end text-right">
        <img 
          src="/logomppe.png" 
          alt="MPPE" 
          :class="compact ? 'h-7 sm:h-9' : 'h-10 sm:h-12'" 
          class="object-contain mb-1 flex-shrink-0" 
        />
        <span v-if="reportCode" class="font-mono text-[9px] sm:text-[11px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          {{ reportCode }}
        </span>
        <span class="text-[8.5px] sm:text-[9.5px] text-slate-400 mt-0.5 font-medium">
          Emisión: {{ formattedDate }}
        </span>
      </div>
    </div>

    <!-- Título del Documento si se especifica -->
    <div v-if="title" class="text-center mt-2 pt-1 border-t border-slate-200" :class="compact ? 'pb-0.5' : 'pb-1'">
      <h2 
        :class="compact ? 'text-xs sm:text-sm font-extrabold' : 'text-sm sm:text-base font-black'" 
        class="uppercase tracking-wide text-slate-850 font-display"
      >
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-[10px] text-slate-500 font-medium">
        {{ subtitle }}
      </p>
    </div>

    <!-- Cintillo de Metadatos (Opcional: Estudiante, Grado, Sección, etc.) -->
    <div 
      v-if="metadata && metadata.length > 0" 
      class="mt-2 grid grid-flow-col auto-cols-fr gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] sm:text-[11px]"
      :class="compact ? 'py-1 text-[9.5px]' : ''"
    >
      <div v-for="(item, idx) in metadata" :key="idx" class="truncate">
        <span class="font-extrabold uppercase text-slate-500 mr-1">{{ item.label }}:</span>
        <span class="font-bold text-slate-800">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  reportCode: {
    type: String,
    default: ''
  },
  metadata: {
    type: Array,
    default: () => []
  },
  compact: {
    type: Boolean,
    default: false
  },
  useGraphicBanner: {
    type: Boolean,
    default: false
  },
  bannerSrc: {
    type: String,
    default: '/images/membrete_oficial.png'
  }
})

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('es-VE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
})
</script>

<style scoped>
@media print {
  .official-letterhead {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
