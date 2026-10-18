const test = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('crypto')
const db = require('../src/database')

test.describe('Attendance Service - Atomic Batch & Upsert Integrity', () => {
  const TEST_DATE = '2026-10-30'

  test.beforeEach(async () => {
    // Clean up test data for the target date
    await db('school.attendance')
      .where('attendance_date', TEST_DATE)
      .del()
  })

  test.after(async () => {
    try {
      await db('school.attendance')
        .where('attendance_date', TEST_DATE)
        .del()
    } finally {
      await db.destroy()
    }
  })

  test('debe insertar registros en lote atómicamente con Bulk Upsert', async () => {
    const students = await db('school.students').where({ is_deleted: false }).limit(2)
    const cls = await db('school.classes').where({ is_deleted: false }).first()
    assert.ok(students.length >= 2, 'Se requieren al menos 2 estudiantes para la prueba')
    assert.ok(cls, 'Se requiere al menos un aula para la prueba')

    const batch = [
      {
        student_id: students[0].id,
        class_id: cls.id,
        attendance_date: TEST_DATE,
        status: 'present',
        notes: 'Puntual'
      },
      {
        student_id: students[1].id,
        class_id: cls.id,
        attendance_date: TEST_DATE,
        status: 'justified', // Debería sanitizarse a excused
        excuse_reason: 'Cita médica certificada'
      }
    ]

    // Import service
    const feathers = require('@feathersjs/feathers')
    const app = feathers()
    app.set('knexClient', db)
    const configureAttendance = require('../src/services/attendance')
    configureAttendance(app)

    const service = app.service('attendance')
    const result = await service.create({ records: batch }, { authenticated: true })

    assert.equal(result.saved, 2)
    assert.equal(result.records.length, 2)

    // Verificar en DB
    const persisted = await db('school.attendance')
      .where({ attendance_date: TEST_DATE, class_id: cls.id })
      .orderBy('student_id', 'asc')

    assert.equal(persisted.length, 2)
    assert.equal(persisted[0].status, 'present')
    assert.equal(persisted[1].status, 'excused', 'El estado "justified" debe convertirse en "excused"')
    assert.equal(persisted[1].is_excused, true)
    assert.equal(persisted[1].excuse_reason, 'Cita médica certificada')
  })

  test('debe actualizar el registro en conflicto (Upsert) e incrementar la versión', async () => {
    const student = await db('school.students').where({ is_deleted: false }).first()
    const cls = await db('school.classes').where({ is_deleted: false }).first()

    const feathers = require('@feathersjs/feathers')
    const app = feathers()
    app.set('knexClient', db)
    const configureAttendance = require('../src/services/attendance')
    configureAttendance(app)
    const service = app.service('attendance')

    // 1. Inserción inicial
    await service.create({
      records: [{
        student_id: student.id,
        class_id: cls.id,
        attendance_date: TEST_DATE,
        status: 'present'
      }]
    }, { authenticated: true })

    const initial = await db('school.attendance')
      .where({ student_id: student.id, class_id: cls.id, attendance_date: TEST_DATE })
      .first()

    assert.equal(initial.status, 'present')
    const initialVersion = initial.version || 1

    // 2. Modificación mediante el mismo endpoint create (Upsert)
    await service.create({
      records: [{
        student_id: student.id,
        class_id: cls.id,
        attendance_date: TEST_DATE,
        status: 'late',
        minutes_late: 25,
        notes: 'Llegada con retraso'
      }]
    }, { authenticated: true })

    const updated = await db('school.attendance')
      .where({ student_id: student.id, class_id: cls.id, attendance_date: TEST_DATE })
      .first()

    assert.equal(updated.status, 'late')
    assert.equal(updated.minutes_late, 25)
    assert.equal(updated.notes, 'Llegada con retraso')
    assert.ok(updated.version >= initialVersion + 1, 'La versión debe incrementarse en el upsert')
  })

  test('debe rechazar lote si falta student_id o attendance_date', async () => {
    const feathers = require('@feathersjs/feathers')
    const app = feathers()
    app.set('knexClient', db)
    const configureAttendance = require('../src/services/attendance')
    configureAttendance(app)
    const service = app.service('attendance')

    await assert.rejects(
      async () => {
        await service.create({
          records: [{ class_id: 1, status: 'present' }]
        }, { authenticated: true })
      },
      /student_id es requerido/
    )
  })
})
