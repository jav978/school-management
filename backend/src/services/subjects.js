const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_SUBJECT_COLUMNS = new Set([
  'institution_id', 'category_id', 'code', 'name', 'short_name',
  'description', 'color_hex', 'icon_url', 'credits', 'hours_per_week',
  'is_elective', 'is_active', 'syllabus_url', 'grade_level',
  'is_deleted', 'deleted_at', 'updated_at'
])

function _enrichSubject(sub) {
  if (!sub) return sub
  let dept = 'Ciencias Naturales y Exactas'
  const nameLower = (sub.name || '').toLowerCase()
  if (nameLower.includes('matemática') || nameLower.includes('calculo') || nameLower.includes('álgebra')) {
    dept = 'Matemática y Lógica'
  } else if (nameLower.includes('lengua') || nameLower.includes('literatura') || nameLower.includes('castellano') || nameLower.includes('inglés') || nameLower.includes('historia')) {
    dept = 'Lengua, Humanidades y Arte'
  } else if (nameLower.includes('educación física') || nameLower.includes('valores') || nameLower.includes('religión') || nameLower.includes('fe')) {
    dept = 'Formación Integral y Valores'
  }

  return {
    ...sub,
    category_name: sub.category_name || dept,
    department: sub.category_name || dept,
    teacher_name: sub.teacher_name || 'Profesor Asignado'
  }
}

class SubjectsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.subjects').where('is_deleted', false)

    if (query.grade_level) {
      knexQuery = knexQuery.where('grade_level', query.grade_level)
    }
    if (query.is_active !== undefined) {
      const activeBool = query.is_active === 'true' || query.is_active === true
      knexQuery = knexQuery.where('is_active', activeBool)
    }
    if (query.code) {
      knexQuery = knexQuery.where('code', String(query.code).toUpperCase().trim())
    }

    const items = await knexQuery.orderBy('name', 'asc')
    const enriched = items.map(_enrichSubject)

    return {
      total: enriched.length,
      limit: 100,
      skip: 0,
      data: enriched
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const sub = await db('school.subjects').where({ id, is_deleted: false }).first()
    if (!sub) {
      throw new BadRequest(`Materia con id ${id} no encontrada`)
    }
    return _enrichSubject(sub)
  }

  _sanitizeSubjectData(data, isCreate = false) {
    const raw = { ...data }
    const clean = {}

    if (isCreate) {
      delete raw.id
      clean.institution_id = raw.institution_id || 1
      if (!raw.name?.trim()) {
        throw new BadRequest('El nombre de la materia es requerido')
      }
      if (!raw.code?.trim()) {
        throw new BadRequest('El código de la materia es requerido')
      }
      clean.code = String(raw.code).trim().toUpperCase()
      clean.name = String(raw.name).trim()
    } else {
      if (raw.code !== undefined) {
        clean.code = String(raw.code).trim().toUpperCase()
        if (!clean.code) throw new BadRequest('El código no puede estar vacío')
      }
      if (raw.name !== undefined) {
        clean.name = String(raw.name).trim()
        if (!clean.name) throw new BadRequest('El nombre no puede estar vacío')
      }
    }

    if (raw.short_name !== undefined) clean.short_name = raw.short_name ? String(raw.short_name).trim() : null
    if (raw.description !== undefined) clean.description = raw.description ? String(raw.description).trim() : null
    if (raw.grade_level !== undefined) clean.grade_level = raw.grade_level ? String(raw.grade_level).trim() : null
    if (raw.color_hex !== undefined) clean.color_hex = raw.color_hex ? String(raw.color_hex).trim() : '#3B82F6'
    if (raw.credits !== undefined) clean.credits = raw.credits !== '' ? Number(raw.credits) : 0
    if (raw.hours_per_week !== undefined) clean.hours_per_week = raw.hours_per_week !== '' ? Number(raw.hours_per_week) : 4
    if (raw.is_active !== undefined) clean.is_active = Boolean(raw.is_active)
    if (raw.is_elective !== undefined) clean.is_elective = Boolean(raw.is_elective)

    // Filter to whitelisted columns
    const filtered = {}
    for (const key of Object.keys(clean)) {
      if (ALLOWED_SUBJECT_COLUMNS.has(key)) {
        filtered[key] = clean[key]
      }
    }
    return filtered
  }

  async create(data, params) {
    const sanitized = this._sanitizeSubjectData(data, true)
    const db = this.getModel(params)

    // Check duplicate code
    const existing = await db('school.subjects')
      .where({ code: sanitized.code, is_deleted: false })
      .first()

    if (existing) {
      throw new BadRequest(`Ya existe una materia con el código ${sanitized.code}`)
    }

    const created = await super.create(sanitized, params)
    return _enrichSubject(created)
  }

  async patch(id, data, params) {
    const sanitized = this._sanitizeSubjectData(data, false)
    sanitized.updated_at = new Date()
    const patched = await super.patch(id, sanitized, params)
    return _enrichSubject(patched)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    await db('school.subjects').where({ id }).update({
      is_deleted: true,
      is_active: false,
      deleted_at: new Date()
    })
    return { id, is_deleted: true }
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.subjects',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('subjects', new SubjectsService(options))

  const service = app.service('subjects')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent', 'staff')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'student', 'parent', 'staff')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [restrictToRoles('admin', 'control_estudio', 'coordinator')]
    }
  })
}
