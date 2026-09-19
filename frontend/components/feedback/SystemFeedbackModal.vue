<template>
  <Teleport to="body">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      @click.self="closeFeedback"
    >
      <div
        class="bg-white dark:bg-[#140c2b] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all animate-scale-in"
      >
        <!-- Top Institutional Accent Bar -->
        <div class="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600"></div>

        <!-- SUCCESS STATE -->
        <div v-if="isSubmitted" class="p-8 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-3xl animate-bounce">
            ✓
          </div>
          <h3 class="text-xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            ¡Muchas gracias por tu opinión!
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Tu valoración de <span class="font-bold text-amber-500">{{ rating }} ★</span> y tus comentarios han sido registrados exitosamente. Nos ayudan a mejorar cada día la plataforma escolar.
          </p>
          <div class="pt-2">
            <button
              @click="resetAndClose"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        <!-- FORM STATE -->
        <div v-else class="p-6 sm:p-7">
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div>
              <div class="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-brand-gold uppercase tracking-wider mb-1">
                <span>⭐ Satisfacción del Usuario</span>
                <span>•</span>
                <span>Mejora Continua</span>
              </div>
              <h2 class="text-xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                ¿Cómo calificarías tu experiencia?
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                U. E. Colegio "Santa Luisa" • Tu opinión orienta nuestras mejoras.
              </p>
            </div>
            <button
              @click="closeFeedback"
              class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="submitFeedback" class="mt-5 space-y-5">
            <!-- 5-Star Interactive Rating -->
            <div class="text-center py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/5 p-4">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Haz clic en las estrellas para calificar
              </span>
              
              <!-- Stars row -->
              <div class="flex items-center justify-center gap-2 sm:gap-3 my-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="rating = star"
                  @mouseenter="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                  class="text-3xl sm:text-4xl transition-all duration-150 transform hover:scale-125 focus:outline-none cursor-pointer"
                  :class="[
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]'
                      : 'text-slate-300 dark:text-slate-700'
                  ]"
                >
                  ★
                </button>
              </div>

              <!-- Dynamic Emotion & Description -->
              <div class="min-h-[30px] flex items-center justify-center gap-2 mt-2">
                <span class="text-xl transition-all duration-200">{{ currentEmotion.emoji }}</span>
                <span class="text-xs font-bold" :class="currentEmotion.color">
                  {{ currentEmotion.label }}
                </span>
              </div>
            </div>

            <!-- Module / Area Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                ¿Sobre qué área específica deseas opinar?
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="mod in moduleOptions"
                  :key="mod.id"
                  type="button"
                  @click="selectedModule = mod.id"
                  :class="[
                    selectedModule === mod.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                  ]"
                  class="px-3 py-2 rounded-xl border text-[11px] text-left transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span class="text-base">{{ mod.icon }}</span>
                  <span class="truncate">{{ mod.label }}</span>
                </button>
              </div>
            </div>

            <!-- Comment Textarea -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Tus comentarios o sugerencias (opcional)</span>
                <span class="text-[10px] text-slate-400">{{ comment.length }}/500</span>
              </label>
              <textarea
                v-model="comment"
                maxlength="500"
                rows="3"
                class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all resize-none"
                placeholder="Cuéntanos qué te ha parecido el sistema, qué función te encanta o qué detalle deberíamos mejorar..."
              ></textarea>
            </div>

            <!-- User identification badge -->
            <div class="flex items-center justify-between text-[11px] px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-white/5 text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1.5">
                <span>👤 Evaluando como:</span>
                <strong class="text-slate-800 dark:text-slate-200 font-semibold">{{ currentUserName }}</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-brand-gold font-mono font-bold uppercase text-[10px]">
                {{ currentUserRoleLabel }}
              </span>
            </div>

            <!-- Error message if any -->
            <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {{ errorMessage }}
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                @click="closeFeedback"
                type="button"
                class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || rating === 0"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Enviar Calificación</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const { isModalOpen, defaultModule, closeFeedback } = useFeedback()
const config = useRuntimeConfig()
const authStore = useAuthStore?.() || null

const rating = ref(5)
const hoverRating = ref(0)
const selectedModule = ref('general')
const comment = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

// Initialize module when modal opens
watch(isModalOpen, (open) => {
  if (open) {
    selectedModule.value = defaultModule.value || 'general'
    errorMessage.value = ''
    isSubmitted.value = false
    rating.value = 5
    comment.value = ''
  }
})

const moduleOptions = [
  { id: 'general', label: 'Toda la Plataforma', icon: '🌐' },
  { id: 'supplies', label: 'Útiles Escolares', icon: '📚' },
  { id: 'report_cards', label: 'Boletas y Notas', icon: '📊' },
  { id: 'portal', label: 'Portal del Representante', icon: '👨‍👩‍👧' },
  { id: 'grades', label: 'Gestión Docente', icon: '📝' },
  { id: 'attendance', label: 'Asistencia y Horarios', icon: '🏫' }
]

const emotionMap = {
  5: { emoji: '🤩', label: '¡Excelente experiencia!', color: 'text-amber-500' },
  4: { emoji: '😊', label: 'Muy buena experiencia', color: 'text-emerald-500' },
  3: { emoji: '😐', label: 'Regular / Aceptable', color: 'text-sky-500' },
  2: { emoji: '😕', label: 'Puede mejorar', color: 'text-orange-500' },
  1: { emoji: '😞', label: 'Deficiente', color: 'text-rose-500' }
}

const currentEmotion = computed(() => {
  const activeStar = hoverRating.value || rating.value || 5
  return emotionMap[activeStar] || emotionMap[5]
})

const currentUserName = computed(() => {
  if (authStore?.user) {
    const u = authStore.user
    return u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.name || u.email)
  }
  return 'Usuario de la Comunidad'
})

const currentUserRole = computed(() => {
  return authStore?.user?.role || 'parent'
})

const currentUserRoleLabel = computed(() => {
  const roles = {
    admin: 'Administrador',
    director: 'Director',
    coordinator: 'Coordinador',
    teacher: 'Docente',
    parent: 'Representante',
    student: 'Estudiante',
    staff: 'Personal Administrativo'
  }
  return roles[currentUserRole.value] || 'Comunidad'
})

const submitFeedback = async () => {
  if (rating.value < 1 || rating.value > 5) {
    errorMessage.value = 'Por favor selecciona una calificación de 1 a 5 estrellas.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const apiBase = config.public.apiBase || 'https://school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev'
    const headers = { 'Content-Type': 'application/json' }
    if (authStore?.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    const res = await $fetch(`${apiBase}/system-feedback`, {
      method: 'POST',
      headers,
      body: {
        rating: rating.value,
        sentiment: currentEmotion.value.emoji,
        module_tag: selectedModule.value,
        comment: comment.value,
        user_name: currentUserName.value,
        user_role: currentUserRole.value,
        user_id: authStore?.user?.id || null,
        user_email: authStore?.user?.email || null
      }
    })

    isSubmitted.value = true
  } catch (err) {
    console.error('Error enviando feedback:', err)
    errorMessage.value = err?.data?.message || 'Ocurrió un inconveniente al registrar tu opinión. Por favor inténtalo de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}

const resetAndClose = () => {
  isSubmitted.value = false
  closeFeedback()
}
</script>
