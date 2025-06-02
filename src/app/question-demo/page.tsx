'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RikaWidget } from '@/components/rika';
import { RikaProvider, useRika } from '@/lib/rikaStore';
import { QuestionClarificationResult } from '@/lib/openai';
import { 
  Send, 
  Sparkles, 
  MessageCircle, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Star,
  Target,
  Heart
} from 'lucide-react';

function QuestionDemoContent() {
  const [question, setQuestion] = useState('');
  const [childAge, setChildAge] = useState(5);
  const [result, setResult] = useState<QuestionClarificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState<'rika' | 'api'>('rika');

  const { 
    currentState, 
    processQuestionWithRika, 
    analyzeQuestion, 
    triggerResponse,
    isLoading, 
    error 
  } = useRika();

  // 示例問題
  const exampleQuestions = [
    '為什麼天空是藍色的？',
    '恐龍為什麼會消失？',
    '為什麼我們要睡覺？',
    '彩虹是怎麼來的？',
    '為什麼花會有不同的顏色？',
    '那個東西是什麼？', // 需要澄清的模糊問題
    '怎麼辦？', // 需要澄清的問題
  ];

  // 歡迎 Rika
  useEffect(() => {
    triggerResponse('welcome');
  }, [triggerResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setShowResult(false);
    setResult(null);

    if (mode === 'rika') {
      // 使用 Rika 互動模式
      await processQuestionWithRika(question, childAge);
    } else {
      // 直接 API 分析模式
      const analysisResult = await analyzeQuestion(question, childAge);
      setResult(analysisResult);
      setShowResult(true);
    }
  };

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return '優秀';
    if (score >= 6) return '良好';
    if (score >= 4) return '普通';
    return '需要改進';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'science': return <Brain className="w-5 h-5 text-blue-500" />;
      case 'nature': return <Sparkles className="w-5 h-5 text-green-500" />;
      case 'emotion': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'life': return <Target className="w-5 h-5 text-purple-500" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🌟 AI 問題澄清系統
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            讓星靈 Rika 幫助你分析和改善問題，創造更棒的故事體驗！
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：問題輸入區 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-blue-500" />
                問題輸入
              </h2>

              {/* 模式切換 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分析模式
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setMode('rika')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      mode === 'rika'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🌟 Rika 互動模式
                  </button>
                  <button
                    onClick={() => setMode('api')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      mode === 'api'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🔧 直接分析模式
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 年齡選擇 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    孩子年齡
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {[3, 4, 5, 6, 7, 8].map(age => (
                      <option key={age} value={age}>{age} 歲</option>
                    ))}
                  </select>
                </div>

                {/* 問題輸入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    問題內容
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="請輸入你想問的問題..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                {/* 提交按鈕 */}
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? '分析中...' : '開始分析'}
                </button>
              </form>

              {/* 示例問題 */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">示例問題：</h3>
                <div className="grid grid-cols-1 gap-2">
                  {exampleQuestions.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* 錯誤訊息 */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* 右側：結果顯示區 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {mode === 'rika' ? (
              /* Rika 互動模式 */
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
                  星靈 Rika 互動
                </h2>
                
                <div className="flex justify-center">
                  <RikaWidget
                    emotion={currentState.emotion}
                    message={currentState.message}
                    animation={currentState.animation}
                    autoPlay={true}
                    interactive={false}
                    size="lg"
                  />
                </div>
              </div>
            ) : (
              /* API 分析結果 */
              showResult && result && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-blue-500" />
                    分析結果
                  </h2>

                  <div className="space-y-6">
                    {/* 原始問題 */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">原始問題：</h3>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {result.originalQuestion}
                      </p>
                    </div>

                    {/* 澄清後問題 */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">澄清後問題：</h3>
                      <p className="text-gray-800 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        {result.clarifiedQuestion}
                      </p>
                    </div>

                    {/* 評分和分類 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Star className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="font-semibold">品質評分</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(result.qualityScore)}`}>
                          {result.qualityScore}/10
                        </div>
                        <div className="text-sm text-gray-600">
                          {getScoreText(result.qualityScore)}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          {getCategoryIcon(result.category)}
                          <span className="font-semibold ml-2">問題分類</span>
                        </div>
                        <div className="text-lg font-bold text-gray-800 capitalize">
                          {result.category}
                        </div>
                      </div>
                    </div>

                    {/* 狀態指標 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        {result.appropriateForAge ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className={result.appropriateForAge ? 'text-green-700' : 'text-red-700'}>
                          {result.appropriateForAge ? '適合年齡' : '不適合年齡'}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {result.needsClarification ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        )}
                        <span className={result.needsClarification ? 'text-yellow-700' : 'text-green-700'}>
                          {result.needsClarification ? '需要澄清' : '問題清楚'}
                        </span>
                      </div>
                    </div>

                    {/* 建議 */}
                    {result.suggestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">改進建議：</h3>
                        <ul className="space-y-2">
                          {result.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-600">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 澄清提示 */}
                    {result.clarificationPrompts && result.clarificationPrompts.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">澄清提示：</h3>
                        <ul className="space-y-2">
                          {result.clarificationPrompts.map((prompt, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-600">{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* API 說明區域 */}
        <motion.div
          className="mt-12 bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 API 使用說明</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">單一問題分析</h3>
              <p className="text-blue-600 text-sm">
                POST /api/clarify-question<br />
                分析單一問題並提供詳細回饋
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">批次處理</h3>
              <p className="text-green-600 text-sm">
                POST /api/clarify-question?action=batch<br />
                同時分析多個問題
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">快速檢查</h3>
              <p className="text-purple-600 text-sm">
                POST /api/clarify-question?action=quick-check<br />
                快速判斷是否需要澄清
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function QuestionDemoPage() {
  return (
    <RikaProvider>
      <QuestionDemoContent />
    </RikaProvider>
  );
} 