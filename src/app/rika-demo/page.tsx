'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RikaWidget,
  RikaAvatar,
  RikaMessage,
  RikaEmotion,
  RikaAnimation,
} from '@/components/rika';
import { RikaProvider, useRika } from '@/lib/rikaStore';

function RikaDemoContent() {
  const [selectedEmotion, setSelectedEmotion] = useState<RikaEmotion>('happy');
  const [selectedAnimation, setSelectedAnimation] =
    useState<RikaAnimation>('float');
  const [customMessage, setCustomMessage] = useState('');
  const [showWidget, setShowWidget] = useState(true);

  const { currentState, updateState, triggerResponse, isLoading } = useRika();

  const emotions: RikaEmotion[] = ['happy', 'curious', 'thinking', 'excited'];
  const animations: RikaAnimation[] = [
    'idle',
    'bounce',
    'float',
    'spin',
    'pulse',
    'wave',
    'sparkle',
    'think',
    'celebrate',
  ];

  const triggers = [
    { key: 'welcome', label: '歡迎' },
    { key: 'question_received', label: '收到問題' },
    { key: 'story_generating', label: '生成故事中' },
    { key: 'story_ready', label: '故事完成' },
    { key: 'encouragement', label: '鼓勵' },
  ];

  const handleUpdateState = () => {
    updateState({
      emotion: selectedEmotion,
      animation: selectedAnimation,
      message: customMessage || '你好！我是星靈 Rika ✨',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🌟 星靈 Rika 元件展示
          </h1>
          <p className="text-gray-600 text-lg">
            探索星靈 Rika 的各種情緒、動畫和互動功能
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：控制面板 */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 當前狀態 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📊 當前狀態
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">情緒：</span>
                  <span className="font-medium">{currentState.emotion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">動畫：</span>
                  <span className="font-medium">{currentState.animation}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">訊息：</span>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                    {currentState.message}
                  </p>
                </div>
              </div>
            </div>

            {/* 情緒選擇 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                😊 選擇情緒
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200
                      ${
                        selectedEmotion === emotion
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setSelectedEmotion(emotion)}
                  >
                    {emotion === 'happy' && '😊 開心'}
                    {emotion === 'curious' && '🤔 好奇'}
                    {emotion === 'thinking' && '💭 思考'}
                    {emotion === 'excited' && '🤩 興奮'}
                  </button>
                ))}
              </div>
            </div>

            {/* 動畫選擇 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ✨ 選擇動畫
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {animations.map((animation) => (
                  <button
                    key={animation}
                    className={`
                      p-2 text-xs rounded border transition-all duration-200
                      ${
                        selectedAnimation === animation
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setSelectedAnimation(animation)}
                  >
                    {animation}
                  </button>
                ))}
              </div>
            </div>

            {/* 自訂訊息 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                💬 自訂訊息
              </h3>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="輸入自訂訊息..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
              <button
                className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                onClick={handleUpdateState}
                disabled={isLoading}
              >
                {isLoading ? '更新中...' : '更新狀態'}
              </button>
            </div>

            {/* 情境觸發 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🎭 情境觸發
              </h3>
              <div className="space-y-2">
                {triggers.map((trigger) => (
                  <button
                    key={trigger.key}
                    className="w-full p-2 text-left text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => triggerResponse(trigger.key)}
                    disabled={isLoading}
                  >
                    {trigger.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右側：展示區 */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* 個別元件測試 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                🧪 個別元件測試
              </h3>

              {/* 頭像元件 */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-700 mb-4">
                  RikaAvatar
                </h4>
                <div className="flex justify-center space-x-6">
                  <div className="text-center">
                    <RikaAvatar emotion="happy" animation="bounce" size="sm" />
                    <p className="mt-2 text-xs text-gray-500">小尺寸</p>
                  </div>
                  <div className="text-center">
                    <RikaAvatar emotion="curious" animation="wave" size="md" />
                    <p className="mt-2 text-xs text-gray-500">中尺寸</p>
                  </div>
                  <div className="text-center">
                    <RikaAvatar
                      emotion={selectedEmotion}
                      animation={selectedAnimation}
                      size="lg"
                    />
                    <p className="mt-2 text-xs text-gray-500">自訂狀態</p>
                  </div>
                </div>
              </div>

              {/* 訊息元件 */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-700 mb-4">
                  RikaMessage
                </h4>
                <div className="flex justify-center">
                  <RikaMessage
                    message={currentState.message}
                    emotion={currentState.emotion}
                    autoType={true}
                    typeSpeed={50}
                  />
                </div>
              </div>
            </div>

            {/* Widget 展示 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  🎮 完整 Widget
                </h3>
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  onClick={() => setShowWidget(!showWidget)}
                >
                  {showWidget ? '隱藏' : '顯示'} Widget
                </button>
              </div>

              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Widget 展示區域
                </div>

                {showWidget && (
                  <RikaWidget
                    emotion={currentState.emotion}
                    message={currentState.message}
                    animation={currentState.animation}
                    position="center"
                    interactive={true}
                    minimizable={true}
                    showSettings={true}
                  />
                )}
              </div>
            </div>

            {/* 使用說明 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📚 使用說明
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 點擊左側的情緒和動畫按鈕來改變星靈 Rika 的狀態</p>
                <p>• 在自訂訊息區域輸入文字來設定對話內容</p>
                <p>• 使用情境觸發來體驗預設的回應模式</p>
                <p>• Widget 支援互動模式，可以點擊頭像切換情緒</p>
                <p>• Widget 可以最小化和設定，適合嵌入到其他頁面</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function RikaDemoPage() {
  return (
    <RikaProvider>
      <RikaDemoContent />
    </RikaProvider>
  );
}
