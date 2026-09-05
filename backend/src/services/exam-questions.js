const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class ExamQuestionsService extends KnexService {}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.exam_questions',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('exam-questions', new ExamQuestionsService(options))

  const service = app.service('exam-questions')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'student')],
      get: [restrictToRoles('admin', 'teacher', 'student')],
      create: [restrictToRoles('admin', 'teacher')],
      update: [restrictToRoles('admin', 'teacher')],
      patch: [restrictToRoles('admin', 'teacher')],
      remove: [restrictToRoles('admin', 'teacher')]
    }
  })
}
