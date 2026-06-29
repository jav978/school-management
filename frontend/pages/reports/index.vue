<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Reportes y Estadísticas</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Estadísticas detalladas, rendimiento académico e informes escolares</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select v-model="selectedPeriod" class="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-xs font-bold w-full sm:w-auto">
          <option value="month">Este Mes</option>
          <option value="quarter">Este Trimestre</option>
          <option value="year">Este Año</option>
        </select>
        <button 
          @click="exportReport" 
          class="px-5 py-3 bg-slate-150 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold rounded-2xl text-xs transition-colors flex-shrink-0"
        >
          📥 Exportar
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="stat in mainStats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ stat.label }}</span>
          <h3 class="text-3xl font-black text-slate-800 dark:text-white mt-1">{{ stat.value }}</h3>
        </div>
        <div class="text-right flex flex-col items-end gap-1">
          <span class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-lg">
            {{ stat.icon }}
          </span>
          <span :class="[stat.trend > 0 ? 'text-emerald-500' : 'text-rose-500', 'text-[10px] font-bold mt-1']">
            {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Academic and Attendance Summary Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      <!-- Rendimiento Académico por Grado -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Rendimiento Académico por Grado</h3>
        <div class="space-y-4">
          <div v-for="grade in academicPerformance" :key="grade.name" class="flex items-center">
            <span class="w-20 text-xs font-bold text-slate-500">{{ grade.name }}</span>
            <div class="flex-1 mx-3">
              <div class="bg-slate-50 dark:bg-slate-950/80 rounded-full h-5 overflow-hidden">
                <div
                  :class="[grade.color, 'rounded-full h-5 flex items-center justify-end pr-3 transition-all duration-500']"
                  :style="{ width: `${grade.average}%` }"
                >
                  <span class="text-[9px] font-black text-slate-950">{{ grade.average }}%</span>
                </div>
              </div>
            </div>
            <span class="w-16 text-right text-[10px] font-bold text-slate-400 dark:text-slate-500">{{ grade.students }} alumnos</span>
          </div>
        </div>
      </div>

      <!-- Asistencia Mensual -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Asistencia Promedio Mensual</h3>
        <div class="grid grid-cols-6 gap-2 my-auto">
          <div v-for="month in attendanceData" :key="month.name" class="text-center">
            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">{{ month.name }}</div>
            <div
              :class="[
                month.rate >= 90 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
                month.rate >= 80 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 
                'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                'w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-xs font-black'
              ]"
            >
              {{ month.rate }}%
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Widgets Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      <!-- Distribución por Estado -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Distribución por Nivel</h3>
        <div class="space-y-4">
          <div v-for="item in statusDistribution" :key="item.label" class="flex items-center justify-between p-1">
            <div class="flex items-center">
              <div :class="[item.color, 'w-3 h-3 rounded-full mr-3']"></div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-350">{{ item.label }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-black text-slate-850 dark:text-slate-100">{{ item.count }}</span>
              <span class="text-[10px] text-slate-400 dark:text-slate-500">({{ item.percentage }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Materias -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Promedio por Materias</h3>
        <div class="space-y-4">
          <div v-for="subject in topSubjects" :key="subject.name" class="flex items-center justify-between p-1">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-350">{{ subject.name }}</span>
            <div class="flex items-center">
              <div class="w-20 bg-slate-50 dark:bg-slate-950 rounded-full h-2 mr-3">
                <div
                  class="bg-emerald-500 rounded-full h-2"
                  :style="{ width: `${subject.average}%` }"
                ></div>
              </div>
              <span class="text-xs font-black text-slate-500 dark:text-slate-400">{{ subject.average }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Financiero -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Balance Financiero</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Ingresos Totales</span>
            <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">${{ financialSummary.income.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Pendientes</span>
            <span class="text-sm font-black text-rose-600 dark:text-rose-400">${{ financialSummary.pending.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Porcentaje Recaudación</span>
            <span class="text-sm font-black text-teal-600 dark:text-teal-400">{{ financialSummary.collection }}%</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Reportes Disponibles -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
      <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Generador de Reportes Disponibles</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="report in availableReports" :key="report.id" class="p-4 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850/60 rounded-2xl hover:border-emerald-500/20 hover:bg-slate-100/50 dark:hover:bg-slate-900 transition-all duration-300 cursor-pointer" @click="generateReport(report)">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-lg mr-3.5">
              {{ report.icon }}
            </div>
            <div>
              <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{{ report.title }}</h4>
              <p class="text-[10px] text-slate-400 mt-1">{{ report.description }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-850/60">
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">{{ report.format }}</span>
            <button class="text-emerald-600 dark:text-emerald-400 text-xs font-black hover:translate-x-0.5 transition-transform">Generar →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedPeriod = ref('month')

const mainStats = ref([
  { label: 'Total Estudiantes', value: '847', icon: '👨‍🎓', trend: 5.2 },
  { label: 'Promedio General', value: '82.5', icon: '📊', trend: 2.1 },
  { label: 'Asistencia Prom.', value: '94%', icon: '✅', trend: 1.5 },
  { label: 'Satisfacción', value: '89%', icon: '⭐', trend: 3.2 }
])

const academicPerformance = ref([
  { name: '1ro Prim.', average: 88, students: 120, color: 'bg-emerald-400' },
  { name: '2do Prim.', average: 85, students: 115, color: 'bg-emerald-400' },
  { name: '3ro Prim.', average: 82, students: 108, color: 'bg-teal-400' },
  { name: '4to Prim.', average: 79, students: 102, color: 'bg-amber-400' },
  { name: '5to Prim.', average: 84, students: 98, color: 'bg-teal-400' },
  { name: '6to Prim.', average: 86, students: 95, color: 'bg-emerald-400' },
])

const attendanceData = ref([
  { name: 'Ene', rate: 95 },
  { name: 'Feb', rate: 93 },
  { name: 'Mar', rate: 94 },
  { name: 'Abr', rate: 91 },
  { name: 'May', rate: 92 },
  { name: 'Jun', rate: 94 }
])

const statusDistribution = ref([
  { label: 'Excelente (90-100)', count: 245, percentage: 29, color: 'bg-emerald-500' },
  { label: 'Bueno (80-89)', count: 312, percentage: 37, color: 'bg-teal-500' },
  { label: 'Regular (70-79)', count: 198, percentage: 23, color: 'bg-amber-500' },
  { label: 'Necesita Mejora (<70)', count: 92, percentage: 11, color: 'bg-rose-500' }
])

const topSubjects = ref([
  { name: 'Matemáticas', average: 85 },
  { name: 'Español', average: 82 },
  { name: 'Ciencias', average: 80 },
  { name: 'Historia', average: 78 },
  { name: 'Inglés', average: 76 }
])

const financialSummary = ref({
  income: 125000,
  pending: 18500,
  collection: 87
})

const availableReports = ref([
  { id: 1, title: 'Boletín de Calificaciones', description: 'Calificaciones acumuladas por alumno', icon: '📝', format: 'PDF' },
  { id: 2, title: 'Reporte de Asistencia', description: 'Detalle mensual de asistencia y ausencias', icon: '✅', format: 'PDF' },
  { id: 3, title: 'Estado de Cuenta', description: 'Historial de facturación del estudiante', icon: '💰', format: 'PDF' },
  { id: 4, title: 'Estadísticas Generales', description: 'Resumen e histogramas académicos', icon: '📊', format: 'Excel' },
  { id: 5, title: 'Lista de Estudiantes', description: 'Directorio general de alumnos registrados', icon: '👥', format: 'Excel' },
  { id: 6, title: 'Horario Escolar', description: 'Distribución de clases por aula y materia', icon: '📅', format: 'PDF' },
])

const exportReport = () => {
  alert('Exportando reporte...')
}

const generateReport = (report) => {
  alert(`Generando: ${report.title}`)
}
</script>
