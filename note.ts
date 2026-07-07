export interface Note {
  id: number;
  userId: number;
  content: string;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  mentions: string[];
  attachments: {
    id: number;
    url: string;
    type: 'image' | 'video' | 'document';
    size: number;
  }[];
  [key: string]: any;
}
