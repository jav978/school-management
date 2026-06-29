const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class GradesService extends KnexService {
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
    name: 'school.exam_results',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('grades', new GradesService(options))

  const service = app.service('grades')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'teacher')],
      update: [restrictToRoles('admin', 'teacher')],
      patch: [restrictToRoles('admin', 'teacher')],
      remove: [restrictToRoles('admin', 'teacher')]
    }
  })
}

