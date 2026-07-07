import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export interface EnhancedRequest extends Request {
  user?: User;
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void> | void;

export type AuthenticatedRequestHandler = (
  req: EnhancedRequest,
  res: Response,
  next: NextFunction
) => Promise<Response | void> | void;
