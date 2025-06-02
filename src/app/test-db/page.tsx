'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
}

export default function TestDbPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const result = await response.json();
      addResult(result);
    } catch (error) {
      addResult({
        success: false,
        message: '請求失敗',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    setLoading(false);
  };

  const testAnonymousAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-anonymous-auth' }),
      });
      const result = await response.json();
      addResult(result);
    } catch (error) {
      addResult({
        success: false,
        message: '匿名登入測試失敗',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    setLoading(false);
  };

  const testCreateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-create-user' }),
      });
      const result = await response.json();
      addResult(result);
    } catch (error) {
      addResult({
        success: false,
        message: '建立用戶測試失敗',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🧪 Supabase 資料庫測試
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              📊 測試資料庫連接
            </button>

            <button
              onClick={testAnonymousAuth}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              👤 測試匿名登入
            </button>

            <button
              onClick={testCreateUser}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              ➕ 測試建立用戶
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              🗑️ 清除結果
            </button>
          </div>

          {loading && (
            <div className="text-center text-gray-600 mb-4">
              ⏳ 測試進行中...
            </div>
          )}

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">
                    {result.success ? '✅' : '❌'}
                  </span>
                  <h3
                    className={`font-semibold ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.message}
                  </h3>
                </div>

                {result.data && (
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}

                {result.error && (
                  <div className="text-red-600 text-sm mt-2">
                    錯誤詳情: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              點擊上方按鈕開始測試 Supabase 連接
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 測試項目說明
          </h2>
          <div className="space-y-3 text-gray-600">
            <div>
              <strong>📊 資料庫連接測試：</strong>
              檢查 Supabase 客戶端是否能正常連接到資料庫，並測試認證系統狀態。
            </div>
            <div>
              <strong>👤 匿名登入測試：</strong>
              測試匿名用戶認證功能，這是 Starrika 的核心功能之一。
            </div>
            <div>
              <strong>➕ 建立用戶測試：</strong>
              測試在資料庫中建立新用戶記錄的功能。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
