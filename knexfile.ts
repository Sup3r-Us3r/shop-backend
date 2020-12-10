import 'dotenv/config';

import { resolve } from 'path';
import { Config } from 'knex';

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DEFAULT,
  },
  migrations: {
    directory: resolve(__dirname, 'src', 'database', 'migrations'),
  },
  seeds: {
    directory: resolve(__dirname, 'src', 'database', 'seeds'),
  },
  useNullAsDefault: true,
} as Config;
