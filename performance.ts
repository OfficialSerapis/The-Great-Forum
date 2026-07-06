import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private logger: Logger;
  private constructor() {
    this.logger = new Logger('PerformanceMonitor');
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  monitorPerformance = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

      this.logger.info('Performance metrics', {
        path: req.path,
        method: req.method,
        responseTime: `${responseTime}ms`,
        status: res.statusCode,
        memoryUsage: this.formatMemory(process.memoryUsage().heapUsed)
      });

      // Log slow requests
      if (Number(responseTime) > 1000) {
        this.logger.warn('Slow request', {
          path: req.path,
          method: req.method,
          responseTime: `${responseTime}ms`
        });
      }
    });

    next();
  };

  private formatMemory(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
