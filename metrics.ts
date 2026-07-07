import { Logger } from './logger';
import { performanceMonitor } from '../middleware/performance';

class Metrics {
  private static instance: Metrics;
  private logger: Logger;
  private metrics: Map<string, number>;
  private readonly interval: number;

  private constructor() {
    this.logger = new Logger('Metrics');
    this.metrics = new Map();
    this.interval = parseInt(process.env.METRICS_INTERVAL || '60000'); // 1 minute

    // Start periodic reporting
    setInterval(() => this.reportMetrics(), this.interval).unref();
  }

  public static getInstance(): Metrics {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics();
    }
    return Metrics.instance;
  }

  // Increment a metric counter
  increment(metric: string, value: number = 1): void {
    const currentValue = this.metrics.get(metric) || 0;
    this.metrics.set(metric, currentValue + value);
  }

  // Set a metric value
  set(metric: string, value: number): void {
    this.metrics.set(metric, value);
  }

  // Get current metrics
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  // Report metrics to monitoring system
  private async reportMetrics(): Promise<void> {
    try {
      const metrics = this.getMetrics();
      
      // Log metrics
      this.logger.info('Metrics report:', Object.fromEntries(metrics));

      // Reset metrics
      this.metrics.clear();

      // Additional metric reporting logic here
      // This could include:
      // - Sending to external monitoring service
      // - Writing to database
      // - Generating alerts
    } catch (error) {
      this.logger.error('Failed to report metrics:', error);
    }
  }

  // Track API performance
  trackApiPerformance(req: any, res: any, duration: number): void {
    const metrics = {
      endpoint: req.path,
      method: req.method,
      status: res.statusCode,
      duration: duration,
      timestamp: new Date().toISOString()
    };

    // Increment request counters
    this.increment('total_requests');
    this.increment(`requests_${metrics.status}`);
    this.increment(`requests_${metrics.method}`);

    // Track response times
    this.set(`response_time_${metrics.method}`, duration);
    this.set(`response_time_${metrics.status}`, duration);
  }

  // Track database performance
  trackDatabasePerformance(query: string, duration: number): void {
    const metrics = {
      query: query,
      duration: duration,
      timestamp: new Date().toISOString()
    };

    // Increment query counters
    this.increment('database_queries');
    this.increment(`database_queries_${query}`);

    // Track query times
    this.set(`database_query_time_${query}`, duration);
  }

  // Track cache performance
  trackCachePerformance(operation: string, duration: number): void {
    const metrics = {
      operation: operation,
      duration: duration,
      timestamp: new Date().toISOString()
    };

    // Increment cache operation counters
    this.increment('cache_operations');
    this.increment(`cache_operations_${operation}`);

    // Track cache times
    this.set(`cache_operation_time_${operation}`, duration);
  }
}

export const metrics = Metrics.getInstance();
