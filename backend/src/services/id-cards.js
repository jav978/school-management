const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class IdCardsService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.id_cards',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('id-cards', new IdCardsService(options))

  const service = app.service('id-cards')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'student', 'parent', 'staff')],
      get: [restrictToRoles('admin', 'teacher', 'student', 'parent', 'staff')],
      create: [restrictToAdmin],
      update: [restrictToAdmin],
      patch: [restrictToAdmin],
      remove: [restrictToAdmin]
    }
  })
}
