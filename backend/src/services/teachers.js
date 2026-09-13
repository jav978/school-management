const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const bcrypt = require('bcryptjs')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_TEACHER_COLUMNS = new Set([
  'user_id', 'institution_id', 'employee_id', 'first_name', 'middle_name', 'last_name',
  'date_of_birth', 'gender', 'blood_type', 'nationality', 'national_id', 'passport_number',
  'marital_status', 'photo_url', 'bio', 'email_personal', 'phone_mobile', 'phone_home',
  'phone_work', 'address_line1', 'address_line2', 'hire_date', 'contract_type', 'salary',
  'salary_currency', 'department', 'position_title', 'office_location', 'highest_education',
  'specialization', 'years_experience', 'certifications', 'languages', 'linkedin_url',
  'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_rel', 'notes',
  'status', 'is_deleted', 'deleted_at', 'deleted_by', 'updated_at', 'updated_by'
])

class TeachersService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    if (query.$sort && typeof query.$sort === 'object') {
      for (const [k, v] of Object.entries(query.$sort)) {
        query.$sort[k] = parseInt(v, 10) || (String(v).toLowerCase() === 'desc' ? -1 : 1)
      }
    } else if (!query.$sort) {
      query.$sort = { employee_id: 1 }
    }
    return super.find({ ...params, query })
  }

  async get(id, params) {
    return super.get(id, params)
  }

  async create(data, params) {
    const first_name = data.first_name ? String(data.first_name).trim() : ''
    const last_name = data.last_name ? String(data.last_name).trim() : ''
    const employee_id = data.employee_id ? String(data.employee_id).trim().toUpperCase() : ''

    if (!first_name) throw new BadRequest('El nombre del profesor es requerido')
    if (!last_name) throw new BadRequest('El apellido del profesor es requerido')
    if (!employee_id) throw new BadRequest('El código o número de empleado es requerido')

    const db = this.getModel(params)
    const existing = await db('school.teachers')
      .where({ employee_id, is_deleted: false })
      .first()
      .catch(() => null)

    if (existing) {
      throw new BadRequest(`Ya existe un profesor con el número de empleado ${employee_id}`)
    }

    let userId = data.user_id
    if (!userId) {
      const username = 'prof_' + employee_id.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString().slice(-4)
      const email = data.email_personal || `${username}@colegiosanmartin.edu`
      const hash = await bcrypt.hash('Teacher123!', 10)
      const newUser = await db('school.users').insert({
        institution_id: data.institution_id || 1,
        username,
        email,
        password_hash: hash,
        role: 'teacher',
        status: 'active'
      }).returning('id')
      userId = newUser[0]?.id || newUser[0]
    }

    const sanitizedData = {
      ...data,
      user_id: userId,
      institution_id: data.institution_id || 1,
      first_name,
      last_name,
      employee_id,
      department: data.department ? String(data.department).trim() : 'General',
      specialization: data.specialization ? String(data.specialization).trim() : null,
      email_personal: data.email_personal ? String(data.email_personal).trim() : null,
      phone_mobile: data.phone_mobile ? String(data.phone_mobile).trim() : null,
      contract_type: data.contract_type || 'full-time',
      status: data.status || 'active',
      photo_url: data.photo_url || null,
      years_experience: data.years_experience !== undefined && data.years_experience !== '' ? Number(data.years_experience) : 0,
      is_deleted: false
    }

    const cleanData = {}
    for (const [key, val] of Object.entries(sanitizedData)) {
      if (ALLOWED_TEACHER_COLUMNS.has(key)) {
        cleanData[key] = val
      }
    }

    return super.create(cleanData, params)
  }

  async patch(id, data, params) {
    const patchData = { ...data }
    if (patchData.first_name !== undefined) {
      patchData.first_name = String(patchData.first_name).trim()
      if (!patchData.first_name) throw new BadRequest('El nombre no puede estar vacío')
    }
    if (patchData.last_name !== undefined) {
      patchData.last_name = String(patchData.last_name).trim()
      if (!patchData.last_name) throw new BadRequest('El apellido no puede estar vacío')
    }
    if (patchData.employee_id !== undefined) {
      patchData.employee_id = String(patchData.employee_id).trim().toUpperCase()
      if (!patchData.employee_id) throw new BadRequest('El número de empleado no puede estar vacío')
      
      const db = this.getModel(params)
      const existing = await db('school.teachers')
        .where({ employee_id: patchData.employee_id, is_deleted: false })
        .whereNot({ id })
        .first()
        .catch(() => null)
      if (existing) {
        throw new BadRequest(`Ya existe otro profesor con el código ${patchData.employee_id}`)
      }
    }

    const cleanPatch = {}
    for (const [key, val] of Object.entries(patchData)) {
      if (ALLOWED_TEACHER_COLUMNS.has(key)) {
        cleanPatch[key] = val
      }
    }
    cleanPatch.updated_at = new Date()

    return super.patch(id, cleanPatch, params)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    await db('school.teachers')
      .where({ id })
      .update({
        is_deleted: true,
        status: 'inactive',
        deleted_at: new Date()
      })
    return { id, is_deleted: true, status: 'inactive' }
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.teachers',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('teachers', new TeachersService(options))

  const service = app.service('teachers')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'control_estudio')],
      update: [restrictToRoles('admin', 'control_estudio')],
      patch: [restrictToRoles('admin', 'control_estudio')],
      remove: [restrictToRoles('admin', 'control_estudio')]
    },
    after: {
      all: [
        async context => {
          const addVirtuals = record => {
            if (record && typeof record === 'object') {
              record.full_name = [record.first_name, record.last_name].filter(Boolean).join(' ')
            }
            return record
          }
          if (context.result) {
            if (Array.isArray(context.result)) {
              context.result.forEach(addVirtuals)
            } else if (Array.isArray(context.result.data)) {
              context.result.data.forEach(addVirtuals)
            } else {
              addVirtuals(context.result)
            }
          }
          return context
        }
      ]
    }
  })
}

