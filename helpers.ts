import { DocumentPerformance } from '../types/analytics';
import { Notification } from '../types/notifications';

class Helpers {
  private static instance: Helpers;
  private constructor() {}

  public static getInstance(): Helpers {
    if (!Helpers.instance) {
      Helpers.instance = new Helpers();
    }
    return Helpers.instance;
  }

  formatPerformanceMetrics(metrics: DocumentPerformance): DocumentPerformance {
    return {
      ...metrics,
      loadTime: this.formatTime(metrics.loadTime),
      responseTime: this.formatTime(metrics.responseTime),
      memoryUsage: this.formatMemory(metrics.memoryUsage)
    };
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }

  formatMemory(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  formatNotification(notification: Notification): Notification {
    return {
      ...notification,
      createdAt: this.formatDate(notification.createdAt),
      updatedAt: this.formatDate(notification.updatedAt)
    };
  }

  formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}

export const helpers = Helpers.getInstance();
