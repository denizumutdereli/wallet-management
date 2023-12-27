import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { NODE_ENV, INTERNAL_IPS } from '@/config';
import { errs } from '@exceptions/HttpException';

const getRemoteIp = (req: Request): string => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip === '::1') {
    ip = '127.0.0.1';
  } else {
    ip = ip.toString().replace('::ffff:', '');
  }
  return ip;
};

const internalMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const env = NODE_ENV || 'development';
    if (env === 'development2') {
      next();
    } else {
      const validIps = INTERNAL_IPS.split(',') || ['127.0.0.1'];
      const ip = getRemoteIp(req);

      if (validIps.includes(ip)) {
        next();
      } else {
        const message = ip + `${req.t('NOACCESS')}`;
        const err = errs.FORBIDDEN(message);
        const { status } = err;

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        return res.status(status).json(err.serialize());
      }
    }
  } catch (error) {
    const message = `${req.t('NOACCESS')}`;
    const err = errs.BAD_REQUEST(message, error);
    const { status } = err;
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return res.status(status).json(err.serialize());
  }
};

export default internalMiddleware;
