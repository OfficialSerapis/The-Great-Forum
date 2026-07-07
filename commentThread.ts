export interface CommentThread {
  id: number;
  documentId: number;
  contentId: number;
  userId: number;
  position: {
    start: number;
    end: number;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
  replies: CommentReply[];
  status: 'open' | 'resolved';
  tags: string[];
  mentions: number[];
}

export interface CommentReply {
  id: number;
  threadId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  mentions: number[];
}
