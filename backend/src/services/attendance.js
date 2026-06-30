const { KnexService } = require('@feathersjs/knex')

class AttendanceService extends KnexService {
  async find(params) {
    return super.find(params)
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
    return super.remove(id, params)
  }
}

const { authenticateHook, restrictToRoles } = require('../hooks/auth')
const { validateData } = require('../hooks/validation')

const attendanceSchema = {
  student_id: { required: true },
  date: { required: true, type: 'date' },
  status: { required: true }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.attendance',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('attendance', new AttendanceService(options))

  const service = app.service('attendance')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'teacher'), validateData(attendanceSchema)],
      update: [restrictToRoles('admin', 'teacher'), validateData(attendanceSchema)],
      patch: [restrictToRoles('admin', 'teacher'), validateData(attendanceSchema)],
      remove: [restrictToRoles('admin', 'teacher')]
    }
  })
}
