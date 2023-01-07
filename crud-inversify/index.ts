import 'reflect-metadata';
import dotenv from 'dotenv';
import { start_routers } from './src/app'


/* Start Server */
async function start() {
  dotenv.config();
  const port = process.env.PORT;  

  const app = await start_routers();

  app.listen(port);

  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}

start()

