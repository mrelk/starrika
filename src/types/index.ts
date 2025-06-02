// 用戶相關類型
export interface User {
  id: string;
  email?: string;
  role: 'child' | 'parent';
  createdAt: Date;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  interests: string[];
  starEnergy: number;
}

// 問題與故事類型
export interface Question {
  id: string;
  text: string;
  category: 'science' | 'life' | 'emotion' | 'nature' | 'other';
  askedBy: string;
  askedAt: Date;
}

export interface Story {
  id: string;
  questionId: string;
  title: string;
  panels: StoryPanel[];
  createdAt: Date;
}

export interface StoryPanel {
  id: string;
  order: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

// 星靈 Rika 相關
export interface RikaState {
  emotion: 'happy' | 'curious' | 'thinking' | 'excited';
  message: string;
  animation?: string;
}
