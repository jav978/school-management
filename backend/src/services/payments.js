const { KnexService } = require('@feathersjs/knex')

class PaymentsService extends KnexService {
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
    name: 'school.student_fees',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('payments', new PaymentsService(options))
}
