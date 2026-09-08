const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

class StaffService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
  }

  _sanitizeStaffData(data, isCreate = false) {
    const clean = { ...data }
    if (isCreate) {
      delete clean.id
      clean.institution_id = clean.institution_id || 1
      if (!clean.employee_id) {
        clean.employee_id = `PERS-${Math.floor(1000 + Math.random() * 9000)}`
      } else {
        clean.employee_id = String(clean.employee_id).trim().toUpperCase()
      }
    } else if (clean.employee_id !== undefined) {
      clean.employee_id = String(clean.employee_id).trim().toUpperCase()
    }

    if (clean.first_name !== undefined) clean.first_name = String(clean.first_name).trim()
    if (clean.last_name !== undefined) clean.last_name = String(clean.last_name).trim()

    // Blood type
    if (clean.blood_type !== undefined) {
      clean.blood_type = clean.blood_type ? String(clean.blood_type).trim().toUpperCase() : 'UNKNOWN'
    }

    // Nullable dates and numbers
    if (clean.date_of_birth === '') clean.date_of_birth = null
    if (clean.user_id === '') clean.user_id = null

    // Strings
    const stringFields = [
      'gender', 'national_id', 'photo_url', 'department', 'position_title',
      'category', 'phone_mobile', 'phone_home', 'email_personal',
      'address_line1', 'emergency_contact_name', 'emergency_contact_phone', 'status'
    ]
    for (const f of stringFields) {
      if (clean[f] !== undefined) {
        clean[f] = clean[f] ? String(clean[f]).trim() : null
      }
    }
    return clean
  }

  async create(data, params) {
    const sanitized = this._sanitizeStaffData(data, true)
    return super.create(sanitized, params)
  }

  async patch(id, data, params) {
    const sanitized = this._sanitizeStaffData(data, false)
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
    name: 'school.staff',
    paginate: {
      default: 10,
      max: 50
    }
  }

  app.use('staff', new StaffService(options))

  const service = app.service('staff')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'teacher', 'staff')],
      get: [restrictToRoles('admin', 'teacher', 'staff')],
      create: [restrictToAdmin],
      update: [restrictToAdmin],
      patch: [restrictToAdmin],
      remove: [restrictToAdmin]
    }
  })
}
