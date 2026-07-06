import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Implement rate limiting
  next();
};

export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // Implement XSS protection
  next();
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Implement CSRF protection
  next();
};

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

export const validateInput = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error) {
      next(new ApiError('Invalid input data', 400));
    }
  };
};
