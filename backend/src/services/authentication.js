const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication')
const { LocalStrategy } = require('@feathersjs/authentication-local')
const { oauth, OAuthStrategy } = require('@feathersjs/authentication-oauth')
const { NotAuthenticated } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook } = require('../hooks/auth')

class CustomLocalStrategy extends LocalStrategy {
  get configuration() {
    const config = super.configuration
    return {
      ...config,
      entityPasswordField: 'password_hash'
    }
  }

  async getEntity(result, params) {
    const { provider, ...paramsWithoutProvider } = params
    return super.getEntity(result, paramsWithoutProvider)
  }
}

class CustomAuthenticationService extends AuthenticationService {
  async getPayload(authResult, params) {
    const payload = await super.getPayload(authResult, params)
    const user = authResult.user
    if (user) {
      payload.session_id = params.sessionId || crypto.randomUUID()
      payload.role = user.role
      payload.email = user.email
    }
    return payload
  }

  async create(data, params) {
    const sessionId = crypto.randomUUID()
    params.sessionId = sessionId

    const result = await super.create(data, params)

    if (result.two_factor_required || !result.user) {
      return result
    }

    const user = result.user
    const db = this.app.get('knexClient')

    // 1. Kick-out: Invalidate all previous active sessions for this user in school.user_sessions
    await db('school.user_sessions')
      .where({ user_id: user.id, is_active: true })
      .update({
        is_active: false,
        ended_at: db.fn.now()
      })

    // 2. Insert new active session
    const rawIp = params.ip || (params.headers && params.headers['x-forwarded-for']) || '127.0.0.1'
    const cleanIp = String(rawIp).includes(',') ? String(rawIp).split(',')[0].trim() : String(rawIp)
    const validIp = cleanIp.match(/^(\d{1,3}\.){3}\d{1,3}$/) ? cleanIp : '127.0.0.1'
    const userAgent = (params.headers && params.headers['user-agent']) || 'Unknown Browser'

    await db('school.user_sessions').insert({
      user_id: user.id,
      token: sessionId,
      ip_address: validIp,
      user_agent: String(userAgent).substring(0, 500),
      started_at: db.fn.now(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      is_active: true
    })

    result.session_id = sessionId
    return result
  }

  async find(params) {
    if (!params.user) {
      throw new NotAuthenticated('No autenticado')
    }
    return {
      authenticated: true,
      user: params.user,
      session_id: params.authentication?.payload?.session_id || null
    }
  }

  async get(id, params) {
    if (!params.user) {
      throw new NotAuthenticated('No autenticado')
    }
    return {
      authenticated: true,
      user: params.user,
      session_id: params.authentication?.payload?.session_id || null
    }
  }

  async remove(id, params) {
    const user = params.user
    const sessionId = params.authentication?.payload?.session_id
    if (user && sessionId) {
      const db = this.app.get('knexClient')
      await db('school.user_sessions')
        .where({ user_id: user.id, token: sessionId })
        .update({
          is_active: false,
          ended_at: db.fn.now()
        })
    }
    return {
      success: true,
      message: 'Sesión finalizada exitosamente'
    }
  }
}

module.exports = function (app) {
  const authentication = new CustomAuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new CustomLocalStrategy())

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.configure(oauth())
    authentication.register('google', new OAuthStrategy())
  }

  app.use('authentication', authentication)

  const service = app.service('authentication')

  service.hooks({
    before: {
      find: [authenticateHook],
      get: [authenticateHook],
      remove: [authenticateHook]
    },
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


