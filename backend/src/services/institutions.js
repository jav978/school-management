const { KnexService } = require('@feathersjs/knex')
const { BadRequest, NotFound } = require('@feathersjs/errors')
const { authenticateHook, restrictToRoles } = require('../hooks/auth')

function _enrichInstitution(inst) {
  if (!inst) return inst
  let settings = inst.settings || {}
  if (typeof settings === 'string') {
    try {
      settings = JSON.parse(settings)
    } catch (_) {
      settings = {}
    }
  }

  const deaCode = inst.accreditation_no || settings.dea_code || 'S0098D0101'
  const systemSubtitle = settings.system_subtitle || 'Gestión Escolar'
  const statisticalCode = settings.statistical_code || '10845'
  const educationalZone = settings.educational_zone || 'DISTRITO CAPITAL'
  const dependency = settings.dependency || 'Privada Subvencionada por MPPE'
  const officialSealUrl = settings.official_seal_url || null
  const signatures = settings.signatures || [
    { role: 'Directora', name: 'Sor María Dolores Amaya', title: 'Directora General', id_card: 'V-6.241.890', signature_url: null },
    { role: 'Control de Estudios', name: 'Prof. Elena Vargas', title: 'Control de Estudios', id_card: 'V-11.458.789', signature_url: null },
    { role: 'Docente Guía', name: 'Prof. Carlos Mendoza', title: 'Docente Guía', id_card: 'V-14.890.123', signature_url: null }
  ]

  return {
    ...inst,
    rif: inst.tax_id,
    dea_code: deaCode,
    system_subtitle: systemSubtitle,
    statistical_code: statisticalCode,
    educational_zone: educationalZone,
    dependency: dependency,
    official_seal_url: officialSealUrl,
    signatures: signatures,
    settings: {
      ...settings,
      dea_code: deaCode,
      system_subtitle: systemSubtitle,
      statistical_code: statisticalCode,
      educational_zone: educationalZone,
      dependency: dependency,
      official_seal_url: officialSealUrl,
      signatures: signatures
    }
  }
}

class InstitutionsService extends KnexService {
  setup(app) {
    this.app = app
  }

  async find(params) {
    const db = this.getModel(params)
    const items = await db('school.institutions').where({ is_deleted: false }).orderBy('id', 'asc')
    const enriched = items.map(_enrichInstitution)
    return {
      total: enriched.length,
      limit: 10,
      skip: 0,
      data: enriched
    }
  }

  async get(id, params) {
    const db = this.getModel(params)
    const item = await db('school.institutions').where({ id, is_deleted: false }).first()
    if (!item) {
      throw new NotFound(`Institución con ID ${id} no encontrada`)
    }
    return _enrichInstitution(item)
  }

  async patch(id, data, params) {
    const db = this.getModel(params)
    const current = await db('school.institutions').where({ id, is_deleted: false }).first()
    if (!current) {
      throw new NotFound(`Institución con ID ${id} no encontrada`)
    }

    let currentSettings = current.settings || {}
    if (typeof currentSettings === 'string') {
      try {
        currentSettings = JSON.parse(currentSettings)
      } catch (_) {
        currentSettings = {}
      }
    }

    const patchData = {}

    if (data.name !== undefined) patchData.name = String(data.name).trim()
    if (data.legal_name !== undefined) patchData.legal_name = String(data.legal_name).trim()
    if (data.email !== undefined) patchData.email = String(data.email).trim()
    if (data.phone_primary !== undefined) patchData.phone_primary = String(data.phone_primary).trim()
    if (data.phone_secondary !== undefined) patchData.phone_secondary = data.phone_secondary ? String(data.phone_secondary).trim() : null
    if (data.address_line1 !== undefined) patchData.address_line1 = String(data.address_line1).trim()
    if (data.website !== undefined) patchData.website = data.website ? String(data.website).trim() : null

    // Logo URL (can be null or string)
    if (data.logo_url !== undefined) {
      patchData.logo_url = data.logo_url ? String(data.logo_url).trim() : null
    }

    // RIF
    if (data.rif !== undefined) {
      patchData.tax_id = String(data.rif).trim().toUpperCase()
    } else if (data.tax_id !== undefined) {
      patchData.tax_id = String(data.tax_id).trim().toUpperCase()
    }

    // Código DEA
    if (data.dea_code !== undefined) {
      patchData.accreditation_no = String(data.dea_code).trim().toUpperCase()
    } else if (data.accreditation_no !== undefined) {
      patchData.accreditation_no = String(data.accreditation_no).trim().toUpperCase()
    }

    // Merged Settings JSONB
    const mergedSettings = {
      ...currentSettings,
      ...(data.settings || {})
    }

    if (data.system_subtitle !== undefined) {
      mergedSettings.system_subtitle = String(data.system_subtitle).trim()
    }
    if (patchData.accreditation_no !== undefined) {
      mergedSettings.dea_code = patchData.accreditation_no
    }
    if (data.statistical_code !== undefined) {
      mergedSettings.statistical_code = String(data.statistical_code).trim()
    }
    if (data.educational_zone !== undefined) {
      mergedSettings.educational_zone = String(data.educational_zone).trim()
    }
    if (data.dependency !== undefined) {
      mergedSettings.dependency = String(data.dependency).trim()
    }
    if (data.official_seal_url !== undefined) {
      mergedSettings.official_seal_url = data.official_seal_url ? String(data.official_seal_url).trim() : null
    }
    if (data.signatures !== undefined) {
      mergedSettings.signatures = Array.isArray(data.signatures) ? data.signatures : mergedSettings.signatures
    }

    patchData.settings = JSON.stringify(mergedSettings)
    patchData.updated_at = new Date()

    await db('school.institutions').where({ id }).update(patchData)
    const updated = await db('school.institutions').where({ id }).first()
    return _enrichInstitution(updated)
  }
}

module.exports = function (app) {
  const options = {
    Model: app.get('knexClient'),
    name: 'school.institutions',
    paginate: {
      default: 10,
      max: 20
    }
  }

  app.use('institutions', new InstitutionsService(options))

  const service = app.service('institutions')

  service.hooks({
    before: {
      all: [],
      find: [],
      get: [],
      create: [authenticateHook, restrictToRoles('admin', 'control_estudio')],
      patch: [authenticateHook, restrictToRoles('admin', 'control_estudio')],
      update: [authenticateHook, restrictToRoles('admin', 'control_estudio')],
      remove: [authenticateHook, restrictToRoles('admin')]
    }
  })
}
