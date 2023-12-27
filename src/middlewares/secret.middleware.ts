import { Request, NextFunction, Response } from 'express';
import { logger } from '@utils/logger';
import { ErrorHandler, errs } from '@/exceptions/HttpException';
import { SECRET_KEY } from '@/config';

const secretTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const SECRET_TOKEN_HEADER = 'secret-token';
    const secretToken = req.header(SECRET_TOKEN_HEADER);

    if (!secretToken) {
      throw errs.VALIDATION(`${req.t('HEADERREQUIRED', { name: SECRET_TOKEN_HEADER })}`);
    } else if (secretToken !== SECRET_KEY) {
      throw errs.VALIDATION(`${req.t('ERROR.NOTALLOWED')}`);
    }

    next();
  } catch (error) {
    if (error instanceof ErrorHandler) {
      const message = error.serialize();
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${error.getStatus()}, Message:: ${message.error}`);
      return res.status(error.getStatus()).json(message);
    } else {
      const err = errs.INTERNAL_SERVER(error);
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${err.getStatus()}, Message:: ${err.serialize()}`);
      return res.status(err.getStatus()).json(err.serialize());
    }
  }
};

export default secretTokenMiddleware;
