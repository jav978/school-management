const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const cors = require('cors')
const dotenv = require('dotenv')

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

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.configure(express.rest())
app.configure(socketio())

app.use(express.errorHandler())

module.exports = app
