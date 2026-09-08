const bcrypt = require('bcryptjs')

/**
 * Seed en Frío (Clean-Slate) para Pruebas
 * Sistema de Gestión Escolar EduFlow — U.E Colegio "Santa Luisa"
 * 
 * Contiene ÚNICAMENTE el andamiaje institucional y UN SOLO usuario Administrador.
 * Cero estudiantes, docentes, representantes, aulas o registros de calificaciones.
 */
exports.seed = async function(knex) {
  // Configurar search_path al esquema school
  await knex.raw("SET search_path TO school, public")

  console.log("🧹 Vaciando datos operacionales en esquema school...")

  // 1. Limpiar dependencias y tablas operativas respetando claves foráneas
  const tablesToClear = [
    'announcement_reads',
    'announcement_targets',
    'announcements',
    'message_receipts',
    'messages',
    'conversation_participants',
    'conversations',
    'notifications',
    'event_attendees',
    'event_targets',
    'events',
    'attendance_summary',
    'attendance',
    'report_card_subjects',
    'term_report_cards',
    'exam_results',
    'assignment_submissions',
    'assignments',
    'exam_questions',
    'exams',
    'lessons',
    'lesson_plans',
    'timetable_slots',
    'student_class_history',
    'student_parents',
    'student_fees',
    'fee_types',
    'settings',
    'grade_scales',
    'class_subjects',
    'classes',
    'rooms',
    'subjects',
    'subject_categories',
    'grades',
    'students',
    'parents',
    'teacher_qualifications',
    'teachers',
    'user_sessions',
    'audit_logs',
    'users',
    'terms',
    'academic_years',
    'institutions',
    'cities',
    'states',
    'countries'
  ]

  for (const table of tablesToClear) {
    try {
      await knex(table).del()
    } catch (err) {
      // Continuar si alguna tabla auxiliar no existe
    }
  }

  console.log("🌱 Insertando catálogo base institucional...")

  // 2. Países (Venezuela y Estados Unidos para monedas VES / USD)
  const countries = await knex('countries').insert([
    { code: 'VE', name: 'Venezuela', phone_code: '+58', currency_code: 'VES' },
    { code: 'US', name: 'Estados Unidos', phone_code: '+1', currency_code: 'USD' }
  ]).returning('*')

  const countryVe = countries.find(c => c.code === 'VE') || countries[0]

  // 3. Estados
  const states = await knex('states').insert([
    { country_id: countryVe.id, code: 'DC', name: 'Distrito Capital' },
    { country_id: countryVe.id, code: 'MIR', name: 'Miranda' }
  ]).returning('*')

  // 4. Ciudades
  const cities = await knex('cities').insert([
    { state_id: states[0].id, name: 'Caracas', postal_code: '1020' },
    { state_id: states[1].id, name: 'Los Teques', postal_code: '1201' }
  ]).returning('*')

  // 5. Institución Oficial: U.E Colegio "Santa Luisa"
  const institutions = await knex('institutions').insert({
    name: 'U.E Colegio "Santa Luisa"',
    legal_name: 'U.E Colegio Santa Luisa',
    tax_id: 'J-12345678-9',
    email: 'contacto@santaluisa.edu.ve',
    phone_primary: '+58 212 123 4567',
    address_line1: 'Calle Real del Prado de María, Caracas, Venezuela',
    city_id: cities[0].id,
    state_id: states[0].id,
    country_id: countryVe.id,
    postal_code: '1020',
    principal_name: 'Lic. Directora Santa Luisa',
    timezone: 'America/Caracas',
    locale: 'es_VE',
    academic_year_start: '2025-09-15',
    academic_year_end: '2026-07-31'
  }).returning('*')

  const institutionId = institutions[0].id

  // 6. Año Académico Vigente: 2025-2026
  const academicYears = await knex('academic_years').insert({
    institution_id: institutionId,
    name: '2025-2026',
    start_date: '2025-09-15',
    end_date: '2026-07-31',
    is_current: true
  }).returning('*')

  const academicYearId = academicYears[0].id

  // 7. Lapsos Académicos MPPE (3 Lapsos / Trimesters)
  await knex('terms').insert([
    { academic_year_id: academicYearId, name: '1er Lapso', term_type: 'trimester', start_date: '2025-09-15', end_date: '2025-12-19', order_num: 1, is_current: true },
    { academic_year_id: academicYearId, name: '2do Lapso', term_type: 'trimester', start_date: '2026-01-07', end_date: '2026-04-10', order_num: 2, is_current: false },
    { academic_year_id: academicYearId, name: '3er Lapso', term_type: 'trimester', start_date: '2026-04-13', end_date: '2026-07-24', order_num: 3, is_current: false }
  ])

  // 8. Escalas de Evaluación Normativas
  await knex('grade_scales').insert([
    { institution_id: institutionId, name: 'Excelente (A)', min_percent: 90, max_percent: 100, grade_letter: 'A', grade_point: 4.0, description: '19-20 Puntos / Sobresaliente', color_hex: '#10B981' },
    { institution_id: institutionId, name: 'Bueno (B)', min_percent: 75, max_percent: 89, grade_letter: 'B', grade_point: 3.0, description: '15-18 Puntos / Distinguido', color_hex: '#3B82F6' },
    { institution_id: institutionId, name: 'Regular (C)', min_percent: 50, max_percent: 74, grade_letter: 'C', grade_point: 2.0, description: '10-14 Puntos / Aprobado', color_hex: '#F59E0B' },
    { institution_id: institutionId, name: 'Deficiente (D)', min_percent: 0, max_percent: 49, grade_letter: 'D', grade_point: 1.0, description: '01-09 Puntos / Aplazado', color_hex: '#EF4444' }
  ])

  // 9. ÚNICO USUARIO INICIAL: Administrador del Sistema
  // Contraseña: password "admin123"
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await knex('users').insert({
    institution_id: institutionId,
    username: 'admin',
    email: 'admin@santaluisa.edu.ve',
    password_hash: hashedPassword,
    role: 'admin',
    status: 'active',
    two_factor_enabled: false
  })

  console.log("✅ Entorno en Frío listo:")
  console.log("   • Institución: U.E Colegio \"Santa Luisa\"")
  console.log("   • Año Escolar: 2025-2026 (3 Lapsos MPPE)")
  console.log("   • Usuario Administrador: admin@santaluisa.edu.ve / admin123")
  console.log("   • Total Alumnos: 0 | Total Docentes: 0 | Total Representantes: 0")
}
