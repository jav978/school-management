const { KnexService } = require('@feathersjs/knex')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_COLUMNS = new Set([
  'id', 'uuid', 'certificate_type', 'recipient_name', 'recipient_id_card',
  'academic_year', 'description', 'average_grade', 'verification_code',
  'issue_date', 'status', 'is_deleted', 'deleted_at', 'created_at', 'updated_at',
  'recipient_type', 'template_id', 'grade_level', 'department', 'position',
  'batch_id', 'metadata', 'issued_by', 'issued_role'
])

class CertificatesService extends KnexService {
  _sanitizeData(data) {
    const clean = {}
    for (const [key, value] of Object.entries(data)) {
      if (ALLOWED_COLUMNS.has(key)) {
        clean[key] = value
      }
    }
    return clean
  }

  _formatItem(item) {
    if (!item) return item
    if (typeof item.metadata === 'string') {
      try {
        item.metadata = JSON.parse(item.metadata)
      } catch (e) {
        item.metadata = {}
      }
    }
    return item
  }

  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    if (!query.$sort) {
      query.$sort = { id: -1 }
    }
    const result = await super.find({ ...params, query })
    if (Array.isArray(result)) {
      return result.map(i => this._formatItem(i))
    }
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map(i => this._formatItem(i))
    }
    return result
  }

  async get(id, params) {
    const item = await super.get(id, params)
    return this._formatItem(item)
  }

  async create(data, params) {
    const db = this.getModel(params)
    if (Array.isArray(data)) {
      const results = []
      for (const item of data) {
        const res = await this.create(item, params)
        results.push(res)
      }
      return results
    }

    const clean = this._sanitizeData(data)

    if (!clean.uuid) {
      clean.uuid = crypto.randomUUID()
    }
    if (!clean.verification_code) {
      clean.verification_code = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    }
    if (!clean.issue_date) {
      clean.issue_date = new Date().toISOString().split('T')[0]
    }
    if (!clean.status) {
      clean.status = 'emitido'
    }
    if (clean.metadata && typeof clean.metadata === 'object') {
      clean.metadata = JSON.stringify(clean.metadata)
    }
    clean.is_deleted = false
    clean.created_at = new Date()
    clean.updated_at = new Date()

    const [inserted] = await db('school.certificates')
      .insert(clean)
      .returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const clean = this._sanitizeData(data)
    if (clean.metadata && typeof clean.metadata === 'object') {
      clean.metadata = JSON.stringify(clean.metadata)
    }
    clean.updated_at = new Date()

    const [updated] = await db('school.certificates')
      .where({ id })
      .update(clean)
      .returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.certificates')
      .where({ id })
      .update({ is_deleted: true, deleted_at: new Date() })
      .returning('*')
    return removed
  }
}

const optionalAuthForPublicCert = async (context) => {
  if (context.params.query?.verification_code) {
    return context
  }
  return authenticateHook(context)
}

const optionalRoleForPublicCert = (context) => {
  if (context.params.query?.verification_code) {
    return context
  }
  return restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')(context)
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.certificates',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('certificates', new CertificatesService(options))

  const service = app.service('certificates')

  service.hooks({
    before: {
      all: [],
      find: [optionalAuthForPublicCert, optionalRoleForPublicCert],
      get: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
