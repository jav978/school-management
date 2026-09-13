const { authenticate } = require('@feathersjs/authentication')
const { Forbidden, NotAuthenticated } = require('@feathersjs/errors')

const baseAuthenticate = authenticate('jwt')

const authenticateHook = async (context) => {
  if (!context.params.provider) {
    return context
  }

  const authService = context.app.defaultAuthentication ? context.app.defaultAuthentication() : context.app.service('authentication')
  if (context.service === authService || context.path === 'authentication') {
    if (!context.params.authentication) {
      throw new NotAuthenticated('Autenticación requerida')
    }
    const { provider, authentication, ...authParams } = context.params
    const authResult = await authService.authenticate(authentication, authParams, 'jwt')
    const { accessToken, ...authResultWithoutToken } = authResult
    context.params = {
      ...context.params,
      ...authResultWithoutToken,
      authenticated: true
    }
  } else {
    await baseAuthenticate(context)
  }

  const authPayload = context.params.authentication && context.params.authentication.payload
  if (!authPayload) {
    throw new NotAuthenticated('Autenticación requerida')
  }

  if (authPayload.two_factor_pending) {
    throw new Forbidden('Se requiere verificación de dos factores (2FA) para acceder a este recurso')
  }

  // Active Single Session Verification
  if (authPayload.session_id) {
    const db = context.app.get('knexClient')
    const session = await db('school.user_sessions')
      .where({
        token: authPayload.session_id,
        user_id: authPayload.sub,
        is_active: true
      })
      .andWhere('expires_at', '>', db.fn.now())
      .first()

    if (!session) {
      throw new NotAuthenticated('Su sesión ha caducado porque se inició sesión en otro dispositivo o ventana.')
    }
  }

  return context
}

const restrictToAdmin = (context) => {
  if (!context.params.provider) {
    return context
  }
  if (!context.params.user || context.params.user.role !== 'admin') {
    throw new Forbidden('Not authorized')
  }
  return context
}

const restrictToRoles = (...roles) => {
  return (context) => {
    if (!context.params.provider) {
      return context
    }
    if (!context.params.user || !roles.includes(context.params.user.role)) {
      throw new Forbidden('Not authorized')
    }
    return context
  }
}

const restrictToSelfOrAdmin = (context) => {
  if (!context.params.provider) {
    return context
  }
  if (!context.params.user) {
    throw new Forbidden('Not authorized')
  }
  if (context.params.user.role === 'admin') {
    return context
  }
  // Allow if the user is requesting their own record
  const userId = context.id
  const currentUserId = context.params.user.id || context.params.user.uuid
  if (userId && currentUserId && String(userId) === String(currentUserId)) {
    return context
  }
  throw new Forbidden('Not authorized')
}

module.exports = {
  authenticateHook,
  restrictToAdmin,
  restrictToRoles,
  restrictToSelfOrAdmin
}


