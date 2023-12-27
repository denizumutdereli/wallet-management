import { NextFunction, Request, Response } from 'express';
import AuthService from '@/services/auth/auth.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import { ByeReponse } from '@/services/auth/auth.dto';

class AuthHttp {
  constructor(private readonly service: AuthService) {}

  public auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookie, token } = await this.service.login(req.body);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookie, token } = await this.service.refresh(req.decoded);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: token, message: 'refresh' });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logOutUserData: ByeReponse = await this.service.logout(req.decoded);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json(logOutUserData);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthHttp;
