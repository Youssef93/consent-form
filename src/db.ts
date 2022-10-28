import Knex from 'knex'
// @ts-ignore
import config from '../knexfile'

const env = process.env.NODE_ENV || 'development'

export const db = Knex(config[env])
