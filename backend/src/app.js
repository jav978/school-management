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
  },
  oauth: {
    redirect: process.env.OAUTH_REDIRECT || 'http://localhost:3001/dashboard',
    google: {
      key: process.env.GOOGLE_CLIENT_ID || '',
      secret: process.env.GOOGLE_CLIENT_SECRET || '',
      scope: ['email', 'profile']
    }
  }
})

// OAuth Provider Status Endpoint
app.get('/oauth/status', (req, res) => {
  res.json({
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  })
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

// Controlled Payload parsing (supporting base64 image uploads up to 2MB binary)
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.configure(express.rest())
app.configure(socketio())

// Sanitized Global Exception Handler (Zero-Crash)
app.use(errorHandler(app))

module.exports = app
