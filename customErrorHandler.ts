import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { ApiError } from './errorHandler';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const logger = new Logger('ErrorHandler');

  // Log error
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Handle different error types
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      status: 'error',
      message: error.message,
      code: error.status
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: error.message,
      errors: error.errors
    });
  }

  // Handle authentication errors
  if (error.name === 'AuthenticationError') {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      code: 401
    });
  }

  // Handle authorization errors
  if (error.name === 'AuthorizationError') {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized',
      code: 403
    });
  }

  // Handle rate limiting errors
  if (error.name === 'RateLimitError') {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests',
      code: 429
    });
  }

  // Handle general errors
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 500
  });
};
