const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class AcademicPlanningsService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
  }

  _sanitizePlanning(data, isCreate = false) {
    const clean = { ...data }
    if (isCreate) {
      delete clean.id
      clean.institution_id = clean.institution_id || 1
    }

    if (clean.teacher_id === '' || clean.teacher_id === undefined) {
      if (isCreate) clean.teacher_id = null
    } else {
      const parsed = parseInt(clean.teacher_id, 10)
      clean.teacher_id = isNaN(parsed) ? null : parsed
    }

    if (clean.subject_id === '' || clean.subject_id === undefined) {
      if (isCreate) clean.subject_id = null
    } else {
      const parsed = parseInt(clean.subject_id, 10)
      clean.subject_id = isNaN(parsed) ? null : parsed
    }

    // JSON fields
    const jsonFields = ['general_objectives', 'weekly_planning', 'evaluation_plan']
    for (const f of jsonFields) {
      if (clean[f] !== undefined && clean[f] !== null) {
        if (typeof clean[f] === 'string') {
          try {
            clean[f] = JSON.parse(clean[f])
          } catch (e) {
            clean[f] = []
          }
        }
        clean[f] = JSON.stringify(clean[f])
      }
    }
    return clean
  }

  async create(data, params) {
    const sanitized = this._sanitizePlanning(data, true)
    return super.create(sanitized, params)
  }

  async patch(id, data, params) {
    const sanitized = this._sanitizePlanning(data, false)
    sanitized.updated_at = new Date()
    return super.patch(id, sanitized, params)
  }

  async remove(id, params) {
    return super.patch(id, { is_deleted: true, updated_at: new Date() }, params)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.academic_plannings',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('academic-plannings', new AcademicPlanningsService(options))

  const service = app.service('academic-plannings')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      remove: [restrictToRoles('admin', 'control_estudio')]
    }
  })
}
