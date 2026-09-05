require('dotenv').config()
const { Client } = require('pg')
const bcrypt = require('bcryptjs')

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'school_management'
})

async function main() {
  await client.connect()
  console.log('Connected to PostgreSQL...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Ensure countries table has MX
  let countryId = 1
  try {
    const c = await client.query(`
      INSERT INTO school.countries (code, name, phone_code, currency_code)
      VALUES ('MX', 'México', '+52', 'MXN')
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `)
    countryId = c.rows[0].id
  } catch (e) {
    const r = await client.query("SELECT id FROM school.countries WHERE code='MX'")
    if (r.rows.length) countryId = r.rows[0].id
  }

  // 2. Ensure state
  let stateId = 1
  try {
    const s = await client.query(`
      INSERT INTO school.states (country_id, code, name)
      VALUES ($1, 'CDMX', 'Ciudad de México')
      RETURNING id
    `, [countryId])
    stateId = s.rows[0].id
  } catch (e) {
    const r = await client.query("SELECT id FROM school.states WHERE code='CDMX'")
    if (r.rows.length) stateId = r.rows[0].id
  }

  // 3. Ensure city
  let cityId = 1
  try {
    const ct = await client.query(`
      INSERT INTO school.cities (state_id, name, postal_code)
      VALUES ($1, 'Ciudad de México', '06600')
      RETURNING id
    `, [stateId])
    cityId = ct.rows[0].id
  } catch (e) {
    const r = await client.query("SELECT id FROM school.cities WHERE name='Ciudad de México'")
    if (r.rows.length) cityId = r.rows[0].id
  }

  // 4. Ensure institution
  let instId = 1
  try {
    const inst = await client.query(`
      INSERT INTO school.institutions (name, legal_name, tax_id, email, country_id, state_id, city_id)
      VALUES ('Colegio San Martín', 'Colegio San Martín A.C.', 'CSM123', 'info@colegiosanmartin.edu', $1, $2, $3)
      RETURNING id
    `, [countryId, stateId, cityId])
    instId = inst.rows[0].id
  } catch (e) {
    const r = await client.query("SELECT id FROM school.institutions LIMIT 1")
    if (r.rows.length) instId = r.rows[0].id
  }

  // 5. Test users list
  const users = [
    { username: 'admin', email: 'admin@colegiosanmartin.edu', role: 'admin', first: 'Steven', last: 'Jhon' },
    { username: 'profesor1', email: 'roberto@colegiosanmartin.edu', role: 'teacher', first: 'Roberto', last: 'Gómez' },
    { username: 'estudiante1', email: 'lucia@colegiosanmartin.edu', role: 'student', first: 'Lucía', last: 'Martínez' },
    { username: 'padre1', email: 'carlos.perez@email.com', role: 'parent', first: 'Carlos', last: 'Pérez' }
  ]

  for (const u of users) {
    // Upsert into school.users
    await client.query(`
      INSERT INTO school.users (institution_id, username, email, password_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, status = 'active'
    `, [instId, u.username, u.email, hashedPassword, u.role])

    // Upsert into public.users
    try {
      await client.query(`
        INSERT INTO public.users (email, password, first_name, last_name, role, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role, is_active = true
      `, [u.email, hashedPassword, u.first, u.last, u.role])
    } catch (err) {
      // public.users might have different constraints
    }

    console.log(`✅ Usuario creado/actualizado: ${u.email} | Clave: password123 | Rol: ${u.role}`)
  }

  await client.end()
  console.log('\n✨ Todos los usuarios de prueba han sido registrados exitosamente.')
}

main().catch(err => {
  console.error('Error seeding test users:', err)
  process.exit(1)
})
