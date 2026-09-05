import { ref, computed } from 'vue'

export type Language = 'en' | 'es'

const currentLang = ref<Language>('es')

// Initialize from localStorage if on client
if (import.meta.client) {
  const saved = localStorage.getItem('school_lang') as Language
  if (saved && (saved === 'en' || saved === 'es')) {
    currentLang.value = saved
  } else {
    currentLang.value = 'es'
  }
}

const translations = {
  en: {
    // Header
    searchPlaceholder: 'Search...',
    dashboard: 'Dashboard',
    admin: 'Admin',
    logout: 'Log out',
    settings: 'Settings',

    // Sidebar
    students: 'Students',
    subjects: 'Subjects',
    teachers: 'Teachers',
    parents: 'Parents',
    account: 'Account',
    class: 'Class',
    schedules: 'Schedules',
    grades: 'Grades',
    exam: 'Exam',
    attendance: 'Attendance',
    transport: 'Transport',
    notice: 'Notice',
    reports: 'Reports',

    // Dashboard KPIs
    earnings: 'Earnings',
    expanse: 'Expanse',

    // Dashboard Charts
    male: 'Male',
    female: 'Female',

    // Event Calendar
    eventCalendar: 'Event Calendar',
    dayToDay: 'Day to day',
    socialMedia: 'Social Media',

    // Community card
    joinCommunityTitle: 'Join the community and find out more',
    joinCommunityDesc: 'Join different community and keep updated with the live notices and messages.',
    exploreNow: 'Explore now',

    // Notice Board
    noticeBoard: 'Notice Board',
    noticeBoardSub: 'Create a notice or find a messages for you!',
    views: 'views',

    // Months & Days
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekDays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
  },
  es: {
    // Header
    searchPlaceholder: 'Buscar...',
    dashboard: 'Panel Principal',
    admin: 'Administrador',
    logout: 'Cerrar sesión',
    settings: 'Configuración',

    // Sidebar
    students: 'Estudiantes',
    subjects: 'Materias',
    teachers: 'Profesores',
    parents: 'Padres',
    account: 'Finanzas',
    class: 'Clases',
    schedules: 'Horarios',
    grades: 'Calificaciones',
    exam: 'Exámenes',
    attendance: 'Asistencias',
    transport: 'Transporte',
    notice: 'Avisos',
    reports: 'Reportes',

    // Dashboard KPIs
    earnings: 'Ingresos',
    expanse: 'Gastos',

    // Dashboard Charts
    male: 'Hombres',
    female: 'Mujeres',

    // Event Calendar
    eventCalendar: 'Calendario de Eventos',
    dayToDay: 'Día a día',
    socialMedia: 'Redes Sociales',

    // Community card
    joinCommunityTitle: 'Únete a la comunidad y entérate de más',
    joinCommunityDesc: 'Participa en diferentes comunidades y mantente al día con los avisos y mensajes en vivo.',
    exploreNow: 'Explorar ahora',

    // Notice Board
    noticeBoard: 'Tablón de Anuncios',
    noticeBoardSub: '¡Crea un aviso o encuentra mensajes para ti!',
    views: 'vistas',

    // Months & Days
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekDays: ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO']
  }
}

export function useLanguage() {
  const setLanguage = (lang: Language) => {
    currentLang.value = lang
    if (import.meta.client) {
      localStorage.setItem('school_lang', lang)
    }
  }

  const toggleLanguage = () => {
    setLanguage(currentLang.value === 'en' ? 'es' : 'en')
  }

  const t = (key: keyof typeof translations['en']): any => {
    return translations[currentLang.value][key] || translations['en'][key] || key
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
    t
  }
}
