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
  document.documentElement.lang = currentLang.value
}

export const translations: Record<Language, Record<string, any>> = {
  es: {
    // Header & Global Navigation
    searchPlaceholder: 'Buscar estudiantes, materias, cédulas...',
    dashboard: 'Panel Principal',
    admin: 'Administrador',
    logout: 'Cerrar sesión',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    messages: 'Mensajes',
    recentMessages: 'Mensajes Recientes',
    institutionalAlerts: 'Alertas Institucionales',
    pendingAlerts: 'pendientes',
    newMessages: 'nuevo',
    markAsRead: 'Marcar leídas',
    viewAll: 'Ver todos',
    mailbox: 'Ir al Buzón Escolar',
    allRightsReserved: 'Todos los derechos reservados',
    developedBy: 'Desarrollado por',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    changeThemeLight: 'Cambiar a modo claro',
    changeThemeDark: 'Cambiar a modo oscuro',

    // Sidebar Modules
    students: 'Estudiantes',
    subjects: 'Materias',
    teachers: 'Profesores',
    parents: 'Padres',
    account: 'Finanzas',
    finance: 'Finanzas',
    class: 'Clases',
    schedules: 'Horarios',
    grades: 'Calificaciones',
    exam: 'Exámenes',
    exams: 'Generador de Exámenes',
    attendance: 'Asistencias',
    transport: 'Transporte',
    notice: 'Avisos',
    communication: 'Avisos y Cartelera',
    reports: 'Reportes',
    classrooms: 'Aulas e Instalaciones',
    staff: 'Personal Administrativo',
    staffTitle: 'Personal y Colaboradores (Staff)',
    planning: 'Planificación Académica',
    boletas: 'Boletas de Notas',
    certificates: 'Diplomas y Certificados',
    supplies: 'Útiles Escolares',
    idcards: 'Carnets Escolares',
    users: 'Usuarios y Roles',
    documentation: 'Documentación del Sistema',

    // Common Actions & Buttons
    save: 'Guardar',
    saveChanges: 'Guardar Cambios',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    create: 'Crear',
    new: 'Nuevo',
    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',
    filter: 'Filtrar',
    clearFilters: 'Limpiar Filtros',
    export: 'Exportar',
    download: 'Descargar',
    upload: 'Subir',
    close: 'Cerrar',
    back: 'Volver',
    confirm: 'Confirmar',
    actions: 'Acciones',
    status: 'Estado',
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    total: 'Total',
    refresh: 'Actualizar',
    print: 'Imprimir',
    details: 'Detalles',
    yes: 'Sí',
    no: 'No',
    male: 'Hombres',
    female: 'Mujeres',

    // Settings Page & Venezuelan Official Info
    institutionalSettings: 'Configuración Institucional',
    settingsSubtitle: 'Administra la identidad del plantel, registros oficiales MPPE, datos fiscales SENIAT y seguridad del sistema',
    general: 'General',
    security: 'Seguridad',
    institutionalIdentity: 'Identidad Institucional y Logotipo',
    liveSimulator: 'Simulador de Barra Lateral / Banner',
    realTime: 'En Tiempo Real',
    officialLogo: 'Insignia / Logotipo Oficial',
    changeLogo: 'Cambiar Logo',
    restoreDefault: 'Restaurar Predeterminado',
    schoolName: 'Nombre Oficial del Colegio',
    systemSubtitle: 'Subtítulo del Sistema / Texto del Banner',
    mppeOfficialData: 'Registro Oficial MPPE y Datos Fiscales',
    mppeNotice: 'Normativa del MPPE y SENIAT (Venezuela)',
    mppeNoticeDesc: 'Estos identificadores son requeridos obligatoriamente para la emisión de títulos, boletines de calificaciones, constancias de estudio y documentación tributaria oficial.',
    rif: 'RIF Institucional (SENIAT)',
    deaCode: 'Código DEA del Plantel',
    statisticalCode: 'Código Estadístico MPPE',
    educationalZone: 'Zona Educativa',
    dependency: 'Tipo de Dependencia Educativa',
    contactChannels: 'Canales de Contacto y Ubicación',
    email: 'Correo Electrónico Institucional',
    phone: 'Teléfono Principal',
    address: 'Dirección Fiscal y Sede',
    saveGeneralSettings: 'Guardar Configuración General',
    notificationSettings: 'Configuración de Notificaciones',
    securitySettings: 'Seguridad y Protección de Cuenta',
    emailNotifications: 'Notificaciones por Email',
    pushNotifications: 'Notificaciones Push',
    twoFactorAuth: 'Autenticación en Dos Pasos (2FA / TOTP)',
    signaturesAndSeals: 'Firmas y Sellos Oficiales',
    officialSeal: 'Sello Oficial del Colegio',
    digitalSignatures: 'Firmas Digitalizadas de Autoridades',
    saveSignaturesAndSeals: 'Guardar Firmas y Sellos Oficiales',

    // Calendar & Notifications
    eventCalendar: 'Calendario de Eventos',
    dayToDay: 'Día a día',
    socialMedia: 'Redes Sociales',
    joinCommunityTitle: 'Únete a la comunidad y entérate de más',
    joinCommunityDesc: 'Participa en diferentes comunidades y mantente al día con los avisos y mensajes en vivo.',
    exploreNow: 'Explorar ahora',
    noticeBoard: 'Tablón de Anuncios',
    noticeBoardSub: '¡Crea un aviso o encuentra mensajes para ti!',
    views: 'vistas',
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekDays: ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO']
  },

  en: {
    // Header & Global Navigation
    searchPlaceholder: 'Search students, subjects, IDs...',
    dashboard: 'Dashboard',
    admin: 'Administrator',
    logout: 'Log out',
    settings: 'Settings',
    notifications: 'Notifications',
    messages: 'Messages',
    recentMessages: 'Recent Messages',
    institutionalAlerts: 'School Alerts',
    pendingAlerts: 'pending',
    newMessages: 'new',
    markAsRead: 'Mark as read',
    viewAll: 'View all',
    mailbox: 'Go to School Mailbox',
    allRightsReserved: 'All rights reserved',
    developedBy: 'Developed by',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    changeThemeLight: 'Switch to light mode',
    changeThemeDark: 'Switch to dark mode',

    // Sidebar Modules
    students: 'Students',
    subjects: 'Subjects',
    teachers: 'Teachers',
    parents: 'Parents & Guardians',
    account: 'Finance',
    finance: 'Finance',
    class: 'Classes',
    schedules: 'Schedules',
    grades: 'Grades',
    exam: 'Exams',
    exams: 'Exam Generator',
    attendance: 'Attendance',
    transport: 'Transport',
    notice: 'Announcements',
    communication: 'Notices & Bulletin',
    reports: 'Reports',
    classrooms: 'Classrooms & Facilities',
    staff: 'Administrative Staff',
    staffTitle: 'Personal y Colaboradores (Staff)',
    planning: 'Academic Planning',
    boletas: 'Report Cards',
    certificates: 'Certificates & Diplomas',
    supplies: 'School Supplies',
    idcards: 'School ID Cards',
    users: 'Users & Roles',
    documentation: 'Documentation',

    // Common Actions & Buttons
    save: 'Save',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    create: 'Create',
    new: 'New',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    clearFilters: 'Clear Filters',
    export: 'Export',
    download: 'Download',
    upload: 'Upload',
    close: 'Close',
    back: 'Back',
    confirm: 'Confirm',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    total: 'Total',
    refresh: 'Refresh',
    print: 'Print',
    details: 'Details',
    yes: 'Yes',
    no: 'No',
    male: 'Male',
    female: 'Female',

    // Settings Page & Venezuelan Official Info
    institutionalSettings: 'Institutional Settings',
    settingsSubtitle: 'Manage school identity, official MPPE registry, SENIAT tax info, and system security',
    general: 'General',
    security: 'Security',
    institutionalIdentity: 'Institutional Identity & Logo',
    liveSimulator: 'Sidebar / Banner Live Simulator',
    realTime: 'Real-Time',
    officialLogo: 'Official School Badge / Logo',
    changeLogo: 'Change Logo',
    restoreDefault: 'Restore Default',
    schoolName: 'Official School Name',
    systemSubtitle: 'System Subtitle / Banner Text',
    mppeOfficialData: 'Official MPPE Registry & Tax Information',
    mppeNotice: 'MPPE & SENIAT Regulations (Venezuela)',
    mppeNoticeDesc: 'These identifiers are required for issuing legal diplomas, report cards, study certificates, and tax compliance documents.',
    rif: 'Institutional Tax ID (RIF)',
    deaCode: 'School DEA Code',
    statisticalCode: 'MPPE Statistical Code',
    educationalZone: 'Educational Zone',
    dependency: 'Educational Dependency Type',
    contactChannels: 'Contact Channels & Location',
    email: 'Official Institutional Email',
    phone: 'Primary Telephone',
    address: 'Campus & Fiscal Address',
    saveGeneralSettings: 'Save General Settings',
    notificationSettings: 'Notification Settings',
    securitySettings: 'Security & Account Protection',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    twoFactorAuth: 'Two-Factor Authentication (2FA / TOTP)',
    signaturesAndSeals: 'Official Signatures & Seals',
    officialSeal: 'Official School Seal',
    digitalSignatures: 'Authorized Digital Signatures',
    saveSignaturesAndSeals: 'Save Official Signatures & Seals',

    // Calendar & Notifications
    eventCalendar: 'Event Calendar',
    dayToDay: 'Day to day',
    socialMedia: 'Social Media',
    joinCommunityTitle: 'Join the community and find out more',
    joinCommunityDesc: 'Join different communities and keep updated with live notices and messages.',
    exploreNow: 'Explore now',
    noticeBoard: 'Notice Board',
    noticeBoardSub: 'Create a notice or find messages for you!',
    views: 'views',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekDays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
  }
}

export function useLanguage() {
  const setLanguage = (lang: Language) => {
    currentLang.value = lang
    if (import.meta.client) {
      localStorage.setItem('school_lang', lang)
      document.documentElement.lang = lang
    }
  }

  const toggleLanguage = () => {
    setLanguage(currentLang.value === 'en' ? 'es' : 'en')
  }

  const t = (key: string, fallback?: string): string => {
    if (!key) return ''
    const currentDict = translations[currentLang.value]
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key]
    }
    const defaultDict = translations['es']
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key]
    }
    const enDict = translations['en']
    if (enDict && enDict[key] !== undefined) {
      return enDict[key]
    }
    return fallback !== undefined ? fallback : key
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
    t
  }
}
