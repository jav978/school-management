const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class StaffService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.staff',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('staff', new StaffService(options))

  const service = app.service('staff')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'staff')],
      get: [restrictToRoles('admin', 'teacher', 'staff')],
      create: [restrictToAdmin],
      update: [restrictToAdmin],
      patch: [restrictToAdmin],
      remove: [restrictToAdmin]
    }
  })
}
