import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import './controllers/user_controller';
import './connectors/prometheus';
import { UserServiceImpl } from './service/impl/user_service_impl';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as swagger from "@inversify-cn/swagger-express-ts"


export async function start_routers() {

  const container = new Container();

  container
    .bind<UserServiceImpl>(UserServiceImpl.name)
    .to(UserServiceImpl)
    .inSingletonScope()

  const server = new InversifyExpressServer(container);

  server.setConfig((app) => {
    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(express.json());
    app.use(swagger.express(
      {
        definition: {
          info: {
            title: "My api",
            version: "1.0"
          },
          externalDocs: {
            url: "My url"
          }
          // Models can be defined here
        }
      }
    ));
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

