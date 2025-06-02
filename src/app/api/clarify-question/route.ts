import { NextRequest, NextResponse } from 'next/server';
import {
    clarifyQuestion,
    clarifyMultipleQuestions,
    quickQuestionCheck,
    checkOpenAIConfig,
    QuestionClarificationResult
} from '@/lib/openai';
import { questionService } from '@/lib/database';
import { getCurrentUser } from '@/lib/supabase';

// GET 方法：獲取使用說明或測試 API 狀態
export async function GET() {
    try {
        checkOpenAIConfig();

        return NextResponse.json({
            success: true,
            message: 'AI 問題澄清 API 已就緒',
            endpoints: {
                'POST /api/clarify-question': {
                    description: '澄清單一問題',
                    body: {
                        question: 'string (必要)',
                        childAge: 'number (可選)',
                        saveToDatabase: 'boolean (可選)',
                    }
                },
                'POST /api/clarify-question?action=batch': {
                    description: '批次澄清多個問題',
                    body: {
                        questions: 'string[] (必要)',
                        childAge: 'number (可選)',
                    }
                },
                'POST /api/clarify-question?action=quick-check': {
                    description: '快速檢查問題是否需要澄清',
                    body: {
                        question: 'string (必要)',
                    }
                }
            },
            examples: {
                single: {
                    question: '為什麼天空是藍色的？',
                    childAge: 5
                },
                batch: {
                    questions: ['為什麼天空是藍色的？', '恐龍為什麼消失了？'],
                    childAge: 6
                },
                quickCheck: {
                    question: '那個東西是怎麼來的？'
                }
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'AI 服務配置錯誤',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// POST 方法：處理問題澄清請求
export async function POST(request: NextRequest) {
    try {
        checkOpenAIConfig();

        const body = await request.json();
        const url = new URL(request.url);
        const action = url.searchParams.get('action');

        // 快速檢查模式
        if (action === 'quick-check') {
            const { question } = body;

            if (!question || typeof question !== 'string') {
                return NextResponse.json({
                    success: false,
                    message: '請提供有效的問題文字',
                }, { status: 400 });
            }

            const needsClarification = await quickQuestionCheck(question);

            return NextResponse.json({
                success: true,
                question,
                needsClarification,
                message: needsClarification
                    ? '這個問題建議進一步澄清'
                    : '這個問題已經足夠清楚'
            });
        }

        // 批次處理模式
        if (action === 'batch') {
            const { questions, childAge } = body;

            if (!Array.isArray(questions) || questions.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: '請提供有效的問題陣列',
                }, { status: 400 });
            }

            const results = await clarifyMultipleQuestions(questions, childAge);

            return NextResponse.json({
                success: true,
                message: `成功分析 ${questions.length} 個問題`,
                results,
                summary: {
                    total: questions.length,
                    needsClarification: results.filter(r => r.needsClarification).length,
                    averageQuality: results.reduce((acc, r) => acc + r.qualityScore, 0) / results.length,
                    categories: results.reduce((acc, r) => {
                        acc[r.category] = (acc[r.category] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>)
                }
            });
        }

        // 單一問題處理模式（預設）
        const { question, childAge, saveToDatabase = false } = body;

        if (!question || typeof question !== 'string') {
            return NextResponse.json({
                success: false,
                message: '請提供有效的問題文字',
            }, { status: 400 });
        }

        // 執行問題澄清
        const result: QuestionClarificationResult = await clarifyQuestion(question, childAge);

        // 可選：將結果保存到資料庫
        if (saveToDatabase) {
            try {
                const user = await getCurrentUser();
                if (user) {
                    const { error: dbError } = await questionService.createQuestion({
                        text: result.clarifiedQuestion,
                        category: result.category,
                        asked_by: user.id,
                    });

                    if (dbError) {
                        console.error('保存問題到資料庫失敗:', dbError);
                    }
                }
            } catch (dbError) {
                console.error('資料庫操作錯誤:', dbError);
                // 不阻斷主要功能，只記錄錯誤
            }
        }

        return NextResponse.json({
            success: true,
            message: '問題分析完成',
            result,
            recommendations: generateRecommendations(result)
        });

    } catch (error) {
        console.error('問題澄清 API 錯誤:', error);

        return NextResponse.json({
            success: false,
            message: '問題分析失敗',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// 生成建議的輔助函數
function generateRecommendations(result: QuestionClarificationResult) {
    const recommendations = [];

    if (result.qualityScore < 5) {
        recommendations.push('建議重新表達問題以獲得更好的故事體驗');
    }

    if (result.needsClarification) {
        recommendations.push('問題需要更多細節，可以參考提供的澄清提示');
    }

    if (!result.appropriateForAge) {
        recommendations.push('建議調整問題內容以更適合目標年齡');
    }

    if (result.qualityScore >= 8) {
        recommendations.push('這是一個很棒的問題！很適合創作故事');
    }

    if (result.category === 'science') {
        recommendations.push('科學類問題很棒！可以激發孩子的探索精神');
    }

    return recommendations;
} 