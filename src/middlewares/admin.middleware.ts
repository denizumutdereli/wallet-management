import { ErrorHandler, ErrorInterface, errs } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = req.decoded as any;
    if (decoded.role !== 'admin') {
      const message = req.t('ERROR.NOTALLOWED');
      throw errs.UNAUTHORIZED(message);
    }
    next();
  } catch (error) {
    let handledError: ErrorInterface;
    if (error instanceof ErrorHandler) {
      handledError = error;
    } else {
      handledError = errs.UNAUTHORIZED(error);
    }

    const message = handledError.serialize();
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${handledError.getStatus()}, Message:: ${message.error}`);
    return res.status(handledError.getStatus()).json(message);
  }
};

export default adminMiddleware;
