const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class AttendanceService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }

    // Support sorting by student_id or attendance_date
    return super.find({ ...params, query })
  }

  async get(id, params) {
    return super.get(id, params)
  }

  async create(data, params) {
    const db = this.getModel(params)

    // Support both single record and batch records
    const records = Array.isArray(data) ? data : (data.records || [data])

    if (!records || records.length === 0) {
      throw new BadRequest('No se proporcionaron registros de asistencia')
    }

    // Pre-resolve teacher_id once outside the loop to eliminate N+1 queries
    const sampleClassId = records[0]?.class_id
    let resolvedTeacherId = null
    if (sampleClassId) {
      const cls = await db('school.classes').where({ id: sampleClassId }).first().catch(() => null)
      resolvedTeacherId = cls?.homeroom_teacher_id
    }
    if (!resolvedTeacherId) {
      const defaultTeacher = await db('school.teachers').where({ is_deleted: false }).first().catch(() => null)
      resolvedTeacherId = defaultTeacher ? defaultTeacher.id : 1
    }

    const validStatuses = ['present', 'absent', 'late', 'excused', 'half_day']

    // Format and sanitize all records before database operation
    const formattedRecords = records.map(item => {
      if (!item.student_id) throw new BadRequest('student_id es requerido para registrar asistencia')
      if (!item.class_id) throw new BadRequest('class_id es requerido para registrar asistencia')
      if (!item.attendance_date) throw new BadRequest('attendance_date es requerido para registrar asistencia')

      let status = item.status || 'present'
      if (status === 'justified') status = 'excused'
      if (!validStatuses.includes(status)) {
        status = 'present'
      }

      const formattedDate = typeof item.attendance_date === 'string'
        ? item.attendance_date.split('T')[0]
        : new Date(item.attendance_date).toISOString().split('T')[0]

      const isExcused = item.is_excused !== undefined ? Boolean(item.is_excused) : (status === 'excused')
      const minutesLate = item.minutes_late !== undefined ? item.minutes_late : (status === 'late' ? 15 : 0)

      return {
        uuid: crypto.randomUUID(),
        student_id: item.student_id,
        class_id: item.class_id,
        teacher_id: item.teacher_id || resolvedTeacherId,
        attendance_date: formattedDate,
        status,
        notes: item.notes || null,
        excuse_reason: item.excuse_reason || null,
        excuse_document: item.excuse_document || null,
        is_excused: isExcused,
        minutes_late: minutesLate,
        parent_notified: false,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        version: 1
      }
    })

    // Execute atomic transaction with Bulk Upsert
    return await db.transaction(async (trx) => {
      const results = await trx('school.attendance')
        .insert(formattedRecords)
        .onConflict(['student_id', 'class_id', 'attendance_date'])
        .merge({
          status: trx.raw('EXCLUDED.status'),
          notes: trx.raw('EXCLUDED.notes'),
          excuse_reason: trx.raw('EXCLUDED.excuse_reason'),
          excuse_document: trx.raw('EXCLUDED.excuse_document'),
          is_excused: trx.raw('EXCLUDED.is_excused'),
          minutes_late: trx.raw('EXCLUDED.minutes_late'),
          teacher_id: trx.raw('EXCLUDED.teacher_id'),
          updated_at: new Date(),
          version: trx.raw('COALESCE(school.attendance.version, 1) + 1')
        })
        .returning('*')

      if (Array.isArray(data)) {
        return results
      }
      return data.records ? { saved: results.length, records: results } : results[0]
    })
  }

  async patch(id, data, params) {
    const patchData = { ...data, updated_at: new Date() }
    if (patchData.status === 'justified') {
      patchData.status = 'excused'
      patchData.is_excused = true
    }
    return super.patch(id, patchData, params)
  }

  async remove(id, params) {
    return super.patch(id, { is_deleted: true, deleted_at: new Date() }, params)
  }
}

const { validateData } = require('../hooks/validation')

const attendanceSchema = {
  student_id: { required: true },
  date: { required: true, type: 'date' },
  status: { required: true }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.attendance',
    paginate: {
      default: 50,
      max: 200
    }
  }

  app.use('attendance', new AttendanceService(options))

  const service = app.service('attendance')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      remove: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')]
    }
  })
}
