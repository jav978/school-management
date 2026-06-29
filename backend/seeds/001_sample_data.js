const bcrypt = require('bcryptjs')

exports.seed = async function(knex) {
  // Set search path
  await knex.raw("SET search_path TO school, public")

  // Limpiar tablas en orden correcto (respetando foreign keys)
  await knex('announcement_reads').del()
  await knex('announcement_targets').del()
  await knex('announcements').del()
  await knex('message_receipts').del()
  await knex('messages').del()
  await knex('conversation_participants').del()
  await knex('conversations').del()
  await knex('notifications').del()
  await knex('event_attendees').del()
  await knex('event_targets').del()
  await knex('events').del()
  await knex('attendance_summary').del()
  await knex('attendance').del()
  await knex('report_card_subjects').del()
  await knex('term_report_cards').del()
  await knex('exam_results').del()
  await knex('assignment_submissions').del()
  await knex('assignments').del()
  await knex('exam_questions').del()
  await knex('exams').del()
  await knex('lessons').del()
  await knex('lesson_plans').del()
  await knex('timetable_slots').del()
  await knex('student_class_history').del()
  await knex('student_parents').del()
  await knex('student_fees').del()
  await knex('fee_types').del()
  await knex('settings').del()
  await knex('grade_scales').del()
  await knex('class_subjects').del()
  await knex('classes').del()
  await knex('rooms').del()
  await knex('subjects').del()
  await knex('subject_categories').del()
  await knex('grades').del()
  await knex('students').del()
  await knex('parents').del()
  await knex('teacher_qualifications').del()
  await knex('teachers').del()
  await knex('users').del()
  await knex('user_sessions').del()
  await knex('audit_logs').del()
  await knex('terms').del()
  await knex('academic_years').del()
  await knex('institutions').del()
  await knex('cities').del()
  await knex('states').del()
  await knex('countries').del()

  // 1. Países
  const countries = await knex('countries').insert([
    { code: 'MX', name: 'México', phone_code: '+52', currency_code: 'MXN' },
    { code: 'US', name: 'Estados Unidos', phone_code: '+1', currency_code: 'USD' },
    { code: 'CO', name: 'Colombia', phone_code: '+57', currency_code: 'COP' },
    { code: 'AR', name: 'Argentina', phone_code: '+54', currency_code: 'ARS' },
    { code: 'ES', name: 'España', phone_code: '+34', currency_code: 'EUR' }
  ]).returning('*')

  // 2. Estados
  const states = await knex('states').insert([
    { country_id: countries[0].id, code: 'CDMX', name: 'Ciudad de México' },
    { country_id: countries[0].id, code: 'JAL', name: 'Jalisco' },
    { country_id: countries[0].id, code: 'NL', name: 'Nuevo León' }
  ]).returning('*')

  // 3. Ciudades
  const cities = await knex('cities').insert([
    { state_id: states[0].id, name: 'Ciudad de México', postal_code: '06600' },
    { state_id: states[1].id, name: 'Guadalajara', postal_code: '44100' },
    { state_id: states[2].id, name: 'Monterrey', postal_code: '64000' }
  ]).returning('*')

  // 4. Institución
  const institutions = await knex('institutions').insert({
    name: 'Colegio San Martín',
    legal_name: 'Colegio San Martín de Porres A.C.',
    tax_id: 'CSM123456789',
    email: 'info@colegiosanmartin.edu',
    phone_primary: '+52 55 1234 5678',
    phone_secondary: '+52 55 1234 5679',
    address_line1: 'Av. Reforma 123',
    address_line2: 'Col. Centro',
    city_id: cities[0].id,
    state_id: states[0].id,
    country_id: countries[0].id,
    postal_code: '06600',
    principal_name: 'Dr. Juan Carlos Pérez',
    founded_year: 1995,
    accreditation_no: 'EDU-2024-001',
    grade_system: 'numeric',
    max_grade: 100,
    passing_grade: 60,
    timezone: 'America/Mexico_City',
    locale: 'es_MX',
    academic_year_start: '2024-08-15',
    academic_year_end: '2025-06-30'
  }).returning('*')

  const institutionId = institutions[0].id

  // 5. Año Académico
  const academicYears = await knex('academic_years').insert({
    institution_id: institutionId,
    name: '2024-2025',
    start_date: '2024-08-15',
    end_date: '2025-06-30',
    is_current: true
  }).returning('*')

  const academicYearId = academicYears[0].id

  // 6. Períodos
  const terms = await knex('terms').insert([
    { academic_year_id: academicYearId, name: 'Primer Semestre', term_type: 'semester', start_date: '2024-08-15', end_date: '2024-12-20', order_num: 1, is_current: true },
    { academic_year_id: academicYearId, name: 'Segundo Semestre', term_type: 'semester', start_date: '2025-01-06', end_date: '2025-06-30', order_num: 2, is_current: false }
  ]).returning('*')

  // 7. Usuarios
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = await knex('users').insert([
    { institution_id: institutionId, username: 'admin', email: 'admin@colegiosanmartin.edu', password_hash: hashedPassword, role: 'admin', status: 'active' },
    { institution_id: institutionId, username: 'profesor1', email: 'roberto@colegiosanmartin.edu', password_hash: hashedPassword, role: 'teacher', status: 'active' },
    { institution_id: institutionId, username: 'profesor2', email: 'laura@colegiosanmartin.edu', password_hash: hashedPassword, role: 'teacher', status: 'active' },
    { institution_id: institutionId, username: 'profesor3', email: 'miguel@colegiosanmartin.edu', password_hash: hashedPassword, role: 'teacher', status: 'active' },
    { institution_id: institutionId, username: 'estudiante1', email: 'juan@estudiante.edu', password_hash: hashedPassword, role: 'student', status: 'active' },
    { institution_id: institutionId, username: 'estudiante2', email: 'maria@estudiante.edu', password_hash: hashedPassword, role: 'student', status: 'active' },
    { institution_id: institutionId, username: 'estudiante3', email: 'carlos@estudiante.edu', password_hash: hashedPassword, role: 'student', status: 'active' },
    { institution_id: institutionId, username: 'padre1', email: 'pedro@padre.com', password_hash: hashedPassword, role: 'parent', status: 'active' },
    { institution_id: institutionId, username: 'padre2', email: 'ana@padre.com', password_hash: hashedPassword, role: 'parent', status: 'active' }
  ]).returning('*')

  // 8. Profesores
  const teachers = await knex('teachers').insert([
    { user_id: users[1].id, institution_id: institutionId, employee_id: 'PROF-001', first_name: 'Roberto', last_name: 'Sánchez Mora', date_of_birth: '1985-05-15', gender: 'male', hire_date: '2020-01-15', contract_type: 'full-time', salary: 25000, department: 'Ciencias Exactas', position_title: 'Profesor de Matemáticas', specialization: 'Matemáticas y Física', years_experience: 10 },
    { user_id: users[2].id, institution_id: institutionId, employee_id: 'PROF-002', first_name: 'Laura', last_name: 'García Pérez', date_of_birth: '1988-08-22', gender: 'female', hire_date: '2019-08-01', contract_type: 'full-time', salary: 24000, department: 'Humanidades', position_title: 'Profesora de Español', specialization: 'Español y Literatura', years_experience: 8 },
    { user_id: users[3].id, institution_id: institutionId, employee_id: 'PROF-003', first_name: 'Miguel', last_name: 'Torres Ruiz', date_of_birth: '1990-03-10', gender: 'male', hire_date: '2021-01-10', contract_type: 'full-time', salary: 23000, department: 'Ciencias Naturales', position_title: 'Profesor de Ciencias', specialization: 'Biología y Química', years_experience: 6 }
  ]).returning('*')

  // 9. Padres
  const parents = await knex('parents').insert([
    { user_id: users[7].id, institution_id: institutionId, first_name: 'Pedro', last_name: 'Pérez López', gender: 'male', phone_mobile: '+52 55 9876 5432', email_primary: 'pedro@padre.com', occupation: 'Ingeniero' },
    { user_id: users[8].id, institution_id: institutionId, first_name: 'Ana', last_name: 'Silva de García', gender: 'female', phone_mobile: '+52 55 8765 4321', email_primary: 'ana@padre.com', occupation: 'Doctora' }
  ]).returning('*')

  // 10. Grados
  const gradesData = await knex('grades').insert([
    { institution_id: institutionId, name: '1ro Primaria', order_num: 1 },
    { institution_id: institutionId, name: '2do Primaria', order_num: 2 },
    { institution_id: institutionId, name: '3ro Primaria', order_num: 3 },
    { institution_id: institutionId, name: '4to Primaria', order_num: 4 },
    { institution_id: institutionId, name: '5to Primaria', order_num: 5 },
    { institution_id: institutionId, name: '6to Primaria', order_num: 6 },
    { institution_id: institutionId, name: '1ro Secundaria', order_num: 7 },
    { institution_id: institutionId, name: '2do Secundaria', order_num: 8 },
    { institution_id: institutionId, name: '3ro Secundaria', order_num: 9 }
  ]).returning('*')

  // 11. Aulas
  const rooms = await knex('rooms').insert([
    { institution_id: institutionId, name: 'Aula 101', room_number: '101', building: 'Edificio A', floor: '1', capacity: 30, room_type: 'classroom' },
    { institution_id: institutionId, name: 'Aula 201', room_number: '201', building: 'Edificio A', floor: '2', capacity: 30, room_type: 'classroom' },
    { institution_id: institutionId, name: 'Aula 301', room_number: '301', building: 'Edificio B', floor: '3', capacity: 25, room_type: 'classroom' },
    { institution_id: institutionId, name: 'Laboratorio', room_number: 'LAB-01', building: 'Edificio C', floor: '1', capacity: 25, room_type: 'lab' },
    { institution_id: institutionId, name: 'Biblioteca', room_number: 'BIB-01', building: 'Edificio D', floor: '1', capacity: 50, room_type: 'library' }
  ]).returning('*')

  // 12. Clases
  const classes = await knex('classes').insert([
    { institution_id: institutionId, academic_year_id: academicYearId, grade_id: gradesData[8].id, name: '3ro Secundaria A', section: 'A', room_id: rooms[2].id, homeroom_teacher_id: teachers[0].id, capacity: 30 },
    { institution_id: institutionId, academic_year_id: academicYearId, grade_id: gradesData[7].id, name: '2do Secundaria B', section: 'B', room_id: rooms[1].id, homeroom_teacher_id: teachers[1].id, capacity: 28 },
    { institution_id: institutionId, academic_year_id: academicYearId, grade_id: gradesData[6].id, name: '1ro Secundaria A', section: 'A', room_id: rooms[0].id, homeroom_teacher_id: teachers[2].id, capacity: 32 }
  ]).returning('*')

  // 13. Categorías de materias
  const subjectCategories = await knex('subject_categories').insert([
    { name: 'Ciencias Exactas', description: 'Matemáticas, Física, Química', color_hex: '#3B82F6', icon: 'calculator' },
    { name: 'Humanidades', description: 'Español, Historia, Literatura', color_hex: '#10B981', icon: 'book' },
    { name: 'Ciencias Naturales', description: 'Biología, Geología', color_hex: '#F59E0B', icon: 'leaf' },
    { name: 'Idiomas', description: 'Inglés, Francés', color_hex: '#8B5CF6', icon: 'globe' },
    { name: 'Artes', description: 'Música, Arte, Teatro', color_hex: '#EC4899', icon: 'palette' }
  ]).returning('*')

  // 14. Materias
  const subjects = await knex('subjects').insert([
    { institution_id: institutionId, category_id: subjectCategories[0].id, code: 'MAT-301', name: 'Matemáticas', short_name: 'Mat', credits: 5, hours_per_week: 5, grade_level: '3ro Secundaria' },
    { institution_id: institutionId, category_id: subjectCategories[1].id, code: 'ESP-301', name: 'Español', short_name: 'Esp', credits: 4, hours_per_week: 4, grade_level: '3ro Secundaria' },
    { institution_id: institutionId, category_id: subjectCategories[2].id, code: 'CIE-301', name: 'Ciencias', short_name: 'Cie', credits: 4, hours_per_week: 4, grade_level: '3ro Secundaria' },
    { institution_id: institutionId, category_id: subjectCategories[1].id, code: 'HIS-301', name: 'Historia', short_name: 'His', credits: 3, hours_per_week: 3, grade_level: '3ro Secundaria' },
    { institution_id: institutionId, category_id: subjectCategories[3].id, code: 'ING-301', name: 'Inglés', short_name: 'Ing', credits: 3, hours_per_week: 3, grade_level: '3ro Secundaria' },
    { institution_id: institutionId, category_id: subjectCategories[4].id, code: 'EDF-301', name: 'Educación Física', short_name: 'EdF', credits: 2, hours_per_week: 2, grade_level: '3ro Secundaria' }
  ]).returning('*')

  // 15. Materias por clase
  const classSubjects = await knex('class_subjects').insert([
    { class_id: classes[0].id, subject_id: subjects[0].id, teacher_id: teachers[0].id, term_id: terms[0].id, hours_week: 5 },
    { class_id: classes[0].id, subject_id: subjects[1].id, teacher_id: teachers[1].id, term_id: terms[0].id, hours_week: 4 },
    { class_id: classes[0].id, subject_id: subjects[2].id, teacher_id: teachers[2].id, term_id: terms[0].id, hours_week: 4 },
    { class_id: classes[1].id, subject_id: subjects[0].id, teacher_id: teachers[0].id, term_id: terms[0].id, hours_week: 5 },
    { class_id: classes[1].id, subject_id: subjects[1].id, teacher_id: teachers[1].id, term_id: terms[0].id, hours_week: 4 }
  ]).returning('*')

  // 16. Estudiantes
  const students = await knex('students').insert([
    { user_id: users[4].id, institution_id: institutionId, student_id: 'EST-2024-001', first_name: 'Juan', last_name: 'Pérez García', date_of_birth: '2010-03-15', gender: 'male', admission_date: '2024-08-15', current_class_id: classes[0].id, current_grade_id: gradesData[8].id, emergency_contact_name: 'Pedro Pérez', emergency_contact_phone: '+52 55 9876 5432' },
    { user_id: users[5].id, institution_id: institutionId, student_id: 'EST-2024-002', first_name: 'María', last_name: 'López Silva', date_of_birth: '2010-07-22', gender: 'female', admission_date: '2024-08-15', current_class_id: classes[0].id, current_grade_id: gradesData[8].id, emergency_contact_name: 'Ana Silva', emergency_contact_phone: '+52 55 8765 4321' },
    { user_id: users[6].id, institution_id: institutionId, student_id: 'EST-2024-003', first_name: 'Carlos', last_name: 'Rodríguez Luna', date_of_birth: '2011-01-10', gender: 'male', admission_date: '2024-08-15', current_class_id: classes[1].id, current_grade_id: gradesData[7].id }
  ]).returning('*')

  // 17. Relación estudiante-padre
  await knex('student_parents').insert([
    { student_id: students[0].id, parent_id: parents[0].id, relationship: 'father', is_primary: true, is_emergency: true },
    { student_id: students[1].id, parent_id: parents[1].id, relationship: 'mother', is_primary: true, is_emergency: true }
  ])

  // 18. Tipos de cuota
  const feeTypes = await knex('fee_types').insert([
    { institution_id: institutionId, name: 'Colegiatura Mensual', description: 'Pago mensual de colegiatura', is_mandatory: true },
    { institution_id: institutionId, name: 'Matrícula', description: 'Pago de inscripción anual', is_mandatory: true },
    { institution_id: institutionId, name: 'Materiales', description: 'Material escolar', is_mandatory: false },
    { institution_id: institutionId, name: 'Transporte', description: 'Servicio de transporte', is_mandatory: false }
  ]).returning('*')

  // 19. Cuotas de estudiantes
  await knex('student_fees').insert([
    { student_id: students[0].id, fee_type_id: feeTypes[0].id, academic_year_id: academicYearId, term_id: terms[0].id, amount: 2500, due_date: '2024-09-01', paid_amount: 2500, is_paid: true, payment_method: 'transfer' },
    { student_id: students[0].id, fee_type_id: feeTypes[0].id, academic_year_id: academicYearId, term_id: terms[0].id, amount: 2500, due_date: '2024-10-01', paid_amount: 2500, is_paid: true, payment_method: 'cash' },
    { student_id: students[0].id, fee_type_id: feeTypes[0].id, academic_year_id: academicYearId, term_id: terms[0].id, amount: 2500, due_date: '2024-11-01', paid_amount: 0, is_paid: false },
    { student_id: students[1].id, fee_type_id: feeTypes[0].id, academic_year_id: academicYearId, term_id: terms[0].id, amount: 2500, due_date: '2024-09-01', paid_amount: 2500, is_paid: true, payment_method: 'transfer' },
    { student_id: students[1].id, fee_type_id: feeTypes[0].id, academic_year_id: academicYearId, term_id: terms[0].id, amount: 2500, due_date: '2024-10-01', paid_amount: 0, is_paid: false }
  ])

  // 20. Exámenes
  const exams = await knex('exams').insert([
    { class_subject_id: classSubjects[0].id, term_id: terms[0].id, title: 'Examen Parcial de Álgebra', exam_type: 'written', exam_date: '2024-09-15', total_marks: 100, passing_marks: 60, weight_percent: 30 },
    { class_subject_id: classSubjects[1].id, term_id: terms[0].id, title: 'Ensayo Literario', exam_type: 'take_home', exam_date: '2024-09-20', total_marks: 100, passing_marks: 60, weight_percent: 25 },
    { class_subject_id: classSubjects[2].id, term_id: terms[0].id, title: 'Proyecto de Ciencias', exam_type: 'practical', exam_date: '2024-10-05', total_marks: 100, passing_marks: 60, weight_percent: 35 }
  ]).returning('*')

  // 21. Resultados de exámenes
  await knex('exam_results').insert([
    { exam_id: exams[0].id, student_id: students[0].id, marks_obtained: 85, total_marks: 100, grade_letter: 'B+', is_passed: true, graded_at: new Date() },
    { exam_id: exams[0].id, student_id: students[1].id, marks_obtained: 92, total_marks: 100, grade_letter: 'A', is_passed: true, graded_at: new Date() },
    { exam_id: exams[1].id, student_id: students[0].id, marks_obtained: 78, total_marks: 100, grade_letter: 'C+', is_passed: true, graded_at: new Date() },
    { exam_id: exams[1].id, student_id: students[1].id, marks_obtained: 95, total_marks: 100, grade_letter: 'A+', is_passed: true, graded_at: new Date() }
  ])

  // 22. Asistencia
  await knex('attendance').insert([
    { student_id: students[0].id, class_id: classes[0].id, teacher_id: teachers[0].id, attendance_date: '2024-09-02', status: 'present' },
    { student_id: students[0].id, class_id: classes[0].id, teacher_id: teachers[0].id, attendance_date: '2024-09-03', status: 'present' },
    { student_id: students[0].id, class_id: classes[0].id, teacher_id: teachers[0].id, attendance_date: '2024-09-04', status: 'late', minutes_late: 15 },
    { student_id: students[1].id, class_id: classes[0].id, teacher_id: teachers[0].id, attendance_date: '2024-09-02', status: 'present' },
    { student_id: students[1].id, class_id: classes[0].id, teacher_id: teachers[0].id, attendance_date: '2024-09-03', status: 'absent' },
    { student_id: students[1].id, class_id: classes[0].id, teacher_id: teachers[0].id, attendance_date: '2024-09-04', status: 'present' }
  ])

  // 23. Horarios
  await knex('timetable_slots').insert([
    { institution_id: institutionId, class_subject_id: classSubjects[0].id, room_id: rooms[2].id, day_of_week: 'monday', start_time: '07:00', end_time: '07:45' },
    { institution_id: institutionId, class_subject_id: classSubjects[1].id, room_id: rooms[2].id, day_of_week: 'monday', start_time: '07:45', end_time: '08:30' },
    { institution_id: institutionId, class_subject_id: classSubjects[2].id, room_id: rooms[3].id, day_of_week: 'tuesday', start_time: '08:30', end_time: '09:15' },
    { institution_id: institutionId, class_subject_id: classSubjects[0].id, room_id: rooms[2].id, day_of_week: 'wednesday', start_time: '07:00', end_time: '07:45' },
    { institution_id: institutionId, class_subject_id: classSubjects[1].id, room_id: rooms[2].id, day_of_week: 'thursday', start_time: '09:30', end_time: '10:15' }
  ])

  // 24. Eventos
  await knex('events').insert([
    { institution_id: institutionId, title: 'Reunión de Padres', description: 'Reunión general de padres de familia', event_type: 'meeting', start_datetime: '2024-09-20T17:00:00', end_datetime: '2024-09-20T19:00:00', location: 'Auditorio', is_published: true },
    { institution_id: institutionId, title: 'Fiesta de Independencia', description: 'Celebración del día de la independencia', event_type: 'cultural', start_datetime: '2024-09-15T09:00:00', end_datetime: '2024-09-15T13:00:00', location: 'Patio Central', is_published: true },
    { institution_id: institutionId, title: 'Semana de Exámenes', description: 'Semana de exámenes parciales', event_type: 'academic', start_datetime: '2024-10-14T07:00:00', end_datetime: '2024-10-18T14:00:00', all_day: true, is_published: true }
  ])

  // 25. Anuncios
  await knex('announcements').insert([
    { institution_id: institutionId, author_id: users[0].id, title: 'Inicio del Ciclo Escolar 2024-2025', body: 'Les damos la bienvenida al nuevo ciclo escolar. Las clases inician el 15 de agosto.', priority: 'high', is_published: true, published_at: new Date() },
    { institution_id: institutionId, author_id: users[0].id, title: 'Cambio de Horario', body: 'El horario de atención administrativa cambia a 8am-4pm a partir del próximo lunes.', priority: 'normal', is_published: true, published_at: new Date() }
  ])

  // 26. Conversaciones y mensajes
  const conversations = await knex('conversations').insert({
    subject: 'Tarea de Matemáticas',
    created_by: users[1].id,
    last_message_at: new Date()
  }).returning('*')

  await knex('conversation_participants').insert([
    { conversation_id: conversations[0].id, user_id: users[1].id },
    { conversation_id: conversations[0].id, user_id: users[4].id }
  ])

  await knex('messages').insert([
    { conversation_id: conversations[0].id, sender_id: users[1].id, body: 'Recuerden que la tarea de álgebra es para el viernes.' },
    { conversation_id: conversations[0].id, sender_id: users[4].id, body: 'Profesor, ¿puede explicar el ejercicio 5?' }
  ])

  // 27. Notificaciones
  await knex('notifications').insert([
    { user_id: users[4].id, title: 'Nuevo examen programado', body: 'Se ha programado un examen de Matemáticas para el 15 de septiembre.', type: 'exam', priority: 'normal' },
    { user_id: users[7].id, title: 'Pago pendiente', body: 'Tiene un pago pendiente de colegiatura de noviembre.', type: 'payment', priority: 'high' }
  ])

  console.log('✅ Datos de ejemplo insertados exitosamente en el esquema school')
  console.log('📊 Resumen:')
  console.log('   - 1 institución')
  console.log('   - 9 usuarios (1 admin, 3 profesores, 3 estudiantes, 2 padres)')
  console.log('   - 3 profesores')
  console.log('   - 3 estudiantes')
  console.log('   - 2 padres')
  console.log('   - 9 grados')
  console.log('   - 3 clases')
  console.log('   - 6 materias')
  console.log('   - 3 exámenes')
  console.log('   - 4 resultados')
  console.log('   - 6 registros de asistencia')
  console.log('   - 5 cuotas')
  console.log('   - 3 eventos')
  console.log('   - 2 anuncios')
  console.log('   - 2 conversaciones con mensajes')
  console.log('   - 2 notificaciones')
}
