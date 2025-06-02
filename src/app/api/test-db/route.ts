import { NextRequest, NextResponse } from 'next/server';
import { supabase, checkSupabaseConfig } from '@/lib/supabase';

export async function GET() {
  try {
    // 檢查環境變數設定
    checkSupabaseConfig();

    // 測試資料庫連接
    const { error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return NextResponse.json(
        {
          success: false,
          message: '資料庫連接失敗',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // 測試認證系統
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError) {
      console.error('Auth test failed:', authError);
      return NextResponse.json(
        {
          success: false,
          message: '認證系統測試失敗',
          error: authError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase 連接成功！',
      database: {
        connected: true,
        timestamp: new Date().toISOString(),
      },
      auth: {
        session: session ? 'Active' : 'No active session',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '測試失敗',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    checkSupabaseConfig();

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'test-anonymous-auth':
        // 測試匿名登入
        const { data: authData, error: authError } =
          await supabase.auth.signInAnonymously();

        if (authError) {
          return NextResponse.json(
            {
              success: false,
              message: '匿名登入失敗',
              error: authError.message,
            },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: '匿名登入成功',
          user: {
            id: authData.user?.id,
            isAnonymous: authData.user?.is_anonymous,
          },
        });

      case 'test-create-user':
        // 測試建立用戶資料
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            role: 'child',
          })
          .select()
          .single();

        if (userError) {
          return NextResponse.json(
            {
              success: false,
              message: '建立用戶失敗',
              error: userError.message,
            },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: '建立用戶成功',
          user: userData,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: '未知的測試動作',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Test POST API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '測試失敗',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
