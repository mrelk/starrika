# 🌟 星靈 Rika 元件系統

## 概述

星靈 Rika 是 Starrika 專案的核心 AI 角色，專為 3-8 歲兒童設計的智能助手。本文檔介紹 Rika 元件系統的使用方法。

## 🎭 核心概念

### 情緒狀態 (RikaEmotion)

- `happy` - 開心 😊
- `curious` - 好奇 🤔
- `thinking` - 思考 💭
- `excited` - 興奮 🤩

### 動畫類型 (RikaAnimation)

- `idle` - 靜止
- `bounce` - 彈跳
- `float` - 漂浮
- `spin` - 旋轉
- `pulse` - 脈動
- `wave` - 揮手
- `sparkle` - 閃爍
- `think` - 思考動作
- `celebrate` - 慶祝

## 📦 元件架構

### 1. RikaAvatar - 頭像元件

星靈 Rika 的視覺化頭像，支援動畫和情緒表現。

```tsx
import { RikaAvatar } from '@/components/rika';

<RikaAvatar
  emotion="happy"
  animation="float"
  size="lg"
  className="custom-styles"
/>;
```

**Props:**

- `emotion?: RikaEmotion` - 情緒狀態
- `animation?: RikaAnimation` - 動畫類型
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - 尺寸
- `className?: string` - 自訂樣式

### 2. RikaMessage - 訊息元件

顯示 Rika 的對話訊息，支援打字效果和語音播放。

```tsx
import { RikaMessage } from '@/components/rika';

<RikaMessage
  message="你好！我是星靈 Rika！"
  emotion="happy"
  autoType={true}
  typeSpeed={50}
  onComplete={() => console.log('打字完成')}
/>;
```

**Props:**

- `message: string` - 訊息內容
- `emotion?: RikaEmotion` - 情緒狀態
- `autoType?: boolean` - 是否自動打字
- `typeSpeed?: number` - 打字速度 (ms)
- `showVoiceButton?: boolean` - 顯示語音按鈕
- `onComplete?: () => void` - 完成回調

### 3. RikaWidget - 完整元件

整合頭像和訊息的完整互動元件。

```tsx
import { RikaWidget } from '@/components/rika';

<RikaWidget
  emotion="happy"
  message="歡迎來到 Starrika！"
  position="bottom-right"
  interactive={true}
  minimizable={true}
  onClick={() => console.log('點擊 Rika')}
/>;
```

**Props:**

- 繼承 `RikaAvatar` 和 `RikaMessage` 的所有 props
- `position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'` - 位置
- `interactive?: boolean` - 是否可互動
- `minimizable?: boolean` - 是否可最小化
- `showSettings?: boolean` - 顯示設定按鈕
- `welcomeMessage?: string` - 歡迎訊息

## 🔄 狀態管理

### RikaProvider

使用 Context API 管理 Rika 的全域狀態。

```tsx
import { RikaProvider } from '@/lib/rikaStore';

function App() {
  return <RikaProvider>{/* 你的應用內容 */}</RikaProvider>;
}
```

### useRika Hook

訪問和操作 Rika 狀態。

```tsx
import { useRika } from '@/lib/rikaStore';

function MyComponent() {
  const {
    currentState,
    updateEmotion,
    updateMessage,
    triggerResponse,
    isLoading,
    error,
  } = useRika();

  const handleHappyClick = () => {
    updateEmotion('happy');
    updateMessage('我很開心！');
  };

  return <button onClick={handleHappyClick}>讓 Rika 開心</button>;
}
```

### 便利 Hooks

```tsx
import {
  useRikaEmotion,
  useRikaMessage,
  useRikaAnimation,
} from '@/lib/rikaStore';

// 只操作情緒
const [emotion, setEmotion] = useRikaEmotion();

// 只操作訊息
const [message, setMessage] = useRikaMessage();

// 只操作動畫
const [animation, setAnimation] = useRikaAnimation();
```

## 🎬 情境觸發

系統提供預設的情境回應：

```tsx
const { triggerResponse } = useRika();

// 歡迎新用戶
triggerResponse('welcome');

// 收到問題時
triggerResponse('question_received');

// 故事生成中
triggerResponse('story_generating');

// 故事完成
triggerResponse('story_ready');

// 鼓勵用戶
triggerResponse('encouragement');
```

