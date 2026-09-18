require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'school_management'
})

async function main() {
  await client.connect()
  console.log('Connected to PostgreSQL for EduFlow seeding...')

  // 1. Staff (Personal administrativo, obrero y profesional)
  const staffList = [
    {
      staff_id: 'STF-001',
      first_name: 'Elena',
      last_name: 'Vargas Mendoza',
      id_card: 'V-14589230',
      staff_type: 'administrativo',
      position: 'Coordinadora de Control de Estudios',
      department: 'Control de Estudios',
      phone: '+58 414 123 4567',
      email: 'elena.vargas@santaluisa.edu.ve',
      address: 'Av. San Martín, Edf. Luisa, Apto 4-B',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      hire_date: '2018-09-15',
      blood_type: 'O+',
      emergency_contact: 'Carlos Vargas (Esposo)',
      emergency_phone: '+58 412 987 6543',
      status: 'activo'
    },
    {
      staff_id: 'STF-002',
      first_name: 'Ramón',
      last_name: 'Paredes Castillo',
      id_card: 'V-12450871',
      staff_type: 'obrero',
      position: 'Encargado de Mantenimiento e Instalaciones',
      department: 'Servicios Generales',
      phone: '+58 416 334 5566',
      email: 'ramon.paredes@santaluisa.edu.ve',
      address: 'Calle Real de San Martín, Casa 12',
      photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
      hire_date: '2015-02-01',
      blood_type: 'A+',
      emergency_contact: 'Rosaura Paredes (Hermana)',
      emergency_phone: '+58 424 555 1212',
      status: 'activo'
    },
    {
      staff_id: 'STF-003',
      first_name: 'Dra. Carmen',
      last_name: 'Méndez Salazar',
      id_card: 'V-10345678',
      staff_type: 'profesional',
      position: 'Psicóloga Escolar y Orientadora',
      department: 'Departamento de Orientación (DOBE)',
      phone: '+58 424 778 9900',
      email: 'carmen.mendez@santaluisa.edu.ve',
      address: 'El Paraíso, Res. Los Samanes',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      hire_date: '2020-10-01',
      blood_type: 'B+',
      emergency_contact: 'Dr. Roberto Méndez',
      emergency_phone: '+58 414 333 4444',
      status: 'activo'
    }
  ]

  for (const s of staffList) {
    await client.query(`
      INSERT INTO school.staff (
        staff_id, first_name, last_name, id_card, staff_type, position, department,
        phone, email, address, photo_url, hire_date, blood_type, emergency_contact,
        emergency_phone, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (staff_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        position = EXCLUDED.position,
        department = EXCLUDED.department,
        photo_url = EXCLUDED.photo_url
    `, [
      s.staff_id, s.first_name, s.last_name, s.id_card, s.staff_type, s.position, s.department,
      s.phone, s.email, s.address, s.photo_url, s.hire_date, s.blood_type, s.emergency_contact,
      s.emergency_phone, s.status
    ])
  }
  console.log('✓ Staff seeded')

  // 2. Classrooms (Aulas y Espacios)
  const classrooms = [
    { room_number: 'A-101', name: 'Aula 1er Año A', capacity: 35, type: 'aula_regular', floor: 1, building: 'Edificio Central San Vicente', equipment: 'Proyector multimedia, Pizarra acrílica, 35 Pupitres ergonómicos', status: 'disponible' },
    { room_number: 'A-102', name: 'Aula 2do Año A', capacity: 35, type: 'aula_regular', floor: 1, building: 'Edificio Central San Vicente', equipment: 'Pizarra acrílica, Ventiladores de techo, 35 Pupitres', status: 'ocupada' },
    { room_number: 'LAB-01', name: 'Laboratorio de Ciencias (Química y Biología)', capacity: 30, type: 'laboratorio', floor: 2, building: 'Edificio Ciencias Santa Luisa', equipment: 'Campana extractora, Microscopios binoculares, Mecheros Bunsen, Ducha de emergencia', status: 'disponible' },
    { room_number: 'LAB-02', name: 'Laboratorio de Computación e Informática', capacity: 28, type: 'laboratorio', floor: 2, building: 'Edificio Ciencias Santa Luisa', equipment: '28 PCs Intel i5, Conexión fibra óptica, Pizarra inteligente interactiva, Aire acondicionado', status: 'disponible' },
    { room_number: 'AUD-01', name: 'Auditorio Santa Luisa de Marillac', capacity: 180, type: 'auditorio', floor: 1, building: 'Edificio Cultural', equipment: 'Sistema de audio profesional, Luces de escenario, Proyector 4K, Climatizado', status: 'disponible' },
    { room_number: 'BIB-01', name: 'Biblioteca Central Vicenciana', capacity: 60, type: 'biblioteca', floor: 1, building: 'Edificio Central San Vicente', equipment: 'Mesas de estudio grupal, Catálogo digitalizado, Zona de lectura silenciosa', status: 'disponible' }
  ]

  for (const c of classrooms) {
    const existing = await client.query("SELECT id FROM school.classrooms WHERE room_number = $1", [c.room_number])
    if (existing.rows.length === 0) {
      await client.query(`
        INSERT INTO school.classrooms (room_number, name, capacity, type, floor, building, equipment, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [c.room_number, c.name, c.capacity, c.type, c.floor, c.building, c.equipment, c.status])
    }
  }
  console.log('✓ Classrooms seeded')

  // Get students and teachers IDs
  const studentsRes = await client.query("SELECT id, first_name, last_name, student_id FROM school.students LIMIT 5")
  const teachersRes = await client.query("SELECT id, first_name, last_name, employee_id as teacher_id FROM school.teachers LIMIT 5")
  const subjectsRes = await client.query("SELECT id, name, code as subject_code FROM school.subjects LIMIT 5")

  const s1 = studentsRes.rows[0]
  const s2 = studentsRes.rows[1] || s1
  const t1 = teachersRes.rows[0]
  const sub1 = subjectsRes.rows[0]

  // 3. Exam Questions for existing exams
  const examRows = await client.query("SELECT id FROM school.exams LIMIT 2")
  if (examRows.rows.length > 0) {
    const examId = examRows.rows[0].id
    await client.query("DELETE FROM school.exam_questions WHERE exam_id = $1", [examId])

    const questions = [
      {
        question_type: 'seleccion_simple',
        question_text: '¿Cuál es el valor aproximado de la aceleración de gravedad en la Tierra a nivel del mar?',
        options: JSON.stringify(['9.8 m/s²', '12.4 m/s²', '5.6 m/s²', '15.0 m/s²']),
        correct_answer: '9.8 m/s²',
        marks: 5,
        order_num: 1,
        explanation: 'La aceleración de gravedad estándar promedio a nivel del mar es 9.80665 m/s².'
      },
      {
        question_type: 'verdadero_falso',
        question_text: 'La masa y el peso son conceptos idénticos en la física clásica.',
        options: JSON.stringify(['Verdadero', 'Falso']),
        correct_answer: 'Falso',
        marks: 5,
        order_num: 2,
        explanation: 'La masa es la cantidad de materia (kg) y el peso es una fuerza dependiente de la gravedad (Newtons).'
      },
      {
        question_type: 'seleccion_multiple',
        question_text: '¿Cuáles de los siguientes son estados fundamentales de la materia?',
        options: JSON.stringify(['Sólido', 'Líquido', 'Gaseoso', 'Magnético']),
        correct_answer: 'Sólido, Líquido, Gaseoso',
        marks: 5,
        order_num: 3,
        explanation: 'Los estados clásicos fundamentales de agregación son sólido, líquido, gaseoso.'
      },
      {
        question_type: 'completacion',
        question_text: 'La unidad del Sistema Internacional para medir la fuerza es el _______.',
        correct_answer: 'Newton',
        marks: 5,
        order_num: 4,
        explanation: 'El Newton (N) representa 1 kg·m/s².'
      }
    ]

    for (const q of questions) {
      await client.query(`
        INSERT INTO school.exam_questions (
          exam_id, question_type, question_text, options, correct_answer,
          marks, order_num, explanation, is_deleted, version
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, false, 1)
      `, [
        examId, q.question_type, q.question_text, q.options,
        q.correct_answer, q.marks, q.order_num, q.explanation
      ])
    }
    console.log('✓ Exam questions seeded for Exam ID:', examId)
  }

  // 4. Academic Plannings
  if (t1 && sub1) {
    await client.query(`
      INSERT INTO school.academic_plannings (
        teacher_id, subject_id, academic_year, period, grade, section,
        group_schedule, indispensable_theme, project_theme, weekly_planning,
        general_objectives, evaluation_plan, evaluation_criteria, status, submission_date
      ) VALUES (
        $1, $2, '2026-2027', '1er lapso', '1er Año', 'A',
        'Lunes y Miércoles 07:00 - 08:30',
        'Ciencia, tecnología y soberanía alimentaria nacional.',
        'La huerta escolar y el laboratorio: Aplicaciones prácticas del método científico.',
        $3, $4, $5, $6, 'aprobada', '2026-09-20'
      )
    `, [
      t1.id,
      sub1.id,
      JSON.stringify([
        { week: 1, topic: 'Introducción al método científico y normas de bioseguridad en el laboratorio.', activities: 'Charla teórica y elaboración de mapa mental.' },
        { week: 2, topic: 'Medición de magnitudes físicas e instrumentos de precisión.', activities: 'Práctica de laboratorio con calibradores y balanzas.' },
        { week: 3, topic: 'Concepto de densidad y flotabilidad en fluidos.', activities: 'Experimento con probetas y líquidos de diferentes densidades.' }
      ]),
      JSON.stringify([
        'Desarrollar el pensamiento crítico e investigativo mediante la experimentación.',
        'Comprender el impacto de las ciencias exactas en el entorno cotidiano.'
      ]),
      JSON.stringify([
        { evaluation: 'Taller experimental', percentage: 25, week: 3, instrument: 'Rúbrica analítica' },
        { evaluation: 'Informe de laboratorio', percentage: 25, week: 5, instrument: 'Escala de estimación' },
        { evaluation: 'Prueba escrita de lapso', percentage: 35, week: 8, instrument: 'Cuestionario estructurado' },
        { evaluation: 'Apreciación y responsabilidad', percentage: 15, week: 10, instrument: 'Registro de observación' }
      ]),
      JSON.stringify([
        { criterion: 'Dominio conceptual y procedimental', weight: 40 },
        { criterion: 'Puntualidad y presentación de informes', weight: 30 },
        { criterion: 'Trabajo colaborativo y respeto mutuo', weight: 30 }
      ])
    ])
    console.log('✓ Academic planning seeded')
  }

  // 5. Report Cards (Boletas de calificaciones con 3 modelos y QR)
  if (s1) {
    const reportCardData = [
      {
        student_id: s1.id,
        academic_year: '2026-2027',
        period: '1er lapso',
        education_level: 'media',
        final_average: 18.25,
        final_letter: 'A',
        attendance_present: 58,
        attendance_absent: 2,
        attendance_late: 1,
        conduct_grade: 'A',
        participation_grade: 'Excelente',
        teacher_observations: 'Estudiante con desempeño académico sobresaliente, gran liderazgo y compromiso en las actividades escolares.',
        verification_code: 'SL-BOL-2026-001',
        status: 'emitida',
        issue_date: '2026-12-18',
        subject_grades: JSON.stringify([
          { subject_name: 'Matemáticas', score: 19, letter: 'A', observations: 'Excelente resolución analítica' },
          { subject_name: 'Castellano y Literatura', score: 18, letter: 'A', observations: 'Notable dominio expresivo' },
          { subject_name: 'Física', score: 17, letter: 'B', observations: 'Comprensión sólida de conceptos' },
          { subject_name: 'Química', score: 19, letter: 'A', observations: 'Destacada labor en laboratorio' },
          { subject_name: 'Inglés', score: 18, letter: 'A', observations: 'Fluidez y comprensión sobresaliente' },
          { subject_name: 'Educación Física', score: 20, letter: 'A', observations: 'Participación y disciplina ejemplar' }
        ])
      }
    ]

    for (const r of reportCardData) {
      await client.query(`
        INSERT INTO school.report_cards (
          student_id, academic_year, period, education_level, final_average,
          final_letter, attendance_present, attendance_absent, attendance_late,
          conduct_grade, participation_grade, teacher_observations, verification_code,
          status, issue_date, subject_grades
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        ON CONFLICT (verification_code) DO UPDATE SET
          final_average = EXCLUDED.final_average,
          status = EXCLUDED.status
      `, [
        r.student_id, r.academic_year, r.period, r.education_level, r.final_average,
        r.final_letter, r.attendance_present, r.attendance_absent, r.attendance_late,
        r.conduct_grade, r.participation_grade, r.teacher_observations, r.verification_code,
        r.status, r.issue_date, r.subject_grades
      ])
    }
    console.log('✓ Report cards seeded')
  }

  // 6. Certificates (Certificados con QR)
  const certs = [
    {
      recipient_name: s1 ? `${s1.first_name} ${s1.last_name}` : 'Sofía Valentina Morales',
      recipient_type: 'estudiante',
      certificate_type: 'excelencia_academica',
      academic_year: '2025-2026',
      grade_level: '1er Año de Media General',
      average_grade: 19.50,
      issue_date: '2026-07-25',
      issued_by: 'Sor María Dolores Amaya',
      issued_role: 'Directora General',
      description: 'Por haber obtenido el más alto índice académico de su cohorte durante el período escolar, demostrando constancia, rectitud y virtud vicenciana.',
      verification_code: 'SL-CERT-2026-001',
      status: 'emitido'
    },
    {
      recipient_name: t1 ? `${t1.first_name} ${t1.last_name}` : 'Prof. Roberto Gómez',
      recipient_type: 'profesor',
      certificate_type: 'reconocimiento_docente',
      academic_year: '2025-2026',
      years_of_service: 10,
      department: 'Departamento de Ciencias Naturales',
      issue_date: '2026-07-25',
      issued_by: 'Consejo Directivo U.E Santa Luisa',
      issued_role: 'Dirección Académica',
      description: 'En reconocimiento a su invaluable vocación pedagógica, entrega y ejemplar trayectoria en la formación de juventudes cristianas.',
      verification_code: 'SL-CERT-2026-002',
      status: 'emitido'
    }
  ]

  for (const c of certs) {
    await client.query(`
      INSERT INTO school.certificates (
        recipient_name, recipient_type, certificate_type, academic_year, grade_level,
        average_grade, years_of_service, department, issue_date, issued_by, issued_role,
        description, verification_code, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (verification_code) DO UPDATE SET
        recipient_name = EXCLUDED.recipient_name,
        description = EXCLUDED.description
    `, [
      c.recipient_name, c.recipient_type, c.certificate_type, c.academic_year, c.grade_level,
      c.average_grade, c.years_of_service, c.department, c.issue_date, c.issued_by, c.issued_role,
      c.description, c.verification_code, c.status
    ])
  }
  console.log('✓ Certificates seeded')

  // 7. ID Cards (Carnets con Foto, QR y Frente/Reverso)
  const idCards = [
    {
      card_code: 'CRD-EST-2026-001',
      recipient_type: 'estudiante',
      recipient_name: s1 ? `${s1.first_name} ${s1.last_name}` : 'Sofía Valentina Morales Rivas',
      recipient_id_card: 'V-32456789',
      photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
      position: 'Estudiante Regular',
      department: 'Educación Media General',
      grade_level: '1er Año Sección A',
      blood_type: 'O+',
      emergency_contact: 'Mariana Rivas (Madre)',
      emergency_phone: '+58 414 112 2334',
      phone: '+58 424 990 0112',
      address: 'Av. San Martín, Calle Bolívar, Qta. Los Rosales',
      email: 'sofia.morales@santaluisa.edu.ve',
      issue_date: '2026-09-15',
      expiry_date: '2027-07-31',
      status: 'activo',
      is_printed: true
    },
    {
      card_code: 'CRD-DOC-2026-002',
      recipient_type: 'profesor',
      recipient_name: t1 ? `${t1.first_name} ${t1.last_name}` : 'Prof. Roberto Gómez Pérez',
      recipient_id_card: 'V-15890234',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      position: 'Docente Titular',
      department: 'Matemáticas y Física',
      blood_type: 'A+',
      emergency_contact: 'Ana Gómez (Cónyuge)',
      emergency_phone: '+58 412 888 7766',
      phone: '+58 414 777 6655',
      address: 'Urb. El Paraíso, Av. Washington, Res. Vista Hermosa',
      email: 'roberto.gomez@santaluisa.edu.ve',
      issue_date: '2026-09-01',
      expiry_date: '2027-08-31',
      status: 'activo',
      is_printed: true
    }
  ]

  for (const c of idCards) {
    await client.query(`
      INSERT INTO school.id_cards (
        card_code, recipient_type, recipient_name, recipient_id_card, photo_url,
        position, department, grade_level, blood_type, emergency_contact, emergency_phone,
        phone, address, email, issue_date, expiry_date, status, is_printed
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT (card_code) DO UPDATE SET
        recipient_name = EXCLUDED.recipient_name,
        photo_url = EXCLUDED.photo_url,
        position = EXCLUDED.position
    `, [
      c.card_code, c.recipient_type, c.recipient_name, c.recipient_id_card, c.photo_url,
      c.position, c.department, c.grade_level, c.blood_type, c.emergency_contact, c.emergency_phone,
      c.phone, c.address, c.email, c.issue_date, c.expiry_date, c.status, c.is_printed
    ])
  }
  console.log('✓ ID Cards seeded')

  // 8. Schedule Templates
  if (t1) {
    await client.query(`
      INSERT INTO school.schedule_templates (
        teacher_id, academic_year, education_level, schedule_type, max_hours,
        current_hours, schedule_slots, status
      ) VALUES ($1, '2026-2027', 'media', 'mañana', 36, 18, $2, 'aprobado')
    `, [
      t1.id,
      JSON.stringify([
        { day: 'lunes', start: '07:00', end: '08:30', grade: '1er Año A', subject: 'Matemáticas' },
        { day: 'lunes', start: '08:35', end: '10:05', grade: '2do Año B', subject: 'Física' },
        { day: 'martes', start: '07:00', end: '08:30', grade: '3er Año A', subject: 'Matemáticas' },
        { day: 'miércoles', start: '07:00', end: '08:30', grade: '1er Año A', subject: 'Matemáticas' }
      ])
    ])
    console.log('✓ Schedule template seeded')
  }

  await client.end()
  console.log('\n--- EduFlow Complete Seeding Finished Successfully! ---')
}

main().catch(err => {
  console.error('Seeding error:', err)
  process.exit(1)
})
