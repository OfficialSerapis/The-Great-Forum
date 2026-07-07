import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// Shared configuration
export const config = {
  // Version
  version: process.env.SHARED_VERSION || '1.0.0',

  // Feature Flags
  features: {
    darkMode: process.env.SHARED_ENABLE_DARK_MODE === 'true',
    notifications: process.env.SHARED_ENABLE_NOTIFICATIONS === 'true',
    emoji: process.env.SHARED_ENABLE_EMOJI === 'true',
  },

  // Performance
  performance: {
    cacheTTL: parseInt(process.env.SHARED_CACHE_TTL || '3600'),
    maxRequests: parseInt(process.env.SHARED_MAX_REQUESTS || '100'),
  },

  // Security
  security: {
    csrfToken: process.env.SHARED_CSRF_TOKEN || 'your_csrf_token',
    corsOrigin: process.env.SHARED_CORS_ORIGIN || 'http://localhost:3000',
  },

  // Analytics
  analytics: {
    id: process.env.SHARED_ANALYTICS_ID || 'your_analytics_id',
  },

  // Storage
  storage: {
    uploadDir: process.env.SHARED_UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.SHARED_MAX_FILE_SIZE || '5000000'),
    allowedFileTypes: (process.env.SHARED_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf')
      .split(',')
      .map(type => type.trim()),
  },

  // Cache
  cache: {
    ttl: parseInt(process.env.SHARED_CACHE_TTL || '3600'),
    max: parseInt(process.env.SHARED_CACHE_MAX || '1000'),
  },

  // Logging
  logging: {
    level: process.env.SHARED_LOG_LEVEL || 'debug',
    dir: process.env.SHARED_LOG_DIR || './logs',
  },
};

// Type definitions
export type Config = typeof config;
export type FeatureFlags = typeof config.features;
export type PerformanceConfig = typeof config.performance;
export type SecurityConfig = typeof config.security;
export type AnalyticsConfig = typeof config.analytics;
export type StorageConfig = typeof config.storage;
export type CacheConfig = typeof config.cache;
export type LoggingConfig = typeof config.logging;

export default config;
