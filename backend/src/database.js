const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/school_management',
    searchPath: ['school', 'public']
  }
})

module.exports = db
