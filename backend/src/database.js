const knex = require('knex')
require('dotenv').config()

const buildConnection = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      searchPath: ['school', 'public']
    }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'school_management',
    searchPath: ['school', 'public']
  }
}

const db = knex({
  client: 'pg',
  connection: buildConnection()
})

module.exports = db

