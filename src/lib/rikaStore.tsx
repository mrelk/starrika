'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { RikaEmotion, RikaAnimation, RikaState } from '@/components/rika/types';
import { rikaService } from './database';
import { getCurrentUser } from './supabase';
import { QuestionClarificationResult } from './openai';

interface RikaContextType {
  // 當前狀態
  currentState: RikaState;

  // 狀態更新方法
  updateEmotion: (emotion: RikaEmotion) => void;
  updateMessage: (message: string) => void;
  updateAnimation: (animation: RikaAnimation) => void;
  updateState: (newState: Partial<RikaState>) => void;

  // 互動方法
  triggerResponse: (trigger: string) => Promise<void>;
  saveStateToDatabase: () => Promise<void>;
  loadStateFromDatabase: () => Promise<void>;

  // AI 問題澄清功能
  analyzeQuestion: (question: string, childAge?: number) => Promise<QuestionClarificationResult | null>;
  processQuestionWithRika: (question: string, childAge?: number) => Promise<void>;

  // 預設回應
  getRandomMessage: (emotion?: RikaEmotion) => string;

  // 狀態標記
  isLoading: boolean;
  error: string | null;
}

const RikaContext = createContext<RikaContextType | undefined>(undefined);

// 預設回應訊息庫
const RESPONSE_MESSAGES = {
  happy: [
    '太棒了！讓我們繼續探索吧！✨',
    '你的笑容讓我感到很溫暖！',
    '今天是個美好的一天，不是嗎？',
    '我們一起創造更多快樂的回憶吧！',
  ],
  curious: [
    '這真是個有趣的想法！',
    '讓我們深入探討一下這個問題...',
    '你的好奇心真的很棒！',
    '還有什麼想要了解的嗎？',
  ],
  thinking: [
    '嗯...讓我仔細思考一下...',
    '這需要好好分析呢～',
    '有幾種可能的答案...',
    '你提出的問題很有深度！',
  ],
  excited: [
    '哇！這太有趣了！🌟',
    '我迫不及待想告訴你更多！',
    '準備好迎接驚喜了嗎？',
    '這絕對會是個精彩的故事！',
  ],
};

// 情境觸發回應
const TRIGGER_RESPONSES: Record<
  string,
  { emotion: RikaEmotion; message: string; animation?: RikaAnimation }
> = {
  welcome: {
    emotion: 'happy',
    message: '歡迎來到 Starrika！我是你的星靈夥伴 Rika ✨',
    animation: 'bounce',
  },
  question_received: {
    emotion: 'curious',
    message: '哇！這是個很棒的問題，讓我想想怎麼回答...',
    animation: 'think',
  },
  question_analyzing: {
    emotion: 'thinking',
    message: '正在仔細分析你的問題...',
    animation: 'sparkle',
  },
  question_clarified: {
    emotion: 'excited',
    message: '我理解你的問題了！這個問題很棒！',
    animation: 'celebrate',
  },
  question_needs_help: {
    emotion: 'curious',
    message: '這個問題有點模糊，讓我幫你整理一下想法...',
    animation: 'think',
  },
  story_generating: {
    emotion: 'thinking',
    message: '正在為你編織一個神奇的故事...',
    animation: 'sparkle',
  },
  story_ready: {
    emotion: 'excited',
    message: '太棒了！你的專屬故事完成了！',
    animation: 'celebrate',
  },
  encouragement: {
    emotion: 'happy',
    message: '你真的很棒！繼續保持好奇心！',
    animation: 'pulse',
  },
};

