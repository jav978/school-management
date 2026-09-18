const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class AnnouncementsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.announcements as a')
      .leftJoin('school.users as u', 'a.author_id', 'u.id')
      .where('a.is_deleted', false)
      .select(
        'a.*',
        'u.username as author_username',
        'u.role as author_role'
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
      data: data.map(item => ({
        ...item,
        author_first_name: item.author_username || 'Dirección',
        author_last_name: 'Académica',
        author_department: 'Coordinación'
      }))
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const announcement = await db('school.announcements as a')
      .leftJoin('school.users as u', 'a.author_id', 'u.id')
      .where('a.id', id)
      .where('a.is_deleted', false)
      .select('a.*', 'u.username as author_username', 'u.role as author_role')
      .first()

    if (!announcement) {
      throw new BadRequest(`Aviso con id ${id} no encontrado`)
    }
    return {
      ...announcement,
      author_first_name: announcement.author_username || 'Dirección',
      author_last_name: 'Académica',
      author_department: 'Coordinación'
    }
  }

  async create(data, params) {
    const db = this.getModel(params)

    if (!data.title) throw new BadRequest('El título del aviso es requerido')
    if (!data.body) throw new BadRequest('El contenido del aviso es requerido')

    const user = params?.user || (await db('school.users').where({ role: 'admin' }).first()) || (await db('school.users').first())
    const authorId = data.author_id || (user ? user.id : 1)
    const inst = (await db('school.institutions').first()) || { id: 1 }

    let priority = data.priority || 'normal'
    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      priority = 'normal'
    }

    const payload = {
      institution_id: inst.id,
      author_id: authorId,
      title: data.title.trim(),
      body: data.body.trim(),
      priority,
      is_published: true,
      published_at: new Date(),
      is_pinned: Boolean(data.is_pinned),
      send_push: false,
      send_email: false,
      send_sms: false,
      view_count: 1,
      created_at: new Date(),
      created_by: authorId,
      is_deleted: false,
      version: 1
    }

    const [inserted] = await db('school.announcements').insert(payload).returning('*')
    return {
      ...inserted,
      author_first_name: user?.username || 'Dirección',
      author_last_name: 'Académica',
      author_department: 'Coordinación'
    }
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const clean = {}
    const patchable = ['title', 'body', 'priority', 'is_pinned', 'is_published']
    for (const key of patchable) {
      if (data[key] !== undefined) {
        clean[key] = data[key]
      }
    }
    clean.updated_at = new Date()
    const [updated] = await db('school.announcements').where({ id }).update(clean).returning('*')
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
