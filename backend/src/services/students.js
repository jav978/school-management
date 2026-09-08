const { KnexService } = require('@feathersjs/knex')
const { authenticateHook, restrictToAdmin, restrictToRoles } = require('../hooks/auth')

const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']

class StudentsService extends KnexService {
  async find(params) {
    const query = { ...params?.query }
    if (query.is_deleted === undefined) {
      query.is_deleted = false
    }
    return super.find({ ...params, query })
  }

  async get(id, params) {
    return super.get(id, params)
  }

  _sanitizeStudentData(data, isCreate = false) {
    const clean = { ...data }

    // Remove client-generated temporary ID on create
    if (isCreate) {
      delete clean.id
    }

    if (clean.first_name !== undefined) {
      clean.first_name = String(clean.first_name).trim()
    }
    if (clean.last_name !== undefined) {
      clean.last_name = String(clean.last_name).trim()
    }

    if (isCreate) {
      if (!clean.first_name) throw new BadRequest('El nombre del estudiante es requerido')
      if (!clean.last_name) throw new BadRequest('El apellido del estudiante es requerido')
      clean.institution_id = clean.institution_id || 1
      if (!clean.student_id) {
        clean.student_id = `EST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      } else {
        clean.student_id = String(clean.student_id).trim().toUpperCase()
      }
    } else if (clean.student_id !== undefined) {
      clean.student_id = String(clean.student_id).trim().toUpperCase()
    }

    // Blood type sanitization
    if (clean.blood_type !== undefined) {
      const bt = String(clean.blood_type).trim().toUpperCase()
      if (VALID_BLOOD_TYPES.includes(bt)) {
        clean.blood_type = bt
      } else if (!bt || bt === 'DESCONOCIDO' || bt === 'UNKNOWN') {
        clean.blood_type = 'unknown'
      } else {
        clean.blood_type = 'unknown'
      }
    }

    // Convert empty string numeric IDs and dates to null
    const nullableFields = [
      'user_id', 'city_id', 'state_id', 'country_id', 
      'current_class_id', 'current_grade_id',
      'date_of_birth', 'admission_date', 'graduation_date', 'expected_graduation'
    ]
    for (const field of nullableFields) {
      if (clean[field] === '' || clean[field] === undefined) {
        if (isCreate) clean[field] = null
        else if (clean[field] === '') clean[field] = null
      } else if (['user_id', 'city_id', 'state_id', 'country_id', 'current_class_id', 'current_grade_id'].includes(field)) {
        const parsed = parseInt(clean[field], 10)
        clean[field] = isNaN(parsed) ? null : parsed
      }
    }

    // String fields - convert empty to null or trim
    const stringFields = [
      'middle_name', 'nationality', 'national_id', 'photo_url', 'email_personal',
      'phone_mobile', 'address_line1', 'address_line2', 'postal_code',
      'medical_conditions', 'allergies', 'medications', 'special_needs',
      'disability_info', 'doctor_name', 'doctor_phone', 'insurance_provider',
      'insurance_policy_no', 'emergency_contact_name', 'emergency_contact_phone',
      'emergency_contact_rel', 'religion', 'ethnicity', 'first_language',
      'transport_route', 'scholarship_details', 'notes'
    ]
    for (const field of stringFields) {
      if (clean[field] !== undefined) {
        clean[field] = clean[field] ? String(clean[field]).trim() : null
      }
    }

    // JSON fields
    const jsonFields = ['photo_history', 'socioeconomic_data', 'authorized_pickup', 'medical_data']
    for (const field of jsonFields) {
      if (clean[field] !== undefined && clean[field] !== null) {
        if (typeof clean[field] === 'string') {
          try {
            clean[field] = JSON.parse(clean[field])
          } catch (e) {
            clean[field] = field === 'photo_history' ? [] : {}
          }
        }
        clean[field] = JSON.stringify(clean[field])
      }
    }

    return clean
  }

  async create(data, params) {
    const sanitized = this._sanitizeStudentData(data, true)
    return super.create(sanitized, params)
  }

  async patch(id, data, params) {
    const sanitized = this._sanitizeStudentData(data, false)
    sanitized.updated_at = new Date()
    return super.patch(id, sanitized, params)
  }

  async remove(id, params) {
    return super.patch(id, { is_deleted: true, deleted_at: new Date() }, params)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.students',
    paginate: {
      default: 50,
      max: 200
    }
  }

  app.use('students', new StudentsService(options))

  const service = app.service('students')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'control_estudio')],
      update: [restrictToRoles('admin', 'control_estudio')],
      patch: [restrictToRoles('admin', 'control_estudio', 'teacher')],
      remove: [restrictToRoles('admin', 'control_estudio')]
    }
  })
}
