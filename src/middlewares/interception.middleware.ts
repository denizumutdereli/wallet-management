import { NextFunction, Response, Request } from 'express';

const Interception = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.id) {
    req.query._id = req.query.id;
    delete req.query.id;
  }

  if (req.body.id) {
    req.body._id = req.body.id;
    delete req.body.id;
  }

  if (req.params.id) {
    req.params._id = req.params.id;
    delete req.params.id;
  }

  next();
};
export default Interception;
