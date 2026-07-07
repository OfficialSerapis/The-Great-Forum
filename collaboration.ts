import { Request } from 'express';
import { User } from '../server/models/user.model';
import { Session } from 'express-session';

export interface EnhancedSession extends Session {
  documentId: string;
  userId: string;
}

export interface EnhancedRequest extends Request {
  user: User;
  session: EnhancedSession;
}

export interface MessagePosition {
  x: number;
  y: number;
}

export interface MessageData {
  type: 'cursor_update' | 'typing_start' | 'typing_stop' | 'send_message';
  position?: MessagePosition;
  content?: string;
  messageId?: string;
}

export interface MessageMetadata {
  fileId?: string;
  [key: string]: any;
}

export interface ChatMessageData {
  id: number;
  content: string;
  senderId: number;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  metadata: MessageMetadata;
}

export interface WebSocketMessage {
  type: 'chat' | 'cursor' | 'documentUpdate' | 'messageDeleted';
  data: any;
  userId: string;
  sessionId: string;
}

export interface DocumentUpdateMessage {
  type: 'documentUpdate';
  content: string;
  cursorPosition?: number;
  userId: string;
  sessionId: string;
}

export interface CursorPosition {
  line: number;
  character: number;
}

export interface MessageDeletedData {
  messageId: number;
  userId: string;
  sessionId: string;
}

export interface WebSocketMessage {
  type: 'chat' | 'cursor' | 'documentUpdate' | 'messageDeleted';
  data: any;
  userId: string;
  sessionId: string;
}

export interface DocumentUpdateMessage {
  type: 'documentUpdate';
  content: string;
  cursorPosition?: number;
  userId: string;
  sessionId: string;
}

export interface CursorPosition {
  line: number;
  character: number;
}

export interface MessageDeletedData {
  messageId: number;
  userId: string;
  sessionId: string;
}
