const { KnexService } = require('@feathersjs/knex')
const { BadRequest } = require('@feathersjs/errors')
const crypto = require('crypto')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

const ALLOWED_COLUMNS = [
  'id', 'payer_first_name', 'payer_last_name', 'payer_id_card',
  'payer_phone', 'payer_email', 'amount', 'currency', 'amount_bs',
  'exchange_rate', 'payment_method', 'payment_type', 'reference_number',
  'bank_origin', 'bank_destination', 'payment_date', 'status', 'notes',
  'student_id', 'created_date', 'is_deleted', 'deleted_at', 'created_at', 'updated_at'
]

function sanitizePayload(raw) {
  const clean = {}
  for (const col of ALLOWED_COLUMNS) {
    if (raw[col] !== undefined) {
      clean[col] = raw[col]
    }
  }
  return clean
}

function formatPaymentResponse(record) {
  if (!record) return record
  return {
    ...record,
    bank_name: record.bank_origin || '',
    admin_notes: record.notes || ''
  }
}

class PaymentsService extends KnexService {
  async find(params) {
    const db = this.getModel(params)
    const query = { ...params?.query }

    let knexQuery = db('school.payments').where(function() {
      this.where('is_deleted', false).orWhereNull('is_deleted')
    })

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
      { column: 'created_at', order: 'desc' }
    ])

    return {
      total: data.length,
      limit: 100,
      skip: 0,
      data: data.map(formatPaymentResponse)
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const payment = await db('school.payments').where('id', id).first()
    if (!payment || payment.is_deleted) {
      throw new BadRequest(`Pago no encontrado con id ${id}`)
    }
    return formatPaymentResponse(payment)
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

    if (existing && !existing.is_deleted) {
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

    // Role security: Parents can never self-verify payments; they are strictly 'pendiente'
    const callerRole = params?.user?.role || data?.caller_role
    if (callerRole === 'parent') {
      status = 'pendiente'
    }

    const rawPayload = {
      id,
      payer_first_name: data.payer_first_name.trim(),
      payer_last_name: data.payer_last_name.trim(),
      payer_id_card: data.payer_id_card.trim().toUpperCase(),
      payer_phone: data.payer_phone || null,
      payer_email: data.payer_email || null,
      amount: Number(data.amount),
      currency: data.currency || 'USD',
      payment_method: data.payment_method || (paymentType === 'pago movil' ? 'pago_movil' : paymentType),
      payment_type: paymentType,
      reference_number: data.reference_number.trim(),
      bank_origin: data.bank_origin || data.bank_name || 'Banesco',
      payment_date: data.payment_date || new Date().toISOString().split('T')[0],
      status,
      notes: data.notes || data.admin_notes || null,
      is_deleted: false,
      created_date: new Date().toISOString().split('T')[0],
      created_at: new Date(),
      updated_at: new Date()
    }

    const payload = sanitizePayload(rawPayload)
    const [inserted] = await db('school.payments').insert(payload).returning('*')
    return formatPaymentResponse(inserted)
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const patchRaw = { ...data }
    if (patchRaw.bank_name !== undefined && patchRaw.bank_origin === undefined) {
      patchRaw.bank_origin = patchRaw.bank_name
    }
    if (patchRaw.admin_notes !== undefined && patchRaw.notes === undefined) {
      patchRaw.notes = patchRaw.admin_notes
    }
    patchRaw.updated_at = new Date()

    const patchData = sanitizePayload(patchRaw)
    const [updated] = await db('school.payments').where({ id }).update(patchData).returning('*')
    return formatPaymentResponse(updated)
  }

  async remove(id, params) {
    const db = this.getModel(params)
    const existing = await db('school.payments').where({ id }).first()
    if (!existing) {
      throw new BadRequest(`Pago no encontrado con id ${id}`)
    }
    await db('school.payments').where({ id }).update({
      is_deleted: true,
      deleted_at: new Date(),
      updated_at: new Date()
    })
    return formatPaymentResponse(existing)
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
