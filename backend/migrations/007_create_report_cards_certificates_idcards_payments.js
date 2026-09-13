exports.up = async function(knex) {
  // 1. Report Cards
  const existsReportCards = await knex.schema.withSchema('school').hasTable('report_cards')
  if (!existsReportCards) {
    await knex.schema.withSchema('school').createTable('report_cards', table => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.integer('student_id').references('id').inTable('school.students').onDelete('CASCADE')
      table.string('student_name', 255)
      table.string('student_code', 50)
      table.string('grade_level', 100)
      table.string('academic_year', 50).defaultTo('2026-2027')
      table.string('period', 50).defaultTo('1er Lapso')
      table.string('education_level', 50).defaultTo('media')
      table.decimal('final_average', 5, 2).defaultTo(18.00)
      table.string('final_letter', 10).defaultTo('A')
      table.boolean('is_solvent').defaultTo(true)
      table.string('verification_code', 100).unique()
      table.string('status', 50).defaultTo('emitida')
      table.string('issue_date', 50)
      table.text('teacher_observations')
      table.text('subject_grades')
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('deleted_at')
      table.timestamps(true, true)

      table.index(['student_id', 'academic_year', 'period'])
      table.index(['verification_code'])
    })
  }

  // 2. Certificates
  const existsCertificates = await knex.schema.withSchema('school').hasTable('certificates')
  if (!existsCertificates) {
    await knex.schema.withSchema('school').createTable('certificates', table => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.string('certificate_type', 100).defaultTo('honor')
      table.string('recipient_name', 255).notNullable()
      table.string('recipient_id_card', 50)
      table.string('academic_year', 50).defaultTo('2026-2027')
      table.text('description')
      table.decimal('average_grade', 5, 2)
      table.string('verification_code', 100).unique()
      table.string('issue_date', 50)
      table.string('status', 50).defaultTo('emitido')
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('deleted_at')
      table.timestamps(true, true)

      table.index(['recipient_name', 'certificate_type'])
      table.index(['verification_code'])
    })
  }

  // 3. ID Cards
  const existsIdCards = await knex.schema.withSchema('school').hasTable('id_cards')
  if (!existsIdCards) {
    await knex.schema.withSchema('school').createTable('id_cards', table => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.string('card_code', 100).unique()
      table.string('recipient_name', 255).notNullable()
      table.string('recipient_id_card', 50).notNullable()
      table.string('recipient_type', 50).defaultTo('estudiante')
      table.string('position', 100).defaultTo('Estudiante Regular')
      table.string('department', 100).defaultTo('Educación Media')
      table.string('blood_type', 10).defaultTo('O+')
      table.string('emergency_contact', 255)
      table.string('emergency_phone', 50)
      table.text('address')
      table.text('photo_url')
      table.string('issue_date', 50)
      table.string('valid_until', 50)
      table.string('status', 50).defaultTo('activo')
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('deleted_at')
      table.timestamps(true, true)

      table.index(['card_code'])
      table.index(['recipient_type', 'recipient_id_card'])
    })
  }

  // 4. Payments
  const existsPayments = await knex.schema.withSchema('school').hasTable('payments')
  if (!existsPayments) {
    await knex.schema.withSchema('school').createTable('payments', table => {
      table.string('id', 100).primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.string('payer_first_name', 100).notNullable()
      table.string('payer_last_name', 100).notNullable()
      table.string('payer_id_card', 50).notNullable()
      table.string('payer_phone', 50)
      table.string('payer_email', 150)
      table.decimal('amount', 12, 2).notNullable()
      table.string('currency', 10).defaultTo('USD')
      table.decimal('amount_bs', 14, 2)
      table.decimal('exchange_rate', 10, 4)
      table.string('payment_method', 50).defaultTo('pago_movil')
      table.string('payment_type', 50).defaultTo('mensualidad')
      table.string('reference_number', 100).notNullable()
      table.string('bank_origin', 100)
      table.string('bank_destination', 100)
      table.string('payment_date', 50)
      table.string('status', 50).defaultTo('aprobado')
      table.text('notes')
      table.integer('student_id').references('id').inTable('school.students').onDelete('SET NULL')
      table.string('created_date', 50)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('deleted_at')
      table.timestamps(true, true)

      table.index(['reference_number'])
      table.index(['payer_id_card', 'status'])
    })
  }
}

exports.down = async function(knex) {
  await knex.schema.withSchema('school').dropTableIfExists('payments')
  await knex.schema.withSchema('school').dropTableIfExists('id_cards')
  await knex.schema.withSchema('school').dropTableIfExists('certificates')
  await knex.schema.withSchema('school').dropTableIfExists('report_cards')
}
