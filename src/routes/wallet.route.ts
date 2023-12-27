import Throttling from '@/config/api.limiter';
import { RouteInterface } from '@/interfaces/route.interface';
import domainModal from '@/models/domain.model';
import mnemonicModel from '@/models/mnemonics.model';
import userModel from '@/models/users.model';
import walletModel from '@/models/wallet.model';
import { initService } from '@/services/wallet/wallet.service';
import Http from '@/transports/http/wallet';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const WalletLimiter = rateLimit(new Throttling({ page: 'action', test: true }).LIMIT);

class WalletRoute implements RouteInterface {
  public path = '/api/wallet';
  public router = Router();
  public http: Http;

  constructor() {
    const walletService = initService(userModel, domainModal, walletModel, mnemonicModel);
    this.http = new Http(walletService);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/`, WalletLimiter, this.http.create);
    this.router.get(`${this.path}/`, WalletLimiter, this.http.search);
    this.router.post(`${this.path}/address`, WalletLimiter, this.http.getWallet);
    this.router.get(`${this.path}/:customerId`, WalletLimiter, this.http.getCustomerWallets);
    this.router.get(`${this.path}/:network/:testnet`, WalletLimiter, this.http.getNetworkWallets);
    // this.router.post(`${this.path}/subscribe`, WalletLimiter, this.http.subscribe);
    // this.router.post(`${this.path}/balance`, WalletLimiter, this.http.getBalance);
    // this.router.get(`${this.path}/:userId/:chain`, WalletLimiter, this.http.getWallet);
    // this.router.put(`${this.path}/update/:userId/:chain`, WalletLimiter, this.http.updateWallet);
    // this.router.delete(`${this.path}/delete/:userId/:chain`, WalletLimiter, this.http.deleteWallet);
    // this.router.post(`${this.path}/transaction`, WalletLimiter, this.http.createTransaction);
    // this.router.get(`${this.path}/transaction/:userId/:chain/:txId`, WalletLimiter, this.http.checkTransactionStatus);
    // this.router.get(`${this.path}/transactions/:userId/:chain`, WalletLimiter, this.http.listLatestTransactions);
    // this.router.post(`${this.path}/mnemonic`, WalletLimiter, this.http.manageMnemonic);
  }
}

export default WalletRoute;
