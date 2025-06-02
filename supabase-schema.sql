-- Starrika 資料庫 Schema
-- 建立時間: 2024-06-02

-- 啟用必要的擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 建立 Enums
CREATE TYPE user_role AS ENUM ('child', 'parent');
CREATE TYPE question_category AS ENUM ('science', 'life', 'emotion', 'nature', 'other');
CREATE TYPE rika_emotion AS ENUM ('happy', 'curious', 'thinking', 'excited');

-- 用戶資料表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    role user_role NOT NULL DEFAULT 'child',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 孩子檔案資料表
CREATE TABLE child_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 3 AND age <= 8),
    interests TEXT[] DEFAULT '{}',
    star_energy INTEGER DEFAULT 0 CHECK (star_energy >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 問題資料表
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    category question_category NOT NULL DEFAULT 'other',
    asked_by UUID REFERENCES users(id) ON DELETE CASCADE,
    asked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 故事資料表
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 故事面板資料表
CREATE TABLE story_panels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    panel_order INTEGER NOT NULL CHECK (panel_order >= 1),
    text TEXT NOT NULL,
    image_prompt TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, panel_order)
);

-- 星靈狀態資料表
CREATE TABLE rika_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emotion rika_emotion NOT NULL DEFAULT 'happy',
    message TEXT NOT NULL,
    animation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_child_profiles_user_id ON child_profiles(user_id);
CREATE INDEX idx_questions_asked_by ON questions(asked_by);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_stories_question_id ON stories(question_id);
CREATE INDEX idx_story_panels_story_id ON story_panels(story_id);
CREATE INDEX idx_story_panels_order ON story_panels(story_id, panel_order);
CREATE INDEX idx_rika_states_user_id ON rika_states(user_id);
CREATE INDEX idx_rika_states_created_at ON rika_states(created_at DESC);

-- 建立 updated_at 自動更新觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_child_profiles_updated_at BEFORE UPDATE ON child_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 建立星星能量增加函數
CREATE OR REPLACE FUNCTION increment_star_energy(profile_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE child_profiles 
    SET star_energy = star_energy + amount,
        updated_at = NOW()
    WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) 政策
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rika_states ENABLE ROW LEVEL SECURITY;

-- 用戶可以讀取和更新自己的資料
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 用戶可以管理自己的孩子檔案
CREATE POLICY "Users can manage own child profiles" ON child_profiles
    FOR ALL USING (auth.uid() = user_id);

-- 用戶可以管理自己的問題
CREATE POLICY "Users can manage own questions" ON questions
    FOR ALL USING (auth.uid() = asked_by);

-- 用戶可以查看與自己問題相關的故事
CREATE POLICY "Users can view stories for own questions" ON stories
    FOR SELECT USING (
        question_id IN (
            SELECT id FROM questions WHERE asked_by = auth.uid()
        )
    );

-- 用戶可以查看與自己故事相關的面板
CREATE POLICY "Users can view panels for own stories" ON story_panels
    FOR SELECT USING (
        story_id IN (
            SELECT s.id FROM stories s
            JOIN questions q ON s.question_id = q.id
            WHERE q.asked_by = auth.uid()
        )
    );

-- 用戶可以管理自己的星靈狀態
CREATE POLICY "Users can manage own rika states" ON rika_states
    FOR ALL USING (auth.uid() = user_id);

-- 建立預設的星靈狀態
INSERT INTO rika_states (user_id, emotion, message) VALUES
    ('00000000-0000-0000-0000-000000000000', 'happy', '哈囉！我是星靈 Rika，準備好一起探索奇妙的世界了嗎？');

-- 註解說明
COMMENT ON TABLE users IS '用戶資料表：儲存基本用戶資訊';
COMMENT ON TABLE child_profiles IS '孩子檔案表：儲存孩子的詳細資訊和星星能量';
COMMENT ON TABLE questions IS '問題表：儲存孩子提出的問題';
COMMENT ON TABLE stories IS '故事表：儲存為問題生成的故事';
COMMENT ON TABLE story_panels IS '故事面板表：儲存故事的各個面板內容';
COMMENT ON TABLE rika_states IS '星靈狀態表：儲存星靈 Rika 的情緒和對話狀態';

COMMENT ON FUNCTION increment_star_energy IS '增加孩子的星星能量'; 