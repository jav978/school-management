import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

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

const DEFAULT_STUDENTS: RepresentedStudent[] = [
  {
    id: 18,
    key: 'carlos',
    first_name: 'Santigo',
    last_name: 'Vásquez Madrid',
    full_name: 'Santigo Vásquez Madrid',
    id_card: 'V-32.901.234',
    student_code: 'EST-2026-4571',
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
    id: 20,
    key: 'maria',
    first_name: 'María Alejandra',
    last_name: 'Vásquez Madrid',
    full_name: 'María Alejandra Vásquez Madrid',
    id_card: 'V-35.109.844',
    student_code: 'EST-2026-8891',
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
  if (saved) {
    activeStudentKey.value = saved
  }
}

export const useActiveStudent = () => {
  let authStore: any = null
  try {
    authStore = useAuthStore()
  } catch {
    // pinia not yet active or SSR edge case
  }

  const representedStudents = computed<RepresentedStudent[]>(() => {
    const userChildren = authStore?.user?.children
    if (Array.isArray(userChildren) && userChildren.length > 0) {
      return userChildren.map((c: any, index: number) => {
        const fallback = DEFAULT_STUDENTS[index] || DEFAULT_STUDENTS[0]
        return {
          id: c.id || fallback.id,
          key: c.key || (index === 0 ? 'carlos' : 'maria'),
          first_name: c.first_name || fallback.first_name,
          last_name: c.last_name || fallback.last_name,
          full_name: c.full_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || fallback.full_name,
          id_card: c.id_card || fallback.id_card,
          student_code: c.student_code || fallback.student_code,
          grade: c.grade || fallback.grade,
          section: c.section || fallback.section,
          level: (c.level as 'primaria' | 'media') || fallback.level,
          level_name: c.level_name || fallback.level_name,
          avatar: c.avatar || fallback.avatar,
          academic_year: c.academic_year || fallback.academic_year,
          classroom: c.classroom || fallback.classroom,
          turn: c.turn || fallback.turn,
          solvency_status: (c.solvency_status as 'solvente' | 'pendiente' | 'insolvente') || fallback.solvency_status,
          homeroom_teacher: c.homeroom_teacher || fallback.homeroom_teacher
        }
      })
    }
    return DEFAULT_STUDENTS
  })

  const activeStudent = computed<RepresentedStudent>(() => {
    const list = representedStudents.value
    return list.find(s => s.key === activeStudentKey.value || s.id === Number(activeStudentKey.value)) || list[0]
  })

  const isCarlos = computed(() => activeStudent.value.key === 'carlos')
  const isMaria = computed(() => activeStudent.value.key === 'maria')
  const activeLevel = computed(() => activeStudent.value.level)
  const activeGrade = computed(() => activeStudent.value.grade)
  const activeSection = computed(() => activeStudent.value.section)

  const setActiveStudent = (keyOrId: string | number) => {
    const list = representedStudents.value
    const found = list.find(s => s.key === keyOrId || s.id === Number(keyOrId))
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
