import winston from 'winston';

import config from './config.js';

const { combine, uncolorize, colorize, printf } = winston.format;

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    config.env === 'development' ? colorize() : uncolorize(),
    printf((info) => `${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
