require('dotenv').config()
const app = require('./src/app')
const db = require('./src/database')

const PORT = process.env.BACKEND_PORT || 3031


app.set('knexClient', db)

// Process-level Fault Tolerance & Error Trapping (Zero-Crash)
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] [CRITICAL UNCAUGHT EXCEPTION]:`, err.message, err.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] [UNHANDLED PROMISE REJECTION]:`, reason)
})

// Core & Personnel services
require('./src/services/authentication')(app)
require('./src/services/two-factor')(app)
require('./src/services/users')(app)
require('./src/services/students')(app)
require('./src/services/teachers')(app)
require('./src/services/parents')(app)
require('./src/services/staff')(app)

// Academic & Facilities services
require('./src/services/academic-years')(app)
require('./src/services/terms')(app)
require('./src/services/subjects')(app)
require('./src/services/classes')(app)
require('./src/services/classrooms')(app)
require('./src/services/exams')(app)
require('./src/services/exam-questions')(app)
require('./src/services/assignments')(app)
require('./src/services/grades')(app)
require('./src/services/report-cards')(app)
require('./src/services/academic-plannings')(app)

// Attendance & Schedule services
require('./src/services/attendance')(app)
require('./src/services/schedules')(app)
require('./src/services/schedule-templates')(app)

// Financial & Identification services
require('./src/services/payments')(app)
require('./src/services/certificates')(app)
require('./src/services/id-cards')(app)

// Communication services
require('./src/services/messages')(app)
require('./src/services/events')(app)
require('./src/services/announcements')(app)
require('./src/services/notifications')(app)

// Settings
require('./src/services/settings')(app)

app.listen(PORT).then(() => {
  console.log(`School Management API running on port ${PORT}`)
})
