import { Request, Response, NextFunction } from 'express';

export const permissions = (req: Request, res: Response, next: NextFunction) => {
  next();
};
