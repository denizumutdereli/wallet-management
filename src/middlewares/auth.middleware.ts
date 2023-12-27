import { cosbin } from '@/policies/config';
import { initTokenService } from '@/services/token/token.service';
import { ErrorHandler, ErrorInterface, errs } from '@exceptions/HttpException';
import userModel from '@models/users.model';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';
const Tokens = initTokenService(userModel);

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First, perform the token validation as usual
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      const message = `${req.t('LOGIN.NOTOKENPROVIDED')}`;
      throw errs.BAD_REQUEST(message);
    }
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      const message = `${req.t('LOGIN.NOTOKENPROVIDED')}`;
      throw errs.BAD_REQUEST(message);
    }

    let tokenType = '';
    if (req.originalUrl === '/refresh') {
      tokenType = 'refresh';
    }
    const isTokenValid = await Tokens.verifyToken(token, tokenType);
    if (!isTokenValid) {
      const message = `${req.t('LOGIN.INVALIDTOKEN')}`;
      throw errs.BAD_REQUEST(message);
    }
    req.decoded = isTokenValid;

    // Get the role of the user from the token payload
    const role = req.decoded.role;
    const obj = req.originalUrl;
    const act = req.method.toLowerCase();

    // Check if the user has the permission to access the endpoint
    const isAllowed = await (await cosbin()).enforce(role, obj, act);
    if (!isAllowed) {
      const message = `${req.t('ERROR.NOTALLOWED')}`;
      throw errs.UNAUTHORIZED(message);
    }

    next();
  } catch (error) {
    let handledError: ErrorInterface;
    if (error instanceof ErrorHandler) {
      handledError = error;
    } else {
      handledError = errs.INTERNAL_SERVER(error);
    }

    const message = handledError.serialize();
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${handledError.getStatus()}, Message:: ${message.error}`);
    return res.status(handledError.getStatus()).json(message);
  }
};

export default authMiddleware;
