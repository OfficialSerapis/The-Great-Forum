import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { fileUtility } from '../utils/file';

class RequestThrottler {
  private static instance: RequestThrottler;
  private logger: Logger;
  private throttleMap: Map<string, number>;
  private readonly maxRequests: number;
  private readonly windowMs: number;

  private constructor() {
    this.logger = new Logger('RequestThrottler');
    this.throttleMap = new Map();
    this.maxRequests = parseInt(process.env.MAX_REQUESTS_PER_WINDOW || '100');
    this.windowMs = parseInt(process.env.THROTTLE_WINDOW_MS || '60000'); // 1 minute
  }

  public static getInstance(): RequestThrottler {
    if (!RequestThrottler.instance) {
      RequestThrottler.instance = new RequestThrottler();
    }
    return RequestThrottler.instance;
  }

  public throttle = (req: Request, res: Response, next: NextFunction) => {
    const key = this.getKey(req);
    const now = Date.now();

    // Clean up old entries
    this.cleanupOldEntries(now);

    // Get current count or initialize
    const count = this.throttleMap.get(key) || 0;

    // Check if request is allowed
    if (count >= this.maxRequests) {
      this.logger.warn('Request throttled:', {
        ip: req.ip,
        endpoint: req.path,
        method: req.method
      });

      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.round(this.windowMs / 1000)
      });
    }

    // Update count
    this.throttleMap.set(key, count + 1);
    next();
  };

  private getKey(req: Request): string {
    // Use a combination of IP and endpoint for more granular throttling
    return `${req.ip}-${req.path}`;
  }

  private cleanupOldEntries(now: number): void {
    const threshold = now - this.windowMs;
    for (const [key, timestamp] of this.throttleMap) {
      if (timestamp < threshold) {
        this.throttleMap.delete(key);
      }
    }
  }

  public async logRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const startTime = Date.now();
      const key = this.getKey(req);

      // Log request details
      this.logger.info('Request received:', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      // Continue with request
      next();

      // Log response details
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logger.info('Request completed:', {
          method: req.method,
          path: req.path,
          status: res.statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      this.logger.error('Error logging request:', error);
      next(error);
    }
  }
}

export const requestThrottler = RequestThrottler.getInstance();
