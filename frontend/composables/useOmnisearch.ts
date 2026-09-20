import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

export interface SearchResultItem {
  id: string | number
  title: string
  subtitle: string
  category: 'module' | 'student' | 'teacher' | 'subject'
  categoryLabel: string
  icon: string
  path: string
  meta?: any
}

// System modules catalog with search keywords
const systemModules: SearchResultItem[] = [
  {
    id: 'mod-dashboard',
    title: 'Panel Principal / Dashboard',
    subtitle: 'Métricas institucionales, gráficos financieros y accesos rápidos',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📊',
    path: '/dashboard'
  },
  {
    id: 'mod-students',
    title: 'Estudiantes y Alumnos',
    subtitle: 'Matrícula oficial, expedientes, historial y fichas académicas',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '🎓',
    path: '/students'
  },
  {
    id: 'mod-enrollment',
    title: 'Planilla Oficial de Matrícula',
    subtitle: 'Formulario de inscripción escolar con foto carnet oficial MPPE',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📄',
    path: '/students/enrollment-form'
  },
  {
    id: 'mod-teachers',
    title: 'Cuerpo Docente',
    subtitle: 'Profesores titulares, departamentos curriculares y especialidades',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '👨‍🏫',
    path: '/teachers'
  },
  {
    id: 'mod-staff',
    title: 'Personal Administrativo y Obrero',
    subtitle: 'Control de nómina interna, cargos de apoyo y servicios',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '👔',
    path: '/staff'
  },
  {
    id: 'mod-schedules',
    title: 'Horarios Escolares',
    subtitle: 'Cronograma semanal por aula, agenda diaria y bloques pedagógicos',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📅',
    path: '/schedules'
  },
  {
    id: 'mod-grades',
    title: 'Calificaciones y Evaluaciones',
    subtitle: 'Registro de notas, desempeño curricular y control de aprobación',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📝',
    path: '/grades'
  },
  {
    id: 'mod-attendance',
    title: 'Control de Asistencia',
    subtitle: 'Pase de lista diario, scanner QR, tardanzas e inasistencias',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📋',
    path: '/attendance'
  },
  {
    id: 'mod-boletas',
    title: 'Boletas de Rendimiento Escolar',
    subtitle: 'Emisión oficial con modelos clásico/moderno y verificación QR',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📑',
    path: '/boletas'
  },
  {
    id: 'mod-idcards',
    title: 'Carnets de Identificación Escolar',
    subtitle: 'Credenciales oficiales con foto, QR duplex e impresión por sección',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '🪪',
    path: '/idcards'
  },
  {
    id: 'mod-subjects',
    title: 'Materias y Asignaturas',
    subtitle: 'Malla curricular por año escolar y carga horaria',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📚',
    path: '/subjects'
  },
  {
    id: 'mod-classrooms',
    title: 'Aulas e Instalaciones',
    subtitle: 'Salones de clase, laboratorios, canchas y capacidad',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '🏫',
    path: '/classrooms'
  },
  {
    id: 'mod-planning',
    title: 'Planificación Académica',
    subtitle: 'Contenidos programáticos, objetivos y lapsos pedagógicos',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📌',
    path: '/planning'
  },
  {
    id: 'mod-exams',
    title: 'Generador de Exámenes',
    subtitle: 'Pruebas, talleres y ponderaciones curriculares',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '✍️',
    path: '/exams'
  },
  {
    id: 'mod-reports',
    title: 'Centro de Reportes Institucionales',
    subtitle: 'Generación, visualización y exportación de estadísticas en PDF',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '📈',
    path: '/reports'
  },
  {
    id: 'mod-finance',
    title: 'Finanzas y Mensualidades',
    subtitle: 'Control de aranceles, mensualidades y solvencia administrativa',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '💳',
    path: '/finance'
  },
  {
    id: 'mod-communication',
    title: 'Buzón y Correspondencia Escolar',
    subtitle: 'Circulares, avisos a representantes y mensajería interna',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '✉️',
    path: '/communication'
  },
  {
    id: 'mod-settings',
    title: 'Configuración Institucional',
    subtitle: 'Parámetros del colegio, escudo, año escolar y seguridad',
    category: 'module',
    categoryLabel: 'Módulo',
    icon: '⚙️',
    path: '/settings'
  }
]

