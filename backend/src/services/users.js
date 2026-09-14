const { KnexService } = require('@feathersjs/knex')
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks
const { BadRequest } = require('@feathersjs/errors')
const { authenticateHook, restrictToAdmin, restrictToSelfOrAdmin } = require('../hooks/auth')

const VALID_ROLES = new Set(['admin', 'teacher', 'student', 'parent', 'staff'])
const VALID_STATUSES = new Set(['active', 'inactive', 'suspended', 'pending', 'graduated'])

const ALLOWED_USER_COLUMNS = new Set([
  'id', 'uuid', 'institution_id', 'username', 'email', 'phone',
  'password_hash', 'password', 'role', 'status', 'avatar_url', 'locale',
  'timezone', 'two_factor_enabled', 'preferences', 'is_active', 'is_deleted',
  'updated_at', 'created_at', 'deleted_at'
])

class UsersService extends KnexService {
  setup(app) {
    this.app = app
  }

  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
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
    const db = this.getModel(params)
    await db('school.users')
      .where({ id })
      .update({
        is_deleted: true,
        is_active: false,
        status: 'inactive',
        deleted_at: db.fn.now()
      })
    return { id: Number(id), is_deleted: true, status: 'inactive' }
  }
}

const mapPassword = (context) => {
  if (context.data && context.data.password) {
    context.data.password_hash = context.data.password
    delete context.data.password
  }
  return context
}

const sanitizeUserUpdate = (context) => {
  if (!context.params.provider) return context
  const currentUser = context.params.user
  if (!currentUser || currentUser.role !== 'admin') {
    if (context.data) {
      delete context.data.role
      delete context.data.user_type
      delete context.data.is_active
      delete context.data.is_verified
      delete context.data.id
      delete context.data.uuid
    }
  }
  return context
}

const sanitizeUserData = (context) => {
  if (!context.data) return context
  const data = { ...context.data }

  // 1. Preferences JSONB handling
  let preferences = data.preferences || {}
  if (typeof preferences === 'string') {
    try { preferences = JSON.parse(preferences) } catch (_) { preferences = {} }
  }
  if (data.full_name) {
    preferences.full_name = String(data.full_name).trim()
  }
  data.preferences = preferences

  // 2. Role normalization to PostgreSQL school.user_role enum
  const rawRole = data.role || data.user_type
  if (rawRole) {
    const roleLower = String(rawRole).toLowerCase().trim()
    if (VALID_ROLES.has(roleLower)) {
      data.role = roleLower
    } else if (roleLower === 'administrative' || roleLower === 'academic_control' || roleLower === 'control_estudio') {
      data.role = 'staff'
      preferences.sub_role = roleLower
    } else {
      data.role = 'staff'
    }
  }

  // 3. Status normalization
  if (data.status) {
    const statusLower = String(data.status).toLowerCase().trim()
    if (VALID_STATUSES.has(statusLower)) {
      data.status = statusLower
      data.is_active = statusLower === 'active'
    }
  }

  // 4. Default required fields on create
  if (context.method === 'create') {
    data.institution_id = data.institution_id || 1
    if (!data.email) {
      throw new BadRequest('El correo electrónico es requerido')
    }
    if (!data.username) {
      const emailPrefix = String(data.email).split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
      data.username = `${emailPrefix}_${Math.floor(1000 + Math.random() * 9000)}`
    }
    if (!data.role) {
      data.role = 'staff'
    }
    if (!data.status) {
      data.status = 'active'
      data.is_active = true
    }
  }

  // 5. Column Whitelist for Knex
  const clean = {}
  for (const [key, val] of Object.entries(data)) {
    if (ALLOWED_USER_COLUMNS.has(key)) {
      clean[key] = val
    }
  }
  context.data = clean
  return context
}

const computeUserVirtuals = (user) => {
  if (!user || typeof user !== 'object') return user
  let prefs = user.preferences
  if (typeof prefs === 'string') {
    try { prefs = JSON.parse(prefs) } catch (_) { prefs = {} }
  }
  user.full_name = (prefs && prefs.full_name) || user.username || (user.email ? user.email.split('@')[0] : 'Usuario')
  user.user_type = user.role
  return user
}

const afterUserVirtuals = async (context) => {
  if (context.result) {
    if (Array.isArray(context.result.data)) {
      context.result.data = context.result.data.map(computeUserVirtuals)
    } else if (Array.isArray(context.result)) {
      context.result = context.result.map(computeUserVirtuals)
    } else {
      context.result = computeUserVirtuals(context.result)
    }
  }
  return context
}

const syncProfileTables = async (context) => {
  const db = context.app.get('knexClient')
  const user = context.result
  if (!user || !context.data) return context

  const phone = context.data.phone
  const avatarUrl = context.data.avatar_url

  try {
    if (user.role === 'parent') {
      const parentUpdate = {}
      if (phone !== undefined) parentUpdate.phone_mobile = phone
      if (avatarUrl !== undefined) parentUpdate.photo_url = avatarUrl
      if (Object.keys(parentUpdate).length > 0) {
        await db('school.parents')
          .where('user_id', user.id)
          .update({ ...parentUpdate, updated_at: db.fn.now() })
      }
    } else if (user.role === 'teacher') {
      const teacherUpdate = {}
      if (phone !== undefined) teacherUpdate.phone = phone
      if (avatarUrl !== undefined) teacherUpdate.photo_url = avatarUrl
      if (Object.keys(teacherUpdate).length > 0) {
        await db('school.teachers')
          .where('user_id', user.id)
          .update({ ...teacherUpdate, updated_at: db.fn.now() })
      }
    }
  } catch (err) {
    console.error('Error syncing profile tables:', err.message)
  }

  return context
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.users',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('users', new UsersService(options))

  const service = app.service('users')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToAdmin],
      get: [restrictToSelfOrAdmin],
      create: [restrictToAdmin, sanitizeUserData, hashPassword('password'), mapPassword],
      update: [restrictToAdmin, sanitizeUserUpdate, sanitizeUserData, hashPassword('password'), mapPassword],
      patch: [restrictToSelfOrAdmin, sanitizeUserUpdate, sanitizeUserData, hashPassword('password'), mapPassword],
      remove: [restrictToAdmin]
    },
    after: {
      all: [protect('password_hash'), afterUserVirtuals],
      patch: [syncProfileTables]
    }
  })
}


