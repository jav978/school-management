const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class ReportCardsService extends KnexService {
  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.report_cards')
      .where({ id })
      .update({ is_deleted: true, deleted_at: new Date() })
      .returning('*')
    return removed
  }
}

const optionalAuthForPublicVerification = async (context) => {
  // If verifying a document publicly via verification_code, skip auth check
  if (context.params.query?.verification_code) {
    return context
  }
  return authenticateHook(context)
}

const optionalRoleForPublicVerification = (context) => {
  if (context.params.query?.verification_code) {
    return context
  }
  return restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')(context)
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.report_cards',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('report-cards', new ReportCardsService(options))

  const service = app.service('report-cards')

  service.hooks({
    before: {
      all: [],
      find: [optionalAuthForPublicVerification, optionalRoleForPublicVerification],
      get: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      update: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      patch: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher')],
      remove: [authenticateHook, restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
