<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Reportes</h2>
        <p class="text-gray-500">Estadísticas e informes del sistema</p>
      </div>
      <div class="flex space-x-3">
        <select v-model="selectedPeriod" class="input-field">
          <option value="month">Este Mes</option>
          <option value="quarter">Este Trimestre</option>
          <option value="year">Este Año</option>
        </select>
        <button @click="exportReport" class="btn-secondary">📥 Exportar</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div v-for="stat in mainStats" :key="stat.label" class="card">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">{{ stat.icon }}</span>
          <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium">
            {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
          </span>
        </div>
        <p class="text-3xl font-bold text-gray-800">{{ stat.value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Rendimiento Académico por Grado</h3>
        <div class="space-y-4">
          <div v-for="grade in academicPerformance" :key="grade.name" class="flex items-center">
            <span class="w-24 text-sm font-medium text-gray-700">{{ grade.name }}</span>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 rounded-full h-6">
                <div
                  :class="grade.color"
                  class="rounded-full h-6 flex items-center justify-end pr-2"
                  :style="{ width: `${grade.average}%` }"
                >
                  <span class="text-xs font-medium text-white">{{ grade.average }}%</span>
                </div>
              </div>
            </div>
            <span class="w-16 text-right text-sm text-gray-600">{{ grade.students }} alumnos</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Asistencia Mensual</h3>
        <div class="grid grid-cols-6 gap-2">
          <div v-for="month in attendanceData" :key="month.name" class="text-center">
            <div class="text-xs text-gray-500 mb-1">{{ month.name }}</div>
            <div
              :class="month.rate >= 90 ? 'bg-green-100' : month.rate >= 80 ? 'bg-yellow-100' : 'bg-red-100'"
              class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto"
            >
              <span class="text-sm font-bold">{{ month.rate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Distribución por Estado</h3>
        <div class="space-y-3">
          <div v-for="item in statusDistribution" :key="item.label" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="item.color" class="w-3 h-3 rounded-full mr-3"></div>
              <span class="text-sm text-gray-700">{{ item.label }}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-800 mr-2">{{ item.count }}</span>
              <span class="text-sm text-gray-500">({{ item.percentage }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Top Materias</h3>
        <div class="space-y-3">
          <div v-for="subject in topSubjects" :key="subject.name" class="flex items-center justify-between">
            <span class="text-sm text-gray-700">{{ subject.name }}</span>
            <div class="flex items-center">
              <div class="w-24 bg-gray-200 rounded-full h-3 mr-3">
                <div
                  class="bg-primary-500 rounded-full h-3"
                  :style="{ width: `${subject.average}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-600">{{ subject.average }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Resumen Financiero</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span class="text-sm text-gray-700">Ingresos Totales</span>
            <span class="font-bold text-green-600">${{ financialSummary.income.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span class="text-sm text-gray-700">Pendientes</span>
            <span class="font-bold text-red-600">${{ financialSummary.pending.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span class="text-sm text-gray-700">Recaudación</span>
            <span class="font-bold text-blue-600">{{ financialSummary.collection }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Reportes Disponibles</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="report in availableReports" :key="report.id" class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" @click="generateReport(report)">
          <div class="flex items-center mb-3">
            <span class="text-2xl mr-3">{{ report.icon }}</span>
            <div>
              <h4 class="font-medium text-gray-800">{{ report.title }}</h4>
              <p class="text-sm text-gray-500">{{ report.description }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">{{ report.format }}</span>
            <button class="text-primary-600 text-sm font-medium">Generar →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedPeriod = ref('month')

const mainStats = ref([
  { label: 'Total Estudiantes', value: '847', icon: '👨‍🎓', trend: 5.2 },
  { label: 'Promedio General', value: '82.5', icon: '📊', trend: 2.1 },
  { label: 'Asistencia', value: '94%', icon: '✅', trend: 1.5 },
  { label: 'Satisfacción', value: '89%', icon: '⭐', trend: 3.2 }
])

const academicPerformance = ref([
  { name: '1ro Prim.', average: 88, students: 120, color: 'bg-green-500' },
  { name: '2do Prim.', average: 85, students: 115, color: 'bg-green-500' },
  { name: '3ro Prim.', average: 82, students: 108, color: 'bg-blue-500' },
  { name: '4to Prim.', average: 79, students: 102, color: 'bg-yellow-500' },
  { name: '5to Prim.', average: 84, students: 98, color: 'bg-blue-500' },
  { name: '6to Prim.', average: 86, students: 95, color: 'bg-green-500' },
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
  { label: 'Excelente (90-100)', count: 245, percentage: 29, color: 'bg-green-500' },
  { label: 'Bueno (80-89)', count: 312, percentage: 37, color: 'bg-blue-500' },
  { label: 'Regular (70-79)', count: 198, percentage: 23, color: 'bg-yellow-500' },
  { label: 'Necesita Mejora (<70)', count: 92, percentage: 11, color: 'bg-red-500' }
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
  { id: 1, title: 'Boletín de Calificaciones', description: 'Calificaciones por estudiante', icon: '📝', format: 'PDF' },
  { id: 2, title: 'Reporte de Asistencia', description: 'Asistencia mensual detallada', icon: '✅', format: 'PDF' },
  { id: 3, title: 'Estado de Cuenta', description: 'Estado financiero por estudiante', icon: '💰', format: 'PDF' },
  { id: 4, title: 'Estadísticas Generales', description: 'Resumen académico del periodo', icon: '📊', format: 'Excel' },
  { id: 5, title: 'Lista de Estudiantes', description: 'Directorio completo', icon: '👥', format: 'Excel' },
  { id: 6, title: 'Horario Escolar', description: 'Horarios por grado', icon: '📅', format: 'PDF' },
])

const exportReport = () => {
  alert('Exportando reporte...')
}

const generateReport = (report) => {
  alert(`Generando: ${report.title}`)
}
</script>
