<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/40">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black font-display text-slate-850 dark:text-white tracking-tight">
            Gestión de Usuarios y Accesos
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administración de cuentas, credenciales y asignación de los 6 roles de EduFlow
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="openModal()" 
          type="button"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-violet-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Usuario</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Usuarios</p>
          <p class="text-3xl font-black font-display text-slate-850 dark:text-white mt-1">{{ users.length }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center font-bold text-xl">
          👥
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Activos</p>
          <p class="text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1">{{ stats.active }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Docentes / Staff</p>
          <p class="text-3xl font-black font-display text-blue-600 dark:text-blue-400 mt-1">{{ stats.teachersAndStaff }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center font-bold text-xl">
          👨‍🏫
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estudiantes / Padres</p>
          <p class="text-3xl font-black font-display text-amber-600 dark:text-amber-400 mt-1">{{ stats.studentsAndParents }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold text-xl">
          🎓
        </div>
      </div>
    </div>

    <!-- Filter and Search Bar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre, correo o rol..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-850 dark:text-white"
        />
        <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <select 
          v-model="selectedRole" 
          class="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="">Todos los Roles</option>
          <option value="admin">Administrador</option>
          <option value="teacher">Profesor</option>
          <option value="student">Estudiante</option>
          <option value="parent">Representante / Padre</option>
          <option value="administrative">Administrativo</option>
          <option value="academic_control">Control de Estudios</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 mt-2">Cargando usuarios...</p>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th class="p-4">Usuario</th>
            <th class="p-4">Correo Electrónico</th>
            <th class="p-4">Rol del Sistema</th>
            <th class="p-4 text-center">Estado</th>
            <th class="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-xs flex items-center justify-center">
                  {{ (user.full_name || user.email || 'U')[0].toUpperCase() }}
                </div>
                <div>
                  <p class="font-bold text-slate-850 dark:text-white leading-tight">
                    {{ user.full_name || user.email.split('@')[0] }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5">ID: #{{ user.id }}</p>
                </div>
              </div>
            </td>
            <td class="p-4 font-mono text-slate-600 dark:text-slate-300">{{ user.email }}</td>
            <td class="p-4">
              <span 
                :class="getRoleBadge(user.user_type || user.role)"
                class="px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize"
              >
                {{ formatRole(user.user_type || user.role) }}
              </span>
            </td>
            <td class="p-4 text-center">
              <span 
                :class="user.status === 'inactive' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize"
              >
                {{ user.status || 'Activo' }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button 
                @click="editUser(user)"
                class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit User Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-850 dark:text-white mb-4">
          {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h2>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nombre Completo *</label>
            <input 
              v-model="userForm.full_name" 
              required 
              placeholder="Ej: Carmen Rivas"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Correo Electrónico *</label>
            <input 
              v-model="userForm.email" 
              type="email"
              required 
              placeholder="usuario@santaluisa.edu.ve"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div v-if="!isEditing">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Contraseña Inicial *</label>
            <input 
              v-model="userForm.password" 
              type="password"
              required 
              placeholder="••••••••"
              class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Rol / Tipo de Usuario *</label>
              <select 
                v-model="userForm.user_type"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="admin">Administrador</option>
                <option value="teacher">Profesor</option>
                <option value="student">Estudiante</option>
                <option value="parent">Representante / Padre</option>
                <option value="administrative">Administrativo</option>
                <option value="academic_control">Control de Estudios</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Estado</label>
              <select 
                v-model="userForm.status"
                class="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20"
            >
              Guardar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const users = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedRole = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentUserId = ref(null)

const userForm = ref({
  full_name: '',
  email: '',
  password: 'password123',
  user_type: 'teacher',
  status: 'active'
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('users')
    users.value = res.data || res || []
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const active = users.value.filter(u => u.status !== 'inactive').length
  const teachersAndStaff = users.value.filter(u => ['teacher', 'administrative', 'academic_control'].includes(u.user_type || u.role)).length
  const studentsAndParents = users.value.filter(u => ['student', 'parent'].includes(u.user_type || u.role)).length
  return { active, teachersAndStaff, studentsAndParents }
})

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const term = searchQuery.value.toLowerCase()
    const matchesSearch = !searchQuery.value ||
      (u.full_name?.toLowerCase().includes(term) ||
       u.email?.toLowerCase().includes(term) ||
       (u.user_type || u.role)?.toLowerCase().includes(term))

    const matchesRole = !selectedRole.value || (u.user_type || u.role) === selectedRole.value
    return matchesSearch && matchesRole
  })
})

const formatRole = (role) => {
  switch (role) {
    case 'admin': return 'Administrador'
    case 'teacher': return 'Profesor'
    case 'student': return 'Estudiante'
    case 'parent': return 'Representante'
    case 'administrative': return 'Administrativo'
    case 'academic_control': return 'Control de Estudios'
    default: return role || 'Usuario'
  }
}

const getRoleBadge = (role) => {
  switch (role) {
    case 'admin': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    case 'teacher': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    case 'student': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'parent': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'academic_control': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
}

const openModal = () => {
  isEditing.value = false
  currentUserId.value = null
  userForm.value = {
    full_name: '',
    email: '',
    password: 'password123',
    user_type: 'teacher',
    status: 'active'
  }
  isModalOpen.value = true
}

const editUser = (user) => {
  isEditing.value = true
  currentUserId.value = user.id
  userForm.value = {
    full_name: user.full_name || '',
    email: user.email,
    user_type: user.user_type || user.role || 'teacher',
    status: user.status || 'active'
  }
  isModalOpen.value = true
}

const saveUser = async () => {
  try {
    if (isEditing.value) {
      await api.patch(`users/${currentUserId.value}`, {
        full_name: userForm.value.full_name,
        email: userForm.value.email,
        user_type: userForm.value.user_type,
        role: userForm.value.user_type === 'admin' ? 'admin' : 'user',
        status: userForm.value.status
      })
    } else {
      await api.post('users', {
        ...userForm.value,
        role: userForm.value.user_type === 'admin' ? 'admin' : 'user'
      })
    }
    isModalOpen.value = false
    await fetchUsers()
  } catch (err) {
    alert('Error al guardar usuario: ' + err.message)
  }
}

onMounted(fetchUsers)
</script>
