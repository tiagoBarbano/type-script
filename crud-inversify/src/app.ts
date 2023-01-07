import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import './controllers/user_controller';
import { UserServiceImpl } from './service/impl/user_service_impl';
import { InversifyExpressServer } from 'inversify-express-utils';

/* Start Server */
export async function start_routers() {

  const container = new Container();

  container
    .bind<UserServiceImpl>(UserServiceImpl.name)
    .to(UserServiceImpl)
    .inSingletonScope()

  const server = new InversifyExpressServer(container);
  server.setConfig((app) => {
    app.use(express.json());
  });
  server.setErrorConfig((app: any) => {
    app.use(
      (
        err: Error,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        console.error(err.stack);
        response.status(500).send('Something broke!');
      }
    );
  });

  const app = server.build();
  
  return app;
}

