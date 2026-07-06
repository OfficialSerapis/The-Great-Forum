import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

const sqlInjectionPatterns = [
  /['"`]/g, // Single/double quotes
  /\b(SELECT|UPDATE|DELETE|DROP|EXEC|ALTER|UNION|INSERT)\b/i, // SQL keywords
  /--|--\s+|\/\*|\*\//i, // SQL comments
  /\b(OR|AND)\b/i, // Logical operators
  /\b(UNION|JOIN)\b/i // Table operations
];

export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  try {
    const checkForSqlInjection = (value: any): boolean => {
      if (typeof value === 'string') {
        return sqlInjectionPatterns.some(pattern => pattern.test(value));
      }
      return false;
    };

    // Check query parameters
    const hasSqlInjectionInQuery = Object.values(req.query).some(checkForSqlInjection);
    if (hasSqlInjectionInQuery) {
      throw new ApiError('Invalid query parameters', 400);
    }

    // Check body parameters
    const hasSqlInjectionInBody = Object.values(req.body).some(checkForSqlInjection);
    if (hasSqlInjectionInBody) {
      throw new ApiError('Invalid request body', 400);
    }

    // Check URL parameters
    const hasSqlInjectionInParams = Object.values(req.params).some(checkForSqlInjection);
    if (hasSqlInjectionInParams) {
      throw new ApiError('Invalid URL parameters', 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};
