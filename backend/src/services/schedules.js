const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class SchedulesService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.schedules as s')
      .leftJoin('school.subjects as sub', 's.subject_id', 'sub.id')
      .leftJoin('school.teachers as t', 's.teacher_id', 't.id')
      .leftJoin('school.classrooms as c', 's.classroom_id', 'c.id')
      .select(
        's.*',
        'sub.name as subject_name',
        'sub.code as subject_code',
        'sub.color_hex as subject_color',
        't.first_name as teacher_first_name',
        't.last_name as teacher_last_name',
        'c.name as classroom_name',
        'c.room_number as classroom_number'
      )

    if (query.grade) {
      knexQuery = knexQuery.where('s.grade', query.grade)
    }
    if (query.section) {
      knexQuery = knexQuery.where('s.section', query.section)
    }
    if (query.day_of_week) {
      knexQuery = knexQuery.where('s.day_of_week', query.day_of_week)
    }
    if (query.teacher_id) {
      knexQuery = knexQuery.where('s.teacher_id', query.teacher_id)
    }
    if (query.subject_id) {
      knexQuery = knexQuery.where('s.subject_id', query.subject_id)
    }

    const data = await knexQuery.orderBy([
      { column: 's.day_of_week', order: 'asc' },
      { column: 's.start_time', order: 'asc' }
    ])

    return {
      total: data.length,
      limit: params?.paginate ? (params.paginate.default || 50) : data.length,
      skip: 0,
      data
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const schedule = await db('school.schedules as s')
      .leftJoin('school.subjects as sub', 's.subject_id', 'sub.id')
      .leftJoin('school.teachers as t', 's.teacher_id', 't.id')
      .leftJoin('school.classrooms as c', 's.classroom_id', 'c.id')
      .where('s.id', id)
      .select(
        's.*',
        'sub.name as subject_name',
        'sub.code as subject_code',
        'sub.color_hex as subject_color',
        't.first_name as teacher_first_name',
        't.last_name as teacher_last_name',
        'c.name as classroom_name',
        'c.room_number as classroom_number'
      )
      .first()

    if (!schedule) {
      throw new BadRequest(`Horario con id ${id} no encontrado`)
    }
    return schedule
  }

  async create(data, params) {
    if (!data.subject_id) throw new BadRequest('subject_id es requerido')
    if (!data.teacher_id) throw new BadRequest('teacher_id es requerido')
    if (!data.day_of_week) throw new BadRequest('day_of_week es requerido')
    if (!data.start_time) throw new BadRequest('start_time es requerido')
    if (!data.end_time) throw new BadRequest('end_time es requerido')

    const db = this.getModel(params)

    // Check for room conflict or teacher conflict at the same day & time
    const conflict = await db('school.schedules')
      .where({
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        grade: data.grade || '1° Primaria',
        section: data.section || 'A'
      })
      .first()
      .catch(() => null)

    if (conflict) {
      throw new BadRequest(`Ya existe una clase asignada para el ${data.day_of_week} a las ${data.start_time}`)
    }

    const payload = {
      uuid: crypto.randomUUID(),
      subject_id: data.subject_id,
      teacher_id: data.teacher_id,
      classroom_id: data.classroom_id || 'AULA-101',
      grade: data.grade || '1° Primaria',
      section: data.section || 'A',
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      semester: data.semester || '1',
      academic_year: data.academic_year || '2026-2027',
      created_at: new Date()
    }

    const [inserted] = await db('school.schedules').insert(payload).returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchData = { ...data, updated_at: new Date() }
    const [updated] = await db('school.schedules').where({ id }).update(patchData).returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const existing = await db('school.schedules').where({ id }).first()
    await db('school.schedules').where({ id }).del()
    return existing
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.schedules',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('schedules', new SchedulesService(options))

  const service = app.service('schedules')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
