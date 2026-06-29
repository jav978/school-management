const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class TeachersService extends KnexService {
  async find(params) {
    return super.find(params)
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
    return super.remove(id, params)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.teachers',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('teachers', new TeachersService(options))

  const service = app.service('teachers')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      create: [restrictToAdmin],
      update: [restrictToAdmin],
      patch: [restrictToAdmin],
      remove: [restrictToAdmin]
    }
  })
}

