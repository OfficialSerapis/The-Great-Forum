import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),
  countryCode: text("country_code"),
  bio: text("bio"),
  avatar: text("avatar").default("/assets/Human.png"),
  background: text("background"),
  filterMatureContent: boolean("filter_mature_content").default(false),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  richTextContent: text("rich_text_content").notNull(),
  textAlignment: text("text_alignment").default("left"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  imageUrl: text("image_url"),
});

export const postHistory = pgTable("post_history", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  content: text("content").notNull(),
  richTextContent: text("rich_text_content").notNull(),
  textAlignment: text("text_alignment").notNull(),
  editedAt: timestamp("edited_at").defaultNow().notNull(),
  editedBy: integer("edited_by").notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
});

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const updateUserSchema = createInsertSchema(users)
  .pick({
    name: true,
    email: true,
    bio: true,
    avatar: true,
    background: true,
    phoneNumber: true,
    countryCode: true,
    filterMatureContent: true,
  })
  .partial(); // Make all fields optional

export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  userId: true,
  imageUrl: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  content: true,
  userId: true,
  postId: true,
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  userId: true,
  postId: true,
});

export const insertShareSchema = createInsertSchema(shares).pick({
  userId: true,
  postId: true,
});



export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Like = typeof likes.$inferSelect;

export type InsertShare = z.infer<typeof insertShareSchema>;
export type Share = typeof shares.$inferSelect;

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;

export interface PostWithUser extends Post {
  user: User;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isShared?: boolean;
  history: PostHistory[];
}

export interface CommentWithUser extends Comment {
  user: User;
}

export interface PostHistory {
  id: number;
  postId: number;
  content: string;
  richTextContent: string;
  textAlignment: string;
  formattedContent: string;
  editedAt: Date;
  editedBy: number;
  reason: string | null;
}

