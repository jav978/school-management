<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-black font-display text-slate-800 dark:text-white">Gestión Financiera</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Administra pagos, cuotas y la facturación de los estudiantes</p>
      </div>
      <button 
        @click="showPaymentModal = true" 
        class="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all duration-300"
      >
        + Registrar Pago
      </button>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ingresos del Mes</span>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${{ totalIncome.toLocaleString() }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-650 font-black text-lg">
          💰
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pendiente</span>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">${{ pendingPayments.toLocaleString() }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-650 font-black text-lg">
          ⏳
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vencido</span>
          <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">${{ overduePayments.toLocaleString() }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-650 font-black text-lg">
          ⚠️
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Al día</span>
          <h3 class="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{{ paidStudents }}%</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-650 font-black text-lg">
          ✓
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar estudiante..."
            class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
          />
          <span class="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
        </div>
        <select v-model="filterStatus" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
          <option value="">Todos los estados</option>
          <option value="paid">Pagado</option>
          <option value="pending">Pendiente</option>
          <option value="overdue">Vencido</option>
        </select>
        <select v-model="filterMonth" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
          <option value="">Todos los meses</option>
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>
    </div>

    <!-- Payments Table Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th class="pb-4 pl-2">Estudiante</th>
              <th class="pb-4">Concepto</th>
              <th class="pb-4">Monto</th>
              <th class="pb-4">Fecha</th>
              <th class="pb-4">Estado</th>
              <th class="pb-4 text-right pr-4">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-850/40 text-sm">
            <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
              <td class="py-4 pl-2 font-bold text-slate-800 dark:text-slate-150">{{ payment.student }}</td>
              <td class="py-4 text-slate-500 dark:text-slate-400 font-medium">{{ payment.concept }}</td>
              <td class="py-4 font-black text-slate-800 dark:text-slate-100">${{ payment.amount.toLocaleString() }}</td>
              <td class="py-4 text-slate-400 font-medium">{{ payment.date }}</td>
              <td class="py-4">
                <span :class="[getStatusClass(payment.status), 'text-[10px] font-bold px-2.5 py-1 rounded-lg']">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
              <td class="py-4 text-right pr-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="viewReceipt(payment)" class="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 active:scale-95 transition-all" title="Ver Recibo">
                    📄
                  </button>
                  <button v-if="payment.status !== 'paid'" @click="markAsPaid(payment)" class="p-2 rounded-xl text-teal-500 hover:bg-teal-500/10 active:scale-95 transition-all" title="Marcar como Pagado">
                    ✅
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Summary Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Distribución de Pagos -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Distribución por Concepto</h3>
        <div class="space-y-4">
          <div v-for="item in paymentDistribution" :key="item.label" class="flex items-center">
            <span class="w-24 text-xs font-semibold text-slate-400 dark:text-slate-500">{{ item.label }}</span>
            <div class="flex-1 bg-slate-50 dark:bg-slate-950/85 rounded-full h-2.5 ml-2">
              <div
                :class="[item.color, 'rounded-full h-2.5 transition-all duration-500']"
                :style="{ width: `${item.percentage}%` }"
              ></div>
            </div>
            <span class="ml-4 text-xs font-black text-slate-700 dark:text-slate-300">${{ item.amount.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Últimos Pagos -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Transacciones Recientes</h3>
        <div class="space-y-3.5">
          <div v-for="payment in recentPayments" :key="payment.id" class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl hover:bg-slate-100/50 transition-all">
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ payment.student }}</p>
              <p class="text-[10px] text-slate-400 dark:text-slate-550 mt-0.5 font-medium">{{ payment.date }}</p>
            </div>
            <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">+${{ payment.amount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Payment Modal Dialog -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="showPaymentModal = false" class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-350"></div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-fade-in">
        <h3 class="text-lg font-black text-slate-800 dark:text-white mb-6">Registrar Pago</h3>
        <form @submit.prevent="savePayment" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Estudiante</label>
            <select v-model="form.student" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option v-for="student in students" :key="student" :value="student">{{ student }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Concepto</label>
            <select v-model="form.concept" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option value="Colegiatura">Colegiatura</option>
              <option value="Matrícula">Matrícula</option>
              <option value="Materiales">Materiales</option>
              <option value="Transporte">Transporte</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Monto (USD)</label>
            <input v-model.number="form.amount" type="number" min="0" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Fecha de Pago</label>
            <input v-model="form.date" type="date" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Método de Pago</label>
            <select v-model="form.method" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300">
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="button" @click="showPaymentModal = false" class="px-5 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold rounded-2xl text-xs transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-300">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  { label: 'Colegiaturas', amount: 7500, percentage: 75, color: 'bg-emerald-500' },
  { label: 'Matrículas', amount: 1500, percentage: 15, color: 'bg-teal-500' },
  { label: 'Materiales', amount: 500, percentage: 5, color: 'bg-amber-500' },
  { label: 'Transporte', amount: 500, percentage: 5, color: 'bg-indigo-500' }
])

const recentPayments = computed(() => payments.value.filter(p => p.status === 'paid').slice(0, 3))

const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
  }
  return classes[status] || 'bg-slate-500/10 text-slate-500'
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
