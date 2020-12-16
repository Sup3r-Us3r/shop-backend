import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('tb_image', table => {
    table.increments('id');
    table.integer('product_id')
      .notNullable()
      .references('id')
      .inTable('tb_product')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('public_id').notNullable();
    table.string('url').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('tb_image');
}
