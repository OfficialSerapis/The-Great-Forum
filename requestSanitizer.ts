import { Request, Response, NextFunction } from 'express';
import { stringUtility } from '../utils/string';

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = stringUtility.sanitizeHtml(req.body[key]);
        }
      });
    }

    // Sanitize query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = stringUtility.sanitizeHtml(req.query[key]);
        }
      });
    }

    // Sanitize URL parameters
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        if (typeof req.params[key] === 'string') {
          req.params[key] = stringUtility.sanitizeHtml(req.params[key]);
        }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
