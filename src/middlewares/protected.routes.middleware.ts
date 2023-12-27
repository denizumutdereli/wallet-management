import { Request, Response, NextFunction } from 'express';
import authMiddleware from './auth.middleware';
import internalMiddleware from './internal.middleware';

export const protectedEndpoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await internalMiddleware(req, res, async () => {
      /**/
    });
    await authMiddleware(req, res, next);
  } catch (error) {
    next(error);
  }
};
