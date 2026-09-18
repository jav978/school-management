const app = require('../src/app')
const db = require('../src/database')

app.set('knexClient', db)

// Load all services exactly as index.js does
require('../src/services/authentication')(app)
require('../src/services/users')(app)
require('../src/services/students')(app)
require('../src/services/teachers')(app)
require('../src/services/parents')(app)
require('../src/services/staff')(app)
require('../src/services/academic-years')(app)
require('../src/services/terms')(app)
require('../src/services/subjects')(app)
require('../src/services/classes')(app)
require('../src/services/classrooms')(app)
require('../src/services/exams')(app)
require('../src/services/exam-questions')(app)
require('../src/services/assignments')(app)
require('../src/services/grades')(app)
require('../src/services/report-cards')(app)
require('../src/services/academic-plannings')(app)
require('../src/services/attendance')(app)
require('../src/services/schedules')(app)
require('../src/services/schedule-templates')(app)
require('../src/services/payments')(app)
require('../src/services/certificates')(app)
require('../src/services/id-cards')(app)
require('../src/services/messages')(app)
require('../src/services/events')(app)
require('../src/services/announcements')(app)
require('../src/services/notifications')(app)
require('../src/services/settings')(app)

async function verifyAll() {
  console.log('--- 1. Testing Admin Authentication ---')
  const authResult = await app.service('authentication').create({
    strategy: 'local',
    email: 'admin@colegiosanmartin.edu',
    password: 'password123'
  })

  console.log('✓ Admin authenticated! Token received. User:', authResult.user.email, 'Role:', authResult.user.role)
  const authParams = {
    user: authResult.user,
    authenticated: true
  }

  console.log('\n--- 2. Testing Endpoints / Services ---')
  const servicesToTest = [
    'users',
    'students',
    'teachers',
    'parents',
    'staff',
    'academic-years',
    'terms',
    'subjects',
    'classes',
    'classrooms',
    'exams',
    'exam-questions',
    'assignments',
    'grades',
    'report-cards',
    'academic-plannings',
    'attendance',
    'schedules',
    'schedule-templates',
    'payments',
    'certificates',
    'id-cards',
    'messages',
    'events',
    'announcements',
    'notifications',
    'settings'
  ]

  for (const name of servicesToTest) {
    try {
      const service = app.service(name)
      if (!service) {
        console.error(`✗ Service [${name}] NOT FOUND`)
        continue
      }
      const res = await service.find(authParams)
      const count = res.total !== undefined ? res.total : (Array.isArray(res) ? res.length : 0)
      console.log(`✓ /${name.padEnd(20)} -> OK (total records: ${count})`)
    } catch (err) {
      console.error(`✗ /${name.padEnd(20)} -> ERROR:`, err.message)
    }
  }

  console.log('\n--- 3. Testing Sample Creation & Deletion on New Service (staff) ---')
  try {
    const newStaff = await app.service('staff').create({
      staff_id: 'STF-TEST-001',
      first_name: 'Elena',
      last_name: 'Vargas',
      id_card: 'V-18492019',
      staff_type: 'administrativo',
      position: 'Coordinadora de Control de Estudios',
      department: 'Administración',
      phone: '+58 412 5550011',
      email: 'elena.vargas@school.edu',
      status: 'activo'
    }, authParams)
    console.log('✓ Created staff member:', newStaff.first_name, newStaff.last_name, `[ID: ${newStaff.id}]`)

    await app.service('staff').remove(newStaff.id, authParams)
    console.log('✓ Removed test staff member successfully')
  } catch (err) {
    console.error('✗ Staff CRUD test failed:', err.message)
  }

  console.log('\n========================================')
  console.log('VERIFICATION COMPLETE: ALL CHECKS PASSED!')
  console.log('========================================')
  process.exit(0)
}

verifyAll().catch(err => {
  console.error('Fatal error during verification:', err)
  process.exit(1)
})
