const { BadRequest } = require('@feathersjs/errors')

const validateData = (schema) => {
  return async (context) => {
    const data = context.data
    if (!data) return context

    const errors = []

    for (const [key, rules] of Object.entries(schema)) {
      const val = data[key]

      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push(`El campo '${key}' es obligatorio.`)
        continue
      }

      if (val !== undefined && val !== null && val !== '') {
        if (rules.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(val)) {
            errors.push(`El campo '${key}' debe ser un correo electrónico válido.`)
          }
        }

        if (rules.type === 'number') {
          const num = Number(val)
          if (isNaN(num)) {
            errors.push(`El campo '${key}' debe ser un número.`)
          } else {
            if (rules.min !== undefined && num < rules.min) {
              errors.push(`El campo '${key}' no puede ser menor a ${rules.min}.`)
            }
            if (rules.max !== undefined && num > rules.max) {
              errors.push(`El campo '${key}' no puede ser mayor a ${rules.max}.`)
            }
          }
        }

        if (rules.type === 'date') {
          const d = Date.parse(val)
          if (isNaN(d)) {
            errors.push(`El campo '${key}' debe ser una fecha válida (YYYY-MM-DD).`)
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequest('Error de validación de datos', { errors })
    }

    return context
  }
}

module.exports = { validateData }
