const { KnexService } = require('@feathersjs/knex')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class ExamsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.exams as e')
      .leftJoin('school.class_subjects as cs', 'e.class_subject_id', 'cs.id')
      .leftJoin('school.classes as cl', 'cs.class_id', 'cl.id')
      .leftJoin('school.subjects as sub', 'cs.subject_id', 'sub.id')
      .leftJoin('school.teachers as t', 'cs.teacher_id', 't.id')
      .leftJoin('school.terms as term', 'e.term_id', 'term.id')
      .where('e.is_deleted', false)
      .select(
        'e.*',
        'cl.name as class_name',
        'cl.id as class_id',
        'sub.name as subject_name',
        'sub.code as subject_code',
        'sub.color_hex as subject_color',
        'term.name as term_name',
        't.first_name as teacher_first_name',
        't.last_name as teacher_last_name'
      )

    if (query.class_id) {
      knexQuery = knexQuery.where('cs.class_id', query.class_id)
    }
    if (query.term_id) {
      knexQuery = knexQuery.where('e.term_id', query.term_id)
    }
    if (query.exam_type) {
      knexQuery = knexQuery.where('e.exam_type', query.exam_type)
    }

    const data = await knexQuery.orderBy('e.exam_date', 'desc')
    return {
      total: data.length,
      limit: 100,
      skip: 0,
      data
    }
  }

  async create(data, params) {
    const db = this.getModel(params)
    const payload = {
      ...data,
      uuid: crypto.randomUUID(),
      created_at: new Date(),
      is_deleted: false,
      version: 1
    }
    const [inserted] = await db('school.exams').insert(payload).returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchData = { ...data, updated_at: new Date() }
    const [updated] = await db('school.exams').where({ id }).update(patchData).returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.exams').where({ id }).update({ is_deleted: true, deleted_at: new Date() }).returning('*')
    return removed
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.exams',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('exams', new ExamsService(options))

  const service = app.service('exams')

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
