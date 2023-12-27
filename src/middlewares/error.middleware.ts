import { NODE_ENV } from '@/config';
import i18n from '@/i18n';
import { ErrorHandler, ErrorInterface, errs } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

interface MongoServerError extends Error {
  code?: number;
  keyPattern?: Record<string, any>;
}

function isMongoServerError(error: Error | MongoServerError): error is MongoServerError {
  return (error as MongoServerError).code !== undefined;
}

const errorMiddleware = (error: Error | ErrorHandler | MongoServerError, req: Request, res: Response, next: NextFunction) => {
  try {
    const env = NODE_ENV || 'development';
    res.locals.message = error.message;
    res.locals.error = env === 'development' ? error : {};

    const logError = (error: ErrorInterface) => {
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${error.getStatus()}, Message:: ${error.error}`);
    };

    if (error instanceof ErrorHandler) {
      logError(error);
      return res.status(error.getStatus()).json(error.serialize());
    } else {
      let handledError: ErrorInterface;

      if (isMongoServerError(error) && error.code === 11000) {
        const keyPattern = Object.keys(error.keyPattern || {});
        handledError = errs.VALIDATION(`${i18n.t('ALREADY_EXISTS', { name: keyPattern.join(',') })}`);
      } else if (error.name === 'ValidationError') {
        handledError = errs.VALIDATION(error.message);
      } else {
        handledError = errs.INTERNAL_SERVER(error);
      }

      logError(handledError);
      return res.status(handledError.getStatus()).json(handledError.serialize());
    }
  } catch (error) {
    const err = errs.INTERNAL_SERVER(error);
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${err.getStatus()}, Message:: ${err.serialize()}`);
    return res.status(err.getStatus()).json(err.serialize());
  }
};

export default errorMiddleware;
