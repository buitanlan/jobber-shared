import { ElasticsearchTransformer, ElasticsearchTransport, LogData } from 'winston-elasticsearch';
import winston from 'winston';

export const esTransformer = (logData: LogData) => ElasticsearchTransformer(logData);
export const winstonLogger = (elasticsearchNode: string, name: string, level: string) => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
    },
  };
  const esTransport = new ElasticsearchTransport(options.elasticsearch);
  return winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport],
  });
};
