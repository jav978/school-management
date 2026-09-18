exports.up = async function(knex) {
  const hasHireDate = await knex.schema.withSchema('school').hasColumn('staff', 'hire_date')
  if (!hasHireDate) {
    await knex.schema.withSchema('school').alterTable('staff', table => {
      table.date('hire_date')
    })
  }
}

exports.down = async function(knex) {
  const hasHireDate = await knex.schema.withSchema('school').hasColumn('staff', 'hire_date')
  if (hasHireDate) {
    await knex.schema.withSchema('school').alterTable('staff', table => {
      table.dropColumn('hire_date')
    })
  }
}