export interface VerificationBadge {
  id: number;
  userId: number;
  badgeType: 'custom' | 'default';
  customBadge: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastRenewedAt: Date;
  nextRenewalAt: Date;
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  bio: string | null;
  avatar: string | null;
  background: string | null;
  filterMatureContent: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  isAnonymous: boolean | null;
  verificationBadge: VerificationBadge | null;
  accountType: 'individual' | 'organization';
  gender: 'male' | 'female' | 'hermaphrodite' | null;
  role: 'user' | 'admin' | 'moderator';
  permissions: {
    canManageBadges: boolean;
    canViewAuditLogs: boolean;
    canToggleBadgeStatus: boolean;
  };
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

export interface BadgeManagement {
  id: number;
  badgeId: number;
  userId: number;
  action: 'assign' | 'revoke';
  reason: string | null;
  createdAt: Date;
}

export interface BadgeHistory {
  id: number;
  badgeId: number;
  userId: number;
  action: 'assign' | 'revoke';
  reason: string | null;
  createdAt: Date;
}

export interface Market {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  members: MarketMember[];
  posts: Post[];
  rules: string;
  category: string;
  tags: string[];
  status: 'active' | 'inactive' | 'deleted';
  settings: {
    isPrivate: boolean;
    requireApproval: boolean;
    maxMembers: number;
    joinRequests: boolean;
    postFrequency: number;
    postTypes: string[];
    contentFilters: string[];
    notificationSettings: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  voiceChannels: VoiceChannel[];
  activeUsers: number;
}

export interface MarketMember {
  id: number;
  marketId: number;
  userId: number;
  role: 'admin' | 'moderator' | 'member';
  mutedUntil: Date | null;
  createdAt: Date;
}

export interface VoiceChannel {
  id: number;
  marketId: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  activeUsers: number;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  isDefault: boolean;
}

export interface Emoji {
  id: number;
  name: string;
}

export interface CommunityNote {
  id: number;
  userId: number;
  content: string;
  richTextContent: string;
  visibility: 'public' | 'followers' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

// ... (rest of the code remains the same)
export interface ContentEditHistory {
  id: number;
  contentId: number;
  contentType: 'post' | 'comment' | 'note';
  originalContent: string;
  editedContent: string;
  editedBy: number;
  reason: string | null;
  createdAt: Date;
}

// Real-time collaboration models
export interface CollaborativeDocument {
  id: number;
  userId: number;
  title: string;
  content: string;
  collaborators: number[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RealTimeOperation {
  id: number;
  documentId: number;
  userId: number;
  operation: string;
  timestamp: Date;
  version: number;
}

// Track changes model
export interface TrackChange {
  id: number;
  documentId: number;
  userId: number;
  changeType: 'insert' | 'delete' | 'format';
  content: string;
  position: number;
  timestamp: Date;
}

// Story/Reel model
export interface Story {
  id: number;
  userId: number;
  content: string;
  mediaType: 'image' | 'video';
  duration: number;
  createdAt: Date;
  expiresAt: Date;
  imageUrl: string;
  videoUrl: string | null;
}

// Live streaming model
export interface LiveStream {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  status: 'scheduled' | 'live' | 'completed';
  scheduledTime: Date;
  startTime: Date;
  endTime: Date;
  viewers: number;
  createdAt: Date;
}

// Poll model
export interface Poll {
  id: number;
  userId: number;
  question: string;
  options: string[];
  votes: Record<number, number>;
  voters: number[];
  createdAt: Date;
  expiresAt: Date;
}

// Quiz model
export interface Quiz {
  id: number;
  userId: number;
  title: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  participants: number[];
  createdAt: Date;
}

// Event model
export interface Event {
  id: number;
  userId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string | null;
  attendees: number[];
  maxAttendees: number | null;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

// Accessibility settings model
export interface AccessibilitySettings {
  id: number;
  userId: number;
  highContrast: boolean;
  textToSpeech: boolean;
  screenReaderMode: boolean;
  fontScale: number;
  colorScheme: 'light' | 'dark' | 'system';
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// Merchandise model
export interface Merchandise {
  id: number;
  userId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics model
export interface Analytics {
  id: number;
  userId: number;
  contentType: 'post' | 'comment' | 'note';
  contentId: number;
  views: number;
  engagement: number;
  shares: number;
  likes: number;
  comments: number;
  timestamp: Date;
}

// AI Features
export interface AISuggestion {
  id: number;
  documentId: number;
  suggestionType: 'grammar' | 'style' | 'clarity' | 'tone';
  content: string;
  alternative: string;
  confidence: number;
  createdAt: Date;
}

export interface AIGrammarCheck {
  id: number;
  documentId: number;
  errorType: 'spelling' | 'grammar' | 'punctuation' | 'syntax';
  content: string;
  correction: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

// Productivity Tools
export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  start: Date;
  end: Date;
  allDay: boolean;
  location: string | null;
  recurrence: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  richTextContent: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Document Management
export interface BatchOperation {
  id: number;
  userId: number;
  operationType: 'convert' | 'merge' | 'split' | 'compress';
  sourceDocuments: number[];
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentConversion {
  id: number;
  userId: number;
  sourceDocument: number;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  convertedUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentAuditTrail {
  id: number;
  documentId: number;
  userId: number;
  action: 'create' | 'update' | 'delete' | 'share' | 'download';
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// Advanced Document Features
export interface DocumentLayout {
  id: number;
  documentId: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'Custom';
  customSize: {
    width: number;
    height: number;
  } | null;
  headerFooter: {
    header: {
      content: string;
      position: 'top' | 'bottom';
      differentFirstPage: boolean;
    };
    footer: {
      content: string;
      position: 'top' | 'bottom';
      differentFirstPage: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentSection {
  id: number;
  documentId: number;
  sectionNumber: number;
  title: string;
  content: string;
  pageBreak: boolean;
  columnCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentContent {
  id: number;
  documentId: number;
  sectionId: number;
  content: string;
  richText: string;
  format: {
    font: string;
    size: number;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    alignment: 'left' | 'center' | 'right' | 'justify';
    spacing: {
      before: number;
      after: number;
      line: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTableOfContents {
  id: number;
  documentId: number;
  title: string;
  position: number;
  levels: number;
  style: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentCrossReference {
  id: number;
  documentId: number;
  referenceType: 'heading' | 'page' | 'number';
  referenceId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentFootnote {
  id: number;
  documentId: number;
  content: string;
  position: number;
  type: 'footnote' | 'endnote';
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentBibliography {
  id: number;
  documentId: number;
  citationStyle: string;
  entries: Array<{
    id: number;
    type: string;
    authors: string[];
    title: string;
    year: number;
    journal: string | null;
    publisher: string | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Social Media Features
export interface StoryEffect {
  id: number;
  name: string;
  type: 'filter' | 'sticker' | 'animation';
  content: string;
  previewUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveStreamInteraction {
  id: number;
  streamId: number;
  userId: number;
  type: 'comment' | 'like' | 'gift' | 'poll';
  content: string | null;
  timestamp: Date;
  isHighlighted: boolean;
}

export interface PollOption {
  id: number;
  pollId: number;
  text: string;
  imageUrl: string | null;
  voteCount: number;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  questionText: string;
  options: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  explanation: string | null;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRSVP {
  id: number;
  eventId: number;
  userId: number;
  status: 'going' | 'interested' | 'not_interested';
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityRole {
  id: number;
  communityId: number;
  name: string;
  permissions: {
    canPost: boolean;
    canComment: boolean;
    canModerate: boolean;
    canBan: boolean;
    canManageEvents: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAnalytics {
  id: number;
  contentId: number;
  contentType: 'post' | 'story' | 'live' | 'quiz' | 'event';
  views: number;
  engagement: number;
  shares: number;
  likes: number;
  comments: number;
  averageViewTime: number;
  demographicData: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementType: 'document' | 'collaboration' | 'productivity' | 'community';
  title: string;
  description: string;
  points: number;
  createdAt: Date;
}

export interface ContentCuration {
  id: number;
  userId: number;
  contentId: number;
  contentType: 'document' | 'post' | 'note';
  status: 'pending' | 'approved' | 'rejected';
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityGuidelines {
  id: number;
  title: string;
  content: string;
  category: 'content' | 'behavior' | 'security' | 'privacy';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
