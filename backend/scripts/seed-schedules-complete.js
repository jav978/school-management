/**
 * Script de Carga de Horarios Oficiales U.E Santa Luisa
 * Basado exactamente en el documento: docs/horarios-alumnos-2025-2026.doc
 * 
 * Contempla:
 * 1. Primaria (Turno Mañana: 07:00 am a 12:10 pm) con Acto Cívico, Desayuno y Receso
 * 2. Educación Media / Bachillerato (07:00 am a 01:25 pm / 06:00 pm) con bloques de 45 min
 * 3. Horarios por Profesor Especialista (ej. Prof. José Vásquez - Computación y Orientación)
 */

require('dotenv').config()
const { Client } = require('pg')

async function seedOfficialSchedules() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'school_management'
  })

  await client.connect()
  console.log('Connected to PostgreSQL for Official Santa Luisa Schedules seeding...')

  try {
    // 1. Asegurar asignaturas requeridas
    const requiredSubjects = [
      { name: 'Matemáticas', code: 'MAT-01', color_hex: '#2563EB' },
      { name: 'Castellano', code: 'CAS-01', color_hex: '#DC2626' },
      { name: 'Ciencias Naturales', code: 'CNA-01', color_hex: '#16A34A' },
      { name: 'G.H.C.', code: 'GHC-01', color_hex: '#D97706' },
      { name: 'Educación de la Fe', code: 'EDF-01', color_hex: '#7C3AED' },
      { name: 'Orientación y Convivencia', code: 'ORI-01', color_hex: '#EA580C' },
      { name: 'Computación', code: 'INF-01', color_hex: '#0284C7' },
      { name: 'Educación Física', code: 'EDF-02', color_hex: '#059669' },
      { name: 'Inglés', code: 'ING-01', color_hex: '#9333EA' },
      { name: 'Arte y Patrimonio', code: 'ART-01', color_hex: '#DB2777' },
      { name: 'Física', code: 'FIS-01', color_hex: '#4F46E5' },
      { name: 'Química', code: 'QUI-01', color_hex: '#0891B2' },
      { name: 'Biología', code: 'BIO-01', color_hex: '#65A30D' }
    ]

    for (const sub of requiredSubjects) {
      const existing = await client.query('SELECT id FROM school.subjects WHERE name ILIKE $1 OR code = $2', [sub.name, sub.code])
      if (existing.rows.length === 0) {
        await client.query(
          'INSERT INTO school.subjects (institution_id, name, code, color_hex, credits, is_elective) VALUES ($1, $2, $3, $4, $5, $6)',
          [1, sub.name, sub.code, sub.color_hex, 4, false]
        )
      }
    }

    // 2. Asegurar al profesor José Vásquez
    let profVasquezId
    const profRes = await client.query("SELECT id FROM school.teachers WHERE last_name ILIKE '%Vásquez%' OR last_name ILIKE '%Vasquez%' LIMIT 1")
    if (profRes.rows.length > 0) {
      profVasquezId = profRes.rows[0].id
    } else {
      let userId
      const userRes = await client.query("SELECT id FROM school.users WHERE email = 'jvasquez@santaluisa.edu.ve'")
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id
      } else {
        const newUser = await client.query(`
          INSERT INTO school.users (institution_id, username, email, password_hash, role, is_active, status)
          VALUES (1, 'jvasquez', 'jvasquez@santaluisa.edu.ve', '$2b$10$abcdefghijklmnopqrstuv', 'teacher', true, 'active')
          RETURNING id
        `)
        userId = newUser.rows[0].id
      }

      const newProf = await client.query(`
        INSERT INTO school.teachers (user_id, institution_id, employee_id, first_name, last_name, specialization, email_personal, status)
        VALUES ($1, 1, 'DOC-088', 'José', 'Vásquez Madrid', 'Computación e Informática Educativa', 'jvasquez@santaluisa.edu.ve', 'active')
        RETURNING id
      `, [userId])
      profVasquezId = newProf.rows[0].id
    }

    const allSubs = (await client.query('SELECT id, name, code FROM school.subjects')).rows
    const allTeachers = (await client.query('SELECT id, first_name, last_name FROM school.teachers')).rows
    const allRooms = (await client.query('SELECT id, name, room_number FROM school.classrooms')).rows

    const subMap = (name) => allSubs.find(s => s.name.toLowerCase().includes(name.toLowerCase())) || allSubs[0]
    const teacherMap = (idx) => allTeachers[idx % allTeachers.length].id

    const labComp = allRooms.find(r => r.name.toLowerCase().includes('computación') || r.id.includes('LAB'))?.id || 'LAB-201'
    const aulaGeneral = allRooms.find(r => r.id === 'AULA-101')?.id || 'AULA-101'
    const cancha = allRooms.find(r => r.name.toLowerCase().includes('cancha'))?.id || 'AULA-103'

    // Limpiar horarios previos
    await client.query('DELETE FROM school.schedules')
    console.log('Cleared existing schedules table.')

    // 3. HORARIO OFICIAL: EDUCACIÓN MEDIA 1ER AÑO (Sección A)
    // 40 Horas semanales exactas del documento
    const mediaSchedule1erAno = [
      // Lunes
      { day: 'monday', start: '07:00', end: '07:45', sub: 'Matemáticas', room: aulaGeneral },
      { day: 'monday', start: '07:45', end: '08:30', sub: 'G.H.C.', room: aulaGeneral },
      { day: 'monday', start: '08:45', end: '09:30', sub: 'Educación de la Fe', room: aulaGeneral },
      { day: 'monday', start: '09:30', end: '10:15', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'monday', start: '10:15', end: '11:00', sub: 'Computación', teacher: profVasquezId, room: labComp }, // G1
      { day: 'monday', start: '11:10', end: '11:55', sub: 'Educación Física', room: cancha }, // G2
      { day: 'monday', start: '11:55', end: '12:40', sub: 'Computación', teacher: profVasquezId, room: labComp }, // G2
      { day: 'monday', start: '12:40', end: '13:25', sub: 'Educación Física', room: cancha }, // G1

      // Martes
      { day: 'tuesday', start: '07:00', end: '07:45', sub: 'G.H.C.', room: aulaGeneral },
      { day: 'tuesday', start: '07:45', end: '08:30', sub: 'G.H.C.', room: aulaGeneral },
      { day: 'tuesday', start: '08:45', end: '09:30', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'tuesday', start: '09:30', end: '10:15', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'tuesday', start: '10:15', end: '11:00', sub: 'Inglés', room: aulaGeneral },
      { day: 'tuesday', start: '11:10', end: '11:55', sub: 'Inglés', room: aulaGeneral },
      { day: 'tuesday', start: '11:55', end: '12:40', sub: 'Matemáticas', room: aulaGeneral },
      { day: 'tuesday', start: '12:40', end: '13:25', sub: 'Matemáticas', room: aulaGeneral },

      // Miércoles
      { day: 'wednesday', start: '07:00', end: '07:45', sub: 'Castellano', room: aulaGeneral },
      { day: 'wednesday', start: '07:45', end: '08:30', sub: 'Castellano', room: aulaGeneral },
      { day: 'wednesday', start: '08:45', end: '09:30', sub: 'Orientación y Convivencia', teacher: profVasquezId, room: aulaGeneral },
      { day: 'wednesday', start: '09:30', end: '10:15', sub: 'Orientación y Convivencia', teacher: profVasquezId, room: aulaGeneral },
      { day: 'wednesday', start: '10:15', end: '11:00', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'wednesday', start: '11:10', end: '11:55', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'wednesday', start: '11:55', end: '12:40', sub: 'Arte y Patrimonio', room: aulaGeneral },
      { day: 'wednesday', start: '12:40', end: '13:25', sub: 'Arte y Patrimonio', room: aulaGeneral },

      // Jueves
      { day: 'thursday', start: '07:00', end: '07:45', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'thursday', start: '07:45', end: '08:30', sub: 'Ciencias Naturales', room: aulaGeneral },
      { day: 'thursday', start: '08:45', end: '09:30', sub: 'G.H.C.', room: aulaGeneral },
      { day: 'thursday', start: '09:30', end: '10:15', sub: 'G.H.C.', room: aulaGeneral },
      { day: 'thursday', start: '10:15', end: '11:00', sub: 'Arte y Patrimonio', room: aulaGeneral },
      { day: 'thursday', start: '11:10', end: '11:55', sub: 'Arte y Patrimonio', room: aulaGeneral },
      { day: 'thursday', start: '11:55', end: '12:40', sub: 'Inglés', room: aulaGeneral },
      { day: 'thursday', start: '12:40', end: '13:25', sub: 'Inglés', room: aulaGeneral },

      // Viernes
      { day: 'friday', start: '07:00', end: '07:45', sub: 'Castellano', room: aulaGeneral },
      { day: 'friday', start: '07:45', end: '08:30', sub: 'Castellano', room: aulaGeneral },
      { day: 'friday', start: '08:45', end: '09:30', sub: 'G.H.C.', room: aulaGeneral },
      { day: 'friday', start: '09:30', end: '10:15', sub: 'Educación de la Fe', room: aulaGeneral },
      { day: 'friday', start: '10:15', end: '11:00', sub: 'Castellano', room: aulaGeneral },
      { day: 'friday', start: '11:10', end: '11:55', sub: 'Castellano', room: aulaGeneral },
      { day: 'friday', start: '11:55', end: '12:40', sub: 'Inglés', room: aulaGeneral },
      { day: 'friday', start: '12:40', end: '13:25', sub: 'Matemáticas', room: aulaGeneral }
    ]

    for (const item of mediaSchedule1erAno) {
      const subjectObj = subMap(item.sub)
      await client.query(`
        INSERT INTO school.schedules (
          grade, section, day_of_week, start_time, end_time,
          subject_id, teacher_id, classroom_id, academic_year, semester
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        '1er Año',
        'A',
        item.day,
        item.start,
        item.end,
        subjectObj.id,
        item.teacher || teacherMap(1),
        item.room,
        '2025-2026',
        '1er Lapso'
      ])
    }
    console.log(`✓ Seeded ${mediaSchedule1erAno.length} blocks for 1er Año Educación Media`)

    // 4. HORARIO OFICIAL: EDUCACIÓN PRIMARIA (1° Primaria - Sección A)
    // 07:10 a 12:10 con Acto Cívico y recesos
    const primariaSlots = [
      { start: '07:10', end: '07:55' },
      { start: '07:55', end: '08:40' },
      // Desayuno: 08:40 - 08:55
      { start: '08:55', end: '09:40' },
      { start: '09:40', end: '10:25' },
      // Receso: 10:25 - 10:40
      { start: '10:40', end: '11:25' },
      { start: '11:25', end: '12:10' }
    ]

    const primariaSubjectsByDay = {
      monday: ['Castellano', 'Castellano', 'Matemáticas', 'Matemáticas', 'Computación', 'Educación Física'],
      tuesday: ['Matemáticas', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Naturales', 'Inglés', 'Arte y Patrimonio'],
      wednesday: ['Castellano', 'Castellano', 'Educación de la Fe', 'Orientación y Convivencia', 'Matemáticas', 'Matemáticas'],
      thursday: ['Ciencias Naturales', 'Ciencias Naturales', 'G.H.C.', 'G.H.C.', 'Inglés', 'Inglés'],
      friday: ['Matemáticas', 'Matemáticas', 'Castellano', 'Castellano', 'Educación Física', 'Arte y Patrimonio']
    }

    let primariaCount = 0
    for (const [day, subjectsArray] of Object.entries(primariaSubjectsByDay)) {
      for (let i = 0; i < primariaSlots.length; i++) {
        const slot = primariaSlots[i]
        const subName = subjectsArray[i]
        const subjectObj = subMap(subName)
        const isComp = subName === 'Computación'
        const isDep = subName === 'Educación Física'

        await client.query(`
          INSERT INTO school.schedules (
            grade, section, day_of_week, start_time, end_time,
            subject_id, teacher_id, classroom_id, academic_year, semester
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          '1° Primaria',
          'A',
          day,
          slot.start,
          slot.end,
          subjectObj.id,
          isComp ? profVasquezId : teacherMap(i),
          isComp ? labComp : (isDep ? cancha : aulaGeneral),
          '2025-2026',
          '1er Lapso'
        ])
        primariaCount++
      }
    }
    console.log(`✓ Seeded ${primariaCount} blocks for 1° Primaria Educación Primaria`)

    // 5. HORARIOS DE OTROS AÑOS PARA ESPECIALISTAS (2do, 3er, 4to, 5to Año)
    const otrosCursos = [
      { grade: '2do Año', section: 'A', day: 'thursday', start: '10:15', end: '11:00', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '2do Año', section: 'A', day: 'thursday', start: '11:55', end: '12:40', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '3er Año', section: 'A', day: 'wednesday', start: '10:15', end: '11:00', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '3er Año', section: 'A', day: 'wednesday', start: '11:55', end: '12:40', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '4to Año', section: 'A', day: 'tuesday', start: '15:00', end: '15:45', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '4to Año', section: 'A', day: 'tuesday', start: '16:30', end: '17:15', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '5to Año', section: 'A', day: 'wednesday', start: '15:00', end: '15:45', sub: 'Computación', teacher: profVasquezId, room: labComp },
      { grade: '5to Año', section: 'A', day: 'wednesday', start: '16:30', end: '17:15', sub: 'Computación', teacher: profVasquezId, room: labComp }
    ]

    for (const oc of otrosCursos) {
      const subjectObj = subMap(oc.sub)
      await client.query(`
        INSERT INTO school.schedules (
          grade, section, day_of_week, start_time, end_time,
          subject_id, teacher_id, classroom_id, academic_year, semester
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        oc.grade,
        oc.section,
        oc.day,
        oc.start,
        oc.end,
        subjectObj.id,
        oc.teacher,
        oc.room,
        '2025-2026',
        '1er Lapso'
      ])
    }
    console.log(`✓ Seeded ${otrosCursos.length} specialized blocks for 2do, 3er, 4to y 5to Año`)

    console.log('✓ ALL OFFICIAL SCHEDULES SEEDED SUCCESSFULLY!')
  } catch (err) {
    console.error('Error seeding official schedules:', err)
  } finally {
    await client.end()
  }
}

seedOfficialSchedules()
