const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class ClassroomsService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.classrooms',
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
