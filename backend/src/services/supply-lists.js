const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')

class SupplyListsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    const isDeleted = query.is_deleted !== undefined ? query.is_deleted : false
    delete query.is_deleted

    let q = db('school.supply_lists').where({ is_deleted: isDeleted })

    if (query.academic_year_name) {
      q = q.where({ academic_year_name: query.academic_year_name })
    }
    if (query.grade_level) {
      q = q.where({ grade_level: query.grade_level })
    }
    if (query.education_level) {
      q = q.where({ education_level: query.education_level })
    }
    if (query.is_published !== undefined) {
      q = q.where({ is_published: Boolean(query.is_published) })
    }

    q = q.orderBy('id', 'asc')

    const lists = await q

    // Fetch items for all matching lists
    const listIds = lists.map(l => l.id)
    let itemsByListId = {}
    if (listIds.length > 0) {
      const items = await db('school.supply_items')
        .whereIn('list_id', listIds)
        .where({ is_deleted: false })
        .orderBy('order_index', 'asc')

      for (const item of items) {
        if (!itemsByListId[item.list_id]) {
          itemsByListId[item.list_id] = []
        }
        itemsByListId[item.list_id].push(item)
      }
    }

    return lists.map(l => ({
      ...l,
      items: itemsByListId[l.id] || []
    }))
  }

  async get(id, params) {
    const db = this.getModel(params)
    const list = await db('school.supply_lists')
      .where({ id, is_deleted: false })
      .first()

    if (!list) {
      throw new BadRequest(`Lista de útiles escolares con id ${id} no encontrada`)
    }

    const items = await db('school.supply_items')
      .where({ list_id: id, is_deleted: false })
      .orderBy('order_index', 'asc')

    return {
      ...list,
      items: items || []
    }
  }

  async create(data, params) {
    const db = this.getModel(params)

    // Clonación de lista
    if (data.action === 'clone') {
      const { source_list_id, target_academic_year, target_grade_level, target_grade_name } = data
      const source = await db('school.supply_lists').where({ id: source_list_id, is_deleted: false }).first()
      if (!source) {
        throw new BadRequest('Lista origen para clonar no encontrada.')
      }

      const sourceItems = await db('school.supply_items').where({ list_id: source_list_id, is_deleted: false }).orderBy('order_index', 'asc')

      const [newList] = await db('school.supply_lists').insert({
        institution_id: source.institution_id || 1,
        academic_year_name: target_academic_year || source.academic_year_name,
        grade_level: target_grade_level || source.grade_level,
        grade_name: target_grade_name || source.grade_name,
        education_level: source.education_level,
        title: `LISTA ESCOLAR ${target_academic_year || source.academic_year_name} - ${target_grade_name || source.grade_name}`.toUpperCase(),
        general_notes: source.general_notes,
        delivery_instructions: source.delivery_instructions,
        is_published: true,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      }).returning('*')

      if (sourceItems.length > 0) {
        const clonedItems = sourceItems.map(item => ({
          list_id: newList.id,
          category: item.category,
          item_name: item.item_name,
          specification: item.specification,
          quantity: item.quantity,
          unit: item.unit,
          is_mandatory: item.is_mandatory,
          order_index: item.order_index,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        }))
        await db('school.supply_items').insert(clonedItems)
      }

      return this.get(newList.id, params)
    }

    const {
      grade_level,
      grade_name,
      education_level,
      academic_year_name = '2026-2027',
      title,
      general_notes,
      delivery_instructions,
      is_published = true,
      items = []
    } = data

    if (!grade_level) throw new BadRequest('El grado/año es requerido.')
    if (!grade_name) throw new BadRequest('El nombre del grado es requerido.')

    const [newList] = await db('school.supply_lists').insert({
      institution_id: 1,
      academic_year_name,
      grade_level,
      grade_name,
      education_level: education_level || 'media_general',
      title: title || `LISTA ESCOLAR ${academic_year_name} - ${grade_name}`.toUpperCase(),
      general_notes: general_notes || 'TODOS LOS ÚTILES DEBEN ESTAR DEBIDAMENTE FORRADOS E IDENTIFICADOS.',
      delivery_instructions: delivery_instructions || null,
      is_published: Boolean(is_published),
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }).returning('*')

    if (Array.isArray(items) && items.length > 0) {
      const itemsToInsert = items.map((it, idx) => ({
        list_id: newList.id,
        category: it.category || 'stationery',
        item_name: it.item_name,
        specification: it.specification || null,
        quantity: it.quantity || '1',
        unit: it.unit || 'unidad',
        is_mandatory: it.is_mandatory !== undefined ? Boolean(it.is_mandatory) : true,
        order_index: it.order_index !== undefined ? it.order_index : idx + 1,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      }))
      await db('school.supply_items').insert(itemsToInsert)
    }

    return this.get(newList.id, params)
  }

  async patch(id, data, params) {
    const db = this.getModel(params)

    const list = await db('school.supply_lists').where({ id, is_deleted: false }).first()
    if (!list) {
      throw new BadRequest(`Lista escolar con id ${id} no encontrada`)
    }

    const updatePayload = {}
    const allowedFields = [
      'academic_year_name', 'grade_level', 'grade_name', 'education_level',
      'title', 'general_notes', 'delivery_instructions', 'is_published'
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updatePayload[field] = data[field]
      }
    }

    updatePayload.updated_at = db.fn.now()

    await db('school.supply_lists').where({ id }).update(updatePayload)

    // Si se enviaron items en el patch, sincronizar
    if (Array.isArray(data.items)) {
      // Borrar anteriores y reinsertar ordenados
      await db('school.supply_items').where({ list_id: id }).delete()

      if (data.items.length > 0) {
        const itemsToInsert = data.items.map((it, idx) => ({
          list_id: id,
          category: it.category || 'stationery',
          item_name: it.item_name,
          specification: it.specification || null,
          quantity: it.quantity || '1',
          unit: it.unit || 'unidad',
          is_mandatory: it.is_mandatory !== undefined ? Boolean(it.is_mandatory) : true,
          order_index: it.order_index !== undefined ? it.order_index : idx + 1,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        }))
        await db('school.supply_items').insert(itemsToInsert)
      }
    }

    return this.get(id, params)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    await db('school.supply_lists').where({ id }).update({
      is_deleted: true,
      updated_at: db.fn.now()
    })
    return { id, success: true, message: 'Lista eliminada lógicamente.' }
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.supply_lists',
    paginate: app.get('paginate')
  }

  app.use('supply-lists', new SupplyListsService(options, app))
}
