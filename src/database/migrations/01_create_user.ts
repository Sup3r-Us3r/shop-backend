import 'dotenv/config';

import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_user', table => {
    table.increments('id').primary;
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.jsonb('photo');
    table.string('recoverycode');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_user');
}
