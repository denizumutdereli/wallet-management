import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { APP_NAME, LOGSERVER, LOG_DIR, NODE_ENV } from '@/config';
import { SyslogTransportOptions, Syslog } from 'winston-syslog';

// logs dir
const logDir: string = join(__dirname, LOG_DIR);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const opt: SyslogTransportOptions = {
  host: LOGSERVER,
  port: 514,
  protocol: 'tcp4',
  facility: 'local0',
  app_name: APP_NAME,
  eol: '\n',
};

// Define log format
let logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

if (NODE_ENV !== 'production') {
  logFormat = winston.format.printf(
    ({ timestamp, level, message, stack }) => `${timestamp} ${level}: ${message} ${stack ? `at line ${stack.split('\n')[1]}` : ''}`,
  );
}

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting OFF not requried since now we have syslog enabled
    // new winstonDaily({
    //   level: 'debug',
    //   datePattern: 'YYYY-MM-DD',
    //   dirname: logDir + '/debug', // log file /logs/debug/*.log in save
    //   filename: `%DATE%.log`,
    //   maxFiles: 30, // 30 Days saved
    //   json: false,
    //   zippedArchive: true,
    // }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
    new Syslog(opt),
  ],
});

if (NODE_ENV === 'production') {
  logger.transports.push(new Syslog(opt));
}

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
