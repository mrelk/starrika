# Supabase 設定指南

這份文檔說明如何設定 Starrika 專案的 Supabase 後端。

## 📋 前置需求

1. [Supabase 帳號](https://supabase.com)
2. Node.js 18+ 環境
3. Next.js 專案已初始化

## 🚀 快速開始

### 1. 建立 Supabase 專案

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 點擊 "New Project"
3. 選擇組織並輸入專案名稱：`starrika`
4. 選擇地區（建議選擇離用戶最近的地區）
5. 設定資料庫密碼（請務必記住）
6. 點擊 "Create new project"

### 2. 獲取 API 金鑰

專案建立完成後，在 Settings > API 頁面找到：

- **Project URL**：`https://your-project-id.supabase.co`
- **anon/public key**：匿名金鑰
- **service_role key**：服務端金鑰（機密）

### 3. 設定環境變數

在專案根目錄建立 `.env.local` 檔案：

```bash
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI API 設定
OPENAI_API_KEY=your-openai-api-key
```

⚠️ **注意**：`.env.local` 已加入 `.gitignore`，不會被提交到 Git。

### 4. 執行資料庫 Schema

1. 在 Supabase Dashboard，前往 SQL Editor
2. 點擊 "New query"
3. 複製 `supabase-schema.sql` 的內容
4. 貼上並執行 SQL

### 5. 設定 Row Level Security (RLS)

資料庫 Schema 已包含完整的 RLS 政策，確保：

- ✅ 用戶只能存取自己的資料
- ✅ 匿名用戶有適當的權限
- ✅ 孩子資料受到保護

### 6. 測試連接

1. 啟動開發伺服器：

   ```bash
   npm run dev
   ```

2. 訪問測試頁面：

   ```
   http://localhost:3000/test-db
   ```

3. 點擊各種測試按鈕確認功能正常

## 🗄️ 資料庫結構

### 核心資料表

| 資料表           | 說明     | 關鍵欄位                                       |
| ---------------- | -------- | ---------------------------------------------- |
| `users`          | 用戶資料 | `id`, `email`, `role`                          |
| `child_profiles` | 孩子檔案 | `user_id`, `name`, `age`, `star_energy`        |
| `questions`      | 問題記錄 | `text`, `category`, `asked_by`                 |
| `stories`        | 故事內容 | `question_id`, `title`                         |
| `story_panels`   | 故事面板 | `story_id`, `panel_order`, `text`, `image_url` |
| `rika_states`    | 星靈狀態 | `user_id`, `emotion`, `message`                |

### 關係圖

```
users (1) ──→ (n) child_profiles
users (1) ──→ (n) questions
users (1) ──→ (n) rika_states
questions (1) ──→ (n) stories
stories (1) ──→ (n) story_panels
```

## 🔧 API 使用範例

### 基本認證

```typescript
import { signInAnonymously, getCurrentUser } from '@/lib/supabase';

// 匿名登入
const { user, error } = await signInAnonymously();

// 獲取當前用戶
const currentUser = await getCurrentUser();
```

### 資料庫操作

```typescript
import { userService, questionService } from '@/lib/database';

// 建立用戶
const { user } = await userService.createUser({
  role: 'child',
});

// 建立問題
const { question } = await questionService.createQuestion({
  text: '為什麼天空是藍色的？',
  category: 'science',
  asked_by: user.id,
});
```

## 🔒 安全性考量

1. **RLS 政策**：所有資料表都啟用 Row Level Security
2. **匿名用戶**：支援匿名體驗，但資料仍受保護
3. **API 金鑰**：服務端金鑰僅用於後端操作
4. **資料驗證**：前端和後端都有資料驗證

## 🐛 常見問題

### Q: 環境變數錯誤

**A**: 確認 `.env.local` 檔案格式正確，重啟開發伺服器

### Q: 資料庫連接失敗

**A**: 檢查 Supabase 專案是否正常運行，API 金鑰是否正確

### Q: RLS 政策錯誤

**A**: 確認 SQL Schema 完全執行，檢查 Supabase Dashboard 的 Authentication 設定

### Q: 匿名登入失敗

**A**: 在 Supabase Dashboard > Authentication > Settings 啟用 "Enable anonymous sign-ins"

## 📚 相關文檔

- [Supabase 官方文檔](https://supabase.com/docs)
- [Next.js 整合指南](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [認證系統](https://supabase.com/docs/guides/auth)

## 🆘 需要協助？

如果遇到問題，請檢查：

1. 📋 環境變數是否正確設定
2. 🗄️ 資料庫 Schema 是否完整執行
3. 🔒 RLS 政策是否啟用
4. 🧪 測試頁面是否正常運作

---

**下一步**：完成 Supabase 設定後，可以繼續開發星靈 Rika 互動系統！
