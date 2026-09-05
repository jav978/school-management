const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class ReportCardsService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.report_cards',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('report-cards', new ReportCardsService(options))

  const service = app.service('report-cards')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'teacher')],
      update: [restrictToRoles('admin', 'teacher')],
      patch: [restrictToRoles('admin', 'teacher')],
      remove: [restrictToAdmin]
    }
  })
}
