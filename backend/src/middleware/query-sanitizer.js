/**
 * Query Sanitizer & SQL Injection Defense Middleware
 * Protege endpoints REST contra inyección de parámetros, desbordamiento de paginación
 * y polución de prototipos.
 */

const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype', '$where', '$regex', '$expr']
const SQL_INJECTION_PATTERN = /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|TRUNCATE|MERGE)\b|--|\/\*|\*\/|;)/i

function sanitizeObject(obj, depth = 0) {
  if (depth > 5 || !obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1))
  }

  const clean = {}
  for (const [key, value] of Object.entries(obj)) {
    // 1. Bloquear claves de prototipo o inyección
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) {
      continue
    }

    // 2. Validar que la clave sea un identificador seguro (alfanumérico, punto, guion bajo o comodín de feathers)
    if (!/^[a-zA-Z0-9_$.]+$/.test(key)) {
      continue
    }

    // 3. Sanitizar valor
    if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value, depth + 1)
    } else if (typeof value === 'string') {
      // Bloquear secuencias maliciosas flagrantes en cadenas de ordenamiento
      if (key === '$sort' && SQL_INJECTION_PATTERN.test(value)) {
        continue
      }
      clean[key] = value
    } else {
      clean[key] = value
    }
  }

  return clean
}

module.exports = function querySanitizer(req, res, next) {
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query)

    // Normalizar paginación segura
    if (req.query.$limit !== undefined) {
      const parsed = parseInt(req.query.$limit, 10)
      req.query.$limit = isNaN(parsed) ? 10 : Math.min(Math.max(1, parsed), 100)
    }

    if (req.query.$skip !== undefined) {
      const parsed = parseInt(req.query.$skip, 10)
      req.query.$skip = isNaN(parsed) ? 0 : Math.max(0, parsed)
    }

    // Validar ordenamiento $sort
    if (req.query.$sort && typeof req.query.$sort === 'object') {
      for (const sortCol of Object.keys(req.query.$sort)) {
        if (!/^[a-zA-Z0-9_]+$/.test(sortCol)) {
          delete req.query.$sort[sortCol]
        }
      }
    }
  }

  next()
}
