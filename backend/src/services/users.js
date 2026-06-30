const { KnexService } = require('@feathersjs/knex')
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks
const { authenticateHook, restrictToAdmin, restrictToSelfOrAdmin } = require('../hooks/auth')

class UsersService extends KnexService {
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

const mapPassword = (context) => {
  if (context.data && context.data.password) {
    context.data.password_hash = context.data.password
    delete context.data.password
  }
  return context
}

const { validateData } = require('../hooks/validation')

const userSchema = {
  email: { required: true, type: 'email' },
  username: { required: true },
  role: { required: true }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.users',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('users', new UsersService(options))

  const service = app.service('users')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToAdmin],
      get: [restrictToSelfOrAdmin],
      create: [restrictToAdmin, validateData(userSchema), hashPassword('password'), mapPassword],
      update: [restrictToAdmin, validateData(userSchema), hashPassword('password'), mapPassword],
      patch: [restrictToSelfOrAdmin, validateData(userSchema), hashPassword('password'), mapPassword],
      remove: [restrictToAdmin]
    },
    after: {
      all: [protect('password_hash')]
    }
  })
}


