<template>
  <div class="space-y-6">
    <!-- Header with Action Buttons -->
    <AttendanceHeader
      :can-manage="canManage"
      :is-parent="isParent"
      :active-student="activeStudent"
      :is-carlos="isCarlos"
      :is-saving="isSaving"
      :students-count="students.length"
      @scan-qr="openQrScannerModal"
      @print-qr="openPrintableQrModal"
      @mark-all-present="markAllPresent"
      @save="saveAttendance"
    />

    <!-- Classroom and Date Selection Bar -->
    <AttendanceFilters
      :classes="classes"
      :selected-class-id="selectedClassId"
      :selected-date="selectedDate"
      :is-parent="isParent"
      :is-today="isToday"
      :is-yesterday="isYesterday"
      @update:class-id="onClassChange"
      @update:date="onDateChange"
      @set-today="setDateToday"
      @set-yesterday="setDateYesterday"
    />

    <!-- 4 KPI Summary Cards -->
    <AttendanceStats
      :total-students="students.length"
      :present-count="presentCount"
      :attendance-rate="attendanceRate"
      :absent-count="absentCount"
      :late-count="lateCount"
      :excused-count="excusedCount"
    />

    <!-- Student Attendance Roster Card -->
    <div class="bg-white dark:bg-[#170f33] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
      <!-- Toolbar: Search and Status Filters -->
      <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/5">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por estudiante o código..."
            class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>

        <!-- Filter Status Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            v-for="statusFilter in statusFilters"
            :key="statusFilter.value"
            @click="activeStatusFilter = statusFilter.value"
            type="button"
            :class="activeStatusFilter === statusFilter.value 
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'"
            class="px-2.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            {{ statusFilter.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 mb-3 animate-spin">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">Cargando lista de estudiantes...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredStudents.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-750 dark:text-white">No se encontraron estudiantes</h3>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
          No hay estudiantes matriculados en esta sección o no coinciden con los filtros aplicados.
        </p>
      </div>

      <!-- Table of Students (Desktop / Tablet md+) -->
      <AttendanceTable
        v-else
        class="hidden md:block"
        :students="filteredStudents"
        :can-manage="canManage"
        @status-change="setStudentStatus"
        @justify="openJustifyModal"
      />

      <!-- Mobile Roster Touch Cards (< md) -->
      <AttendanceMobileList
        v-if="filteredStudents.length > 0"
        class="md:hidden"
        :students="filteredStudents"
        :can-manage="canManage"
        @status-change="setStudentStatus"
        @justify="openJustifyModal"
      />
    </div>

    <!-- Modals -->
    <AttendanceJustifyModal
      :is-open="isJustifyModalOpen"
      :student="justifyingStudent"
      :trigger-origin="triggerOrigin"
      @close="closeJustifyModal"
      @confirm="saveJustification"
    />

    <AttendanceQrScannerModal
      :is-open="isQrScannerOpen"
      :last-scanned-student="lastScannedStudent"
      @close="isQrScannerOpen = false"
      @scan="handleQrScan"
    />

    <AttendanceQrPrintModal
      :is-open="isPrintableQrOpen"
      :students="students"
      @close="isPrintableQrOpen = false"
    />

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div 
        v-if="toastMessage" 
        data-testid="attendance-toast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 font-semibold text-sm"
      >
        <span class="text-emerald-400 font-bold text-base">✓</span>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useActiveStudent } from '~/composables/useActiveStudent'
import { useAttendanceRoster } from '~/composables/useAttendanceRoster'

import AttendanceHeader from '~/components/attendance/AttendanceHeader.vue'
import AttendanceFilters from '~/components/attendance/AttendanceFilters.vue'
import AttendanceStats from '~/components/attendance/AttendanceStats.vue'
import AttendanceTable from '~/components/attendance/AttendanceTable.vue'
import AttendanceMobileList from '~/components/attendance/AttendanceMobileList.vue'
import AttendanceJustifyModal from '~/components/attendance/AttendanceJustifyModal.vue'
import AttendanceQrScannerModal from '~/components/attendance/AttendanceQrScannerModal.vue'
import AttendanceQrPrintModal from '~/components/attendance/AttendanceQrPrintModal.vue'

const authStore = useAuthStore()
const api = useApi()
const { activeStudent, isCarlos, isMaria } = useActiveStudent()

const currentRole = computed(() => authStore.userRole || authStore.user?.role || 'admin')

// Composable initialization
const {
  canManage,
  isStudent,
  isParent,
  classes,
  selectedClassId,
  selectedDate,
  students,
  search,
  activeStatusFilter,
  statusFilters,
  isLoading,
  isSaving,
  toastMessage,
  isToday,
  isYesterday,
  presentCount,
  absentCount,
  lateCount,
  excusedCount,
  attendanceRate,
  filteredStudents,
  setDateToday,
  setDateYesterday,
  showToast,
  setStudentStatus,
  markAllPresent,
  fetchClasses,
  fetchStudentsAndAttendance,
  saveAttendance,
  processQrInput,
  autoSelectClassForParent
} = useAttendanceRoster(api, { currentRole, activeStudent, isCarlos })

// Modal State
const isJustifyModalOpen = ref(false)
const justifyingStudent = ref(null)
const triggerOrigin = ref({ x: 50, y: 50 })

const isQrScannerOpen = ref(false)
const lastScannedStudent = ref(null)
const isPrintableQrOpen = ref(false)

const openJustifyModal = (student, event) => {
  if (event?.clientX && event?.clientY) {
    triggerOrigin.value = {
      x: Math.round((event.clientX / window.innerWidth) * 100),
      y: Math.round((event.clientY / window.innerHeight) * 100)
    }
  } else {
    triggerOrigin.value = { x: 50, y: 50 }
  }
  justifyingStudent.value = student
  isJustifyModalOpen.value = true
}

const closeJustifyModal = () => {
  isJustifyModalOpen.value = false
  justifyingStudent.value = null
}

const saveJustification = ({ student, reasonType, reason, document }) => {
  if (!student) return
  const fullReason = `${reasonType}: ${reason}`
  student.attendance_status = 'excused'
  student.excuse_reason = fullReason
  student.excuse_document = document
  student.is_excused = true
  closeJustifyModal()
  showToast('Justificación aplicada')
}

const openQrScannerModal = () => {
  lastScannedStudent.value = null
  isQrScannerOpen.value = true
}

const handleQrScan = (code) => {
  const found = processQrInput(code)
  if (found) {
    lastScannedStudent.value = found
  }
}

const openPrintableQrModal = () => {
  isPrintableQrOpen.value = true
}

const onClassChange = (classId) => {
  selectedClassId.value = classId
  fetchStudentsAndAttendance()
}

const onDateChange = (date) => {
  selectedDate.value = date
  fetchStudentsAndAttendance()
}

watch(activeStudent, () => {
  autoSelectClassForParent()
})

onMounted(async () => {
  await fetchClasses()
  if (isParent.value) {
    autoSelectClassForParent()
  } else {
    await fetchStudentsAndAttendance()
  }
})
</script>
