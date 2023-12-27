import WalletService from '@/services/external-wallet/wallet.service';
import { NextFunction, Request, Response } from 'express';

class Http {
  constructor(private readonly service: WalletService) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.user = req.decoded.id;
      req.body.domain = req.decoded.domain; // bypass
      const response = await this.service.create(req.body);

      res.status(201).json({ data: response, message: 'create main wallet' });
    } catch (error) {
      next(error);
    }
  };

  // public createNodeWallet = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body.user = req.decoded.id;
  //     req.body.domain = req.decoded.domain; // bypass
  //     const response = await this.service.createNodeWallet(req.body);

  //     res.status(201).json({ data: response, message: 'create node wallet' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public createVirtualAccount = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body.user = req.decoded.id;
  //     req.body.domain = req.decoded.domain; // bypass
  //     const response = await this.service.createVirtualAccount(req.body);

  //     res.status(201).json({ data: response, message: 'create virtual account' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public engageToVirtualAccount = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body.user = req.decoded.id;
  //     req.body.domain = req.decoded.domain; // bypass
  //     const response = await this.service.engageToVirtualAccount(req.body);

  //     res.status(201).json({ data: response, message: 'engage to virtual account' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.search(req.query as any);

      res.status(201).json({ data: response, message: 'search' });
    } catch (error) {
      next(error);
    }
  };
}

export default Http;
