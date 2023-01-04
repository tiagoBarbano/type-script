import { createLogger, transports, format, Logger } from "winston"
import LokiTransport from "winston-loki"
 
let logger: Logger
 
const initializeLogger = () => {
  if (logger) {
    return
  }
 
  logger = createLogger({
    transports: [new LokiTransport({
        host: process.env.URL_LOKI!,
        labels: { app: 'honeyshop'},
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err)
      }),
      new transports.Console({
        format: format.combine(format.simple(), format.colorize())
      })]
  })
}
 
export const getLogger = () => {
  initializeLogger()
  return logger
}