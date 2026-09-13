const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class AssignmentsService extends KnexService {
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
    name: 'school.assignments',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('assignments', new AssignmentsService(options))

  const service = app.service('assignments')

  service.hooks({
    before: {
      all: [authenticateHook],
      create: [restrictToRoles('admin', 'coordinator', 'teacher')],
      update: [restrictToRoles('admin', 'coordinator', 'teacher')],
      patch: [restrictToRoles('admin', 'coordinator', 'teacher')],
      remove: [restrictToRoles('admin', 'coordinator', 'teacher')]
    }
  })
}

