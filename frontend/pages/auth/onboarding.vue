<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans relative">
    <div class="w-full max-w-xl relative z-10">
      <div class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-10 transition-all">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-2 mx-auto mb-4 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-slate-700/60">
            <img src="/logocolegio.png" alt="Logo U.E Santa Luisa" class="w-full h-full object-contain" />
          </div>
          <h1 class="text-2xl font-black text-slate-850 dark:text-white tracking-tight font-display">
            Completa tu Perfil Institucional
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium max-w-md mx-auto leading-relaxed">
            Bienvenido a la plataforma escolar de la U.E Colegio "Santa Luisa". Selecciona tu rol y asocia tu identificación.
          </p>
        </div>

        <!-- Vista de Estado Pendiente (Docente / Administrativo) -->
        <div v-if="pendingApproval" class="text-center space-y-5 py-4">
          <div class="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner border border-amber-200/60 dark:border-amber-800/40">
            ⏳
          </div>
          <h2 class="text-lg font-bold text-slate-850 dark:text-white">
            Solicitud en Proceso de Verificación
          </h2>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2">
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tu cuenta ha sido creada exitosamente como <strong class="text-orange-600 dark:text-orange-400 capitalize">{{ selectedRoleName }}</strong>.
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Por políticas de seguridad y protección de datos académicos, la Dirección del Plantel y Control de Estudios revisarán tu registro para otorgarte los permisos correspondientes.
            </p>
            <div class="pt-2 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span>🏫</span>
              <span>U.E Colegio "Santa Luisa" • Coordinación Académica</span>
            </div>
          </div>
          <div class="pt-2">
            <NuxtLink
              to="/auth/login"
              class="w-full inline-block py-3 px-6 bg-slate-850 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
            >
              Volver al Inicio de Sesión
            </NuxtLink>
          </div>
        </div>

        <!-- Formulario de Onboarding -->
        <form v-else @submit.prevent="handleSubmitOnboarding" class="space-y-6">
          <!-- 1. Selección de Rol -->
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">
              1. Selecciona tu Rol en el Plantel
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Representante -->
              <div 
                @click="selectedRole = 'parent'"
                :class="[
                  'p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3',
                  selectedRole === 'parent' 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-100 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                ]"
              >
                <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 flex items-center justify-center text-lg flex-shrink-0">
                  👨‍👩‍👧
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100">Representante</h3>
                    <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">Activo</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Consulta notas, pagos y asistencias de tus representados.
                  </p>
                </div>
              </div>

              <!-- Estudiante -->
              <div 
                @click="selectedRole = 'student'"
                :class="[
                  'p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3',
                  selectedRole === 'student' 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-100 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                ]"
              >
                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg flex-shrink-0">
                  🎓
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100">Estudiante</h3>
                    <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">Activo</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Horarios, materias, asignaciones y boletines.
                  </p>
                </div>
              </div>

              <!-- Docente -->
              <div 
                @click="selectedRole = 'teacher'"
                :class="[
                  'p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3',
                  selectedRole === 'teacher' 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-100 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                ]"
              >
                <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-lg flex-shrink-0">
                  👨‍🏫
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-bold text-slate-850 dark:text-slate-100">Docente</h3>
                    <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">Verificación</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Carga de calificaciones, asistencias y diplomas.
                  </p>
                </div>
              </div>

              <!-- Personal Administrativo -->
              <div 
                @click="selectedRole = 'staff'"
                :class="[
                  'p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3',
                  selectedRole === 'staff' 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-100 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                ]"
              >
                <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-lg flex-shrink-0">
                  🏛️
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs font-bold text-slate-850 dark:text-slate-100">Personal / Staff</h3>
                    <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">Verificación</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Control de estudios, secretaría y finanzas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Datos de Identidad -->
          <div class="space-y-4 pt-2">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              2. Identificación del Titular
            </label>

            <!-- Cédula de Identidad -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Cédula de Identidad
              </label>
              <div class="flex gap-2">
                <select
                  v-model="idType"
                  class="px-3 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="V">V-</option>
                  <option value="E">E-</option>
                  <option value="J">J-</option>
                </select>
                <input
                  v-model="idNumber"
                  type="text"
                  required
                  placeholder="Ej. 18555444"
                  class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                />
              </div>
            </div>

            <!-- Nombres y Apellidos -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Primer Nombre
                </label>
                <input
                  v-model="firstName"
                  type="text"
                  required
                  placeholder="Ej. Carmen"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Primer Apellido
                </label>
                <input
                  v-model="lastName"
                  type="text"
                  required
                  placeholder="Ej. Pérez"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                />
              </div>
            </div>

            <!-- Teléfono Celular -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Teléfono Celular / WhatsApp
              </label>
              <input
                v-model="phone"
                type="tel"
                placeholder="Ej. 0414-1234567"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
              />
            </div>

            <!-- Correo (Informativo si viene de Google) -->
            <div v-if="email">
              <label class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Correo Electrónico Vinculado
              </label>
              <input
                :value="email"
                disabled
                class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 text-sm font-medium"
              />
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold">
            {{ error }}
          </div>

          <!-- Botón de Envío -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              <span v-if="submitting" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ submitting ? 'Guardando perfil...' : 'Confirmar y Completar Registro' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const route = useRoute()
const authStore = useAuthStore()

const selectedRole = ref('parent')
const idType = ref('V')
const idNumber = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref(route.query.email || '')
const submitting = ref(false)
const error = ref('')
const pendingApproval = ref(false)

const roleNames = {
  parent: 'Representante',
  student: 'Estudiante',
  teacher: 'Docente / Profesor',
  staff: 'Personal Administrativo'
}

const selectedRoleName = computed(() => roleNames[selectedRole.value] || selectedRole.value)

onMounted(() => {
  if (authStore.user) {
    email.value = authStore.user.email || email.value
    firstName.value = authStore.user.first_name || ''
    lastName.value = authStore.user.last_name || ''
    phone.value = authStore.user.phone || ''
  }
})

const handleSubmitOnboarding = async () => {
  error.value = ''

  if (!idNumber.value.trim()) {
    error.value = 'Por favor ingresa tu número de cédula de identidad.'
    return
  }

  submitting.value = true

  try {
    const res = await authStore.completeOAuthOnboarding({
      role: selectedRole.value,
      id_type: idType.value,
      id_number: idNumber.value.trim(),
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim(),
      phone: phone.value.trim(),
      email: email.value
    })

    if (res && res.status === 'pending') {
      pendingApproval.value = true
    } else {
      navigateTo('/dashboard')
    }
  } catch (err) {
    error.value = err.data?.message || err.message || 'Ocurrió un error al guardar tu perfil.'
  } finally {
    submitting.value = false
  }
}
</script>
