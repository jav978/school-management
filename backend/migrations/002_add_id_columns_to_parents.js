exports.up = function(knex) {
  return knex.schema.withSchema('school').table('parents', table => {
    table.string('id_type', 10).defaultTo('V')
    table.string('id_number', 20)
  }).catch(err => {
    // Si ya existen las columnas en la base de datos, ignorar el error de duplicado
    if (err.message && err.message.includes('already exists')) {
      return
    }
    throw err
  })
}

exports.down = function(knex) {
  return knex.schema.withSchema('school').table('parents', table => {
    table.dropColumn('id_type')
    table.dropColumn('id_number')
  })
}
