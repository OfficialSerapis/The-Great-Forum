import { Request, Response, NextFunction } from 'express';
import { cacheConfig } from '../config/cache';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = `rate_limit:${req.ip}`;
    const limit = parseInt(process.env.RATE_LIMIT || '100');
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '60000'); // 1 minute

    // Get current count
    const count = await cacheConfig.get(key);
    
    if (count) {
      if (count >= limit) {
        return res.status(429).json({
          error: 'Too many requests. Please try again later.'
        });
      }
    } else {
      await cacheConfig.set(key, 1, windowMs);
    }

    // Increment count
    await cacheConfig.incr(key);
    
    next();
  } catch (error) {
    next(error);
  }
};

// Custom rate limiter for specific endpoints
export const documentRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = `rate_limit:document:${req.ip}`;
    const limit = parseInt(process.env.DOCUMENT_RATE_LIMIT || '50');
    const windowMs = parseInt(process.env.DOCUMENT_RATE_LIMIT_WINDOW || '300000'); // 5 minutes

    const count = await cacheConfig.get(key);
    
    if (count && count >= limit) {
      return res.status(429).json({
        error: 'Too many document operations. Please try again later.'
      });
    }

    if (!count) {
      await cacheConfig.set(key, 1, windowMs);
    } else {
      await cacheConfig.incr(key);
    }

    next();
  } catch (error) {
    next(error);
  }
};
