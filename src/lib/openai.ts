import OpenAI from 'openai';

// 檢查 OpenAI API Key
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    console.warn('⚠️ OPENAI_API_KEY 未設定，AI 功能將無法使用');
}

// 初始化 OpenAI 客戶端
export const openai = new OpenAI({
    apiKey: openaiApiKey || 'placeholder-key',
});

// 檢查 OpenAI 設定是否正確
export const checkOpenAIConfig = () => {
    if (!openaiApiKey || openaiApiKey === 'placeholder-key') {
        throw new Error('請設定 OPENAI_API_KEY 環境變數');
    }
};

// 問題分類類型
export type QuestionCategory = 'science' | 'life' | 'emotion' | 'nature' | 'other';

// 問題澄清結果介面
export interface QuestionClarificationResult {
    originalQuestion: string;
    clarifiedQuestion: string;
    category: QuestionCategory;
    appropriateForAge: boolean;
    qualityScore: number; // 1-10 分
    suggestions: string[];
    needsClarification: boolean;
    clarificationPrompts?: string[];
}

// 問題澄清主函數
export async function clarifyQuestion(
    question: string,
    childAge?: number
): Promise<QuestionClarificationResult> {
    checkOpenAIConfig();

    const ageContext = childAge ? `這個問題來自一位 ${childAge} 歲的孩子。` : '';

    const prompt = `
你是一位專業的兒童教育專家和故事創作助手，專門幫助 3-8 歲的孩子。
${ageContext}

請分析以下問題，並提供詳細的分析結果：

問題：「${question}」

請以 JSON 格式回應，包含以下欄位：

1. "clarifiedQuestion": 將問題改寫得更清楚、更適合孩子理解的版本
2. "category": 問題分類 ("science", "life", "emotion", "nature", "other")
3. "appropriateForAge": 是否適合 3-8 歲孩子 (boolean)
4. "qualityScore": 問題品質評分 1-10 分 (數字)
5. "suggestions": 改進建議陣列 (如果需要的話)
6. "needsClarification": 是否需要進一步澄清 (boolean)
7. "clarificationPrompts": 如果需要澄清，提供引導問題陣列

評分標準：
- 10分：問題清楚、有趣、適齡，能激發好奇心
- 7-9分：問題不錯但可以改進
- 4-6分：問題模糊或需要澄清
- 1-3分：問題不適合或有問題

注意事項：
- 確保內容適合兒童
- 避免恐怖、暴力或不當內容
- 問題應該能夠轉化為有趣的故事
- 使用孩子容易理解的語言
`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: '你是專業的兒童教育專家，專門協助 3-8 歲孩子的學習和成長。請用繁體中文回應。',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
            throw new Error('OpenAI 回應為空');
        }

        // 解析 JSON 回應
        const result = JSON.parse(responseContent);

        return {
            originalQuestion: question,
            clarifiedQuestion: result.clarifiedQuestion || question,
            category: result.category || 'other',
            appropriateForAge: result.appropriateForAge ?? true,
            qualityScore: result.qualityScore || 5,
            suggestions: result.suggestions || [],
            needsClarification: result.needsClarification ?? false,
            clarificationPrompts: result.clarificationPrompts || [],
        };
    } catch (error) {
        console.error('問題澄清 API 錯誤:', error);

        // 降級處理：提供基本的分析結果
        return {
            originalQuestion: question,
            clarifiedQuestion: question,
            category: 'other',
            appropriateForAge: true,
            qualityScore: 5,
            suggestions: ['由於 AI 服務暫時無法使用，建議稍後再試'],
            needsClarification: false,
            clarificationPrompts: [],
        };
    }
}

// 批次處理多個問題
export async function clarifyMultipleQuestions(
    questions: string[],
    childAge?: number
): Promise<QuestionClarificationResult[]> {
    const results = await Promise.allSettled(
        questions.map((q) => clarifyQuestion(q, childAge))
    );

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            console.error(`問題 ${index + 1} 澄清失敗:`, result.reason);
            return {
                originalQuestion: questions[index],
                clarifiedQuestion: questions[index],
                category: 'other' as QuestionCategory,
                appropriateForAge: true,
                qualityScore: 5,
                suggestions: ['處理此問題時發生錯誤'],
                needsClarification: false,
                clarificationPrompts: [],
            };
        }
    });
}

// 檢查問題是否需要澄清的快速函數
export async function quickQuestionCheck(question: string): Promise<boolean> {
    checkOpenAIConfig();

    const prompt = `
分析以下問題是否需要澄清才能為 3-8 歲孩子創作故事：

問題：「${question}」

回應 "YES" 如果問題模糊、不完整或需要更多資訊。
回應 "NO" 如果問題已經足夠清楚。

只回應 YES 或 NO。
`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.1,
            max_tokens: 10,
        });

        const response = completion.choices[0]?.message?.content?.trim();
        return response === 'YES';
    } catch (error) {
        console.error('快速問題檢查錯誤:', error);
        return false; // 預設不需要澄清
    }
} 