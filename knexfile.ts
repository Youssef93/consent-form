//@ts-nocheck
import * as path from 'path'

const dbUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`
const dbTestUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB_TEST}`

const base = {
  client: 'pg',
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: path.join(__dirname, 'db', 'migrations')
  },
}

module.exports = {
  development: {
    ...base,
    connection: dbUrl
  },

  test: {
    ...base,
    connection: dbTestUrl
  }
}
