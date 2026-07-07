import { Request, Response, NextFunction } from 'express';
import { EnhancedRequest } from './request';

export type RequestHandler = (
  req: EnhancedRequest,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

export type ErrorHandler = (
  error: Error,
  req: EnhancedRequest,
  res: Response,
  next: NextFunction
) => void;

export interface RouteConfig {
  path: string;
  handler: RequestHandler;
  method: 'get' | 'post' | 'put' | 'delete';
  middleware?: RequestHandler[];
}
