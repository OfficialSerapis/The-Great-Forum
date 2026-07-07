export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  customColors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
}

export interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  bio?: string;
  avatar?: string;
  background?: string;
  filterMatureContent?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isAnonymous?: boolean;
  verificationBadge: VerificationBadge | null;
  role: 'user' | 'admin' | 'moderator';
  permissions: {
    canManageBadges: boolean;
    canViewAuditLogs: boolean;
    canToggleBadgeStatus: boolean;
  };
  accountType: 'individual' | 'organization';
  gender: 'male' | 'female' | 'hermaphrodite' | null;
  theme?: ThemeSettings;
}

export interface DocumentTemplate {
  id: number;
  name: string;
  content: string;
  layout: string;
  style: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface CollaborativeDocument {
  id: number;
  userId: number;
  owner: number;
  title: string;
  content: string;
  collaborators: number[];
  version: number;
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export enum AdminPermission {
  MANAGE_BADGES = 'manage_badges',
  TOGGLE_BADGE_STATUS = 'toggle_badge_status',
  VIEW_ALL_BADGES = 'view_all_badges'
}

export interface BadgeAuditLog {
  id: number;
  badgeId: number;
  userId: number;
  action: 'create' | 'update' | 'delete' | 'toggle_status';
  previousState: Partial<VerificationBadge>;
  newState: Partial<VerificationBadge>;
  timestamp: Date;
  ipAddress: string;
}

export interface VerificationBadge {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  userId: number;
  type: 'verification' | 'achievement' | 'custom';
}

export interface Emoji {
  id: number;
  name: string;
  code: string;
  category: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isPopular: boolean;
}

// Request and Response
import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction, Application, Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import { Session } from 'express-session';
import { User } from './models/user';
import { Document } from './models/document';

export type SessionData = {
  [key: string]: any;
};

export type ParamsDictionary = { [key: string]: string };

export interface EnhancedRequest<
  P = ParamsDictionary, 
  ResBody = any, 
  ReqBody = any, 
  ReqQuery = ParsedQs, 
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: User;
  document?: Document;
  session: Session & Partial<SessionData> & {
    logIn?: (user: User, options?: any, done?: (err: any) => void) => void;
    logOut?: (options?: any, done?: (err: any) => void) => void;
  };
  body: ReqBody;
  params: P;
}

export type RouteHandler<
  P = ParamsDictionary, 
  ResBody = any, 
  ReqBody = any, 
  ReqQuery = ParsedQs, 
  Locals extends Record<string, any> = Record<string, any>
> = (req: EnhancedRequest<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction) => void | Promise<void>;

};

// Authenticated request type
export type AuthenticatedRequest = EnhancedRequest & {
    user: User;
};

// Request with specific query parameters
export type RequestWithQuery<Q extends Record<string, string>> = EnhancedRequest<ParamsDictionary, any, any, Q>;

// Request with user and optional document
export type RequestWithUser = EnhancedRequest & {
    user: User;
    document?: Document;
};

// Utility type for route handlers
export type RouteHandler = (req: EnhancedRequest, res: Response, next: NextFunction) => void | Response;

export interface RequestWithPost extends RequestWithUser {
  body: {
    title: string;
    content: string;
    tags?: string[];
    category?: string;
  };
}

// Market
export interface Market {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  members: MarketMember[];
}

export interface MarketMember {
  id: number;
  marketId: number;
  userId: number;
  role: 'admin' | 'moderator' | 'member';
  createdAt: Date;
};

export type Post = {
  id: number;
  userId: number;
  content: string;
  richTextContent?: string;
  textAlignment?: string;
  createdAt: Date;
  updatedAt: Date;
  history: PostHistory[];
  emojis?: Emoji[];
};

export type PostHistory = {
  id: number;
  postId: number;
  editedBy: number;
  content: string;
  richTextContent?: string;
  textAlignment?: TextAlignment;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  changes: Array<{
    type: 'edit' | 'format' | 'alignment' | 'media';
    details: any;
  }>;
};

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  richTextContent: string;
  textAlignment: 'left' | 'center' | 'right';
  createdAt: Date;
  updatedAt: Date;
  emojis?: Emoji[];
  likes: number;
  replies: Comment[];
};

export interface Share {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  emojis?: Emoji[];
  comment?: string;
  visibility: 'public' | 'friends' | 'private';
};

export interface Market {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  members: MarketMember[];
  createdAt: Date;
  updatedAt: Date;
};

export interface Language {
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
};

export interface Emoji {
  id: number;
  name: string;
  code: string;
  category: string;
};

export interface FormatOption {
  type: 'bold' | 'italic' | 'underline' | 'strikethrough';
  value: boolean;
};

export interface TextAlignment {
  type: 'left' | 'center' | 'right' | 'justify';
};
