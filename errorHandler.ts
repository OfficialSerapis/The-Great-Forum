import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export interface AppError extends Error {
  status?: number;
  message: string;
  isOperational?: boolean;
}

export class ApiError extends Error {
  status: number;
  isOperational: boolean;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.isOperational = true;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    Logger.error(`Operational Error: ${err.message}`);
    return res.status(err.status).json({
      status: 'error',
      message: err.message
    });
  }

  // Log error for debugging
  Logger.error('Error:', err);

  // Handle validation errors from Express-validator
  if (err.name === 'ValidationError') {
    Logger.error('Validation error:', err);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    Logger.error('JWT error:', err);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }

  // Handle database errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    Logger.error('Database validation error:', err);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
  }

  // Handle generic errors
  Logger.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

export default AppError;
