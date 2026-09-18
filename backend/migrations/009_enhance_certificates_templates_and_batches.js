exports.up = async function(knex) {
  const tableExists = await knex.schema.withSchema('school').hasTable('certificates')
  if (tableExists) {
    await knex.schema.withSchema('school').alterTable('certificates', table => {
      table.string('recipient_type', 50).defaultTo('estudiante')
      table.string('template_id', 50).defaultTo('classic')
      table.string('grade_level', 100)
      table.string('department', 100)
      table.string('position', 100)
      table.string('batch_id', 100)
      table.jsonb('metadata').defaultTo('{}')
      table.string('issued_by', 255)
      table.string('issued_role', 150)
    })
  }
}

exports.down = async function(knex) {
  const tableExists = await knex.schema.withSchema('school').hasTable('certificates')
  if (tableExists) {
    await knex.schema.withSchema('school').alterTable('certificates', table => {
      table.dropColumn('recipient_type')
      table.dropColumn('template_id')
      table.dropColumn('grade_level')
      table.dropColumn('department')
      table.dropColumn('position')
      table.dropColumn('batch_id')
      table.dropColumn('metadata')
      table.dropColumn('issued_by')
      table.dropColumn('issued_role')
    })
  }
}
