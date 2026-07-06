import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error) {
      next(new ApiError('Invalid request data', 400));
    }
  };
};

export const validateQuery = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query);
      next();
    } catch (error) {
      next(new ApiError('Invalid query parameters', 400));
    }
  };
};

export const validateParams = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params);
      next();
    } catch (error) {
      next(new ApiError('Invalid path parameters', 400));
    }
  };
};

export const validateHeaders = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.headers);
      next();
    } catch (error) {
      next(new ApiError('Invalid headers', 400));
    }
  };
};
