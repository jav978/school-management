import test from 'node:test'
import assert from 'node:assert/strict'
import { ref } from 'vue'
import { useAttendanceRoster } from '../composables/useAttendanceRoster.js'

test.describe('useAttendanceRoster Composable - Unit Tests', () => {
  const mockApi = {
    get: async () => ({ data: [] }),
    post: async () => ({ success: true })
  }

  test('calcula métricas de asistencia y porcentajes con precisión', () => {
    const currentRole = ref('admin')
    const roster = useAttendanceRoster(mockApi, { currentRole })

    roster.students.value = [
      { id: 1, first_name: 'Ana', last_name: 'Pérez', attendance_status: 'present' },
      { id: 2, first_name: 'Carlos', last_name: 'Gómez', attendance_status: 'absent' },
      { id: 3, first_name: 'Beatriz', last_name: 'Ruiz', attendance_status: 'late', minutes_late: 15 },
      { id: 4, first_name: 'David', last_name: 'Silva', attendance_status: 'excused' }
    ]

    assert.equal(roster.presentCount.value, 1)
    assert.equal(roster.absentCount.value, 1)
    assert.equal(roster.lateCount.value, 1)
    assert.equal(roster.excusedCount.value, 1)

    // Tasa de asistencia = (1 presentes + 1 tarde) / 4 * 100 = 50%
    assert.equal(roster.attendanceRate.value, 50)
  })

  test('markAllPresent() actualiza todos los estudiantes a present y resetea tardanzas', () => {
    const currentRole = ref('teacher')
    const roster = useAttendanceRoster(mockApi, { currentRole })

    roster.students.value = [
      { id: 1, first_name: 'Ana', last_name: 'Pérez', attendance_status: 'absent', minutes_late: 0 },
      { id: 2, first_name: 'Carlos', last_name: 'Gómez', attendance_status: 'late', minutes_late: 20 }
    ]

    roster.markAllPresent()

    assert.equal(roster.students.value[0].attendance_status, 'present')
    assert.equal(roster.students.value[0].minutes_late, 0)
    assert.equal(roster.students.value[1].attendance_status, 'present')
    assert.equal(roster.students.value[1].minutes_late, 0)
    assert.equal(roster.presentCount.value, 2)
    assert.equal(roster.attendanceRate.value, 100)
  })

  test('filtrado por texto y por píldora de estado funciona correctamente', () => {
    const currentRole = ref('admin')
    const roster = useAttendanceRoster(mockApi, { currentRole })

    roster.students.value = [
      { id: 1, first_name: 'María', last_name: 'González', student_id: 'EST-001', attendance_status: 'present' },
      { id: 2, first_name: 'Carlos', last_name: 'Mendoza', student_id: 'EST-002', attendance_status: 'absent' },
      { id: 3, first_name: 'José', last_name: 'Mendoza', student_id: 'EST-003', attendance_status: 'late' }
    ]

    // 1. Filtro por búsqueda 'Mendoza'
    roster.search.value = 'mendoza'
    assert.equal(roster.filteredStudents.value.length, 2)

    // 2. Filtro combinado por estado 'late'
    roster.activeStatusFilter.value = 'late'
    assert.equal(roster.filteredStudents.value.length, 1)
    assert.equal(roster.filteredStudents.value[0].first_name, 'José')

    // Resetear filtros
    roster.search.value = ''
    roster.activeStatusFilter.value = 'all'
    assert.equal(roster.filteredStudents.value.length, 3)
  })

  test('processQrInput localiza al estudiante y lo marca como presente', () => {
    const currentRole = ref('teacher')
    const roster = useAttendanceRoster(mockApi, { currentRole })

    roster.students.value = [
      { id: 10, first_name: 'Elena', last_name: 'Rivas', student_id: 'QR-9901', attendance_status: 'absent' }
    ]

    const found = roster.processQrInput('qr-9901')
    assert.ok(found)
    assert.equal(found.id, 10)
    assert.equal(found.attendance_status, 'present')

    const notFound = roster.processQrInput('UNKNOWN-CODE')
    assert.equal(notFound, null)
  })
})
