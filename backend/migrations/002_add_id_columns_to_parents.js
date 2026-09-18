exports.up = async function(knex) {
  const hasParentsTable = await knex.schema.withSchema('school').hasTable('parents')
  if (!hasParentsTable) return

  const hasIdType = await knex.schema.withSchema('school').hasColumn('parents', 'id_type')
  const hasIdNumber = await knex.schema.withSchema('school').hasColumn('parents', 'id_number')

  if (!hasIdType || !hasIdNumber) {
    await knex.schema.withSchema('school').table('parents', table => {
      if (!hasIdType) table.string('id_type', 10).defaultTo('V')
      if (!hasIdNumber) table.string('id_number', 20)
    })
  }
}

exports.down = function(knex) {
  return knex.schema.withSchema('school').table('parents', table => {
    table.dropColumn('id_type')
    table.dropColumn('id_number')
  })
}
