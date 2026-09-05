const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class AnnouncementsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.announcements as a')
      .leftJoin('school.teachers as t', 'a.author_id', 't.id')
      .where('a.is_deleted', false)
      .select(
        'a.*',
        't.first_name as author_first_name',
        't.last_name as author_last_name',
        't.department as author_department'
      )

    if (query.priority) {
      knexQuery = knexQuery.where('a.priority', query.priority)
    }
    if (query.is_pinned !== undefined) {
      knexQuery = knexQuery.where('a.is_pinned', query.is_pinned)
    }

    const data = await knexQuery.orderBy([
      { column: 'a.is_pinned', order: 'desc' },
      { column: 'a.created_at', order: 'desc' }
    ])

    return {
      total: data.length,
      limit: 50,
      skip: 0,
      data
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const announcement = await db('school.announcements as a')
      .leftJoin('school.teachers as t', 'a.author_id', 't.id')
      .where('a.id', id)
      .where('a.is_deleted', false)
      .select('a.*', 't.first_name as author_first_name', 't.last_name as author_last_name')
      .first()

    if (!announcement) {
      throw new BadRequest(`Aviso con id ${id} no encontrado`)
    }
    return announcement
  }

  async create(data, params) {
    const db = this.getModel(params)

    if (!data.title) throw new BadRequest('El título del aviso es requerido')
    if (!data.body) throw new BadRequest('El contenido del aviso es requerido')

    const teacher = await db('school.teachers').first().catch(() => null)
    const authorId = data.author_id || (teacher ? teacher.id : 1)

    const payload = {
      uuid: crypto.randomUUID(),
      institution_id: 1,
      author_id: authorId,
      title: data.title.trim(),
      body: data.body.trim(),
      priority: data.priority || 'normal',
      is_published: true,
      published_at: new Date(),
      is_pinned: Boolean(data.is_pinned),
      send_push: true,
      send_email: false,
      send_sms: false,
      view_count: 1,
      created_at: new Date(),
      is_deleted: false,
      version: 1
    }

    const [inserted] = await db('school.announcements').insert(payload).returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchData = { ...data, updated_at: new Date() }
    const [updated] = await db('school.announcements').where({ id }).update(patchData).returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.announcements').where({ id }).update({ is_deleted: true, deleted_at: new Date() }).returning('*')
    return removed
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.announcements',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('announcements', new AnnouncementsService(options))

  const service = app.service('announcements')

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
