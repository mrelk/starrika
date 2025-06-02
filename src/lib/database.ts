import { supabase } from './supabase';
import type { Database } from '@/types/database';

// 類型別名
type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type ChildProfile = Tables['child_profiles']['Row'];
type Question = Tables['questions']['Row'];
type Story = Tables['stories']['Row'];
type StoryPanel = Tables['story_panels']['Row'];
type RikaState = Tables['rika_states']['Row'];

// === 用戶相關操作 ===

export const userService = {
  // 建立新用戶
  async createUser(userData: Tables['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return { user: null, error };
    }

    return { user: data, error: null };
  },

  // 獲取用戶資料
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return { user: null, error };
    }

    return { user: data, error: null };
  },

  // 更新用戶資料
  async updateUser(userId: string, updates: Tables['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return { user: null, error };
    }

    return { user: data, error: null };
  },
};

// === 孩子檔案相關操作 ===

export const childProfileService = {
  // 建立孩子檔案
  async createChildProfile(profileData: Tables['child_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('child_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating child profile:', error);
      return { profile: null, error };
    }

    return { profile: data, error: null };
  },

  // 獲取孩子檔案
  async getChildProfile(userId: string) {
    const { data, error } = await supabase
      .from('child_profiles')
      .select()
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching child profile:', error);
      return { profile: null, error };
    }

    return { profile: data, error: null };
  },

  // 更新孩子檔案
  async updateChildProfile(
    profileId: string,
    updates: Tables['child_profiles']['Update']
  ) {
    const { data, error } = await supabase
      .from('child_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      console.error('Error updating child profile:', error);
      return { profile: null, error };
    }

    return { profile: data, error: null };
  },

  // 增加星星能量
  async addStarEnergy(profileId: string, amount: number) {
    const { data, error } = await supabase.rpc('increment_star_energy', {
      profile_id: profileId,
      amount: amount,
    });

    if (error) {
      console.error('Error adding star energy:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  },
};

// === 問題相關操作 ===

export const questionService = {
  // 建立新問題
  async createQuestion(questionData: Tables['questions']['Insert']) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      return { question: null, error };
    }

    return { question: data, error: null };
  },

  // 獲取用戶的問題列表
  async getUserQuestions(userId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select()
      .eq('asked_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching questions:', error);
      return { questions: [], error };
    }

    return { questions: data, error: null };
  },

  // 獲取特定問題
  async getQuestion(questionId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select()
      .eq('id', questionId)
      .single();

    if (error) {
      console.error('Error fetching question:', error);
      return { question: null, error };
    }

    return { question: data, error: null };
  },
};

// === 故事相關操作 ===

export const storyService = {
  // 建立新故事
  async createStory(storyData: Tables['stories']['Insert']) {
    const { data, error } = await supabase
      .from('stories')
      .insert(storyData)
      .select()
      .single();

    if (error) {
      console.error('Error creating story:', error);
      return { story: null, error };
    }

    return { story: data, error: null };
  },

  // 獲取故事及其面板
  async getStoryWithPanels(storyId: string) {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `
        *,
        story_panels(*)
      `
      )
      .eq('id', storyId)
      .single();

    if (error) {
      console.error('Error fetching story with panels:', error);
      return { story: null, error };
    }

    return { story: data, error: null };
  },

  // 建立故事面板
  async createStoryPanel(panelData: Tables['story_panels']['Insert']) {
    const { data, error } = await supabase
      .from('story_panels')
      .insert(panelData)
      .select()
      .single();

    if (error) {
      console.error('Error creating story panel:', error);
      return { panel: null, error };
    }

    return { panel: data, error: null };
  },

  // 更新面板圖片URL
  async updatePanelImage(panelId: string, imageUrl: string) {
    const { data, error } = await supabase
      .from('story_panels')
      .update({ image_url: imageUrl })
      .eq('id', panelId)
      .select()
      .single();

    if (error) {
      console.error('Error updating panel image:', error);
      return { panel: null, error };
    }

    return { panel: data, error: null };
  },
};

// === 星靈 Rika 狀態相關操作 ===

export const rikaService = {
  // 建立新的星靈狀態
  async createRikaState(stateData: Tables['rika_states']['Insert']) {
    const { data, error } = await supabase
      .from('rika_states')
      .insert(stateData)
      .select()
      .single();

    if (error) {
      console.error('Error creating Rika state:', error);
      return { state: null, error };
    }

    return { state: data, error: null };
  },

  // 獲取用戶最新的星靈狀態
  async getLatestRikaState(userId: string) {
    const { data, error } = await supabase
      .from('rika_states')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest Rika state:', error);
      return { state: null, error };
    }

    return { state: data, error: null };
  },
};
