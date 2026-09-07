import { ref, computed } from 'vue'

export interface RepresentedStudent {
  id: number
  key: string
  first_name: string
  last_name: string
  full_name: string
  id_card: string
  student_code: string
  grade: string
  section: string
  level: 'primaria' | 'media'
  level_name: string
  avatar: string
  academic_year: string
  classroom: string
  turn: string
  solvency_status: 'solvente' | 'pendiente' | 'insolvente'
  homeroom_teacher: string
}

const STUDENTS: RepresentedStudent[] = [
  {
    id: 1,
    key: 'carlos',
    first_name: 'Carlos',
    last_name: 'Johnson Vásquez',
    full_name: 'Carlos Johnson Vásquez',
    id_card: 'V-32.485.912',
    student_code: 'EST-2026-0042',
    grade: '3er Año',
    section: 'U',
    level: 'media',
    level_name: 'Educación Media General (Bachillerato)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    academic_year: '2025-2026',
    classroom: 'Aula 3-U (Pabellón B)',
    turn: 'Mañana (7:00 am - 1:25 pm / 3:00 pm)',
    solvency_status: 'solvente',
    homeroom_teacher: 'Prof. Carlos Mendoza (Física & Ciencias)'
  },
  {
    id: 2,
    key: 'maria',
    first_name: 'María',
    last_name: 'Johnson Vásquez',
    full_name: 'María Johnson Vásquez',
    id_card: 'V-35.109.844',
    student_code: 'EST-2026-0089',
    grade: '1° Primaria',
    section: 'U',
    level: 'primaria',
    level_name: 'Educación Primaria',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    academic_year: '2025-2026',
    classroom: 'Aula 1-U (Pabellón A)',
    turn: 'Mañana (7:00 am - 12:10 pm)',
    solvency_status: 'solvente',
    homeroom_teacher: 'Prof. Ana Silva (Docente de Aula)'
  }
]

// Global singleton reactive state
const activeStudentKey = ref<string>('carlos')

// Initialize from localStorage if client-side
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('active_represented_student')
  if (saved && STUDENTS.some(s => s.key === saved)) {
    activeStudentKey.value = saved
  }
}

export const useActiveStudent = () => {
  const representedStudents = computed(() => STUDENTS)

  const activeStudent = computed<RepresentedStudent>(() => {
    return STUDENTS.find(s => s.key === activeStudentKey.value) || STUDENTS[0]
  })

  const isCarlos = computed(() => activeStudent.value.key === 'carlos')
  const isMaria = computed(() => activeStudent.value.key === 'maria')
  const activeLevel = computed(() => activeStudent.value.level)
  const activeGrade = computed(() => activeStudent.value.grade)
  const activeSection = computed(() => activeStudent.value.section)

  const setActiveStudent = (keyOrId: string | number) => {
    const found = STUDENTS.find(s => s.key === keyOrId || s.id === Number(keyOrId))
    if (found) {
      activeStudentKey.value = found.key
      if (typeof window !== 'undefined') {
        localStorage.setItem('active_represented_student', found.key)
      }
    }
  }

  return {
    representedStudents,
    activeStudent,
    activeStudentKey,
    isCarlos,
    isMaria,
    activeLevel,
    activeGrade,
    activeSection,
    setActiveStudent
  }
}
