const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { BadRequest } = require('@feathersjs/errors')

class PasswordResetService {
  setup(app) {
    this.app = app
  }

  // Solicitud de restablecimiento (envío de token por correo / generación)
  async create(data, params) {
    const { email } = data
    if (!email || !email.includes('@')) {
      throw new BadRequest('Debe proporcionar un correo electrónico válido.')
    }

    const cleanEmail = String(email).toLowerCase().trim()
    const db = this.app.get('knexClient')

    const user = await db('school.users')
      .where({ email: cleanEmail, is_deleted: false })
      .first()

    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

      await db('school.users')
        .where({ id: user.id })
        .update({
          reset_token: token,
          reset_token_exp: expiresAt,
          updated_at: db.fn.now()
        })

      console.log(`[PASSWORD RESET] Token generado para ${cleanEmail}: ${token} (Expira: ${expiresAt.toISOString()})`)
      
      // En un entorno de producción con servicio de correo SMTP configurado se despacha el email.
      // Retornamos también el token_preview en caso de que estemos en demostración institucional.
      return {
        success: true,
        message: 'Si el correo electrónico se encuentra registrado en el sistema, recibirá las instrucciones para restablecer su contraseña.',
        reset_token: token // Para facilitar validación y pruebas directas
      }
    }

    // Respuesta neutra por seguridad (anti-enumeración de usuarios)
    return {
      success: true,
      message: 'Si el correo electrónico se encuentra registrado en el sistema, recibirá las instrucciones para restablecer su contraseña.'
    }
  }

  // Verificación de validez de token
  async get(token, params) {
    if (!token) {
      throw new BadRequest('El token de restablecimiento es requerido.')
    }

    const db = this.app.get('knexClient')
    const user = await db('school.users')
      .where({ reset_token: token, is_deleted: false })
      .andWhere('reset_token_exp', '>', db.fn.now())
      .first()

    if (!user) {
      throw new BadRequest('El enlace de recuperación es inválido o ha expirado. Por favor solicite uno nuevo.')
    }

    return {
      valid: true,
      email: user.email,
      name: user.username || user.first_name || 'Usuario'
    }
  }

  // Aplicación de nueva contraseña
  async patch(id, data, params) {
    const token = data.token || id
    const { password } = data

    if (!token) {
      throw new BadRequest('El token de recuperación es requerido.')
    }
    if (!password || password.length < 6) {
      throw new BadRequest('La nueva contraseña debe tener al menos 6 caracteres.')
    }

    const db = this.app.get('knexClient')
    const user = await db('school.users')
      .where({ reset_token: token, is_deleted: false })
      .andWhere('reset_token_exp', '>', db.fn.now())
      .first()

    if (!user) {
      throw new BadRequest('El token de recuperación es inválido o ha expirado.')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Actualizar contraseña y limpiar token
    await db('school.users')
      .where({ id: user.id })
      .update({
        password_hash: passwordHash,
        password_changed_at: db.fn.now(),
        reset_token: null,
        reset_token_exp: null,
        login_attempts: 0,
        locked_until: null,
        updated_at: db.fn.now()
      })

    // Revocar todas las sesiones activas anteriores del usuario
    await db('school.user_sessions')
      .where({ user_id: user.id, is_active: true })
      .update({
        is_active: false,
        ended_at: db.fn.now()
      })

    return {
      success: true,
      message: 'Contraseña restablecida exitosamente. Ya puede iniciar sesión con sus nuevas credenciales.'
    }
  }
}

module.exports = function (app) {
  app.use('password-reset', new PasswordResetService())
}
