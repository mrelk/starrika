// Supabase 資料庫類型定義
export interface Database {
  public: {
    Tables: {
      // 用戶資料表
      users: {
        Row: {
          id: string;
          email?: string;
          role: 'child' | 'parent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string;
          role: 'child' | 'parent';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'child' | 'parent';
          created_at?: string;
          updated_at?: string;
        };
      };

      // 孩子檔案資料表
      child_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          interests: string[];
          star_energy: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          interests?: string[];
          star_energy?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          interests?: string[];
          star_energy?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 問題資料表
      questions: {
        Row: {
          id: string;
          text: string;
          category: 'science' | 'life' | 'emotion' | 'nature' | 'other';
          asked_by: string;
          asked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          category: 'science' | 'life' | 'emotion' | 'nature' | 'other';
          asked_by: string;
          asked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          category?: 'science' | 'life' | 'emotion' | 'nature' | 'other';
          asked_by?: string;
          asked_at?: string;
          created_at?: string;
        };
      };

      // 故事資料表
      stories: {
        Row: {
          id: string;
          question_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 故事面板資料表
      story_panels: {
        Row: {
          id: string;
          story_id: string;
          panel_order: number;
          text: string;
          image_prompt: string;
          image_url?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          panel_order: number;
          text: string;
          image_prompt: string;
          image_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          panel_order?: number;
          text?: string;
          image_prompt?: string;
          image_url?: string;
          created_at?: string;
        };
      };

      // 星靈狀態資料表
      rika_states: {
        Row: {
          id: string;
          user_id: string;
          emotion: 'happy' | 'curious' | 'thinking' | 'excited';
          message: string;
          animation?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          emotion: 'happy' | 'curious' | 'thinking' | 'excited';
          message: string;
          animation?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          emotion?: 'happy' | 'curious' | 'thinking' | 'excited';
          message?: string;
          animation?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'child' | 'parent';
      question_category: 'science' | 'life' | 'emotion' | 'nature' | 'other';
      rika_emotion: 'happy' | 'curious' | 'thinking' | 'excited';
    };
  };
}
