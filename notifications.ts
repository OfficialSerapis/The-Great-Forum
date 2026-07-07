export enum NotificationType {
  DOCUMENT = 'document',
  COLLABORATION = 'collaboration',
  SYSTEM = 'system',
  QUANTUM = 'quantum'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  metadata: any;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationOptions {
  userId: number;
  type?: NotificationType;
  status?: NotificationStatus;
  limit?: number;
  offset?: number;
}

export interface RealTimeNotification {
  type: 'notification';
  data: Notification;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}
