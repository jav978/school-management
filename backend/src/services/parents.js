const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class ParentsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.parents').where('is_deleted', false)

    if (query.status) {
      knexQuery = knexQuery.where('status', query.status)
    }
    if (query.relationship) {
      knexQuery = knexQuery.where('relationship', query.relationship)
    }

    const parents = await knexQuery.orderBy('last_name', 'asc')

    // Enrich parents with represented students
    const parentIds = parents.map(p => p.id)
    let studentLinks = []
    if (parentIds.length > 0) {
      studentLinks = await db('school.student_parents as sp')
        .join('school.students as s', 'sp.student_id', 's.id')
        .whereIn('sp.parent_id', parentIds)
        .where('sp.is_deleted', false)
        .select(
          'sp.parent_id',
          's.id as student_id',
          's.first_name',
          's.last_name',
          's.student_id as student_code',
          's.section'
        )
    }

    const parentsWithStudents = parents.map(p => {
      const myStudents = studentLinks.filter(l => l.parent_id === p.id)
      return {
        ...p,
        students: myStudents
      }
    })

    return {
      total: parentsWithStudents.length,
      limit: 100,
      skip: 0,
      data: parentsWithStudents
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const parent = await db('school.parents').where({ id, is_deleted: false }).first()
    if (!parent) {
      throw new BadRequest(`Representante con id ${id} no encontrado`)
    }

    const students = await db('school.student_parents as sp')
      .join('school.students as s', 'sp.student_id', 's.id')
      .where('sp.parent_id', id)
      .where('sp.is_deleted', false)
      .select('s.*', 'sp.relationship as link_relationship', 'sp.is_primary')

    return {
      ...parent,
      students
    }
  }

  async create(data, params) {
    const db = this.getModel(params)

    if (!data.first_name) throw new BadRequest('El nombre del representante es requerido')
    if (!data.last_name) throw new BadRequest('El apellido del representante es requerido')
    if (!data.national_id) throw new BadRequest('La cédula o documento de identidad es requerido')

    const nationalId = data.national_id.trim().toUpperCase()
    const existing = await db('school.parents')
      .where({ national_id: nationalId, is_deleted: false })
      .first()
      .catch(() => null)

    if (existing) {
      throw new BadRequest(`Ya existe un representante con el documento ${nationalId}`)
    }

    const parentCode = data.parent_id || `REP-2026-${Date.now().toString().slice(-4)}`

    const payload = {
      uuid: crypto.randomUUID(),
      institution_id: 1,
      parent_id: parentCode,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      national_id: nationalId,
      relationship: data.relationship || 'Representante Legal',
      occupation: data.occupation || null,
      email_primary: data.email_primary ? data.email_primary.trim().toLowerCase() : null,
      phone_mobile: data.phone_mobile || null,
      whatsapp: data.whatsapp || data.phone_mobile || null,
      emergency_contact: data.emergency_contact !== undefined ? Boolean(data.emergency_contact) : true,
      status: 'active',
      created_at: new Date(),
      is_deleted: false,
      version: 1
    }

    const [inserted] = await db('school.parents').insert(payload).returning('*')

    // If student_id is provided, link them
    if (data.student_id) {
      await db('school.student_parents').insert({
        student_id: data.student_id,
        parent_id: inserted.id,
        relationship: data.relationship || 'Representante Legal',
        is_primary: true,
        is_emergency: true,
        can_pickup: true,
        has_custody: true,
        created_at: new Date(),
        is_deleted: false,
        version: 1
      }).catch(() => null)
    }

    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchData = { ...data, updated_at: new Date() }
    delete patchData.students
    delete patchData.student_id

    const [updated] = await db('school.parents').where({ id }).update(patchData).returning('*')

    // If student_id link is requested
    if (data.student_id) {
      const existingLink = await db('school.student_parents').where({ parent_id: id, student_id: data.student_id }).first()
      if (!existingLink) {
        await db('school.student_parents').insert({
          student_id: data.student_id,
          parent_id: id,
          relationship: updated.relationship || 'Representante Legal',
          is_primary: true,
          is_emergency: true,
          can_pickup: true,
          has_custody: true,
          created_at: new Date(),
          is_deleted: false,
          version: 1
        }).catch(() => null)
      }
    }

    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.parents').where({ id }).update({ is_deleted: true, deleted_at: new Date() }).returning('*')
    return removed
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.parents',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('parents', new ParentsService(options))

  const service = app.service('parents')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'parent', 'staff')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'parent', 'staff')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [restrictToRoles('admin', 'control_estudio')]
    }
  })
}
