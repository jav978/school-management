const otplib = require('otplib')
const qrcode = require('qrcode')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { BadRequest, NotAuthenticated, Forbidden } = require('@feathersjs/errors')
const { authenticateHook } = require('../hooks/auth')

function generateBackupCodes(count = 8) {
  const codes = []
  for (let i = 0; i < count; i++) {
    const part1 = crypto.randomBytes(2).toString('hex').toUpperCase()
    const part2 = crypto.randomBytes(2).toString('hex').toUpperCase()
    codes.push(`${part1}-${part2}`)
  }
  return codes
}

class TwoFactorService {
  constructor(app) {
    this.app = app
  }

  get db() {
    return this.app.get('knexClient')
  }

  // GET /two-factor (Checks 2FA status for the logged-in user)
  async find(params) {
    const user = params.user
    if (!user) throw new NotAuthenticated('Usuario no autenticado')

    const [dbUser] = await this.db('school.users')
      .where({ id: user.id })
      .select('id', 'email', 'two_factor_enabled')

    return {
      two_factor_enabled: !!(dbUser && dbUser.two_factor_enabled)
    }
  }

  // POST /two-factor (Handles actions: 'setup', 'enable', 'disable', 'challenge')
  async create(data, params) {
    const action = data.action || 'setup'

    // 1. Setup: Generate secret and QR code for scanning
    if (action === 'setup') {
      const user = params.user
      if (!user) throw new NotAuthenticated('Debe iniciar sesión para configurar 2FA')

      const secret = otplib.generateSecret()
      const otpauth = otplib.generateURI({
        issuer: 'U.E Colegio Santa Luisa',
        label: user.email,
        secret
      })

      const qrCode = await qrcode.toDataURL(otpauth, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 6,
        color: {
          dark: '#110926',
          light: '#ffffff'
        }
      })

      const backupCodes = generateBackupCodes(8)

      // Store temporary secret until verified
      await this.db('school.users')
        .where({ id: user.id })
        .update({
          two_factor_temp_secret: secret,
          updated_at: new Date()
        })

      return {
        secret,
        qrCode,
        backupCodes,
        issuer: 'U.E Colegio Santa Luisa',
        account: user.email
      }
    }

    // 2. Enable: Verify code and activate 2FA with hashed backup codes
    if (action === 'enable') {
      const user = params.user
      if (!user) throw new NotAuthenticated('Debe iniciar sesión para activar 2FA')
      const { code, backupCodes } = data

      if (!code) throw new BadRequest('Debe ingresar el código de verificación de 6 dígitos')

      const [dbUser] = await this.db('school.users')
        .where({ id: user.id })
        .select('id', 'two_factor_temp_secret')

      if (!dbUser || !dbUser.two_factor_temp_secret) {
        throw new BadRequest('No hay una configuración 2FA pendiente. Inicie la configuración primero.')
      }

      // Verify token
      const verification = otplib.verifySync({
        token: String(code).trim(),
        secret: dbUser.two_factor_temp_secret,
        epochTolerance: 1
      })

      if (!verification || !verification.valid) {
        throw new BadRequest('Código de verificación inválido o expirado. Verifique la hora de su dispositivo.')
      }

      // Hash backup codes
      const hashedBackupCodes = (backupCodes || []).map(c => ({
        code_hash: bcrypt.hashSync(c.replace(/\s+/g, '').toUpperCase(), 10),
        used: false,
        created_at: new Date().toISOString()
      }))

      await this.db('school.users')
        .where({ id: user.id })
        .update({
          two_factor_secret: dbUser.two_factor_temp_secret,
          two_factor_temp_secret: null,
          two_factor_enabled: true,
          two_factor_backup_codes: JSON.stringify(hashedBackupCodes),
          updated_at: new Date()
        })

      return {
        success: true,
        message: 'Autenticación en dos pasos (2FA) activada exitosamente'
      }
    }

