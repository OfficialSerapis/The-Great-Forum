export interface Achievement {
  id: number;
  name: string;
  description: string;
  category: 'content' | 'social' | 'collaboration' | 'community';
  points: number;
  icon: string;
  requirements: {
    type: 'posts' | 'comments' | 'reactions' | 'collaborations' | 'days_active';
    count: number;
  }[];
  isSecret: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  createdAt: Date;
  progress: {
    current: number;
    target: number;
  };
}
