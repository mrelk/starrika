import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Supabase 設定
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 檢查是否為真實的環境變數
const hasValidCredentials =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 建立 Supabase 客戶端（客戶端使用）
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// 建立 Supabase 管理員客戶端（伺服器端使用）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// 輔助函數：檢查環境變數
export const checkSupabaseConfig = () => {
  if (!hasValidCredentials) {
    throw new Error(
      '請設定 Supabase 環境變數：NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
};

// 輔助函數：檢查用戶是否已登入
export const getCurrentUser = async () => {
  checkSupabaseConfig();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return user;
};

// 輔助函數：匿名登入
export const signInAnonymously = async () => {
  checkSupabaseConfig();

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error('Error signing in anonymously:', error);
    return { user: null, error };
  }

  return { user: data.user, error: null };
};

// 輔助函數：登出
export const signOut = async () => {
  checkSupabaseConfig();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
  }

  return { error };
};
