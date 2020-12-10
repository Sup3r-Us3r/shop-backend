import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_category', table => {
    table.increments('id');
    table.string('name').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_category');
}
