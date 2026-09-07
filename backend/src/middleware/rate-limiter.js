const rateLimit = require('express-rate-limit')

// Strict rate limiter for authentication endpoints (Anti-Brute Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Máximo 15 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    name: 'TooManyRequests',
    message: 'Demasiados intentos de acceso desde esta dirección IP. Por seguridad, intente nuevamente en 15 minutos.',
    code: 429,
    statusCode: 429
  }
})

// General API limiter to protect against DDoS / high concurrent flooding
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 300, // 300 peticiones por minuto por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    name: 'TooManyRequests',
    message: 'Límite de peticiones simultáneas superado. El servidor está protegiendo la estabilidad del servicio.',
    code: 429,
    statusCode: 429
  }
})

module.exports = {
  authLimiter,
  apiLimiter
}
