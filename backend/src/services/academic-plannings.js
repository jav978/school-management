const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class AcademicPlanningsService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.academic_plannings',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('academic-plannings', new AcademicPlanningsService(options))

  const service = app.service('academic-plannings')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher')],
      get: [restrictToRoles('admin', 'teacher')],
      create: [restrictToRoles('admin', 'teacher')],
      update: [restrictToRoles('admin', 'teacher')],
      patch: [restrictToRoles('admin', 'teacher')],
      remove: [restrictToAdmin]
    }
  })
}
