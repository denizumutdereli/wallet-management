import UserService from '@/services/user/user.service';
import { NextFunction, Request, Response } from 'express';

class Http {
  constructor(private readonly service: UserService) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body.created_by = req.decoded.id;
      const response = await this.service.create(req.body);

      res.status(201).json({ data: response, message: 'create' });
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

  public profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.findDataById(req.decoded.id);

      res.status(201).json({ data: response, message: 'profile' });
    } catch (error) {
      next(error);
    }
  };

  public autocomplete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.search = req.params.search;
      const response = await this.service.autocomplete(req.query as any);

      res.status(201).json({ data: response, message: 'search' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body._id = req.params._id;
      // req.body.updated_by = req.decoded.id;
      const response = await this.service.update(req.body);

      res.status(201).json({ data: response, message: 'update' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body.deleted_by = req.decoded.id;
      const response = await this.service.delete(req.params._id);

      res.status(201).json({ data: response, message: 'delete' });
    } catch (error) {
      next(error);
    }
  };
}

export default Http;
