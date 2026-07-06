import { Logger } from '../utils/logger';
import { metrics } from '../utils/metrics';
import { sentry } from './config';
import { emailTransport } from './config';

class MonitoringService {
  private static instance: MonitoringService;
  private logger: Logger;
  private readonly errorThreshold: number;
  private readonly performanceThreshold: number;
  private readonly alertInterval: number;

  private constructor() {
    this.logger = new Logger('MonitoringService');
    this.errorThreshold = parseInt(process.env.ERROR_THRESHOLD || '5');
    this.performanceThreshold = parseInt(process.env.PERFORMANCE_THRESHOLD || '500'); // 500ms
    this.alertInterval = parseInt(process.env.ALERT_INTERVAL || '300000'); // 5 minutes

    // Start periodic checks
    setInterval(() => this.checkHealth(), this.alertInterval).unref();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Track errors
  trackError(error: Error, context: string): void {
    try {
      // Log error
      this.logger.error('Error occurred:', {
        context,
        message: error.message,
        stack: error.stack
      });

      // Send to Sentry
      sentry.captureException(error, {
        tags: { context },
        extra: { stack: error.stack }
      });

      // Increment error counter
      metrics.increment('errors_total');
      metrics.increment(`errors_${context}`);

      // Check if we need to send alert
      this.checkErrorThreshold();
    } catch (err) {
      this.logger.error('Failed to track error:', err);
    }
  }

  // Track performance
  trackPerformance(
    operation: string,
    duration: number,
    context: string
  ): void {
    try {
      // Log performance
      this.logger.info('Performance metrics:', {
        operation,
        duration,
        context
      });

      // Track metrics
      metrics.set(`performance_${operation}`, duration);
      metrics.set(`performance_${context}`, duration);

      // Check if we need to send alert
      this.checkPerformanceThreshold(operation, duration);
    } catch (err) {
      this.logger.error('Failed to track performance:', err);
    }
  }

  // Check health status
  async checkHealth(): Promise<void> {
    try {
      const metrics = metrics.getMetrics();
      const errorCount = metrics.get('errors_total') || 0;
      
      if (errorCount > this.errorThreshold) {
        await this.sendAlert('High Error Rate', `
          Error threshold exceeded (${errorCount} errors)
          Please check the logs for more details.
        `);
      }

      // Check performance metrics
      metrics.forEach((value, key) => {
        if (key.startsWith('performance_') && value > this.performanceThreshold) {
          this.sendAlert('Performance Alert', `
            Slow operation detected (${key} took ${value}ms)
            Please investigate performance issues.
          `);
        }
      });
    } catch (err) {
      this.logger.error('Failed to check health:', err);
    }
  }

  // Send alert
  async sendAlert(title: string, message: string): Promise<void> {
    try {
      const recipients = process.env.ALERT_RECIPIENTS?.split(',') || [];
      
      if (recipients.length === 0) {
        this.logger.warn('No alert recipients configured');
        return;
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: recipients,
        subject: `[SMC Alert] ${title}`,
        text: message,
        html: `<h1>${title}</h1><p>${message}</p>`
      };

      await emailTransport.sendMail(mailOptions);
      this.logger.info('Alert sent successfully');
    } catch (err) {
      this.logger.error('Failed to send alert:', err);
      // Send to Sentry as a fallback
      sentry.captureException(err, {
        tags: { type: 'alert' },
        extra: { message }
      });
    }
  }

  // Check error threshold
  private checkErrorThreshold(): void {
    const errorCount = metrics.getMetrics().get('errors_total') || 0;
    
    if (errorCount > this.errorThreshold) {
      this.sendAlert('Error Threshold Exceeded', `
        Error threshold (${this.errorThreshold}) exceeded with ${errorCount} errors.
        Please investigate immediately.
      `);
    }
  }

  // Check performance threshold
  private checkPerformanceThreshold(operation: string, duration: number): void {
    if (duration > this.performanceThreshold) {
      this.sendAlert('Performance Degradation', `
        Operation ${operation} took ${duration}ms
        This exceeds the threshold of ${this.performanceThreshold}ms
      `);
    }
  }
}

export const monitoringService = MonitoringService.getInstance();
