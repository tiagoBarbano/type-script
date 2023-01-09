import 'reflect-metadata';
import dotenv from 'dotenv';
import { start_routers } from './src/app'
import { getLogger } from './src/connectors/logger';

/* Start Server */
async function start() {
  dotenv.config();
  
  const log = getLogger()
  const port = process.env.PORT;  
  const app = await start_routers();

  app.listen(port);
  log.info(`⚡️[server]: Server is running at http://localhost:${port}`);
}

start()

