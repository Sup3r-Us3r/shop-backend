import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_product', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.float('price', 2).notNullable();
    table.string('category').notNullable();
    table.text('description').notNullable();
    table.date('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_product');
}
