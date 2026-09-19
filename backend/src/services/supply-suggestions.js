const { KnexService } = require('@feathersjs/knex')
const { BadRequest, NotFound } = require('@feathersjs/errors')

class SupplySuggestionsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    const isDeleted = query.is_deleted !== undefined ? query.is_deleted : false
    delete query.is_deleted

    let q = db('school.supply_suggestions as ss')
      .join('school.supply_lists as sl', 'sl.id', 'ss.list_id')
      .where({ 'ss.is_deleted': isDeleted })
      .select(
        'ss.*',
        'sl.grade_name',
        'sl.grade_level',
        'sl.education_level',
        'sl.academic_year_name',
        'sl.title as list_title'
      )

    if (query.list_id) {
      q = q.where({ 'ss.list_id': query.list_id })
    }
    if (query.status) {
      q = q.where({ 'ss.status': query.status })
    }
    if (query.user_id) {
      q = q.where({ 'ss.user_id': query.user_id })
    }

    q = q.orderBy('ss.created_at', 'desc')

    const rows = await q
    return rows
  }

  async get(id, params) {
    const db = this.getModel(params)
    const suggestion = await db('school.supply_suggestions as ss')
      .join('school.supply_lists as sl', 'sl.id', 'ss.list_id')
      .where({ 'ss.id': id, 'ss.is_deleted': false })
      .select(
        'ss.*',
        'sl.grade_name',
        'sl.grade_level',
        'sl.education_level',
        'sl.academic_year_name',
        'sl.title as list_title'
      )
      .first()

    if (!suggestion) {
      throw new NotFound(`Sugerencia con id ${id} no encontrada`)
    }

    return suggestion
  }

  async create(data, params) {
    const db = this.getModel(params)
    const {
      list_id,
      suggestion_text,
      suggested_item_name,
      suggested_category
    } = data

    if (!list_id) {
      throw new BadRequest('El identificador de la lista (list_id) es obligatorio.')
    }
    if (!suggestion_text || !suggestion_text.trim()) {
      throw new BadRequest('El texto de la sugerencia u observación es obligatorio.')
    }

    // Verificar si la lista existe y si allow_suggestions está activo
    const list = await db('school.supply_lists')
      .where({ id: list_id, is_deleted: false })
      .first()

    if (!list) {
      throw new NotFound(`Lista de útiles con id ${list_id} no encontrada.`)
    }

    if (list.allow_suggestions === false) {
      throw new BadRequest('El buzón de sugerencias para esta lista de útiles se encuentra actualmente cerrado por la administración.')
    }

    const user = params?.user || {}
    const userName = data.user_name || (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null) || 'Representante'
    const userEmail = data.user_email || user.email || null
    const userRole = data.user_role || user.role || 'parent'
    const userId = user.id || data.user_id || null

    const [created] = await db('school.supply_suggestions').insert({
      list_id,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      user_role: userRole,
      suggested_item_name: suggested_item_name ? suggested_item_name.trim() : null,
      suggested_category: suggested_category || 'stationery',
      suggestion_text: suggestion_text.trim(),
      status: 'pending',
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }).returning('*')

    return this.get(created.id, params)
  }

  async patch(id, data, params) {
    const db = this.getModel(params)

    const existing = await db('school.supply_suggestions')
      .where({ id, is_deleted: false })
      .first()

    if (!existing) {
      throw new NotFound(`Sugerencia con id ${id} no encontrada`)
    }

    // Acción especial: Incorporar automáticamente a la lista oficial
    if (data.action === 'incorporate') {
      const listId = existing.list_id

      // Obtener el máximo order_index de la lista
      const maxOrderRow = await db('school.supply_items')
        .where({ list_id: listId, is_deleted: false })
        .max('order_index as max_order')
        .first()

      const nextOrder = (maxOrderRow?.max_order || 0) + 1

      const itemName = data.item_name || existing.suggested_item_name || existing.suggestion_text.substring(0, 100)
      const category = data.category || existing.suggested_category || 'stationery'
      const specification = data.specification || 'Aprobado e incorporado por Coordinación'
      const quantity = data.quantity || '1'
      const unit = data.unit || 'unidad'

      const [newItem] = await db('school.supply_items').insert({
        list_id: listId,
        category,
        item_name: itemName,
        specification,
        quantity,
        unit,
        is_mandatory: data.is_mandatory !== undefined ? Boolean(data.is_mandatory) : true,
        order_index: nextOrder,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      }).returning('*')

      const adminNotes = data.admin_notes || `Aceptada e incorporada a la lista oficial como: ${itemName}`

      await db('school.supply_suggestions').where({ id }).update({
        status: 'accepted',
        admin_notes: adminNotes,
        updated_at: db.fn.now()
      })

      const updatedSuggestion = await this.get(id, params)
      return {
        suggestion: updatedSuggestion,
        incorporated_item: newItem,
        message: `El artículo "${itemName}" fue incorporado con éxito a la lista oficial.`
      }
    }

    // Actualización de estado y notas administrativas estándar
    const updatePayload = {}
    if (data.status) {
      updatePayload.status = data.status
    }
    if (data.admin_notes !== undefined) {
      updatePayload.admin_notes = data.admin_notes
    }
    updatePayload.updated_at = db.fn.now()

    await db('school.supply_suggestions').where({ id }).update(updatePayload)
    return this.get(id, params)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    await db('school.supply_suggestions').where({ id }).update({
      is_deleted: true,
      updated_at: db.fn.now()
    })
    return { id, success: true, message: 'Sugerencia eliminada lógicamente.' }
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.supply_suggestions',
    paginate: app.get('paginate')
  }

  app.use('supply-suggestions', new SupplySuggestionsService(options, app))
}
