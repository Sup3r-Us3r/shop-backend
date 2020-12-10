import 'dotenv/config';

import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_user', table => {
    table.increments('id').primary;
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('photo');
    table.string('recoverycode');
    table.date('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_user');
}