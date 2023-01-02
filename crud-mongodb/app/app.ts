import express, { Express } from 'express';
import { connectToDatabase } from './connectors/dbconnector';
import user from './service/user_service'

/* Start Server */
export async function start_routers() {
  const app: Express = express();
  app.use(express.json())
  app.use('/user', user);
  await connectToDatabase()

  return app;
}

