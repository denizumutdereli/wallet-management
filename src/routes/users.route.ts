import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Throttling from '@/config/api.limiter';
import { RouteInterface } from '@/interfaces/route.interface';
import Http from '@/transports/http/user';
import { initService } from '@/services/user/user.service';
import userModel from '@/models/users.model';
import domainModal from '@/models/domain.model';

const UserLimiter = rateLimit(new Throttling({ page: 'user', test: true }).LIMIT);

class UserRoute implements RouteInterface {
  public path = '/api/user';
  public router = Router();
  public http: Http;

  constructor() {
    const userService = initService(userModel, domainModal);
    this.http = new Http(userService);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, UserLimiter, this.http.search);
    // this.router.get(`${this.path}/:_id`, UserLimiter, this.Http.findById);
    this.router.post(`${this.path}/create`, UserLimiter, this.http.create);
    this.router.patch(`${this.path}/update/:_id`, UserLimiter, this.http.update);
    this.router.delete(`${this.path}/delete/:_id`, UserLimiter, this.http.delete);
    this.router.get(`${this.path}/profile`, UserLimiter, this.http.profile);
    this.router.get(`${this.path}/autocomplete/:search`, UserLimiter, this.http.autocomplete);
  }
}

export default UserRoute;
