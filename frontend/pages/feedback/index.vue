<template>
  <div class="min-h-screen pb-20 bg-slate-50/60 dark:bg-[#0c071e] text-slate-800 dark:text-slate-100 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      
      <!-- Top Header & Breadcrumb -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-brand-gold uppercase tracking-wider mb-1">
            <span>Dirección & Calidad</span>
            <span>•</span>
            <span>Auditoría de Experiencia</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Métricas de Satisfacción y Feedback</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold font-mono">
              ⭐ {{ metrics.average_rating || '5.00' }} / 5.00
            </span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            U. E. Colegio "Santa Luisa" • Percepción del sistema por Representantes, Docentes y Personal.
          </p>
        </div>

        <!-- Top Actions -->
        <div class="flex items-center gap-2.5">
          <button
            @click="fetchFeedbackData"
            type="button"
            :disabled="loading"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            <span :class="{ 'animate-spin': loading }">🔄</span>
            <span>Actualizar Datos</span>
          </button>

          <button
            @click="openFeedback('general')"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>⭐</span>
            <span>Calificar la Plataforma</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !feedbackList.length" class="py-20 text-center">
        <div class="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">Cargando analíticas directivas...</p>
      </div>

      <div v-else class="mt-6 space-y-6">
        
        <!-- 4 TOP KPI CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- KPI 1: Promedio General -->
          <div class="p-5 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">⭐</div>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Índice de Satisfacción</p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-amber-500 font-display">{{ metrics.average_rating || '5.00' }}</span>
              <span class="text-xs text-slate-400 font-bold">/ 5.00</span>
            </div>
            <div class="mt-2 flex items-center gap-1 text-amber-400 text-sm">
              <span v-for="s in 5" :key="s">
                {{ s <= Math.round(metrics.average_rating || 5) ? '★' : '☆' }}
              </span>
              <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-1.5 font-sans">
                {{ getQualityLabel(metrics.average_rating) }}
              </span>
            </div>
          </div>

          <!-- KPI 2: Total de Evaluaciones -->
          <div class="p-5 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">📝</div>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total de Evaluaciones</p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-slate-900 dark:text-white font-display">{{ metrics.total_reviews || 0 }}</span>
              <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">opiniones registradas</span>
            </div>
            <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Comunidad activa expresando sugerencias.
            </p>
          </div>

          <!-- KPI 3: Tasa de Aprobación -->
          <div class="p-5 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">👍</div>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aprobación Positiva (≥4★)</p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-emerald-500 font-display">{{ metrics.satisfaction_rate || 100 }}%</span>
              <span class="text-xs text-slate-400 font-bold">favorable</span>
            </div>
            <div class="mt-2.5 w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" :style="{ width: `${metrics.satisfaction_rate || 100}%` }"></div>
            </div>
          </div>

          <!-- KPI 4: Representantes vs Personal -->
          <div class="p-5 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">👨‍👩‍👧</div>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Percepción Representantes</p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-sky-500 font-display">
                {{ metrics.role_breakdown?.parent?.avg_rating || metrics.average_rating || '5.00' }}
              </span>
              <span class="text-xs text-slate-400 font-bold">promedio</span>
            </div>
            <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {{ metrics.role_breakdown?.parent?.count || 0 }} representantes han evaluado el sistema.
            </p>
          </div>
        </div>

        <!-- 2 MID ANALYTICS GRIDS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- HISTOGRAMA DE DISTRIBUCIÓN DE ESTRELLAS -->
          <div class="p-6 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <span>📊 Distribución de Calificaciones</span>
            </h3>

            <div class="space-y-3">
              <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-3 text-xs">
                <span class="w-12 font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>{{ star }}</span>
                  <span class="text-amber-400">★</span>
                </span>
                <div class="flex-1 bg-slate-100 dark:bg-white/10 h-3 rounded-full overflow-hidden">
                  <div
                    class="h-3 rounded-full transition-all duration-500"
                    :class="[
                      star === 5 ? 'bg-amber-400' :
                      star === 4 ? 'bg-emerald-500' :
                      star === 3 ? 'bg-sky-400' :
                      star === 2 ? 'bg-orange-400' : 'bg-rose-500'
                    ]"
                    :style="{ width: `${getStarPercentage(star)}%` }"
                  ></div>
                </div>
                <span class="w-12 text-right font-mono font-bold text-slate-500 dark:text-slate-400">
                  {{ metrics.star_distribution?.[star] || 0 }} ({{ getStarPercentage(star) }}%)
                </span>
              </div>
            </div>
          </div>

          <!-- DESGLOSE COMPARATIVO POR ROL -->
          <div class="p-6 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <span>👥 Percepción por Estamento Escolar</span>
            </h3>

            <div class="space-y-3.5">
              <!-- Representantes -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">👨‍👩‍👧</span>
                  <div>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">Padres y Representantes</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">
                      {{ metrics.role_breakdown?.parent?.count || 0 }} valoraciones registradas
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-amber-500 font-mono">
                    {{ metrics.role_breakdown?.parent?.avg_rating || 'N/A' }} ★
                  </p>
                  <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {{ metrics.role_breakdown?.parent?.satisfaction_rate || 100 }}% satisfacción
                  </p>
                </div>
              </div>

              <!-- Docentes -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">👩‍🏫</span>
                  <div>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">Personal Docente</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">
                      {{ metrics.role_breakdown?.teacher?.count || 0 }} valoraciones registradas
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-amber-500 font-mono">
                    {{ metrics.role_breakdown?.teacher?.avg_rating || 'N/A' }} ★
                  </p>
                  <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {{ metrics.role_breakdown?.teacher?.satisfaction_rate || 100 }}% satisfacción
                  </p>
                </div>
              </div>

              <!-- Personal Administrativo y Directivo -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🏛️</span>
                  <div>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">Personal Administrativo / Directivo</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">
                      {{ (metrics.role_breakdown?.staff?.count || 0) + (metrics.role_breakdown?.admin?.count || 0) }} valoraciones
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-amber-500 font-mono">
                    {{ metrics.role_breakdown?.staff?.avg_rating || metrics.role_breakdown?.admin?.avg_rating || '5.00' }} ★
                  </p>
                  <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    100% satisfacción
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STREAM DE OPINIONES Y COMENTARIOS -->
        <div class="p-6 rounded-3xl bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4 mb-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>💬 Muro de Opiniones y Comentarios</span>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-mono">
                  {{ filteredFeedbackList.length }}
                </span>
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Voces y sugerencias de la comunidad educativa Santa Luisa.
              </p>
            </div>

            <!-- Filters -->
            <div class="flex items-center flex-wrap gap-2">
              <!-- Filter by Role -->
              <select
                v-model="filterRole"
                class="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <option value="all">Todos los Roles</option>
                <option value="parent">Representantes</option>
                <option value="teacher">Docentes</option>
                <option value="staff">Personal / Directivos</option>
              </select>

              <!-- Filter by Stars -->
              <select
                v-model="filterRating"
                class="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <option value="all">Todas las Estrellas</option>
                <option value="5">5 Estrellas (★ 5)</option>
                <option value="4">4 Estrellas (★ 4)</option>
                <option value="3">3 Estrellas (★ 3)</option>
                <option value="low">≤ 2 Estrellas</option>
              </select>

              <!-- Filter by Module -->
              <select
                v-model="filterModule"
                class="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <option value="all">Todos los Módulos</option>
                <option value="supplies">Útiles Escolares</option>
                <option value="report_cards">Boletas y Notas</option>
                <option value="grades">Gestión Docente</option>
                <option value="general">Toda la Plataforma</option>
              </select>
            </div>
          </div>

          <!-- Empty filtered state -->
          <div v-if="filteredFeedbackList.length === 0" class="py-12 text-center text-slate-400 text-xs">
            No se encontraron opiniones que coincidan con los filtros seleccionados.
          </div>

          <!-- Cards list -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in filteredFeedbackList"
              :key="item.id"
              class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <!-- Top Row: User + Role + Rating -->
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                      {{ item.user_name?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {{ item.user_name || 'Anónimo' }}
                      </p>
                      <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {{ getRoleBadge(item.user_role) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    <span class="text-xs font-black text-amber-500 font-mono">{{ item.rating }}</span>
                    <span class="text-amber-400 text-xs">★</span>
                  </div>
                </div>

                <!-- Comment text -->
                <p v-if="item.comment" class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2 italic bg-white dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                  "{{ item.comment }}"
                </p>
                <p v-else class="text-[11px] text-slate-400 italic mt-2">
                  (Calificación sin comentario adicional)
                </p>
              </div>

              <!-- Bottom Row: Module Tag + Date -->
              <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span class="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-white/10 font-medium">
                  {{ getModuleLabel(item.module_tag) }}
                </span>
                <span>{{ formatDate(item.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const authStore = useAuthStore?.() || null
const { openFeedback } = useFeedback()

const loading = ref(false)
const feedbackList = ref([])
const metrics = ref({
  total_reviews: 0,
  average_rating: 5.0,
  satisfaction_rate: 100,
  star_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  role_breakdown: {},
  module_breakdown: {}
})

const filterRole = ref('all')
const filterRating = ref('all')
const filterModule = ref('all')

const fetchFeedbackData = async () => {
  loading.value = true
  try {
    const apiBase = config.public.apiBase || 'https://school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev'
    const res = await $fetch(`${apiBase}/system-feedback`)
    feedbackList.value = res.data || []
    metrics.value = res.metrics || {
      total_reviews: 0,
      average_rating: 5.0,
      satisfaction_rate: 100,
      star_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      role_breakdown: {},
      module_breakdown: {}
    }
  } catch (err) {
    console.error('Error fetching feedback data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeedbackData()
})

const filteredFeedbackList = computed(() => {
  return feedbackList.value.filter(item => {
    if (filterRole.value !== 'all' && item.user_role !== filterRole.value) {
      return false
    }
    if (filterRating.value !== 'all') {
      if (filterRating.value === 'low') {
        if (item.rating > 2) return false
      } else if (item.rating !== parseInt(filterRating.value, 10)) {
        return false
      }
    }
    if (filterModule.value !== 'all' && item.module_tag !== filterModule.value) {
      return false
    }
    return true
  })
})

const getStarPercentage = (star) => {
  const total = metrics.value.total_reviews || 0
  if (total === 0) return 0
  const count = metrics.value.star_distribution?.[star] || 0
  return Math.round((count / total) * 100)
}

const getQualityLabel = (rating) => {
  const r = parseFloat(rating) || 5.0
  if (r >= 4.8) return 'Excepcional'
  if (r >= 4.0) return 'Muy Alta'
  if (r >= 3.0) return 'Aceptable'
  return 'En Observación'
}

const getRoleBadge = (role) => {
  const roles = {
    parent: 'Representante',
    teacher: 'Docente',
    staff: 'Personal Administrativo',
    admin: 'Directiva',
    student: 'Estudiante'
  }
  return roles[role] || role || 'Usuario'
}

const getModuleLabel = (tag) => {
  const tags = {
    supplies: '📚 Útiles Escolares',
    report_cards: '📊 Boletas y Calificaciones',
    grades: '📝 Evaluaciones',
    general: '🌐 Toda la Plataforma',
    portal: '👨‍👩‍👧 Portal Representante',
    attendance: '🏫 Asistencia'
  }
  return tags[tag] || tag || 'General'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch (e) {
    return dateStr
  }
}
</script>
