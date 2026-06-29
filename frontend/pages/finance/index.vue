<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gestión Financiera</h2>
        <p class="text-gray-500">Administra pagos y facturación</p>
      </div>
      <button @click="showPaymentModal = true" class="btn-primary">
        + Registrar Pago
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Ingresos del Mes</p>
            <p class="text-3xl font-bold text-green-600">${{ totalIncome.toLocaleString() }}</p>
          </div>
          <span class="text-3xl">💰</span>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Pagos Pendientes</p>
            <p class="text-3xl font-bold text-yellow-600">${{ pendingPayments.toLocaleString() }}</p>
          </div>
          <span class="text-3xl">⏳</span>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Pagos Vencidos</p>
            <p class="text-3xl font-bold text-red-600">${{ overduePayments.toLocaleString() }}</p>
          </div>
          <span class="text-3xl">⚠️</span>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Estudiantes al Día</p>
            <p class="text-3xl font-bold text-blue-600">{{ paidStudents }}%</p>
          </div>
          <span class="text-3xl">✅</span>
        </div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar estudiante..."
          class="input-field md:w-1/3"
        />
        <select v-model="filterStatus" class="input-field md:w-1/4">
          <option value="">Todos los estados</option>
          <option value="paid">Pagado</option>
          <option value="pending">Pendiente</option>
          <option value="overdue">Vencido</option>
        </select>
        <select v-model="filterMonth" class="input-field md:w-1/4">
          <option value="">Todos los meses</option>
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Estudiante</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Concepto</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Monto</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Fecha</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in filteredPayments" :key="payment.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 font-medium text-gray-800">{{ payment.student }}</td>
              <td class="py-3 px-4 text-gray-600">{{ payment.concept }}</td>
              <td class="py-3 px-4 font-semibold text-gray-800">${{ payment.amount.toLocaleString() }}</td>
              <td class="py-3 px-4 text-gray-600">{{ payment.date }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusClass(payment.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewReceipt(payment)" class="text-blue-600 hover:text-blue-800">📄</button>
                  <button v-if="payment.status !== 'paid'" @click="markAsPaid(payment)" class="text-green-600 hover:text-green-800">✅</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Distribución de Pagos</h3>
        <div class="space-y-3">
          <div v-for="item in paymentDistribution" :key="item.label" class="flex items-center">
            <span class="w-24 text-sm text-gray-600">{{ item.label }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-4 ml-3">
              <div
                :class="item.color"
                class="rounded-full h-4"
                :style="{ width: `${item.percentage}%` }"
              ></div>
            </div>
            <span class="ml-3 text-sm font-medium">${{ item.amount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Últimos Pagos</h3>
        <div class="space-y-3">
          <div v-for="payment in recentPayments" :key="payment.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-800">{{ payment.student }}</p>
              <p class="text-sm text-gray-500">{{ payment.date }}</p>
            </div>
            <span class="font-semibold text-green-600">${{ payment.amount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Registrar Pago</h3>
        <form @submit.prevent="savePayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
            <select v-model="form.student" required class="input-field">
              <option v-for="student in students" :key="student" :value="student">{{ student }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
            <select v-model="form.concept" required class="input-field">
              <option value="Colegiatura">Colegiatura</option>
              <option value="Matrícula">Matrícula</option>
              <option value="Materiales">Materiales</option>
              <option value="Transporte">Transporte</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input v-model.number="form.amount" type="number" min="0" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
            <input v-model="form.date" type="date" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
            <select v-model="form.method" required class="input-field">
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showPaymentModal = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const search = ref('')
const filterStatus = ref('')
const filterMonth = ref('')
const showPaymentModal = ref(false)

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
const students = ['Juan Pérez García', 'María López Silva', 'Carlos Rodríguez Luna', 'Ana Martínez Ruiz']

const form = ref({
  student: '',
  concept: 'Colegiatura',
  amount: 0,
  date: '',
  method: 'cash'
})

const payments = ref([
  { id: 1, student: 'Juan Pérez García', concept: 'Colegiatura', amount: 2500, date: '2024-03-15', status: 'paid', method: 'transfer' },
  { id: 2, student: 'María López Silva', concept: 'Colegiatura', amount: 2500, date: '2024-03-10', status: 'paid', method: 'cash' },
  { id: 3, student: 'Carlos Rodríguez Luna', concept: 'Matrícula', amount: 1500, date: '2024-03-20', status: 'pending', method: '' },
  { id: 4, student: 'Ana Martínez Ruiz', concept: 'Colegiatura', amount: 2500, date: '2024-02-15', status: 'overdue', method: '' },
])

const totalIncome = computed(() => payments.value.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0))
const pendingPayments = computed(() => payments.value.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))
const overduePayments = computed(() => payments.value.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0))
const paidStudents = computed(() => Math.round((payments.value.filter(p => p.status === 'paid').length / payments.value.length) * 100))

const filteredPayments = computed(() => {
  return payments.value.filter(p => {
    const matchesSearch = p.student.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !filterStatus.value || p.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const paymentDistribution = ref([
  { label: 'Colegiaturas', amount: 7500, percentage: 75, color: 'bg-blue-500' },
  { label: 'Matrículas', amount: 1500, percentage: 15, color: 'bg-green-500' },
  { label: 'Materiales', amount: 500, percentage: 5, color: 'bg-yellow-500' },
  { label: 'Transporte', amount: 500, percentage: 5, color: 'bg-purple-500' }
])

const recentPayments = computed(() => payments.value.filter(p => p.status === 'paid').slice(0, 3))

const getStatusClass = (status) => {
  const classes = { paid: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', overdue: 'bg-red-100 text-red-800' }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = { paid: 'Pagado', pending: 'Pendiente', overdue: 'Vencido' }
  return labels[status] || status
}

const viewReceipt = (payment) => {
  alert(`Generando recibo para ${payment.student}`)
}

const markAsPaid = (payment) => {
  const index = payments.value.findIndex(p => p.id === payment.id)
  payments.value[index].status = 'paid'
  payments.value[index].method = 'cash'
}

const savePayment = () => {
  payments.value.push({ ...form.value, id: Date.now(), status: 'paid' })
  showPaymentModal.value = false
  form.value = { student: '', concept: 'Colegiatura', amount: 0, date: '', method: 'cash' }
}
</script>
