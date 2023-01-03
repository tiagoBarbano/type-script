import express, { Express } from 'express';
import user from './controllers/user_controller'

/* Start Server */
export async function start_routers() {
  const app: Express = express();
  app.use(express.json())
  app.use('/user', user);
  return app;
}

