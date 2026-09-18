exports.up = async function(knex) {
  // 1. Asegurar tabla school.staff
  const staffTableExists = await knex.schema.withSchema('school').hasTable('staff')
  if (!staffTableExists) {
    await knex.schema.withSchema('school').createTable('staff', table => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.integer('user_id').references('id').inTable('school.users').onDelete('SET NULL')
      table.integer('institution_id').references('id').inTable('school.institutions').onDelete('CASCADE')
      table.string('employee_id', 50)
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.date('date_of_birth')
      table.string('gender', 20)
      table.string('blood_type', 10).defaultTo('unknown')
      table.string('national_id', 50)
      table.string('photo_url')
      table.string('department', 100)
      table.string('position_title', 100)
      table.string('category', 50).defaultTo('administrative') // administrative, worker, security, etc.
      table.string('phone_mobile', 30)
      table.string('phone_home', 30)
      table.string('email_personal', 150)
      table.string('address_line1', 200)
      table.string('emergency_contact_name', 150)
      table.string('emergency_contact_phone', 30)
      table.string('status', 20).defaultTo('active')
      table.boolean('is_deleted').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  // 2. Extender tabla school.students con historial de fotos y datos socioeconómicos
  await knex.schema.withSchema('school').alterTable('students', table => {
    table.jsonb('photo_history').defaultTo('[]')
    table.jsonb('socioeconomic_data').defaultTo('{}')
    table.jsonb('authorized_pickup').defaultTo('{}')
    table.jsonb('medical_data').defaultTo('{}')
  }).catch(err => {
    // Si ya existen las columnas, ignorar
    if (err.message && err.message.includes('already exists')) return
    throw err
  })

  // 3. Extender tabla school.parents con photo_url y blood_type si no existen
  const parentHasPhoto = await knex.schema.withSchema('school').hasColumn('parents', 'photo_url')
  if (!parentHasPhoto) {
    await knex.schema.withSchema('school').alterTable('parents', table => {
      table.string('photo_url')
      table.string('blood_type', 10).defaultTo('unknown')
    }).catch(() => {})
  }
}

exports.down = async function(knex) {
  await knex.schema.withSchema('school').alterTable('students', table => {
    table.dropColumn('photo_history')
    table.dropColumn('socioeconomic_data')
    table.dropColumn('authorized_pickup')
    table.dropColumn('medical_data')
  }).catch(() => {})
}
