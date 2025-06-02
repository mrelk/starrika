# 🧠 AI 問題澄清系統

## 概述

AI 問題澄清系統是 Starrika 專案的核心功能之一，專為 3-8 歲兒童設計，能夠智能分析、改善和分類用戶提出的問題，確保每個問題都能創造出適齡且有趣的故事。

## 🎯 主要功能

### 1. 問題分析與分類
- **自動分類**：將問題歸類為科學、生活、情感、自然或其他類別
- **適齡性檢查**：評估問題是否適合 3-8 歲兒童
- **品質評分**：1-10 分評估問題的清晰度和故事潛力
- **內容安全**：過濾不當內容，確保兒童安全

### 2. 問題澄清與改善
- **自動改寫**：將模糊問題改寫為清楚易懂的版本
- **澄清檢測**：識別需要更多資訊的問題
- **澄清提示**：提供具體的澄清建議和引導問題
- **改進建議**：給出提升問題品質的具體建議

### 3. 星靈 Rika 整合
- **互動式澄清**：透過 Rika 與孩子自然對話來改善問題
- **情緒化回應**：根據問題類型和品質調整 Rika 的情緒
- **漸進式引導**：分步驟引導孩子表達更好的問題

## 🔧 技術架構

### API 端點

#### 1. 基本問題澄清
```http
POST /api/clarify-question
Content-Type: application/json

{
  "question": "為什麼天空是藍色的？",
  "childAge": 5,
  "saveToDatabase": true
}
```

**回應格式：**
```json
{
  "success": true,
  "message": "問題分析完成",
  "result": {
    "originalQuestion": "為什麼天空是藍色的？",
    "clarifiedQuestion": "天空看起來是藍色的，這是為什麼呢？",
    "category": "science",
    "appropriateForAge": true,
    "qualityScore": 9,
    "suggestions": ["這是一個很棒的問題！很適合創作故事"],
    "needsClarification": false,
    "clarificationPrompts": []
  },
  "recommendations": [
    "科學類問題很棒！可以激發孩子的探索精神"
  ]
}
```

#### 2. 快速檢查
```http
POST /api/clarify-question?action=quick-check
Content-Type: application/json

{
  "question": "那個東西是什麼？"
}
```

**回應格式：**
```json
{
  "success": true,
  "question": "那個東西是什麼？",
  "needsClarification": true,
  "message": "這個問題建議進一步澄清"
}
```

#### 3. 批次處理
```http
POST /api/clarify-question?action=batch
Content-Type: application/json

{
  "questions": [
    "為什麼天空是藍色的？",
    "恐龍為什麼消失了？"
  ],
  "childAge": 6
}
```

### 核心函數

#### `clarifyQuestion(question: string, childAge?: number)`
主要的問題澄清函數，使用 OpenAI GPT-4 進行深度分析。

```typescript
import { clarifyQuestion } from '@/lib/openai';

const result = await clarifyQuestion('為什麼天空是藍色的？', 5);
console.log(result.qualityScore); // 9
console.log(result.category); // 'science'
```

#### `quickQuestionCheck(question: string)`
快速檢查問題是否需要澄清，使用 GPT-3.5-turbo 提高效率。

```typescript
import { quickQuestionCheck } from '@/lib/openai';

const needsClarification = await quickQuestionCheck('那個東西是什麼？');
console.log(needsClarification); // true
```

## 🌟 Rika 整合功能

### 智能互動流程

1. **問題接收**：Rika 展現好奇情緒，表示收到問題
2. **分析階段**：切換到思考模式，進行 AI 分析
3. **結果回應**：根據分析結果調整情緒和回應
4. **澄清引導**：如需澄清，提供具體建議

### Hook 使用方式

```typescript
import { useRika } from '@/lib/rikaStore';

function QuestionInput() {
  const { processQuestionWithRika, analyzeQuestion, isLoading } = useRika();

  const handleSubmit = async (question: string) => {
    // 完整 Rika 互動流程
    await processQuestionWithRika(question, 5);
    
    // 或直接分析（無互動）
    const result = await analyzeQuestion(question, 5);
  };
}
```

## 📊 評分系統

### 品質評分標準 (1-10 分)

- **10 分**：問題清楚、有趣、適齡，能激發好奇心
- **7-9 分**：問題不錯但可以改進
- **4-6 分**：問題模糊或需要澄清
- **1-3 分**：問題不適合或有問題

### 分類系統

| 分類 | 描述 | 圖示 |
|------|------|------|
| `science` | 科學知識相關 | 🧠 |
| `nature` | 自然現象相關 | 🌿 |
| `life` | 日常生活相關 | 🏠 |
| `emotion` | 情感心理相關 | ❤️ |
| `other` | 其他類型 | 💭 |

## 🔒 安全機制

### 內容過濾
- 自動檢測不當內容
- 適齡性評估
- 暴力/恐怖內容過濾
- 確保正面教育價值

### 錯誤處理
- API 錯誤降級處理
- 網路異常容錯機制
- 用戶友善的錯誤訊息
- 重試機制

## 🎮 測試頁面

訪問 `/question-demo` 查看完整的功能展示：

### 功能特色
- **雙模式測試**：Rika 互動模式 vs 直接 API 模式
- **即時結果**：實時顯示分析結果和評分
- **示例問題**：預設多種測試問題
- **視覺化回饋**：直觀的 UI 展示分析結果

### 示例問題測試

#### 優質問題 (8-10 分)
- "為什麼天空是藍色的？"
- "恐龍為什麼會消失？"
- "彩虹是怎麼來的？"

#### 需要澄清的問題 (1-5 分)
- "那個東西是什麼？"
- "怎麼辦？"
- "為什麼會這樣？"

## 💡 使用範例

### 基本使用
```typescript
// 在 React 元件中
import { RikaProvider, useRika } from '@/lib/rikaStore';

function App() {
  return (
    <RikaProvider>
      <QuestionInterface />
    </RikaProvider>
  );
}

function QuestionInterface() {
  const { processQuestionWithRika } = useRika();
  
  const handleQuestion = async (question: string) => {
    await processQuestionWithRika(question, 5);
  };
}
```

### 直接 API 呼叫
```typescript
// 伺服器端或客戶端直接使用
const response = await fetch('/api/clarify-question', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: '為什麼天空是藍色的？',
    childAge: 5
  })
});

const { result } = await response.json();
console.log(result.qualityScore); // 9
```

## 🚀 最佳實踐

### 1. 效能優化
- 使用 `quickQuestionCheck` 進行預檢
- 批次處理多個問題時使用 batch API
- 適當的錯誤處理和降級機制

### 2. 用戶體驗
- 提供即時載入狀態
- 清楚的錯誤訊息
- 引導式的澄清建議

### 3. 內容品質
- 定期檢視評分準確性
- 更新適齡性標準
- 持續改進澄清提示

## 🔮 未來發展

### 短期目標
- [ ] 增加更多語言支援
- [ ] 優化回應速度
- [ ] 擴展分類系統

### 長期規劃
- [ ] 個人化問題建議
- [ ] 學習記錄分析
- [ ] 多模態輸入支援（語音、圖片）

## 📝 更新日誌

### v1.0.0 (目前版本)
- ✅ 基本問題澄清功能
- ✅ Rika 智能互動
- ✅ 分類和評分系統
- ✅ 批次處理支援
- ✅ 測試頁面

---

## 📞 支援

如有任何問題或建議，請參考：
- API 文檔：`GET /api/clarify-question`
- 測試頁面：`/question-demo`
- Rika 元件文檔：`RIKA_COMPONENTS.md` 