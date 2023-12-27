import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Throttling from '@/config/api.limiter';
import { RouteInterface } from '@/interfaces/route.interface';
import userModel from '@/models/users.model';
import domainModal from '@/models/domain.model';
import Http from '@/transports/http/domain';
import { initService } from '@/services/domain/domain.service';

const DomainLimiter = rateLimit(new Throttling({ page: 'action', test: true }).LIMIT);

class DomainRoute implements RouteInterface {
  public path = '/api/domain';
  public router = Router();
  public http: Http;

  constructor() {
    const domainService = initService(userModel, domainModal);
    this.http = new Http(domainService);
    this.initializeRoutes();
  }

  // initializeRoutes() {
  //   this.router.get(`${this.path}`, DomainLimiter, this.http.search);
  //   this.router.post(`${this.path}/create`, DomainLimiter, this.http.create);
  //   // this.router.patch(`${this.path}/update/:_id`, DomainLimiter, this.domainHttp.update); //UPDATE!!!
  //   // this.router.delete(`${this.path}/delete/:_id`, DomainLimiter, this.domainHttp.delete);
  //   // this.router.post(`${this.path}/profile`, DomainLimiter, this.domainHttp.profile);
  //   // this.router.get(`${this.path}/autocomplete/:search`, DomainLimiter, this.domainHttp.autocomplete);
  // }

  initializeRoutes() {
    this.router.get(`${this.path}`, DomainLimiter, this.http.search);
    // this.router.get(`${this.path}/:_id`, UserLimiter, this.Http.findById);
    this.router.post(`${this.path}/create`, DomainLimiter, this.http.create);
    this.router.patch(`${this.path}/update/:_id`, DomainLimiter, this.http.update);
    this.router.delete(`${this.path}/delete/:_id`, DomainLimiter, this.http.delete);
    this.router.get(`${this.path}/profile`, DomainLimiter, this.http.profile);
    this.router.get(`${this.path}/autocomplete/:search`, DomainLimiter, this.http.autocomplete);
  }
}

export default DomainRoute;
