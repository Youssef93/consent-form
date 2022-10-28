import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // alternatively we can generate the id in teh api itself instead of the database so we don't create the extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

  await knex.schema.createTable('consents', (t) => {
    t.uuid('unique_id').primary().unique().defaultTo(knex.raw('uuid_generate_v4()'))
    t.uuid('target_id').defaultTo(knex.raw('uuid_generate_v4()')).index('targe_id_index')
    // in a real world scenario we would have stricter schema (like length, ..etc)
    t.string('name')
    t.string('consent_url')
    t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
    t.integer('version')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('consents')
}

