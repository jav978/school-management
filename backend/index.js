const app = require('./src/app')
const db = require('./src/database')

const PORT = process.env.PORT || 3030

app.set('knexClient', db)

// Core services
require('./src/services/authentication')(app)
require('./src/services/users')(app)
require('./src/services/students')(app)
require('./src/services/teachers')(app)

// Academic services
require('./src/services/academic-years')(app)
require('./src/services/terms')(app)
require('./src/services/subjects')(app)
require('./src/services/classes')(app)
require('./src/services/exams')(app)
require('./src/services/assignments')(app)
require('./src/services/grades')(app)

// Attendance & Schedule services
require('./src/services/attendance')(app)
require('./src/services/schedules')(app)

// Financial services
require('./src/services/payments')(app)

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
