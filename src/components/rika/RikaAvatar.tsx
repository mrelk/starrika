'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Lightbulb, Zap } from 'lucide-react';
import { RikaEmotion, RikaAnimation, RIKA_THEMES, RIKA_SIZES } from './types';

interface RikaAvatarProps {
  emotion?: RikaEmotion;
  animation?: RikaAnimation;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const EMOTION_ICONS = {
  happy: Heart,
  curious: Lightbulb,
  thinking: Sparkles,
  excited: Zap,
};

const ANIMATION_VARIANTS = {
  idle: {
    scale: 1,
    rotate: 0,
    y: 0,
  },
  bounce: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  spin: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  wave: {
    rotate: [0, 15, -15, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  sparkle: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  think: {
    y: [0, -5, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  celebrate: {
    scale: [1, 1.3, 1],
    rotate: [0, 360],
    transition: {
      duration: 0.8,
      repeat: 2,
      ease: 'easeInOut',
    },
  },
};

export default function RikaAvatar({
  emotion = 'happy',
  animation = 'float',
  size = 'md',
  className = '',
}: RikaAvatarProps) {
  const theme = RIKA_THEMES[emotion];
  const sizeConfig = RIKA_SIZES[size];
  const Icon = EMOTION_ICONS[emotion];

  return (
    <div className={`relative ${className}`}>
      {/* 主要頭像容器 */}
      <motion.div
        className={`
          ${sizeConfig.container}
          relative
          bg-gradient-to-br ${theme.gradient}
          rounded-full
          ${theme.shadow}
          shadow-lg
          border-4 border-white
          overflow-hidden
          cursor-pointer
          select-none
        `}
        variants={ANIMATION_VARIANTS}
        animate={animation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 背景光暈 */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 星靈圖示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className={`
              ${
                size === 'sm'
                  ? 'w-6 h-6'
                  : size === 'md'
                    ? 'w-8 h-8'
                    : size === 'lg'
                      ? 'w-12 h-12'
                      : 'w-16 h-16'
              }
              text-white drop-shadow-md
            `}
          />
        </div>

        {/* 情緒粒子效果 */}
        {emotion === 'excited' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}

        {/* 思考泡泡 */}
        {emotion === 'thinking' && (
          <div className="absolute -top-2 -right-2">
            <motion.div
              className="w-4 h-4 bg-white rounded-full opacity-80"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        )}
      </motion.div>

      {/* 環繞光環 */}
      <motion.div
        className={`
          absolute inset-0 -z-10
          rounded-full
          bg-gradient-to-br ${theme.gradient}
          opacity-20
        `}
        style={{
          transform: 'scale(1.3)',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 星星裝飾 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 text-yellow-300"
          style={{
            left: `${10 + i * 30}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeInOut',
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
}
