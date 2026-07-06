import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { performanceMonitor } from './performance';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const logger = new Logger('RequestLogger');
  const start = Date.now();

  // Log request details
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers,
    body: req.body
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      responseLength: res.get('Content-Length')
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`
      });
    }
  });

  // Add performance monitoring
  performanceMonitor.monitorPerformance(req, res, next);
};