## 🎨 主題系統

每種情緒都有對應的顏色主題：

```tsx
import { RIKA_THEMES } from '@/components/rika/types';

const happyTheme = RIKA_THEMES.happy;
// {
//   primary: '#FFD700',
//   secondary: '#FFA500',
//   accent: '#FF69B4',
//   gradient: 'from-yellow-400 via-orange-400 to-pink-400',
//   shadow: 'shadow-yellow-300/50'
// }
```

## 📱 響應式設計

元件支援四種尺寸：

```tsx
import { RIKA_SIZES } from '@/components/rika/types';

// 小尺寸 (w-16 h-16)
<RikaAvatar size="sm" />

// 中尺寸 (w-24 h-24)
<RikaAvatar size="md" />

// 大尺寸 (w-32 h-32)
<RikaAvatar size="lg" />

// 超大尺寸 (w-48 h-48)
<RikaAvatar size="xl" />
```

## 🔗 資料庫整合

Rika 狀態可以保存到 Supabase：

```tsx
const { saveStateToDatabase, loadStateFromDatabase } = useRika();

// 保存當前狀態
await saveStateToDatabase();

// 載入用戶的 Rika 狀態
await loadStateFromDatabase();
```

## 🚀 快速開始

1. **基礎使用**

```tsx
import { RikaWidget } from '@/components/rika';

function HomePage() {
  return (
    <div>
      <h1>歡迎來到 Starrika</h1>
      <RikaWidget
        emotion="happy"
        message="你好！我是你的星靈夥伴 Rika！"
        position="bottom-right"
      />
    </div>
  );
}
```

2. **進階使用**

```tsx
import { RikaProvider, useRika } from '@/lib/rikaStore';
import { RikaWidget } from '@/components/rika';

function StoryPage() {
  const { triggerResponse } = useRika();

  const handleQuestionSubmit = async (question: string) => {
    // 觸發收到問題的回應
    await triggerResponse('question_received');

    // 處理問題...

    // 故事完成後
    await triggerResponse('story_ready');
  };

  return (
    <RikaWidget
      interactive={true}
      autoPlay={true}
      onEmotionChange={(emotion) => {
        console.log('情緒變化:', emotion);
      }}
    />
  );
}

function App() {
  return (
    <RikaProvider>
      <StoryPage />
    </RikaProvider>
  );
}
```

## 🎭 展示頁面

訪問 `/rika-demo` 查看完整的元件展示和互動測試。

## 🔧 自訂擴展

### 添加新情緒

1. 在 `types.ts` 中擴展 `RikaEmotion` 類型
2. 在 `RIKA_THEMES` 中添加對應主題
3. 在 `EMOTION_ICONS` 中添加圖示
4. 更新訊息庫和回應邏輯

### 添加新動畫

1. 在 `types.ts` 中擴展 `RikaAnimation` 類型
2. 在 `ANIMATION_VARIANTS` 中定義動畫效果
3. 使用 Framer Motion 的動畫屬性

## 📚 API 參考

完整的 TypeScript 類型定義請參考：

- `src/components/rika/types.ts` - 核心類型定義
- `src/components/rika/index.ts` - 匯出界面
- `src/lib/rikaStore.tsx` - 狀態管理

## 🎯 最佳實踐

1. **性能優化**

   - 使用 `React.memo` 包裝不常變化的元件
   - 適當使用 `useCallback` 和 `useMemo`
   - 控制動畫的頻率和複雜度

2. **用戶體驗**

   - 根據情境選擇合適的情緒和動畫
   - 保持一致的互動回饋
   - 考慮兒童的注意力特點

3. **無障礙支援**

   - 提供鍵盤導航支援
   - 適當的 ARIA 標籤
   - 高對比度和清晰的視覺元素

4. **效能監控**
   - 監控動畫效能
   - 適當的載入狀態
   - 錯誤處理和降級方案

---

## 🌟 結語

星靈 Rika 元件系統為 Starrika 專案提供了豐富的互動體驗。透過模組化的設計，開發者可以輕鬆整合和自訂 Rika 的行為，為兒童創造更有趣的學習環境。
