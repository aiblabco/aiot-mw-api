const winston = require('winston');
const config = require('./config');
require('winston-daily-rotate-file');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),

    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/express-api-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '1M',
      maxFiles: '14d',
      name: 'error',
      createSymlink: true,
      symlinkName: 'error.log',
      handleExceptions: true,
      json: true,
      colorize: false,
    }),
  ],
});

module.exports = logger;
