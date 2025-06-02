'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Minimize2, Maximize2 } from 'lucide-react';
import RikaAvatar from './RikaAvatar';
import RikaMessage from './RikaMessage';
import { RikaProps, RikaEmotion, RikaAnimation } from './types';

interface RikaWidgetProps extends RikaProps {
  // 額外的 Widget 特定屬性
  minimizable?: boolean;
  showSettings?: boolean;
  position?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'center';
  persistState?: boolean;
  welcomeMessage?: string;
}

// 預設訊息庫
const DEFAULT_MESSAGES = {
  happy: [
    '嗨！我是星靈 Rika，很高興見到你！✨',
    '今天想探索什麼有趣的問題呢？',
    '你的好奇心讓我感到很開心！',
  ],
  curious: [
    '哇！我感受到你的好奇心了～',
    '有什麼神奇的事情想了解嗎？',
    '讓我們一起探索未知的世界吧！',
  ],
  thinking: [
    '讓我仔細想想...這是個很棒的問題！',
    '嗯...這需要好好思考一下呢～',
    '你提出的問題真的很有深度！',
  ],
  excited: [
    '哇！這太精彩了！✨',
    '我迫不及待想和你分享這個故事！',
    '準備好迎接奇妙的冒險了嗎？',
  ],
};

// 位置樣式
const POSITION_CLASSES = {
  'bottom-right': 'fixed bottom-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
  'top-right': 'fixed top-4 right-4',
  'top-left': 'fixed top-4 left-4',
  center: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

export default function RikaWidget({
  emotion = 'happy',
  message,
  animation = 'float',
  size = 'lg',
  interactive = true,
  autoPlay = true,
  minimizable = true,
  showSettings = false,
  position = 'bottom-right',
  persistState = true,
  welcomeMessage,
  onClick,
  onEmotionChange,
  className = '',
}: RikaWidgetProps) {
  const [currentEmotion, setCurrentEmotion] = useState<RikaEmotion>(emotion);
  const [currentMessage, setCurrentMessage] = useState<string>(
    message || welcomeMessage || DEFAULT_MESSAGES[emotion][0]
  );
  const [currentAnimation, setCurrentAnimation] =
    useState<RikaAnimation>(animation);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  // 隨機切換訊息
  useEffect(() => {
    if (!autoPlay || message) return;

    const messages = DEFAULT_MESSAGES[currentEmotion];
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, currentEmotion, message]);

  // 更新當前訊息
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      const messages = DEFAULT_MESSAGES[currentEmotion];
      setCurrentMessage(messages[messageIndex]);
    }
  }, [message, currentEmotion, messageIndex]);

  // 情緒變化處理
  const handleEmotionChange = (newEmotion: RikaEmotion) => {
    setCurrentEmotion(newEmotion);
    setMessageIndex(0);
    onEmotionChange?.(newEmotion);

    // 切換對應的動畫
    const emotionAnimations: Record<RikaEmotion, RikaAnimation> = {
      happy: 'bounce',
      curious: 'wave',
      thinking: 'think',
      excited: 'celebrate',
    };
    setCurrentAnimation(emotionAnimations[newEmotion]);
  };

  // 點擊處理
  const handleAvatarClick = () => {
    onClick?.();

    if (interactive) {
      // 循環切換情緒
      const emotions: RikaEmotion[] = [
        'happy',
        'curious',
        'thinking',
        'excited',
      ];
      const currentIndex = emotions.indexOf(currentEmotion);
      const nextEmotion = emotions[(currentIndex + 1) % emotions.length];
      handleEmotionChange(nextEmotion);
    }
  };

  return (
    <div className={`${POSITION_CLASSES[position]} z-50 ${className}`}>
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {/* 訊息框 */}
        <AnimatePresence>
          {showMessage && !isMinimized && (
            <motion.div
              className="absolute bottom-full left-0 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <RikaMessage
                message={currentMessage}
                emotion={currentEmotion}
                onComplete={() => {
                  if (autoPlay && !message) {
                    setTimeout(() => {
                      setShowMessage(false);
                      setTimeout(() => setShowMessage(true), 1000);
                    }, 3000);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 主要容器 */}
        <div className="relative">
          {/* 星靈頭像 */}
          <div onClick={handleAvatarClick}>
            <RikaAvatar
              emotion={currentEmotion}
              animation={currentAnimation}
              size={isMinimized ? 'md' : size}
            />
          </div>

          {/* 控制按鈕 */}
          {(minimizable || showSettings) && (
            <div className="absolute -top-2 -right-2 flex gap-1">
              {minimizable && (
                <motion.button
                  className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setIsMinimized(!isMinimized)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3 h-3" />
                  ) : (
                    <Minimize2 className="w-3 h-3" />
                  )}
                </motion.button>
              )}

              {showSettings && (
                <motion.button
                  className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="w-3 h-3" />
                </motion.button>
              )}
            </div>
          )}

          {/* 情緒選擇器（互動模式） */}
          {interactive && !isMinimized && (
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              <div className="flex gap-1 bg-white rounded-full px-2 py-1 shadow-lg">
                {(
                  ['happy', 'curious', 'thinking', 'excited'] as RikaEmotion[]
                ).map((emotionOption) => (
                  <button
                    key={emotionOption}
                    className={`
                      w-4 h-4 rounded-full transition-all duration-200
                      ${currentEmotion === emotionOption ? 'scale-125' : 'scale-75 opacity-50'}
                    `}
                    style={{
                      background: `linear-gradient(45deg, ${
                        emotionOption === 'happy'
                          ? '#FFD700, #FFA500'
                          : emotionOption === 'curious'
                            ? '#00CED1, #20B2AA'
                            : emotionOption === 'thinking'
                              ? '#9370DB, #8A2BE2'
                              : '#FF4500, #FF6347'
                      })`,
                    }}
                    onClick={() => handleEmotionChange(emotionOption)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 能量等級指示器 */}
          <motion.div
            className="absolute -left-2 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex flex-col gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-3 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: i < 3 ? 1 : 0.3 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
