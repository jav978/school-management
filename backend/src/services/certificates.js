const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class CertificatesService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.certificates',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('certificates', new CertificatesService(options))

  const service = app.service('certificates')

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
