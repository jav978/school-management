exports.up = async function(knex) {
  // 1. Crear tabla school.academic_plannings si no existe
  const planningsTableExists = await knex.schema.withSchema('school').hasTable('academic_plannings')
  if (!planningsTableExists) {
    await knex.schema.withSchema('school').createTable('academic_plannings', table => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique()
      table.integer('institution_id').references('id').inTable('school.institutions').onDelete('CASCADE').defaultTo(1)
      table.integer('teacher_id').references('id').inTable('school.teachers').onDelete('SET NULL')
      table.integer('subject_id').references('id').inTable('school.subjects').onDelete('SET NULL')
      table.string('academic_year', 50).defaultTo('2025-2026')
      table.string('period', 50).defaultTo('1er lapso')
      table.string('grade', 50)
      table.string('section', 20)
      table.string('group_schedule', 255)
      table.text('indispensable_theme')
      table.text('project_theme')
      table.jsonb('general_objectives').defaultTo('[]')
      table.jsonb('weekly_planning').defaultTo('[]')
      table.jsonb('evaluation_plan').defaultTo('[]')
      table.string('status', 50).defaultTo('borrador') // borrador, aprobada, finalizada
      table.boolean('is_deleted').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  // 2. Extender columnas de school.rooms para compatibilidad total con aulas
  const hasType = await knex.schema.withSchema('school').hasColumn('rooms', 'type')
  if (!hasType) {
    await knex.schema.withSchema('school').alterTable('rooms', table => {
      table.string('type', 50).defaultTo('aula_regular')
      table.string('status', 50).defaultTo('disponible')
      table.text('equipment')
    }).catch(err => {
      if (err.message && err.message.includes('already exists')) return
      throw err
    })
  }

  // 3. Crear vista school.classrooms apuntando a school.rooms para compatibilidad Feathers
  await knex.raw('CREATE OR REPLACE VIEW school.classrooms AS SELECT * FROM school.rooms')
}

exports.down = async function(knex) {
  await knex.raw('DROP VIEW IF EXISTS school.classrooms CASCADE')
  await knex.schema.withSchema('school').dropTableIfExists('academic_plannings')
}
