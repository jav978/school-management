const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_PARENT_COLUMNS = new Set([
  'user_id', 'institution_id', 'first_name', 'middle_name', 'last_name',
  'date_of_birth', 'gender', 'national_id', 'photo_url', 'email_primary',
  'email_secondary', 'phone_mobile', 'phone_home', 'phone_work', 'whatsapp',
  'address_line1', 'address_line2', 'city_id', 'state_id', 'country_id',
  'postal_code', 'occupation', 'employer', 'work_address', 'annual_income_range',
  'education_level', 'marital_status', 'preferred_contact', 'preferred_language',
  'notes', 'status', 'is_deleted', 'deleted_at', 'deleted_by', 'updated_at',
  'updated_by', 'id_type', 'id_number'
])

class ParentsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.parents').where('is_deleted', false)

    if (query.status) {
      knexQuery = knexQuery.where('status', query.status)
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
          'sp.relationship as link_relationship',
          's.id as student_id',
          's.first_name',
          's.last_name',
          's.student_id as student_code'
        )
    }

    const parentsWithStudents = parents.map(p => {
      const myStudents = studentLinks.filter(l => l.parent_id === p.id)
      let relationship = 'Padre'
      let emergencyContact = true
      let parentCode = `REP-${String(p.id).padStart(4, '0')}`

      if (p.notes) {
        try {
          const parsed = JSON.parse(p.notes)
          if (parsed.relationship) relationship = parsed.relationship
          if (parsed.emergency_contact !== undefined) emergencyContact = parsed.emergency_contact
          if (parsed.parent_id) parentCode = parsed.parent_id
        } catch (_) {
          if (p.notes.includes('Parentesco:')) {
            const m = p.notes.match(/Parentesco:\s*([^|;\n]+)/)
            if (m) relationship = m[1].trim()
          }
        }
      }
      if (myStudents.length > 0 && myStudents[0].link_relationship) {
        relationship = myStudents[0].link_relationship
      }

      return {
        ...p,
        full_name: `${p.first_name} ${p.last_name}`.trim(),
        parent_id: parentCode,
        relationship,
        emergency_contact: emergencyContact,
        students: myStudents
      }
    })

    // If filtered by relationship
    let resultData = parentsWithStudents
    if (query.relationship) {
      resultData = resultData.filter(p => p.relationship === query.relationship)
    }

    return {
      total: resultData.length,
      limit: 100,
      skip: 0,
      data: resultData
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

    let relationship = 'Padre'
    let emergencyContact = true
    let parentCode = `REP-${String(parent.id).padStart(4, '0')}`
    if (parent.notes) {
      try {
        const parsed = JSON.parse(parent.notes)
        if (parsed.relationship) relationship = parsed.relationship
        if (parsed.emergency_contact !== undefined) emergencyContact = parsed.emergency_contact
        if (parsed.parent_id) parentCode = parsed.parent_id
      } catch (_) {}
    }
    if (students.length > 0 && students[0].link_relationship) {
      relationship = students[0].link_relationship
    }

    return {
      ...parent,
      full_name: `${parent.first_name} ${parent.last_name}`.trim(),
      parent_id: parentCode,
      relationship,
      emergency_contact: emergencyContact,
      students
    }
  }

  async create(data, params) {
    const db = this.getModel(params)

    if (!data.first_name) throw new BadRequest('El nombre del representante es requerido')
    if (!data.last_name) throw new BadRequest('El apellido del representante es requerido')
    if (!data.national_id && !data.id_number) throw new BadRequest('La cédula o documento de identidad es requerido')

    let idType = (data.id_type || 'V').trim().toUpperCase()
    let idNumber = (data.id_number || '').trim()
    let nationalId = (data.national_id || '').trim().toUpperCase()

    if (!nationalId && idNumber) {
      nationalId = `${idType}-${idNumber}`
    } else if (nationalId) {
      if (nationalId.includes('-')) {
        const parts = nationalId.split('-')
        idType = parts[0].toUpperCase()
        idNumber = parts.slice(1).join('-')
      } else {
        const firstChar = nationalId[0]
        if (['V', 'E', 'P', 'J'].includes(firstChar)) {
          idType = firstChar
          idNumber = nationalId.slice(1)
        } else {
          const num = parseInt(nationalId, 10)
          idType = (!isNaN(num) && num >= 80000000) ? 'E' : 'V'
          idNumber = nationalId
        }
        nationalId = `${idType}-${idNumber}`
      }
    }

    const existing = await db('school.parents')
      .where({ national_id: nationalId, is_deleted: false })
      .first()
      .catch(() => null)

    if (existing) {
      throw new BadRequest(`Ya existe un representante con el documento ${nationalId}`)
    }

    const parentCode = data.parent_id || `REP-2026-${Date.now().toString().slice(-4)}`
    const relationship = data.relationship || 'Padre'
    const emergencyContact = data.emergency_contact !== undefined ? Boolean(data.emergency_contact) : true

    const meta = {
      parent_id: parentCode,
      relationship,
      emergency_contact: emergencyContact
    }

    const payload = {
      uuid: crypto.randomUUID(),
      institution_id: 1,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      id_type: idType,
      id_number: idNumber,
      national_id: nationalId,
      occupation: data.occupation || null,
      email_primary: data.email_primary ? data.email_primary.trim().toLowerCase() : null,
      phone_mobile: data.phone_mobile || null,
      whatsapp: data.whatsapp || data.phone_mobile || null,
      notes: JSON.stringify(meta),
      status: 'active',
      created_at: new Date(),
      is_deleted: false,
      version: 1
    }

    const [inserted] = await db('school.parents').insert(payload).returning('*')

    // If student_id is provided, link them
    let linkedStudents = []
    if (data.student_id) {
      await db('school.student_parents').insert({
        student_id: data.student_id,
        parent_id: inserted.id,
        relationship,
        is_primary: true,
        is_emergency: emergencyContact,
        can_pickup: true,
        has_custody: true,
        created_at: new Date(),
        is_deleted: false,
        version: 1
      }).catch(() => null)

      const s = await db('school.students').where({ id: data.student_id }).first().catch(() => null)
      if (s) {
        linkedStudents.push({
          student_id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          student_code: s.student_id
        })
      }
    }

    return {
      ...inserted,
      full_name: `${inserted.first_name} ${inserted.last_name}`.trim(),
      parent_id: parentCode,
      relationship,
      emergency_contact: emergencyContact,
      students: linkedStudents
    }
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const existing = await db('school.parents').where({ id, is_deleted: false }).first()
    if (!existing) throw new BadRequest(`Representante con id ${id} no encontrado`)

    let meta = {}
    if (existing.notes) {
      try { meta = JSON.parse(existing.notes) } catch (_) {}
    }
    if (data.relationship) meta.relationship = data.relationship
    if (data.emergency_contact !== undefined) meta.emergency_contact = Boolean(data.emergency_contact)
    if (data.parent_id) meta.parent_id = data.parent_id

    const patchData = { ...data, updated_at: new Date(), notes: JSON.stringify(meta) }
    delete patchData.students
    delete patchData.student_id
    delete patchData.parent_id
    delete patchData.relationship
    delete patchData.emergency_contact
    delete patchData.full_name

    if (patchData.national_id || patchData.id_number) {
      let idType = (patchData.id_type || existing.id_type || 'V').trim().toUpperCase()
      let idNumber = (patchData.id_number || existing.id_number || '').trim()
      let nationalId = (patchData.national_id || '').trim().toUpperCase()

      if (!nationalId && idNumber) {
        nationalId = `${idType}-${idNumber}`
      } else if (nationalId) {
        if (nationalId.includes('-')) {
          const parts = nationalId.split('-')
          idType = parts[0].toUpperCase()
          idNumber = parts.slice(1).join('-')
        } else {
          const firstChar = nationalId[0]
          if (['V', 'E', 'P', 'J'].includes(firstChar)) {
            idType = firstChar
            idNumber = nationalId.slice(1)
          } else {
            const num = parseInt(nationalId, 10)
            idType = (!isNaN(num) && num >= 80000000) ? 'E' : 'V'
            idNumber = nationalId
          }
          nationalId = `${idType}-${idNumber}`
        }
      }
      patchData.id_type = idType
      patchData.id_number = idNumber
      patchData.national_id = nationalId
    }

    const cleanPatch = {}
    for (const [key, val] of Object.entries(patchData)) {
      if (ALLOWED_PARENT_COLUMNS.has(key)) {
        cleanPatch[key] = val
      }
    }
    cleanPatch.updated_at = new Date()

    const [updated] = await db('school.parents').where({ id }).update(cleanPatch).returning('*')

    // If student_id link is requested
    if (data.student_id) {
      const existingLink = await db('school.student_parents').where({ parent_id: id, student_id: data.student_id }).first()
      if (!existingLink) {
        await db('school.student_parents').insert({
          student_id: data.student_id,
          parent_id: id,
          relationship: meta.relationship || 'Padre',
          is_primary: true,
          is_emergency: meta.emergency_contact !== undefined ? meta.emergency_contact : true,
          can_pickup: true,
          has_custody: true,
          created_at: new Date(),
          is_deleted: false,
          version: 1
        }).catch(() => null)
      }
    }

    return {
      ...updated,
      full_name: `${updated.first_name} ${updated.last_name}`.trim(),
      parent_id: meta.parent_id || `REP-${String(id).padStart(4, '0')}`,
      relationship: meta.relationship || 'Padre',
      emergency_contact: meta.emergency_contact !== undefined ? meta.emergency_contact : true
    }
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const [removed] = await db('school.parents').where({ id }).update({ is_deleted: true, status: 'inactive', deleted_at: new Date() }).returning('*')
    await db('school.student_parents').where({ parent_id: id }).update({ is_deleted: true, deleted_at: new Date() }).catch(() => null)
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
