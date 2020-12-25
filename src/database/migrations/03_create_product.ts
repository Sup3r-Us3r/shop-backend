import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_product', table => {
    table.increments('id');
    table.boolean('star').notNullable().defaultTo(false);
    table.string('name').notNullable();
    table.float('price', 2).notNullable();
    table.integer('amount').notNullable();
    table.string('category').notNullable();
    table.text('description').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_product');
}
