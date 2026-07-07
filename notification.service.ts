import { UserInstance } from '../models';

class NotificationService {
  private static instance: NotificationService;
  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async createNotification(
    userId: number,
    type: string,
    message: string,
    metadata: any = {}
  ): Promise<any> {
    try {
      const user = await UserInstance.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const notification = {
        userId,
        type,
        message,
        metadata,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save notification
      await user.addNotification(notification);
      return notification;
    } catch (error) {
      throw new Error('Failed to create notification');
    }
  }

  async getNotifications(
    userId: number,
    options: any = {}
  ): Promise<any[]> {
    try {
      const user = await UserInstance.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const notifications = await user.getNotifications({
        limit: options.limit || 50,
        offset: options.offset || 0,
        order: [['createdAt', 'DESC']]
      });

      return notifications;
    } catch (error) {
      throw new Error('Failed to get notifications');
    }
  }

  async markAsRead(
    userId: number,
    notificationId: number
  ): Promise<any> {
    try {
      const user = await UserInstance.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const notification = await user.getNotification(notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.read = true;
      notification.updatedAt = new Date();
      await notification.save();

      return notification;
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async deleteNotification(
    userId: number,
    notificationId: number
  ): Promise<void> {
    try {
      const user = await UserInstance.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const notification = await user.getNotification(notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.destroy();
    } catch (error) {
      throw new Error('Failed to delete notification');
    }
  }

  async sendRealTimeNotification(
    userId: number,
    type: string,
    message: string,
    metadata: any = {}
  ): Promise<void> {
    try {
      // Create notification
      const notification = await this.createNotification(userId, type, message, metadata);

      // Send via WebSocket
      const socket = await this.getWebSocketConnection(userId);
      if (socket) {
        socket.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));
      }
    } catch (error) {
      throw new Error('Failed to send real-time notification');
    }
  }

  private async getWebSocketConnection(userId: number): Promise<any> {
    // Get WebSocket connection for user
    return null;
  }
}

export const notificationService = NotificationService.getInstance();