    // 3. Disable: Deactivate 2FA
    if (action === 'disable') {
      const user = params.user
      if (!user) throw new NotAuthenticated('Debe iniciar sesión para desactivar 2FA')
      const { code, password } = data

      const [dbUser] = await this.db('school.users')
        .where({ id: user.id })
        .select('id', 'password_hash', 'two_factor_secret', 'two_factor_enabled')

      if (!dbUser || !dbUser.two_factor_enabled) {
        return { success: true, message: 'La autenticación en dos pasos ya está desactivada' }
      }

      let authorized = false

      if (code && dbUser.two_factor_secret) {
        const verification = otplib.verifySync({
          token: String(code).trim(),
          secret: dbUser.two_factor_secret,
          epochTolerance: 1
        })
        if (verification && verification.valid) authorized = true
      }

      if (!authorized && password && dbUser.password_hash) {
        authorized = bcrypt.compareSync(password, dbUser.password_hash)
      }

      if (!authorized) {
        throw new BadRequest('Código de autenticación o contraseña incorrecta')
      }

      await this.db('school.users')
        .where({ id: user.id })
        .update({
          two_factor_secret: null,
          two_factor_temp_secret: null,
          two_factor_enabled: false,
          two_factor_backup_codes: null,
          updated_at: new Date()
        })

      return {
        success: true,
        message: 'Autenticación en dos pasos desactivada exitosamente'
      }
    }

    // 4. Challenge: Complete 2FA login with code or backup code
    if (action === 'challenge') {
      const { temp_token, code } = data
      if (!temp_token || !code) {
        throw new BadRequest('Token temporal y código de verificación son requeridos')
      }

      const authService = this.app.service('authentication')
      let payload
      try {
        payload = await authService.verifyAccessToken(temp_token)
      } catch (err) {
        throw new NotAuthenticated('El token de sesión 2FA ha expirado o es inválido. Inicie sesión nuevamente.')
      }

      if (!payload || !payload.two_factor_pending) {
        throw new BadRequest('Token no válido para desafío 2FA')
      }

      const [dbUser] = await this.db('school.users')
        .where({ id: payload.sub })
        .select('*')

      if (!dbUser || !dbUser.two_factor_enabled || !dbUser.two_factor_secret) {
        throw new BadRequest('El usuario no tiene 2FA configurado')
      }

      const cleanCode = String(code).trim().replace(/\s+/g, '').toUpperCase()
      let isValid = false
      let usedBackup = false

      // Test TOTP
      if (/^\d{6}$/.test(cleanCode)) {
        const verification = otplib.verifySync({
          token: cleanCode,
          secret: dbUser.two_factor_secret,
          epochTolerance: 1
        })
        if (verification && verification.valid) {
          isValid = true
        }
      }

      // Test Backup Code fallback
      if (!isValid && dbUser.two_factor_backup_codes) {
        let backupList = []
        try {
          backupList = JSON.parse(dbUser.two_factor_backup_codes) || []
        } catch (e) {
          backupList = []
        }

        const matchedIndex = backupList.findIndex(b => !b.used && bcrypt.compareSync(cleanCode, b.code_hash))
        if (matchedIndex !== -1) {
          isValid = true
          usedBackup = true
          backupList[matchedIndex].used = true
          backupList[matchedIndex].used_at = new Date().toISOString()
          await this.db('school.users')
            .where({ id: dbUser.id })
            .update({
              two_factor_backup_codes: JSON.stringify(backupList),
              updated_at: new Date()
            })
        }
      }

      if (!isValid) {
        throw new BadRequest('Código de verificación o de respaldo incorrecto. Intente nuevamente.')
      }

      // Issue full legitimate Access Token
      const accessToken = await authService.createAccessToken({ sub: dbUser.id })

      // Sanitize user
      const userCopy = { ...dbUser }
      delete userCopy.password_hash
      delete userCopy.two_factor_secret
      delete userCopy.two_factor_temp_secret
      delete userCopy.two_factor_backup_codes

      return {
        accessToken,
        user: userCopy,
        used_backup: usedBackup
      }
    }

    throw new BadRequest(`Acción '${action}' no reconocida`)
  }
}

module.exports = function (app) {
  app.use('two-factor', new TwoFactorService(app))
  const service = app.service('two-factor')

  service.hooks({
    before: {
      all: [],
      find: [authenticateHook],
      create: [
        (context) => {
          // 'challenge' is public during login; others require authentication
          if (context.data && context.data.action === 'challenge') {
            return context
          }
          return authenticateHook(context)
        }
      ]
    }
  })
}
