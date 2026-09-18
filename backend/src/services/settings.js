const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin } = require('../hooks/auth')

class SettingsService extends KnexService {
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
    name: 'school.settings',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('settings', new SettingsService(options))

  const service = app.service('settings')

  service.hooks({
    before: {
      all: [authenticateHook],
      create: [restrictToAdmin],
      update: [restrictToAdmin],
      patch: [restrictToAdmin],
      remove: [restrictToAdmin]
    }
  })
}

