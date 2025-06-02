// 星靈 Rika 元件相關類型定義

export type RikaEmotion = 'happy' | 'curious' | 'thinking' | 'excited';

export type RikaAnimation =
  | 'idle'
  | 'bounce'
  | 'float'
  | 'spin'
  | 'pulse'
  | 'wave'
  | 'sparkle'
  | 'think'
  | 'celebrate';

export interface RikaState {
  emotion: RikaEmotion;
  message: string;
  animation?: RikaAnimation;
  userId?: string;
}

export interface RikaProps {
  emotion?: RikaEmotion;
  message?: string;
  animation?: RikaAnimation;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  autoPlay?: boolean;
  onClick?: () => void;
  onEmotionChange?: (emotion: RikaEmotion) => void;
  className?: string;
}

export interface RikaTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  shadow: string;
}

// 預設主題
export const RIKA_THEMES: Record<RikaEmotion, RikaTheme> = {
  happy: {
    primary: '#FFD700',
    secondary: '#FFA500',
    accent: '#FF69B4',
    gradient: 'from-yellow-400 via-orange-400 to-pink-400',
    shadow: 'shadow-yellow-300/50',
  },
  curious: {
    primary: '#00CED1',
    secondary: '#20B2AA',
    accent: '#9370DB',
    gradient: 'from-cyan-400 via-teal-400 to-purple-400',
    shadow: 'shadow-cyan-300/50',
  },
  thinking: {
    primary: '#9370DB',
    secondary: '#8A2BE2',
    accent: '#4169E1',
    gradient: 'from-purple-400 via-violet-400 to-blue-400',
    shadow: 'shadow-purple-300/50',
  },
  excited: {
    primary: '#FF4500',
    secondary: '#FF6347',
    accent: '#FF69B4',
    gradient: 'from-orange-400 via-red-400 to-pink-400',
    shadow: 'shadow-orange-300/50',
  },
};

// 尺寸配置
export const RIKA_SIZES = {
  sm: {
    container: 'w-16 h-16',
    text: 'text-xs',
    padding: 'p-2',
  },
  md: {
    container: 'w-24 h-24',
    text: 'text-sm',
    padding: 'p-3',
  },
  lg: {
    container: 'w-32 h-32',
    text: 'text-base',
    padding: 'p-4',
  },
  xl: {
    container: 'w-48 h-48',
    text: 'text-lg',
    padding: 'p-6',
  },
};
