import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { Logger } from './logger';

class IDGenerator {
  private static instance: IDGenerator;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger('IDGenerator');
  }

  public static getInstance(): IDGenerator {
    if (!IDGenerator.instance) {
      IDGenerator.instance = new IDGenerator();
    }
    return IDGenerator.instance;
  }

  // Generate a UUID v4
  generateUUID(): string {
    try {
      return uuidv4();
    } catch (error) {
      this.logger.error('Failed to generate UUID:', error);
      throw error;
    }
  }

  // Generate a short ID (e.g., for URLs)
  generateShortID(length: number = 8): string {
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
      }
      return result;
    } catch (error) {
      this.logger.error('Failed to generate short ID:', error);
      throw error;
    }
  }

  // Generate a secure random string
  generateSecureString(length: number): string {
    try {
      const bytes = crypto.randomBytes(Math.ceil(length / 2));
      return bytes.toString('hex').slice(0, length);
    } catch (error) {
      this.logger.error('Failed to generate secure string:', error);
      throw error;
    }
  }

  // Generate a numeric ID
  generateNumericID(): number {
    try {
      const min = 1000000000;
      const max = 9999999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
      this.logger.error('Failed to generate numeric ID:', error);
      throw error;
    }
  }

  // Validate an ID format
  validateID(id: string, format: 'uuid' | 'short' | 'numeric'): boolean {
    try {
      if (format === 'uuid') {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return regex.test(id);
      } else if (format === 'short') {
        const regex = /^[A-Za-z0-9]+$/;
        return regex.test(id);
      } else if (format === 'numeric') {
        return /^\d+$/.test(id);
      }
      return false;
    } catch (error) {
      this.logger.error('Failed to validate ID:', error);
      return false;
    }
  }

  // Generate a timestamp-based ID
  generateTimestampID(): string {
    try {
      const timestamp = Date.now().toString(36);
      const random = this.generateShortID(4);
      return `${timestamp}-${random}`;
    } catch (error) {
      this.logger.error('Failed to generate timestamp ID:', error);
      throw error;
    }
  }

  // Generate a batch of IDs
  generateBatchIDs(count: number, format: 'uuid' | 'short' | 'numeric'): string[] {
    try {
      const ids: string[] = [];
      for (let i = 0; i < count; i++) {
        switch (format) {
          case 'uuid':
            ids.push(this.generateUUID());
            break;
          case 'short':
            ids.push(this.generateShortID());
            break;
          case 'numeric':
            ids.push(this.generateNumericID().toString());
            break;
        }
      }
      return ids;
    } catch (error) {
      this.logger.error('Failed to generate batch IDs:', error);
      throw error;
    }
  }
}

export const idGenerator = IDGenerator.getInstance();
