import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { stringUtility } from '../utils/string';

interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
  };
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];

      // Validate required fields
      Object.keys(schema).forEach(field => {
        if (schema[field].required && !req.body[field]) {
          errors.push(`Field ${field} is required`);
        }
      });

      // Validate each field
      Object.entries(req.body).forEach(([field, value]) => {
        const fieldSchema = schema[field];
        if (!fieldSchema) return;

        // Check type
        if (fieldSchema.type) {
          const typeCheck = {
            string: typeof value === 'string',
            number: typeof value === 'number',
            boolean: typeof value === 'boolean',
            array: Array.isArray(value),
            object: typeof value === 'object' && !Array.isArray(value)
          };

          if (!typeCheck[fieldSchema.type]) {
            errors.push(`Field ${field} must be of type ${fieldSchema.type}`);
          }
        }

        // Check length
        if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
          errors.push(`Field ${field} must be at least ${fieldSchema.minLength} characters`);
        }

        if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
          errors.push(`Field ${field} must be at most ${fieldSchema.maxLength} characters`);
        }

        // Check pattern
        if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
          errors.push(`Field ${field} does not match required pattern`);
        }

        // Check enum
        if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
          errors.push(`Field ${field} must be one of: ${fieldSchema.enum.join(', ')}`);
        }
      });

      if (errors.length > 0) {
        throw new ApiError('Validation failed', 400, errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
