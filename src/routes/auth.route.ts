import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Throttling from '@/config/api.limiter';
import authMiddleware from '@middlewares/auth.middleware';
import { RouteInterface } from '@/interfaces/route.interface';
import AuthHttp from '@/transports/http/auth';
import { initAuthService } from '@/services/auth/auth.service';
import userModel from '@/models/users.model';

const AuthLimiter = rateLimit(new Throttling({ page: 'auth', test: true }).LIMIT);

class AuthRoute implements RouteInterface {
  public path = '/';
  public router = Router();
  public authHttp: AuthHttp;

  constructor() {
    const authService = initAuthService(userModel);
    this.authHttp = new AuthHttp(authService);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}auth`, AuthLimiter, this.authHttp.auth);
    this.router.post(`${this.path}refresh`, AuthLimiter, authMiddleware, this.authHttp.refresh);
    this.router.post(`${this.path}logout`, AuthLimiter, authMiddleware, this.authHttp.logout);
  }
}

export default AuthRoute;
