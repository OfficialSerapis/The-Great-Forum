import { Request } from 'express';
import { Session } from 'express-session';
import { User } from '../server/models/user.model';

export interface EnhancedSession extends Session {
  documentId: string;
  userId: string;
}

export interface EnhancedRequest extends Request {
  user: User;
  session: EnhancedSession;
}
