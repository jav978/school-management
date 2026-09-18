const { KnexService } = require('@feathersjs/knex')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_COLUMNS = new Set([
  'id', 'uuid', 'card_code', 'recipient_name', 'recipient_id_card',
  'recipient_type', 'position', 'department', 'blood_type',
  'emergency_contact', 'emergency_phone', 'address', 'photo_url',
  'issue_date', 'valid_until', 'status', 'is_deleted', 'deleted_at',
  'created_at', 'updated_at'
])

class IdCardsService extends KnexService {
  _sanitizeData(data) {
    const clean = {}
    for (const [key, value] of Object.entries(data)) {
      if (ALLOWED_COLUMNS.has(key)) {
        clean[key] = value
      }
    }
    if (data.expiry_date && !clean.valid_until) {
      clean.valid_until = data.expiry_date
    }
    return clean
  }

  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
  }

  async create(data, params) {
    const db = this.getModel(params)
    const clean = this._sanitizeData(data)

    if (!clean.uuid) {
      clean.uuid = crypto.randomUUID()
    }

    // Ensure unique card_code, resolving collisions against active and deleted records
    let candidate = clean.card_code
    if (!candidate) {
      const typePrefix = (clean.recipient_type || 'est').slice(0, 3).toUpperCase()
      const year = new Date().getFullYear()
      const randomDigits = Math.floor(1000 + Math.random() * 9000)
      candidate = `CRD-${typePrefix}-${year}-${randomDigits}`
    }

    let finalCode = candidate
    let attempts = 0
    while (attempts < 20) {
      const existing = await db('school.id_cards').where({ card_code: finalCode }).first()
      if (!existing) {
        break
      }
      // If code already exists in DB (even if soft-deleted), generate a new unique suffix
      const randomDigits = Math.floor(1000 + Math.random() * 9000)
      const base = candidate.includes('-') ? candidate.replace(/-\d+$/, '') : candidate
      finalCode = `${base}-${randomDigits}`
      attempts++
    }
    clean.card_code = finalCode

    if (!clean.issue_date) {
      clean.issue_date = new Date().toISOString().split('T')[0]
    }
    if (!clean.valid_until) {
      clean.valid_until = '2027-07-31'
    }
    if (!clean.status) {
      clean.status = 'activo'
    }
    clean.is_deleted = false
    clean.created_at = new Date()
    clean.updated_at = new Date()

    const [inserted] = await db('school.id_cards')
      .insert(clean)
      .returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const clean = this._sanitizeData(data)
    clean.updated_at = new Date()

    const [updated] = await db('school.id_cards')
      .where({ id })
      .update(clean)
      .returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.id_cards')
      .where({ id })
      .update({ is_deleted: true, deleted_at: new Date() })
      .returning('*')
    return removed
  }
}

const optionalAuthForPublicCard = async (context) => {
  if (context.params.query?.card_code) {
    return context
  }
  return authenticateHook(context)
}

const optionalRoleForPublicCard = (context) => {
  if (context.params.query?.card_code) {
    return context
  }
  return restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent', 'staff')(context)
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.id_cards',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('id-cards', new IdCardsService(options))

  const service = app.service('id-cards')

  service.hooks({
    before: {
      all: [],
      find: [optionalAuthForPublicCard, optionalRoleForPublicCard],
      get: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent', 'staff')],
      create: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
