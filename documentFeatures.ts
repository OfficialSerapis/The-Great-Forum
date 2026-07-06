import { z } from 'zod';

// Document Features Models
export interface MailMergeTemplate {
  id: number;
  name: string;
  content: string;
  fields: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: number;
  documentId: number;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  position: {
    page: number;
    x: number;
    y: number;
  };
}

export interface PageLayout {
  id: number;
  documentId: number;
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  columns: number;
  headers: {
    content: string;
    height: number;
  }[];
  footers: {
    content: string;
    height: number;
  }[];
}

export interface DocumentProtection {
  id: number;
  documentId: number;
  password: string;
  restrictions: {
    edit: boolean;
    copy: boolean;
    print: boolean;
    comments: boolean;
  };
}

export interface DocumentComparison {
  id: number;
  documentId: number;
  comparedDocumentId: number;
  changes: {
    type: 'insert' | 'delete' | 'format';
    content: string;
    position: number;
  }[];
}

// Social Features Models
export interface LivePoll {
  id: number;
  creatorId: number;
  question: string;
  options: string[];
  votes: {
    optionIndex: number;
    userId: number;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractiveStory {
  id: number;
  creatorId: number;
  content: {
    type: 'image' | 'video' | 'text' | 'poll' | 'quiz';
    data: any;
    interactions?: {
      type: 'like' | 'comment' | 'share' | 'reply';
      count: number;
    }[];
  }[];
  views: number;
  interactions: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface GroupChat {
  id: number;
  name: string;
  members: number[];
  messages: {
    id: number;
    senderId: number;
    content: string;
    type: 'text' | 'image' | 'video' | 'file';
    timestamp: Date;
  }[];
  createdAt: Date;
}

export interface VoiceMessage {
  id: number;
  senderId: number;
  receiverId: number;
  duration: number;
  url: string;
  transcript?: string;
  createdAt: Date;
}

// Integration Features Models
export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  attendees: number[];
  reminders: {
    type: 'email' | 'push' | 'sms';
    time: number;
  }[];
}

export interface CloudStorage {
  id: number;
  userId: number;
  provider: 'google' | 'onedrive' | 'dropbox';
  accessToken: string;
  refreshToken: string;
  storageUsed: number;
  storageLimit: number;
}

// Analytics Features Models
export interface UserBehavior {
  id: number;
  userId: number;
  actions: {
    type: string;
    timestamp: Date;
    metadata: any;
  }[];
  preferences: {
    contentTypes: string[];
    interactionTypes: string[];
  };
}

export interface ContentPerformance {
  id: number;
  contentId: number;
  metrics: {
    views: number;
    interactions: number;
    engagementRate: number;
    averageTime: number;
  };
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
}

// Accessibility Features Models
export interface ScreenReaderConfig {
  id: number;
  userId: number;
  settings: {
    voice: string;
    speed: number;
    pitch: number;
    volume: number;
  };
  preferences: {
    readingOrder: boolean;
    tableNavigation: boolean;
    formNavigation: boolean;
  };
}

// Security Features Models
export interface SecurityAudit {
  id: number;
  userId: number;
  type: 'login' | 'password_change' | '2fa' | 'ip_change';
  timestamp: Date;
  ipAddress: string;
  location: string;
  success: boolean;
}

// Zod Schemas for Validation
export const mailMergeTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: z.string(),
  fields: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const formFieldSchema = z.object({
  id: z.number(),
  documentId: z.number(),
  name: z.string(),
  type: z.enum(['text', 'number', 'date', 'dropdown', 'checkbox']),
  required: z.boolean(),
  defaultValue: z.string().optional(),
  options: z.array(z.string()).optional(),
  position: z.object({
    page: z.number(),
    x: z.number(),
    y: z.number()
  })
});

// Add more schemas as needed
