const { BadRequest, NotAuthenticated } = require('@feathersjs/errors')

class OAuthOnboardingService {
  setup(app) {
    this.app = app
  }

  async create(data, params) {
    const db = this.app.get('knexClient')
    const currentUser = params.user
    const email = (data.email || (currentUser && currentUser.email))?.toLowerCase()?.trim()

    if (!email) {
      throw new BadRequest('No se pudo identificar el correo del usuario.')
    }

    const { role, id_type = 'V', id_number, phone, first_name, last_name } = data

    const validRoles = ['parent', 'student', 'teacher', 'staff']
    if (!validRoles.includes(role)) {
      throw new BadRequest('Rol inválido. Debe seleccionar: Representante, Estudiante, Docente o Personal.')
    }

    if (!id_number) {
      throw new BadRequest('La cédula de identidad es requerida.')
    }

    // Buscar o verificar usuario existente
    let user = await db('school.users')
      .where({ email, is_deleted: false })
      .first()

    // Si es docente o personal administrativo, por seguridad institucional queda en 'pending'
    const isRestrictedRole = (role === 'teacher' || role === 'staff')
    const initialStatus = isRestrictedRole ? 'pending' : 'active'
    const isActive = !isRestrictedRole

    const userPayload = {
      role,
      status: initialStatus,
      is_active: isActive,
      phone: phone || (user ? user.phone : null),
      updated_at: db.fn.now()
    }

    if (first_name) userPayload.first_name = first_name
    if (last_name) userPayload.last_name = last_name

    let existingPrefs = {}
    try {
      existingPrefs = user && user.preferences ? (typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences) : {}
    } catch (_) {}

    userPayload.preferences = JSON.stringify({
      ...existingPrefs,
      id_type,
      id_number,
      onboarding_completed: true,
      onboarding_date: new Date().toISOString()
    })

    if (user) {
      await db('school.users')
        .where({ id: user.id })
        .update(userPayload)
      user = await db('school.users').where({ id: user.id }).first()
    } else {
      // Crear nuevo usuario si viene de registro externo
      const [newId] = await db('school.users')
        .insert({
          institution_id: 1,
          username: email.split('@')[0],
          email,
          ...userPayload,
          created_at: db.fn.now()
        })
        .returning('id')
      user = await db('school.users').where({ id: typeof newId === 'object' ? newId.id : newId }).first()
    }

    // Crear/vincular perfil según el rol
    if (role === 'parent') {
      const existingParent = await db('school.parents')
        .where(function() {
          this.where({ user_id: user.id }).orWhere({ email_primary: email })
        })
        .first()

      if (!existingParent) {
        await db('school.parents').insert({
          institution_id: 1,
          user_id: user.id,
          first_name: first_name || user.first_name || 'Representante',
          last_name: last_name || user.last_name || '',
          id_type,
          id_number: String(id_number),
          email_primary: email,
          phone_mobile: phone || '',
          relationship: 'Representante Legal',
          is_active: true,
          created_at: db.fn.now()
        })
      }
    } else if (role === 'teacher') {
      const existingTeacher = await db('school.teachers')
        .where(function() {
          this.where({ user_id: user.id }).orWhere({ email })
        })
        .first()

      if (!existingTeacher) {
        await db('school.teachers').insert({
          institution_id: 1,
          user_id: user.id,
          first_name: first_name || user.first_name || 'Profesor',
          last_name: last_name || user.last_name || '',
          id_number: `${id_type}-${id_number}`,
          email,
          phone: phone || '',
          status: 'inactive', // Inactivo hasta que Dirección apruebe
          created_at: db.fn.now()
        })
      }
    } else if (role === 'staff') {
      const existingStaff = await db('school.staff')
        .where(function() {
          this.where({ user_id: user.id }).orWhere({ email_personal: email })
        })
        .first()

      if (!existingStaff) {
        await db('school.staff').insert({
          institution_id: 1,
          user_id: user.id,
          first_name: first_name || user.first_name || 'Personal',
          last_name: last_name || user.last_name || '',
          id_number: `${id_type}-${id_number}`,
          email_personal: email,
          phone_mobile: phone || '',
          department: 'Administración',
          position: 'Personal Escolar',
          status: 'inactive',
          created_at: db.fn.now()
        })
      }
    }

    return {
      success: true,
      status: initialStatus,
      is_active: isActive,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        first_name: user.first_name,
        last_name: user.last_name
      },
      message: isRestrictedRole
        ? 'Su cuenta como Docente/Personal ha sido registrada y está en proceso de verificación por la Dirección del Plantel.'
        : 'Perfil completado con éxito. ¡Bienvenido a la Comunidad Educativa Vicenciana!'
    }
  }
}

module.exports = function (app) {
  app.use('oauth-onboarding', new OAuthOnboardingService())
}
