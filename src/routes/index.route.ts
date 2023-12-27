import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Throttling from '@/config/api.limiter';
import { RouteInterface } from '@/interfaces/route.interface';
import HomeHttp from '@/transports/http/home';
import { initHomeService } from '@/services/home/home.service';
import secretTokenMiddleware from '@/middlewares/secret.middleware';
import userModel from '@/models/users.model';

const HomeLimiter = rateLimit(new Throttling({ page: 'auth', test: true }).LIMIT);
const SetupLimiter = rateLimit(new Throttling({ page: 'setup', test: true }).LIMIT);
const ConfigLimiter = rateLimit(new Throttling({ page: 'config', test: true }).LIMIT);

class HomeRoute implements RouteInterface {
  public path = '/';
  public router = Router();
  public homeHttp: HomeHttp;

  constructor() {
    const homeService = initHomeService(userModel);
    this.homeHttp = new HomeHttp(homeService);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.all(`${this.path}`, HomeLimiter, this.homeHttp.index);
    this.router.put(`${this.path}setup`, SetupLimiter, secretTokenMiddleware, this.homeHttp.setup);
    this.router.get(`${this.path}api/config`, ConfigLimiter, this.homeHttp.config);
    // this.router.post(`${this.path}api/wallet`, this.homeHttp.wallet);
    // this.router.get(`${this.path}api/wallet`, this.homeHttp.balance);
  }
}

export default HomeRoute;
