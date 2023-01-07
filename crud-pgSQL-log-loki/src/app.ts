import express, { Express } from 'express';
import prometheus from './utils/prometheus'
import user from './controllers/user_controllerts'

/* Start Server */
export async function start_routers() {
  const app: Express = express();
  app.use(express.json())
  app.use('/user', user);
  app.use('/metrics', prometheus);

  return app;
}

