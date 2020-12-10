import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { resolve } from 'path';

import routes from './routes';

class App {
  public server = express();

  constructor() {
    this.middlewares();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cors());
    this.server.use(
      '/uploads',
      express.static(
        resolve(__dirname, '..', 'uploads')
      )
    );
    this.server.use(routes);
  }
}

export default new App().server;
