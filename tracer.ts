import opentelemetry from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';

import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

module.exports = (serviceName: any) => {

  //Specify zipkin url. defualt url is http://localhost:9411/api/v2/spans
  const zipkinUrl = 'http://localhost';
  const zipkinPort = '9411';
  const zipkinPath = '/api/v2/spans';
  const zipkinURL = `${zipkinUrl}:${zipkinPort}${zipkinPath}`;

  const options = {
    headers: {
      'my-header': 'header-value',
    },
    url: zipkinURL,
    //serviceName: 'your-application-name',
    
   
    // optional interceptor
    getExportRequestHeaders: () => {
      return {
        'my-header': 'header-value',
      }
    }
  }
  const traceExporter_zipkin = new ZipkinExporter(options);

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter_zipkin));

  provider.register();

  registerInstrumentations({
    instrumentations: [
      // new ExpressInstrumentation({
      //     requestHook: (span, reqInfo) => {
      //         span.setAttribute('request-headers',JSON.stringify(reqInfo.req.headers))
      //     }
      // }),
      new ExpressInstrumentation(),
      new HttpInstrumentation()
    ],
  });

  return opentelemetry.trace.getTracer(serviceName);
};