import { createClient } from '@sentry/node';
import { createTransport } from 'nodemailer';
import { Logger } from '../utils/logger';

// Initialize Sentry
const sentry = createClient({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Initialize email transport
const emailTransport = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Initialize performance monitoring
const performanceMonitoring = {
  thresholds: {
    responseTime: 1000, // 1 second
    memoryUsage: 100 * 1024 * 1024, // 100MB
    cpuUsage: 80, // 80%
  },
  checkInterval: 5000, // 5 seconds
};

// Initialize error reporting
const errorReporting = {
  enabled: process.env.ERROR_REPORTING === 'true',
  providers: [
    'sentry',
    'email',
    'console',
  ],
};

// Initialize health checks
const healthChecks = {
  endpoints: {
    '/health': {
      checks: ['database', 'redis', 'cache'],
      timeout: 5000,
    },
    '/ready': {
      checks: ['database', 'redis', 'cache', 'services'],
      timeout: 10000,
    },
  },
};

export {
  sentry,
  emailTransport,
  performanceMonitoring,
  errorReporting,
  healthChecks,
};
