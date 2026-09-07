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

  const service = app.service('authentication')

  service.hooks({
    after: {
      create: [
        async (context) => {
          const user = context.result && context.result.user
          if (user && user.two_factor_enabled) {
            // User has 2FA enabled: return temporary token requiring 2FA challenge
            const tempToken = await service.createAccessToken(
              { sub: user.id, two_factor_pending: true },
              { expiresIn: '5m' }
            )
            context.result = {
              two_factor_required: true,
              temp_token: tempToken,
              user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
              }
            }
          }
          return context
        }
      ]
    }
  })
}

