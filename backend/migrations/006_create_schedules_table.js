exports.up = async function(knex) {
  const exists = await knex.schema.withSchema('school').hasTable('schedules')
  if (!exists) {
    await knex.schema.withSchema('school').createTable('schedules', table => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.integer('institution_id').defaultTo(1)
      table.integer('subject_id').references('id').inTable('school.subjects').onDelete('SET NULL')
      table.integer('teacher_id').references('id').inTable('school.teachers').onDelete('SET NULL')
      table.string('classroom_id', 50).defaultTo('AULA-101')
      table.string('grade', 50).notNullable()
      table.string('section', 20).notNullable().defaultTo('A')
      table.string('day_of_week', 20).notNullable()
      table.string('start_time', 20).notNullable()
      table.string('end_time', 20).notNullable()
      table.string('semester', 50).defaultTo('1er Lapso')
      table.string('academic_year', 50).defaultTo('2026-2027')
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamps(true, true)

      table.index(['grade', 'section', 'academic_year'])
      table.index(['teacher_id', 'day_of_week'])
    })
  }
}

exports.down = async function(knex) {
  await knex.schema.withSchema('school').dropTableIfExists('schedules')
}
