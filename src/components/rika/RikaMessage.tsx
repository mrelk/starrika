'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { RikaEmotion, RIKA_THEMES } from './types';

interface RikaMessageProps {
  message: string;
  emotion?: RikaEmotion;
  autoType?: boolean;
  typeSpeed?: number;
  showVoiceButton?: boolean;
  onComplete?: () => void;
  className?: string;
}

export default function RikaMessage({
  message,
  emotion = 'happy',
  autoType = true,
  typeSpeed = 50,
  showVoiceButton = true,
  onComplete,
  className = '',
}: RikaMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(autoType);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const theme = RIKA_THEMES[emotion];

  // 打字機效果
  useEffect(() => {
    if (!autoType) {
      setDisplayedText(message);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    const timer = setInterval(() => {
      if (index <= message.length) {
        setDisplayedText(message.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, typeSpeed);

    return () => clearInterval(timer);
  }, [message, autoType, typeSpeed, onComplete]);

  // 語音播放功能（模擬）
  const handleVoicePlay = () => {
    if (isVoicePlaying) return;

    setIsVoicePlaying(true);

    // 模擬語音播放時間（實際應用中會整合真正的 TTS 服務）
    const duration = message.length * 100; // 根據文字長度估算播放時間

    setTimeout(() => {
      setIsVoicePlaying(false);
    }, duration);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 對話框容器 */}
      <div className="relative">
        {/* 對話框背景 */}
        <div
          className={`
            relative
            bg-white
            rounded-2xl
            ${theme.shadow}
            shadow-lg
            border-2
            p-4
            max-w-sm
            min-h-[3rem]
          `}
          style={{ borderColor: theme.primary }}
        >
          {/* 彩虹邊框效果 */}
          <div
            className={`
              absolute inset-0
              rounded-2xl
              bg-gradient-to-r ${theme.gradient}
              opacity-20
              -z-10
            `}
            style={{ transform: 'scale(1.02)' }}
          />

          {/* 訊息內容 */}
          <div className="relative">
            <p className="text-gray-800 leading-relaxed text-sm font-medium">
              {displayedText}
              {isTyping && (
                <motion.span
                  className="inline-block ml-1 w-2 h-4 bg-gray-400 rounded-sm"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </p>

            {/* 語音播放按鈕 */}
            {showVoiceButton && !isTyping && (
              <motion.button
                className={`
                  absolute -top-2 -right-2
                  w-8 h-8
                  bg-gradient-to-r ${theme.gradient}
                  rounded-full
                  flex items-center justify-center
                  text-white
                  ${theme.shadow}
                  shadow-md
                  hover:scale-110
                  transition-transform
                  ${isVoicePlaying ? 'animate-pulse' : ''}
                `}
                onClick={handleVoicePlay}
                disabled={isVoicePlaying}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isVoicePlaying ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>

          {/* 對話框尾巴 */}
          <div
            className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45"
            style={{ borderColor: theme.primary }}
          />
        </div>

        {/* 漂浮裝飾 */}
        <AnimatePresence>
          {emotion === 'excited' && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-400 text-xs"
                  style={{
                    left: `${10 + i * 20}%`,
                    top: `-${10 + i * 5}px`,
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, -40, -60],
                    scale: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeOut',
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* 思考效果 */}
        {emotion === 'thinking' && (
          <motion.div
            className="absolute -top-6 left-4 text-gray-400 text-xs"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💭
          </motion.div>
        )}

        {/* 好奇心泡泡 */}
        {emotion === 'curious' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-300 rounded-full opacity-60"
                style={{
                  right: `${5 + i * 8}px`,
                  top: `${-5 - i * 3}px`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}
