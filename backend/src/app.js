const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const { authLimiter, apiLimiter } = require('./middleware/rate-limiter')
const errorHandler = require('./middleware/error-handler')
const querySanitizer = require('./middleware/query-sanitizer')

dotenv.config()

const app = express(feathers())

// Security Headers & CORS (Must be first to apply to all routes and preflight OPTIONS)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}))
app.options('*', cors())

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}))

// Configuration
const host = process.env.BACKEND_HOST || process.env.HOST || 'school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev'
const port = process.env.PORT || 3030
app.set('host', host)
app.set('port', port)

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
    redirect: process.env.OAUTH_REDIRECT || 'https://gestionescolarcolegiosantaluisa.vercel.app/auth/callback',
    defaults: {
      origin: process.env.APP_ORIGIN || `https://${host}`
    },
    google: {
      key: process.env.GOOGLE_CLIENT_ID || '',
      secret: process.env.GOOGLE_CLIENT_SECRET || '',
      scope: ['openid', 'email', 'profile']
    }
  }
})

// OAuth Provider Status Endpoint
app.get('/oauth/status', (req, res) => {
  res.json({
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  })
})

// Concurrency & Brute-Force Protection (Rate Limiters)
app.use('/authentication', authLimiter)
app.use('/two-factor', authLimiter)
app.use(apiLimiter)

// Query Sanitization & SQL Injection Defense
app.use(querySanitizer)

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
