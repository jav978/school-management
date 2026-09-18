<template>
  <div class="space-y-6">
    <ui-page-header title="Mi Perfil" subtitle="Gestiona tu información personal y de contacto">
      <template #actions>
        <button @click="toggleEdit" class="btn-secondary cursor-pointer">
          {{ editMode ? 'Cancelar' : 'Editar Perfil' }}
        </button>
        <button v-if="editMode" @click="saveProfile" :disabled="saving" class="btn-primary cursor-pointer flex items-center gap-2">
          <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
        </button>
      </template>
    </ui-page-header>

    <!-- Feedback alerts -->
    <div v-if="successMessage" class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold flex items-center justify-between">
      <span>✓ {{ successMessage }}</span>
      <button @click="successMessage = ''" class="text-emerald-600 hover:text-emerald-800 cursor-pointer">✕</button>
    </div>
    <div v-if="errorMessage" class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm font-semibold flex items-center justify-between">
      <span>⚠ {{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="text-rose-600 hover:text-rose-800 cursor-pointer">✕</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <ui-card>
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <img 
                v-if="form.avatar_url" 
                :src="form.avatar_url" 
                alt="Avatar" 
                class="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-primary/20 shadow-md"
              />
              <ui-avatar v-else :initials="userInitials" size="xl" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white font-display">{{ form.name || 'Usuario' }}</h2>
            <p class="text-xs font-bold text-brand-primary dark:text-brand-secondary uppercase tracking-wider mt-1">{{ form.roleLabel }}</p>
          </div>
          <ui-divider />
          <div class="space-y-3">
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">Email:</span>
              <span class="text-slate-700 dark:text-slate-300 font-medium truncate">{{ form.email }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">Teléfono:</span>
              <span class="text-slate-700 dark:text-slate-300 font-medium">{{ form.phone || 'No registrado' }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-slate-400 w-24">Dirección:</span>
              <span class="text-slate-700 dark:text-slate-300 font-medium">{{ form.address || 'Caracas, Venezuela' }}</span>
            </div>
          </div>
        </ui-card>

        <!-- Represented Students (if Parent) -->
        <ui-card v-if="authStore.user?.children?.length" title="Estudiantes Representados">
          <div class="space-y-2.5">
            <div 
              v-for="child in authStore.user.children" 
              :key="child.id"
              class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            >
              <div class="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">
                🎓
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{{ child.first_name }} {{ child.last_name }}</p>
                <p class="text-[10px] text-slate-400 font-medium">{{ child.student_code || 'Estudiante Regular' }}</p>
              </div>
            </div>
          </div>
        </ui-card>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <ui-card title="Información Personal">
          <div class="space-y-4">
            <!-- Edit Avatar in Edit Mode -->
            <div v-if="editMode" class="mb-4">
              <ui-avatar-upload v-model="form.avatar_url" label="Actualizar Fotografía de Perfil" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ui-form-input
                v-model="form.name"
                label="Nombre Completo"
                :disabled="!editMode"
              />
              <ui-form-input
                v-model="form.email"
                label="Correo Electrónico"
                type="email"
                disabled
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ui-form-input
                v-model="form.phone"
                label="Teléfono Móvil (WhatsApp)"
                :disabled="!editMode"
              />
              <ui-form-input
                v-model="form.address"
                label="Dirección de Habitación"
                :disabled="!editMode"
              />
            </div>
          </div>
        </ui-card>

        <ui-card title="Cambiar Contraseña">
          <div class="space-y-4">
            <ui-form-input
              v-model="passwordForm.current"
              label="Contraseña Actual"
              type="password"
              :disabled="!editMode"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ui-form-input
                v-model="passwordForm.new"
                label="Nueva Contraseña"
                type="password"
                :disabled="!editMode"
              />
              <ui-form-input
                v-model="passwordForm.confirm"
                label="Confirmar Contraseña"
                type="password"
                :disabled="!editMode"
              />
            </div>
          </div>
        </ui-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const authStore = useAuthStore()
const api = useApi()

const editMode = ref(false)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: 'Caracas, Venezuela',
  avatar_url: '',
  roleLabel: 'Usuario'
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const syncUserToForm = () => {
  const u = authStore.user
  if (u) {
    form.value.name = u.full_name || (u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : '') || u.name || u.username || ''
    form.value.email = u.email || ''
    form.value.phone = u.phone || u.phone_mobile || ''
    form.value.address = u.address || u.address_line1 || 'Caracas, Venezuela'
    form.value.avatar_url = u.avatar_url || u.photo_url || ''
    form.value.roleLabel = u.role === 'parent' 
      ? 'Representante Legal' 
      : u.role === 'teacher' 
        ? 'Docente Titular' 
        : u.role === 'student' 
          ? 'Estudiante Regular' 
          : 'Administrador'
  }
}

onMounted(() => {
  syncUserToForm()
})

watch(() => authStore.user, () => {
  syncUserToForm()
}, { immediate: true })

const toggleEdit = () => {
  if (editMode.value) {
    syncUserToForm()
  }
  editMode.value = !editMode.value
  errorMessage.value = ''
}

const userInitials = computed(() => {
  if (!form.value.name) return 'US'
  return form.value.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const saveProfile = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const u = authStore.user
    if (!u || !u.id) {
      throw new Error('No hay sesión de usuario activa')
    }

    const payload = {
      phone: form.value.phone,
      avatar_url: form.value.avatar_url,
      preferences: {
        ...(u.preferences || {}),
        full_name: form.value.name
      }
    }

    // If password update requested
    if (passwordForm.value.new) {
      if (passwordForm.value.new !== passwordForm.value.confirm) {
        throw new Error('La nueva contraseña y su confirmación no coinciden')
      }
      payload.password = passwordForm.value.new
    }

    await api.patch(`users/${u.id}`, payload)

    // Update client authStore
    authStore.user = {
      ...authStore.user,
      full_name: form.value.name,
      name: form.value.name,
      phone: form.value.phone,
      avatar_url: form.value.avatar_url,
      address: form.value.address
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }

    successMessage.value = 'Perfil actualizado exitosamente'
    editMode.value = false
    passwordForm.value.current = ''
    passwordForm.value.new = ''
    passwordForm.value.confirm = ''
  } catch (err) {
    errorMessage.value = err?.data?.message || err?.message || 'Error al guardar los cambios'
  } finally {
    saving.value = false
  }
}
</script>
