import WalletService from '@/services/wallet/wallet.service';
import { NextFunction, Request, Response } from 'express';

class Http {
  constructor(private readonly service: WalletService) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.created_by = req.decoded.id;
      req.body.user = req.decoded.id;
      req.body.domain = req.decoded.domain; // bypass
      const response = await this.service.create(req.body);

      res.status(201).json({ data: response, message: 'create' });
    } catch (error) {
      next(error);
    }
  };

  public getWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.user = req.decoded.id;
      req.body.domain = req.decoded.domain; // bypass
      const response = await this.service.getWallet(req.body);

      res.status(201).json({ data: response, message: 'wallet' });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerWallets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.user = req.decoded.id;
      req.query.domain = req.decoded.domain; // bypass
      req.query.customerId = req.params.customerId;
      const response = await this.service.getCustomerWallets(req.query as any);

      res.status(201).json({ data: response, message: 'customer wallets' });
    } catch (error) {
      next(error);
    }
  };

  public getNetworkWallets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.user = req.decoded.id;
      req.query.domain = req.decoded.domain; // bypass
      req.query.network = req.params.network;
      req.query.testnet = 'false'; //req.params.testnet; // bypass
      const response = await this.service.getNetworkWallets(req.query as any);

      res.status(201).json({ data: response, message: 'customer wallets' });
    } catch (error) {
      next(error);
    }
  };

  public search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.search(req.query as any);

      res.status(201).json({ data: response, message: 'search' });
    } catch (error) {
      next(error);
    }
  };

  // public getBalance = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body.user = req.decoded.id;
  //     req.body.domain = req.decoded.domain; // bypass
  //     const response = await this.service.getBalance(req.body);

  //     res.status(201).json({ data: response, message: 'wallet balance' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public subscribe = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body.user = req.decoded.id;
  //     req.body.domain = req.decoded.domain; // bypass
  //     const response = await this.service.subscribe(req.body);

  //     res.status(201).json({ data: response, message: 'subscribe' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public search = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const response = await this.service.search(req.query);

  //     res.status(201).json({ data: response, message: 'search' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public profile = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const response = await this.service.findDataById(req.decoded.id);

  //     res.status(201).json({ data: response, message: 'profile' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public autocomplete = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.query.search = req.params.search;
  //     const response = await this.service.autocomplete(req.query);

  //     res.status(201).json({ data: response, message: 'search' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public delete = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     // req.body.deleted_by = req.decoded.id;
  //     const response = await this.service.delete(req.params._id);

  //     res.status(201).json({ data: response, message: 'delete' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default Http;
