const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class ClassesService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
  }

  async get(id, params) {
    return super.get(id, params)
  }

  async create(data, params) {
    return super.create(data, params)
  }

  async patch(id, data, params) {
    return super.patch(id, data, params)
  }

  async remove(id, params) {
    return super.patch(id, { is_deleted: true, deleted_at: new Date() }, params)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.classes',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('classes', new ClassesService(options))

  const service = app.service('classes')

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