export function RikaProvider({ children }: { children: ReactNode }) {
  const [currentState, setCurrentState] = useState<RikaState>({
    emotion: 'happy',
    message: '嗨！我是星靈 Rika，很高興見到你！✨',
    animation: 'float',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 更新情緒
  const updateEmotion = useCallback((emotion: RikaEmotion) => {
    setCurrentState((prev) => ({ ...prev, emotion }));
  }, []);

  // 更新訊息
  const updateMessage = useCallback((message: string) => {
    setCurrentState((prev) => ({ ...prev, message }));
  }, []);

  // 更新動畫
  const updateAnimation = useCallback((animation: RikaAnimation) => {
    setCurrentState((prev) => ({ ...prev, animation }));
  }, []);

  // 更新整個狀態
  const updateState = useCallback((newState: Partial<RikaState>) => {
    setCurrentState((prev) => ({ ...prev, ...newState }));
  }, []);

  // 獲取隨機訊息
  const getRandomMessage = useCallback(
    (emotion?: RikaEmotion) => {
      const targetEmotion = emotion || currentState.emotion;
      const messages = RESPONSE_MESSAGES[targetEmotion];
      return messages[Math.floor(Math.random() * messages.length)];
    },
    [currentState.emotion]
  );

  // 觸發回應
  const triggerResponse = useCallback(
    async (trigger: string) => {
      setError(null);

      const response = TRIGGER_RESPONSES[trigger];
      if (response) {
        updateState({
          emotion: response.emotion,
          message: response.message,
          animation: response.animation,
        });
      } else {
        // 使用當前情緒的隨機訊息
        updateMessage(getRandomMessage());
      }
    },
    [updateState, updateMessage, getRandomMessage]
  );

  // AI 問題分析功能
  const analyzeQuestion = useCallback(async (question: string, childAge?: number): Promise<QuestionClarificationResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/clarify-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          childAge,
          saveToDatabase: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '問題分析失敗');
      }

      return data.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(errorMessage);
      console.error('問題分析錯誤:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 完整的問題處理流程（包含 Rika 互動）
  const processQuestionWithRika = useCallback(async (question: string, childAge?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // 步驟 1: Rika 收到問題
      await triggerResponse('question_received');
      await new Promise(resolve => setTimeout(resolve, 1500)); // 等待動畫

      // 步驟 2: 開始分析
      await triggerResponse('question_analyzing');
      
      // 步驟 3: 執行 AI 分析
      const result = await analyzeQuestion(question, childAge);
      
      if (!result) {
        updateState({
          emotion: 'thinking',
          message: '抱歉，我在理解這個問題時遇到了困難。可以換個方式問問看嗎？',
          animation: 'think',
        });
        return;
      }

      // 步驟 4: 根據分析結果回應
      if (result.needsClarification) {
        await triggerResponse('question_needs_help');
        
        // 提供澄清建議
        const clarificationText = result.clarificationPrompts && result.clarificationPrompts.length > 0
          ? `你可以這樣問：\n${result.clarificationPrompts.slice(0, 2).join('\n或：')}`
          : '你可以提供更多細節，這樣我就能為你創作更精彩的故事！';
          
        setTimeout(() => {
          updateState({
            emotion: 'curious',
            message: clarificationText,
            animation: 'wave',
          });
        }, 2000);
      } else {
        await triggerResponse('question_clarified');
        
        // 顯示分析結果和建議
        setTimeout(() => {
          let responseMessage = `我理解了！這是個關於${getCategoryName(result.category)}的問題。`;
          
          if (result.qualityScore >= 8) {
            responseMessage += '\n這個問題很棒，我們可以創作一個精彩的故事！';
          } else if (result.qualityScore >= 6) {
            responseMessage += '\n這是個不錯的問題！';
          }

          updateState({
            emotion: result.qualityScore >= 7 ? 'excited' : 'happy',
            message: responseMessage,
            animation: result.qualityScore >= 8 ? 'celebrate' : 'bounce',
          });
        }, 2000);
      }

    } catch (err) {
      setError('處理問題時發生錯誤');
      updateState({
        emotion: 'thinking',
        message: '抱歉，我遇到了一些技術問題。請稍後再試試看！',
        animation: 'think',
      });
    } finally {
      setIsLoading(false);
    }
  }, [analyzeQuestion, triggerResponse, updateState]);

  // 保存狀態到資料庫
  const saveStateToDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError('用戶未登入');
        return;
      }

      const { error: dbError } = await rikaService.createRikaState({
        user_id: user.id,
        emotion: currentState.emotion,
        message: currentState.message,
        animation: currentState.animation,
      });

      if (dbError) {
        setError('保存狀態失敗');
        console.error('Failed to save Rika state:', dbError);
      }
    } catch (err) {
      setError('保存狀態時發生錯誤');
      console.error('Error saving Rika state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentState]);

  // 從資料庫載入狀態
  const loadStateFromDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError('用戶未登入');
        return;
      }

      const { state, error: dbError } = await rikaService.getLatestRikaState(
        user.id
      );

      if (dbError) {
        console.error('Failed to load Rika state:', dbError);
        // 使用預設狀態，不算錯誤
        return;
      }

      if (state) {
        setCurrentState({
          emotion: state.emotion,
          message: state.message,
          animation: state.animation || 'float',
          userId: state.user_id,
        });
      }
    } catch (err) {
      setError('載入狀態時發生錯誤');
      console.error('Error loading Rika state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: RikaContextType = {
    currentState,
    updateEmotion,
    updateMessage,
    updateAnimation,
    updateState,
    triggerResponse,
    analyzeQuestion,
    processQuestionWithRika,
    saveStateToDatabase,
    loadStateFromDatabase,
    getRandomMessage,
    isLoading,
    error,
  };

  return <RikaContext.Provider value={value}>{children}</RikaContext.Provider>;
}

// Hook 來使用 Rika Context
export const useRika = () => {
  const context = useContext(RikaContext);
  if (context === undefined) {
    throw new Error('useRika must be used within a RikaProvider');
  }
  return context;
};

// 便利 Hooks
export const useRikaEmotion = () => {
  const { currentState, updateEmotion } = useRika();
  return [currentState.emotion, updateEmotion] as const;
};

export const useRikaMessage = () => {
  const { currentState, updateMessage } = useRika();
  return [currentState.message, updateMessage] as const;
};

export const useRikaAnimation = () => {
  const { currentState, updateAnimation } = useRika();
  return [currentState.animation, updateAnimation] as const;
};

// 輔助函數：獲取分類中文名稱
function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    science: '科學',
    life: '生活',
    emotion: '情感',
    nature: '自然',
    other: '其他',
  };
  return categories[category] || '未知';
}
