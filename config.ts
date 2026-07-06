import { createClient } from 'redis';
import { createConnection } from 'typeorm';
import { Logger } from '../utils/logger';

const logger = new Logger('BackupSystem');

interface BackupConfig {
  database: {
    type: 'postgres' | 'mysql' | 'sqlite';
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  storage: {
    type: 'local' | 's3' | 'azure';
    path: string;
    bucket?: string;
    accessKey?: string;
    secretKey?: string;
  };
  schedule: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  retention: {
    days: number;
    weeks: number;
    months: number;
  };
}

const config: BackupConfig = {
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'smc',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  storage: {
    type: process.env.BACKUP_STORAGE || 'local',
    path: process.env.BACKUP_PATH || '/backups',
    bucket: process.env.BACKUP_BUCKET,
    accessKey: process.env.BACKUP_ACCESS_KEY,
    secretKey: process.env.BACKUP_SECRET_KEY,
  },
  schedule: {
    daily: process.env.BACKUP_DAILY === 'true',
    weekly: process.env.BACKUP_WEEKLY === 'true',
    monthly: process.env.BACKUP_MONTHLY === 'true',
  },
  retention: {
    days: parseInt(process.env.BACKUP_RETENTION_DAYS || '7'),
    weeks: parseInt(process.env.BACKUP_RETENTION_WEEKS || '4'),
    months: parseInt(process.env.BACKUP_RETENTION_MONTHS || '12'),
  },
};

// Initialize database connection
const databaseConnection = createConnection({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
});

// Initialize Redis client
const redisClient = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
  password: config.redis.password,
});

export {
  config,
  databaseConnection,
  redisClient,
  logger,
};
