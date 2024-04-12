import { knex as knexSetup, Knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: { filename: './tmp/app.db' },
  useNullAsDefault: true,
  migrations: { extension: 'ts', directory: './tmp/migrations' },
}

export const knex = knexSetup(knexConfig)
