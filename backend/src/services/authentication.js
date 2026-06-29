const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication')
const { LocalStrategy } = require('@feathersjs/authentication-local')

class CustomLocalStrategy extends LocalStrategy {
  get configuration() {
    const config = super.configuration
    return {
      ...config,
      entityPasswordField: 'password_hash'
    }
  }
}

module.exports = function (app) {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new CustomLocalStrategy())

  app.use('authentication', authentication)
}

