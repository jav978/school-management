const { authenticate } = require('@feathersjs/authentication')
const { Forbidden } = require('@feathersjs/errors')

const baseAuthenticate = authenticate('jwt')

const authenticateHook = async (context) => {
  await baseAuthenticate(context)
  if (context.params.authentication && context.params.authentication.payload && context.params.authentication.payload.two_factor_pending) {
    throw new Forbidden('Se requiere verificación de dos factores (2FA) para acceder a este recurso')
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


