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

    const defaultTeacher = await db('school.teachers').where({ is_deleted: false }).first().catch(() => null)
    const fallbackTeacherId = defaultTeacher ? defaultTeacher.id : 1

    const results = []

    for (const item of records) {
      if (!item.student_id) throw new BadRequest('student_id es requerido para registrar asistencia')
      if (!item.class_id) throw new BadRequest('class_id es requerido para registrar asistencia')
      if (!item.attendance_date) throw new BadRequest('attendance_date es requerido para registrar asistencia')

      let status = item.status || 'present'
      if (status === 'justified') status = 'excused'
      const validStatuses = ['present', 'absent', 'late', 'excused', 'half_day']
      if (!validStatuses.includes(status)) {
        status = 'present'
      }

      // Check teacher_id
      let teacherId = item.teacher_id
      if (!teacherId) {
        const cls = await db('school.classes').where({ id: item.class_id }).first().catch(() => null)
        teacherId = cls?.homeroom_teacher_id || fallbackTeacherId
      }

      const formattedDate = typeof item.attendance_date === 'string' 
        ? item.attendance_date.split('T')[0] 
        : new Date(item.attendance_date).toISOString().split('T')[0]

      const isExcused = item.is_excused !== undefined ? Boolean(item.is_excused) : (status === 'excused')

      // Check if existing record exists for (student_id, class_id, attendance_date)
      const existing = await db('school.attendance')
        .where({
          student_id: item.student_id,
          class_id: item.class_id,
          attendance_date: formattedDate
        })
        .first()
        .catch(() => null)

      if (existing) {
        const [updated] = await db('school.attendance')
          .where({ id: existing.id })
          .update({
            status,
            notes: item.notes !== undefined ? item.notes : existing.notes,
            excuse_reason: item.excuse_reason !== undefined ? item.excuse_reason : existing.excuse_reason,
            is_excused: isExcused,
            minutes_late: item.minutes_late !== undefined ? item.minutes_late : (status === 'late' ? 15 : 0),
            teacher_id: teacherId,
            updated_at: new Date(),
            version: (existing.version || 1) + 1
          })
          .returning('*')
        results.push(updated)
      } else {
        const [inserted] = await db('school.attendance')
          .insert({
            uuid: crypto.randomUUID(),
            student_id: item.student_id,
            class_id: item.class_id,
            teacher_id: teacherId,
            attendance_date: formattedDate,
            status,
            notes: item.notes || null,
            excuse_reason: item.excuse_reason || null,
            is_excused: isExcused,
            minutes_late: item.minutes_late || (status === 'late' ? 15 : 0),
            parent_notified: false,
            created_at: new Date(),
            is_deleted: false,
            version: 1
          })
          .returning('*')
        results.push(inserted)
      }
    }

    return Array.isArray(data) ? results : (data.records ? { saved: results.length, records: results } : results[0])
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
