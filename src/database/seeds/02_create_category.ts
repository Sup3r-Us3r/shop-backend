import Knex from 'knex';

export async function seed(knex: Knex) {
  return knex('tb_category').insert([
    { name: 'Natura' },
    { name: 'Tapetes' },
    { name: 'Cama mesa e banho' },
    { name: 'Kits' },
  ]);
}
