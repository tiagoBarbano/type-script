import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import './controllers/user_controller';
import './connectors/prometheus';
import { UserServiceImpl } from './service/impl/user_service_impl';
import { InversifyExpressServer } from 'inversify-express-utils';

import { Tracer } from 'zipkin';
import { BatchRecorder } from 'zipkin';
const { jsonEncoder: {JSON_V2} } = require('zipkin');
import { HttpLogger } from 'zipkin-transport-http';
const CLSContext = require('zipkin-context-cls');


export async function start_routers() {

  const ctxImpl = new CLSContext();

  const recorder = new BatchRecorder({
      logger: new HttpLogger({
        endpoint: `http://localhost:9411/api/v1/spans`
      })
    });

  const tracer = new Tracer({ctxImpl, recorder}); // configure your tracer properly here

  const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
  const container = new Container();

  container
    .bind<UserServiceImpl>(UserServiceImpl.name)
    .to(UserServiceImpl)
    .inSingletonScope()

  const server = new InversifyExpressServer(container);
  server.setConfig((app) => {
    app.use(express.json());
    app.use(zipkinMiddleware({
      tracer,
      serviceName: 'CRUD-USERS' // name of this application
    }));
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

