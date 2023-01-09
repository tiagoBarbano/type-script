import express, { Request, Response} from 'express';
import { controller, httpGet, interfaces, request, response, next } from 'inversify-express-utils';
import client from 'prom-client'

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

collectDefaultMetrics({ register });
//register.metrics().then(str => console.log(str));

export const httpRequestTimer = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  // buckets for response time from 0.1ms to 1s
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000],
});

@controller('/metrics')
export class PrometheusController implements interfaces.Controller {

    @httpGet("/")
    public async createUser(@request() req: Request, 
                            @response() res: Response, 
                            @next() next: express.NextFunction) {
      
      res.set('Content-Type', register.contentType)                              
      res.end(await register.metrics( ))
    }
}
