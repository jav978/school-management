const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class ScheduleTemplatesService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.schedule_templates',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('schedule-templates', new ScheduleTemplatesService(options))

  const service = app.service('schedule-templates')

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
