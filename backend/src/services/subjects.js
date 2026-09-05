const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class SubjectsService extends KnexService {
  async find(params) {
    // If not specified, exclude soft-deleted items if column exists
    return super.find(params)
  }

  async get(id, params) {
    return super.get(id, params)
  }

  async create(data, params) {
    // Sanitization & Validation
    const name = data.name ? String(data.name).trim() : ''
    const code = data.code ? String(data.code).trim().toUpperCase() : ''
    
    if (!name) {
      throw new BadRequest('El nombre de la materia es requerido')
    }
    if (!code) {
      throw new BadRequest('El código de la materia es requerido')
    }

    const sanitizedData = {
      ...data,
      name,
      code,
      grade_level: data.grade_level ? String(data.grade_level).trim() : null,
      description: data.description ? String(data.description).trim() : null,
      credits: data.credits !== undefined && data.credits !== '' ? Number(data.credits) : 0,
      hours_per_week: data.hours_per_week !== undefined && data.hours_per_week !== '' ? Number(data.hours_per_week) : 4,
      institution_id: data.institution_id || 1,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      color_hex: data.color_hex || '#3B82F6'
    }

    // Check duplicate code
    const db = this.getModel(params)
    const existing = await db('school.subjects')
      .where({ code, is_deleted: false })
      .first()
      .catch(() => null)

    if (existing) {
      throw new BadRequest(`Ya existe una materia con el código ${code}`)
    }

    return super.create(sanitizedData, params)
  }

  async patch(id, data, params) {
    const patchData = { ...data }
    if (patchData.name !== undefined) {
      patchData.name = String(patchData.name).trim()
      if (!patchData.name) throw new BadRequest('El nombre no puede estar vacío')
    }
    if (patchData.code !== undefined) {
      patchData.code = String(patchData.code).trim().toUpperCase()
      if (!patchData.code) throw new BadRequest('El código no puede estar vacío')
    }
    if (patchData.grade_level !== undefined && patchData.grade_level !== null) {
      patchData.grade_level = String(patchData.grade_level).trim()
    }
    if (patchData.description !== undefined && patchData.description !== null) {
      patchData.description = String(patchData.description).trim()
    }
    if (patchData.credits !== undefined) {
      patchData.credits = Number(patchData.credits) || 0
    }

    return super.patch(id, patchData, params)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    
    // Check if subject is associated with classes or schedules
    const classSubject = await db('school.class_subjects')
      .where({ subject_id: id })
      .first()
      .catch(() => null)

    if (classSubject) {
      throw new BadRequest('No se puede eliminar la materia porque tiene clases o secciones asociadas. Desasigne las clases primero.')
    }

    const schedule = await db('school.schedules')
      .where({ subject_id: id })
      .first()
      .catch(() => null)

    if (schedule) {
      throw new BadRequest('No se puede eliminar la materia porque tiene horarios asignados.')
    }

    return super.remove(id, params)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.subjects',
    paginate: {
      default: 20,
      max: 100
    }
  }

  app.use('subjects', new SubjectsService(options))

  const service = app.service('subjects')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
