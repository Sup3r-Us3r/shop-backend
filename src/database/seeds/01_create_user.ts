import Knex from 'knex';
import bcrypt from 'bcrypt';

const hash = bcrypt.hashSync('123456789', 8);

export async function seed(knex: Knex) {
  return knex('tb_user').insert([
    {
      name: 'User1',
      email: 'user1@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
    },
    {
      name: 'User2',
      email: 'user2@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
    },
    {
      name: 'User3',
      email: 'user3@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
    },
    {
      name: 'User4',
      email: 'user4@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
    },
    {
      name: 'User5',
      email: 'user5@mail.com',
      password: hash,
      photo: 'https://avatars0.githubusercontent.com/u/22561893?s=460&u=fcc8d1cf270f6eb3c101fcd56021713a379c43a9&v=4',
    },
  ]);
}
