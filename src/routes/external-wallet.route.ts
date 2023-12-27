import Throttling from '@/config/api.limiter';
import { RouteInterface } from '@/interfaces/route.interface';
import domainModal from '@/models/domain.model';
import mnemonicModel from '@/models/mnemonics.model';
import userModel from '@/models/users.model';
import walletModel from '@/models/wallet.model';
import { initService } from '@/services/external-wallet/wallet.service';
import Http from '@/transports/http/external-wallet';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const WalletLimiter = rateLimit(new Throttling({ page: 'action', test: true }).LIMIT);

class ExternalWalletRoute implements RouteInterface {
  public path = '/';
  public router = Router();
  public http: Http;

  constructor() {
    const walletService = initService(userModel, domainModal, walletModel, mnemonicModel);
    this.http = new Http(walletService);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}api/external-wallet`, WalletLimiter, this.http.create);
    this.router.get(`${this.path}api/external-wallet`, WalletLimiter, this.http.search);
    // this.router.post(`${this.path}api/node-wallet`, WalletLimiter, this.http.createNodeWallet);
    // this.router.post(`${this.path}api/virtual-wallet`, WalletLimiter, this.http.createVirtualAccount);
    // this.router.post(`${this.path}api/virtual-wallet/engage`, WalletLimiter, this.http.engageToVirtualAccount);
  }
}

export default ExternalWalletRoute;
