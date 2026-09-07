const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const { authLimiter, apiLimiter } = require('./middleware/rate-limiter')
const errorHandler = require('./middleware/error-handler')

dotenv.config()

const app = express(feathers())

// Configuration
app.set('authentication', {
  secret: process.env.JWT_SECRET || 'school-management-secret-key',
  service: 'users',
  entity: 'user',
  authStrategies: ['jwt', 'local'],
  jwtOptions: {
    header: { typ: 'access' },
    audience: 'https://schoolms.com',
    issuer: 'schoolms',
    algorithm: 'HS256',
    expiresIn: '1d'
  },
  local: {
    usernameField: 'email',
    passwordField: 'password'
  }
})

// Security Headers & CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}))
app.use(cors())

// Concurrency & Brute-Force Protection (Rate Limiters)
app.use('/authentication', authLimiter)
app.use('/two-factor', authLimiter)
app.use(apiLimiter)

// Controlled Payload parsing
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.configure(express.rest())
app.configure(socketio())

// Sanitized Global Exception Handler (Zero-Crash)
app.use(errorHandler(app))

module.exports = app
