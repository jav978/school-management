exports.up = async function(knex) {
  const hasCol = await knex.schema.withSchema('school').hasColumn('users', 'two_factor_backup_codes')
  if (!hasCol) {
    await knex.schema.withSchema('school').table('users', table => {
      table.text('two_factor_backup_codes').nullable()
      table.text('two_factor_temp_secret').nullable()
    })
  }
}

exports.down = async function(knex) {
  const hasCol = await knex.schema.withSchema('school').hasColumn('users', 'two_factor_backup_codes')
  if (hasCol) {
    await knex.schema.withSchema('school').table('users', table => {
      table.dropColumn('two_factor_backup_codes')
      table.dropColumn('two_factor_temp_secret')
    })
  }
}
