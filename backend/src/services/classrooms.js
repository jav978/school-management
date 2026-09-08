const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class ClassroomsService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
  }

  _sanitizeRoom(data, isCreate = false) {
    const clean = { ...data }
    if (isCreate) {
      delete clean.id
      clean.institution_id = clean.institution_id || 1
    }
    if (clean.room_number) clean.room_number = String(clean.room_number).trim().toUpperCase()
    if (clean.name) clean.name = String(clean.name).trim()
    if (clean.building) clean.building = String(clean.building).trim()
    if (clean.type) clean.room_type = clean.type
    if (clean.room_type) clean.type = clean.room_type
    if (clean.equipment && typeof clean.equipment === 'object') {
      clean.equipment = JSON.stringify(clean.equipment)
    }
    if (clean.capacity !== undefined && clean.capacity !== '') {
      clean.capacity = parseInt(clean.capacity, 10) || 30
    }
    if (clean.floor !== undefined && clean.floor !== '') {
      clean.floor = parseInt(clean.floor, 10) || 1
    }
    return clean
  }

  async create(data, params) {
    const sanitized = this._sanitizeRoom(data, true)
    return super.create(sanitized, params)
  }

  async patch(id, data, params) {
    const sanitized = this._sanitizeRoom(data, false)
    sanitized.updated_at = new Date()
    return super.patch(id, sanitized, params)
  }

  async remove(id, params) {
    return super.patch(id, { is_deleted: true, deleted_at: new Date() }, params)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.rooms',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('classrooms', new ClassroomsService(options))

  const service = app.service('classrooms')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent', 'staff')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent', 'staff')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
