import { cacheConfig } from '../config/cache';
import { DocumentPerformance } from '../types/analytics';

class CacheManager {
  private static instance: CacheManager;
  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async getDocumentCache(documentId: string): Promise<any> {
    try {
      const key = `document:${documentId}`;
      const cache = await cacheConfig.get(key);
      return cache;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setDocumentCache(documentId: string, data: any, ttl: number = 3600): Promise<void> {
    try {
      const key = `document:${documentId}`;
      await cacheConfig.set(key, data, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async getUserCache(userId: string): Promise<any> {
    try {
      const key = `user:${userId}`;
      const cache = await cacheConfig.get(key);
      return cache;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setUserCache(userId: string, data: any, ttl: number = 3600): Promise<void> {
    try {
      const key = `user:${userId}`;
      await cacheConfig.set(key, data, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async getAnalyticsCache(documentId: string): Promise<DocumentPerformance> {
    try {
      const key = `analytics:document:${documentId}`;
      const cache = await cacheConfig.get(key);
      return cache;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setAnalyticsCache(documentId: string, data: DocumentPerformance, ttl: number = 3600): Promise<void> {
    try {
      const key = `analytics:document:${documentId}`;
      await cacheConfig.set(key, data, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidateCache(key: string): Promise<void> {
    try {
      await cacheConfig.del(key);
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      await this.invalidateCache(`user:${userId}`);
      await this.invalidateCache(`analytics:user:${userId}`);
    } catch (error) {
      console.error('User cache invalidate error:', error);
    }
  }

  async invalidateDocumentCache(documentId: string): Promise<void> {
    try {
      await this.invalidateCache(`document:${documentId}`);
      await this.invalidateCache(`analytics:document:${documentId}`);
    } catch (error) {
      console.error('Document cache invalidate error:', error);
    }
  }
}

export const cacheManager = CacheManager.getInstance();
