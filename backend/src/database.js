const knex = require('knex')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const buildConnection = () => {
  if (process.env.DATABASE_URL) {
    const isSsl = process.env.DATABASE_URL.includes('sslmode=require') || 
                  process.env.DATABASE_URL.includes('ssl=true') || 
                  process.env.DB_SSL === 'true'
    return {
      connectionString: process.env.DATABASE_URL,
      searchPath: ['school', 'public'],
      ...(isSsl ? { ssl: { rejectUnauthorized: false } } : {})
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