export const useOmnisearch = () => {
  const router = useRouter()
  const api = useApi()

  const query = ref('')
  const isLoading = ref(false)
  const studentsCache = ref<any[]>([])
  const teachersCache = ref<any[]>([])
  const hasLoadedCache = ref(false)

  // Pre-load data in background once for instant local speed
  const preloadIndex = async () => {
    if (hasLoadedCache.value) return
    try {
      const [resStudents, resTeachers] = await Promise.allSettled([
        api.get('students'),
        api.get('teachers')
      ])

      if (resStudents.status === 'fulfilled' && resStudents.value) {
        const raw = resStudents.value.data || resStudents.value
        studentsCache.value = Array.isArray(raw) ? raw : []
      }

      if (resTeachers.status === 'fulfilled' && resTeachers.value) {
        const raw = resTeachers.value.data || resTeachers.value
        teachersCache.value = Array.isArray(raw) ? raw : []
      }

      hasLoadedCache.value = true
    } catch (_) {
      // Graceful fallback
    }
  }

  // Filtered categorized results
  const searchResults = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q || q.length < 2) {
      // Suggest top default shortcuts
      return {
        modules: systemModules.slice(0, 4),
        students: [],
        teachers: [],
        total: 4
      }
    }

    // 1. Search modules
    const matchedModules = systemModules.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.subtitle.toLowerCase().includes(q)
    )

    // 2. Search students
    const matchedStudents: SearchResultItem[] = studentsCache.value
      .filter(s => {
        const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase()
        const id = String(s.national_id || '').toLowerCase()
        const code = String(s.student_id || '').toLowerCase()
        return fullName.includes(q) || id.includes(q) || code.includes(q)
      })
      .slice(0, 5)
      .map(s => ({
        id: `stu-${s.id}`,
        title: `${s.last_name || ''}, ${s.first_name || ''}`.trim() || 'Estudiante',
        subtitle: `${s.grade_level || s.grade || 'Año Regular'} • C.I: ${s.national_id || 'S/N'} • Cód: ${s.student_id || s.id}`,
        category: 'student' as const,
        categoryLabel: 'Estudiante',
        icon: '🎓',
        path: `/students?search=${encodeURIComponent(s.national_id || s.last_name || '')}`,
        meta: s
      }))

    // 3. Search teachers
    const matchedTeachers: SearchResultItem[] = teachersCache.value
      .filter(t => {
        const fullName = `${t.first_name || ''} ${t.last_name || ''}`.toLowerCase()
        const id = String(t.national_id || '').toLowerCase()
        const dept = String(t.department || '').toLowerCase()
        const spec = String(t.specialization || '').toLowerCase()
        return fullName.includes(q) || id.includes(q) || dept.includes(q) || spec.includes(q)
      })
      .slice(0, 4)
      .map(t => ({
        id: `tea-${t.id}`,
        title: `Prof. ${t.first_name || ''} ${t.last_name || ''}`.trim(),
        subtitle: `${t.department || 'Cátedra'} • ${t.specialization || 'Docente'} • C.I: ${t.national_id || 'S/N'}`,
        category: 'teacher' as const,
        categoryLabel: 'Docente',
        icon: '👨‍🏫',
        path: `/teachers?search=${encodeURIComponent(t.last_name || t.first_name || '')}`,
        meta: t
      }))

    const total = matchedModules.length + matchedStudents.length + matchedTeachers.length

    return {
      modules: matchedModules,
      students: matchedStudents,
      teachers: matchedTeachers,
      total
    }
  })

  const selectResult = (result: SearchResultItem) => {
    query.value = ''
    router.push(result.path)
  }

  return {
    query,
    isLoading,
    searchResults,
    preloadIndex,
    selectResult
  }
}
