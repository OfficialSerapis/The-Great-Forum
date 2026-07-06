import { Request, Response, NextFunction } from 'express';
import { XSSConfig } from '../types/security';
import { ApiError } from './errorHandler';

const defaultConfig: XSSConfig = {
  onNoMatch: 'escape',
  whiteList: ['text/plain', 'application/json'],
  escapeHtml: true
};

export const xssProtection = (config: Partial<XSSConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check content type
      const contentType = req.headers['content-type'];
      if (!finalConfig.whiteList.includes(contentType)) {
        if (finalConfig.onNoMatch === 'throw') {
          throw new ApiError('Invalid content type', 400);
        } else {
          // Escape HTML
          if (finalConfig.escapeHtml) {
            escapeHtml(req.body);
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const escapeHtml = (obj: any): void => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      } else if (typeof obj[key] === 'object') {
        escapeHtml(obj[key]);
      }
    });
  }
};
