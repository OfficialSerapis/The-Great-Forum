import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export class CacheConfig {
  private static instance: CacheConfig;
  private redis: Redis;
  private constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || '',
      db: parseInt(process.env.REDIS_DB || '0', 10)
    });

    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  public static getInstance(): CacheConfig {
    if (!CacheConfig.instance) {
      CacheConfig.instance = new CacheConfig();
    }
    return CacheConfig.instance;
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, stringValue);
      } else {
        await this.redis.set(key, stringValue);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async decr(key: string): Promise<number> {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      console.error('Cache decrement error:', error);
      return 0;
    }
  }
}

export const cacheConfig = CacheConfig.getInstance();
