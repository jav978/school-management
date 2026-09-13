const { KnexService } = require('@feathersjs/knex')
const { authenticateHook } = require('../hooks/auth')

class MessagesService extends KnexService {
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
    name: 'school.messages',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('messages', new MessagesService(options))

  const service = app.service('messages')

  service.hooks({
    before: {
      all: [authenticateHook]
    }
  })
}

