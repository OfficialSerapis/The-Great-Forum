export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  caption: string;
  effects: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  views: number;
}

export interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface ReelState {
  id: number;
  userId: number;
  content: string;
  mediaType: 'video' | 'image';
  duration: number;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  caption: string;
  effects: string[];
  likes: number;
  comments: Comment[];
}
