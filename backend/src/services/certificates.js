const { KnexService } = require('@feathersjs/knex')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_COLUMNS = new Set([
  'id', 'uuid', 'certificate_type', 'recipient_name', 'recipient_id_card',
  'academic_year', 'description', 'average_grade', 'verification_code',
  'issue_date', 'status', 'is_deleted', 'deleted_at', 'created_at', 'updated_at'
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
    if (!clean.verification_code) {
      clean.verification_code = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    }
    if (!clean.issue_date) {
      clean.issue_date = new Date().toISOString().split('T')[0]
    }
    if (!clean.status) {
      clean.status = 'emitido'
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
