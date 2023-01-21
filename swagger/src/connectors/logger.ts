import { createLogger, transports, format, Logger } from "winston"
const WinstonLogStash = require('winston3-logstash-transport');

let logger: Logger

const initializeLogger = () => {
  if (logger) {
    return
  }
  
    // logger = createLogger({
    //   transports: [
    //     new transports.Console({
    //     format: format.combine(format.simple(), format.colorize())
    //     })]
    // })
    logger = createLogger({})
    logger.add(new WinstonLogStash({
      mode: 'tcp',
      host: 'localhost',
      port: 5959,
      applicationName: "UserSwagger"
    }));
}

  export const getLogger = () => {
  initializeLogger()
  return logger
}
