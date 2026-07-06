import { Request, Response, NextFunction } from 'express';
import { InputValidationSchema } from '../types/security';
import { ApiError } from './errorHandler';

export const validateInput = (schema: InputValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check required fields
      if (schema.required) {
        const missingFields = schema.required.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
          throw new ApiError(`Missing required fields: ${missingFields.join(', ')}`, 400);
        }
      }

      // Validate each property
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([field, rules]) => {
          const value = req.body[field];

          // Check type
          if (rules.type && typeof value !== rules.type) {
            throw new ApiError(`Invalid type for field ${field}`, 400);
          }

          // Check format
          if (rules.format && !new RegExp(rules.format).test(value)) {
            throw new ApiError(`Invalid format for field ${field}`, 400);
          }

          // Check pattern
          if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
            throw new ApiError(`Invalid pattern for field ${field}`, 400);
          }

          // Check length
          if (rules.minLength && value.length < rules.minLength) {
            throw new ApiError(`Field ${field} is too short`, 400);
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            throw new ApiError(`Field ${field} is too long`, 400);
          }
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
