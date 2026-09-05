const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

class PaymentsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.payments')

    if (query.status) {
      knexQuery = knexQuery.where('status', query.status)
    }
    if (query.payment_type) {
      knexQuery = knexQuery.where('payment_type', query.payment_type)
    }
    if (query.payer_id_card) {
      knexQuery = knexQuery.where('payer_id_card', query.payer_id_card)
    }

    const data = await knexQuery.orderBy([
      { column: 'payment_date', order: 'desc' },
      { column: 'created_date', order: 'desc' }
    ])

    return {
      total: data.length,
      limit: 100,
      skip: 0,
      data
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const payment = await db('school.payments').where('id', id).first()
    if (!payment) {
      throw new BadRequest(`Pago no encontrado con id ${id}`)
    }
    return payment
  }

  async create(data, params) {
    const db = this.getModel(params)

    if (!data.payer_first_name) throw new BadRequest('El nombre del pagador es requerido')
    if (!data.payer_last_name) throw new BadRequest('El apellido del pagador es requerido')
    if (!data.payer_id_card) throw new BadRequest('La cédula o documento de identidad es requerido')
    if (!data.amount) throw new BadRequest('El monto es requerido')
    if (!data.reference_number) throw new BadRequest('El número de referencia es requerido')

    const id = data.id || `PAY-${Date.now().toString().slice(-6)}`
    
    // Check reference duplication
    const existing = await db('school.payments')
      .where({ reference_number: data.reference_number })
      .first()
      .catch(() => null)

    if (existing) {
      throw new BadRequest(`Ya existe un pago registrado con el número de referencia ${data.reference_number}`)
    }

    let paymentType = data.payment_type || 'pago movil'
    const validTypes = ['pago movil', 'transferencia', 'efectivo', 'otro']
    if (!validTypes.includes(paymentType)) {
      paymentType = 'transferencia'
    }

    let status = data.status || 'verificado'
    const validStatuses = ['pendiente', 'verificado', 'rechazado']
    if (!validStatuses.includes(status)) {
      status = 'verificado'
    }

    const payload = {
      id,
      payer_first_name: data.payer_first_name.trim(),
      payer_last_name: data.payer_last_name.trim(),
      payer_id_card: data.payer_id_card.trim().toUpperCase(),
      payer_phone: data.payer_phone || null,
      payment_type: paymentType,
      bank_name: data.bank_name || 'Banesco',
      reference_number: data.reference_number.trim(),
      amount: Number(data.amount),
      payment_date: data.payment_date || new Date().toISOString().split('T')[0],
      receipt_image_url: data.receipt_image_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
      status,
      admin_notes: data.admin_notes || null,
      created_date: new Date()
    }

    const [inserted] = await db('school.payments').insert(payload).returning('*')
    return inserted
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchData = { ...data, updated_date: new Date() }
    const [updated] = await db('school.payments').where({ id }).update(patchData).returning('*')
    return updated
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const existing = await db('school.payments').where({ id }).first()
    await db('school.payments').where({ id }).del()
    return existing
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.payments',
    paginate: {
      default: 50,
      max: 100
    }
  }

  app.use('payments', new PaymentsService(options))

  const service = app.service('payments')

  service.hooks({
    before: {
      all: [authenticateHook],
      find: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'parent', 'staff')],
      get: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'teacher', 'parent', 'staff')],
      create: [restrictToRoles('admin', 'control_estudio', 'coordinator', 'parent')],
      update: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      patch: [restrictToRoles('admin', 'control_estudio', 'coordinator')],
      remove: [restrictToRoles('admin', 'control_estudio')]
    }
  })
}
