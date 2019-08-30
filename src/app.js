import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import routes from './routes';
import Youch from 'youch';
import { resolve } from 'path';

//start connection with de database
import './database';

class App {
  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
    this.exceptionHandler();
  }
  middleware() {
    this.server.use(express.json());
    this.server.use(
      '/uploads',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }
  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const exceptions = await new Youch(err, res).toJSON();
        res.status(500).json(exceptions);
      }
      res.status(500).json({ error: 'internal server error' });
    });
  }
}

export default new App().server;
