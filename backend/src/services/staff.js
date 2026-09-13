const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

const ALLOWED_STAFF_COLUMNS = new Set([
  'user_id', 'institution_id', 'employee_id', 'first_name', 'last_name',
  'date_of_birth', 'gender', 'blood_type', 'national_id', 'photo_url',
  'department', 'position_title', 'category', 'phone_mobile', 'phone_home',
  'email_personal', 'address_line1', 'emergency_contact_name',
  'emergency_contact_phone', 'status', 'is_deleted', 'created_at', 'updated_at'
])

function _enrichStaff(person) {
  if (!person) return person
  const categoryNormalized = person.category === 'administrative' ? 'administrativo' : (person.category || 'administrativo')
  const statusNormalized = (person.status === 'active' || person.status === 'activo') ? 'activo' : ((person.status === 'inactive' || person.status === 'inactivo') ? 'inactivo' : (person.status || 'activo'))

  return {
    ...person,
    full_name: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
    staff_id: person.employee_id,
    id_card: person.national_id,
    category: categoryNormalized,
    staff_type: categoryNormalized,
    position: person.position_title || 'Colaborador',
    position_title: person.position_title || 'Colaborador',
    phone: person.phone_mobile,
    email: person.email_personal,
    emergency_contact: person.emergency_contact_name,
    emergency_phone: person.emergency_contact_phone,
    status: statusNormalized
  }
}

class StaffService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.staff').where('is_deleted', false)

    if (query.status) {
      if (query.status === 'activo') {
        knexQuery = knexQuery.whereIn('status', ['activo', 'active'])
      } else if (query.status === 'inactivo') {
        knexQuery = knexQuery.whereIn('status', ['inactivo', 'inactive'])
      } else {
        knexQuery = knexQuery.where('status', query.status)
      }
    }

    if (query.category) {
      if (query.category === 'administrativo') {
        knexQuery = knexQuery.whereIn('category', ['administrativo', 'administrative'])
      } else if (query.category === 'profesional') {
        knexQuery = knexQuery.whereIn('category', ['profesional', 'professional'])
      } else if (query.category === 'obrero') {
        knexQuery = knexQuery.whereIn('category', ['obrero', 'services', 'worker'])
      } else {
        knexQuery = knexQuery.where('category', query.category)
      }
    }

    const items = await knexQuery.orderBy('id', 'asc')
    const enriched = items.map(_enrichStaff)

    return {
      total: enriched.length,
      limit: 100,
      skip: 0,
      data: enriched
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const item = await db('school.staff').where({ id, is_deleted: false }).first()
    if (!item) {
      throw new BadRequest(`Colaborador con id ${id} no encontrado`)
    }
    return _enrichStaff(item)
  }

  _sanitizeStaffData(data, isCreate = false) {
    const raw = { ...data }
    const clean = {}

    // Map aliases - frontend form fields take precedence
    if (raw.position !== undefined) raw.position_title = raw.position
    if (raw.staff_type !== undefined) raw.category = raw.staff_type
    if (raw.staff_id !== undefined) raw.employee_id = raw.staff_id
    if (raw.id_card !== undefined) raw.national_id = raw.id_card
    if (raw.phone !== undefined) raw.phone_mobile = raw.phone
    if (raw.email !== undefined) raw.email_personal = raw.email
    if (raw.emergency_contact !== undefined) raw.emergency_contact_name = raw.emergency_contact
    if (raw.emergency_phone !== undefined) raw.emergency_contact_phone = raw.emergency_phone

    if (isCreate) {
      delete raw.id
      clean.institution_id = raw.institution_id || 1
      if (!raw.employee_id) {
        clean.employee_id = `PERS-${Math.floor(1000 + Math.random() * 9000)}`
      } else {
        clean.employee_id = String(raw.employee_id).trim().toUpperCase()
      }
    } else if (raw.employee_id !== undefined) {
      clean.employee_id = String(raw.employee_id).trim().toUpperCase()
    }

    if (raw.first_name !== undefined) clean.first_name = String(raw.first_name).trim()
    if (raw.last_name !== undefined) clean.last_name = String(raw.last_name).trim()

    // Blood type
    if (raw.blood_type !== undefined) {
      clean.blood_type = raw.blood_type ? String(raw.blood_type).trim().toUpperCase() : 'UNKNOWN'
    }

    // Nullable dates and numbers
    if (raw.date_of_birth === '') clean.date_of_birth = null
    else if (raw.date_of_birth !== undefined) clean.date_of_birth = raw.date_of_birth

    if (raw.user_id === '') clean.user_id = null
    else if (raw.user_id !== undefined) clean.user_id = raw.user_id

    // Category / status normalization
    if (raw.category !== undefined) {
      const cat = String(raw.category).toLowerCase().trim()
      if (cat === 'administrative' || cat === 'administrativo') clean.category = 'administrativo'
      else if (cat === 'professional' || cat === 'profesional') clean.category = 'profesional'
      else if (cat === 'worker' || cat === 'obrero' || cat === 'services') clean.category = 'obrero'
      else clean.category = cat
    }

    if (raw.status !== undefined) {
      const st = String(raw.status).toLowerCase().trim()
      if (st === 'active' || st === 'activo') clean.status = 'activo'
      else if (st === 'inactive' || st === 'inactivo') clean.status = 'inactivo'
      else if (st === 'license' || st === 'licencia') clean.status = 'licencia'
      else clean.status = st
    }

    // Strings
    const stringFields = [
      'gender', 'national_id', 'photo_url', 'department', 'position_title',
      'phone_mobile', 'phone_home', 'email_personal',
      'address_line1', 'emergency_contact_name', 'emergency_contact_phone'
    ]
    for (const f of stringFields) {
      if (raw[f] !== undefined) {
        clean[f] = raw[f] ? String(raw[f]).trim() : null
      }
    }

    // Filter to allowed columns
    const filtered = {}
    for (const key of Object.keys(clean)) {
      if (ALLOWED_STAFF_COLUMNS.has(key)) {
        filtered[key] = clean[key]
      }
    }
    return filtered
  }

  async create(data, params) {
    const sanitized = this._sanitizeStaffData(data, true)
    const created = await super.create(sanitized, params)
    return _enrichStaff(created)
  }

  async patch(id, data, params) {
    const sanitized = this._sanitizeStaffData(data, false)
    sanitized.updated_at = new Date()
    const patched = await super.patch(id, sanitized, params)
    return _enrichStaff(patched)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    await db('school.staff').where({ id }).update({ is_deleted: true, updated_at: new Date() })
    return { id, is_deleted: true }
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.staff',
    paginate: {
      default: 50,
      max: 200
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
