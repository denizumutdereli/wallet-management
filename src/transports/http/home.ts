import { NextFunction, Request, Response } from 'express';
import HomeService from '@/services/home/home.service';
import { CreateDefaultResponse } from '@/services/home/home.dto';
import { latestTag } from '@/utils/version';

class HomeHttp {
  constructor(private readonly service: HomeService) {}

  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.index();
      const result: CreateDefaultResponse = { status: true, data: response.data, healthcheck: true, version: latestTag || '0.0.1' };
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public setup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.setup();
      const result: CreateDefaultResponse = { status: true, data: response.data, message: 'setup' };
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public config = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.config();
      const result: CreateDefaultResponse = { status: true, data: response.data, message: 'config' };
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  // public wallet = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const response = await this.service.wallet();
  //     const result: any = { status: true, data: response.data, message: 'wallet' };
  //     res.status(201).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public balance = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const response = await this.service.balance(req.query.address.toString());
  //     const result: any = { status: true, data: response.data, message: 'wallet balance' };
  //     res.status(201).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default HomeHttp;
