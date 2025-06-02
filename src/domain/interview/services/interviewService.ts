import type { Company } from "@/domain/company/entities";
import type { Resume } from "@/domain/resume/entities";
import type { InterviewSetting, ConversationLog, InterviewAnalysisResult } from "@/domain/interview/entities";
import type { Feedback, ScoreSet } from "@/domain/interview/value-objects"; // Corrected import for VOs
// import type { IAiModelService } from "@/infrastructure/ai/IAiModelService"; // This will be used later

// Placeholder for the AI service dependency, will be properly injected.
// For now, we might mock its behavior or assume its interface.
interface MockAiService {
    analyzeInterview(prompt: string, systemPrompt: string, schemaName: string): Promise<any>;
}

export class InterviewService {
    private aiService: MockAiService; // Placeholder for actual AI service

    constructor(aiService: MockAiService) { // Dependency will be injected
        this.aiService = aiService;
    }

    public async analyzeInterview(
        conversationLog: ConversationLog,
        companyInfo: Company,
        resumeInfo: Resume,
        settingInfo: InterviewSetting
        // setProgress: (progress: number) => void, // Removed: UI concern, handle in Application layer
    ): Promise<InterviewAnalysisResult> {
        try {
            const settingDetail: { difficulty: string; type: string } = {
                difficulty: "",
                type: ""
            };

            // Determine difficulty description
            switch (settingInfo.difficultyLevel) {
                case "簡単":
                    settingDetail.difficulty = "簡単です。面接初心者なので激甘採点にしてください。基本的に6点以上を付けましょう";
                    break;
                case "普通":
                    settingDetail.difficulty = "普通です。一般的な基準で採点しましょう";
                    break;
                case "難しい":
                    settingDetail.difficulty = "難しいです。厳しめに採点しましょう";
                    break;
                case "激ムズ":
                    settingDetail.difficulty = "激ムズです。非常に厳しく採点しましょう";
                    break;
                default:
                    settingDetail.difficulty = "普通です。一般的な基準で採点しましょう"; // Default case
            }

            // Determine interview type description
            switch (settingInfo.interviewType) {
                case "技術面接":
                    settingDetail.type = "技術面接です。プログラミングの経験や研究成果について判断してください";
                    break;
                case "行動面接":
                    settingDetail.type = "行動面接です。学生時代に頑張ったことや自己PRについて判断してください";
                    break;
                case "複合面接":
                    settingDetail.type = "複合面接です。技術と行動両方を、総合的に判断してください";
                    break;
                default:
                    settingDetail.type = "複合面接です。技術と行動両方を、総合的に判断してください"; // Default case
            }

            const systemPrompt = `
入力される候補者の情報を参考にして、面接結果を分析してください。
中身のない解答や、失礼な態度の解答は遠慮なく0点を付け、フィードバックで厳しく、ネチネチと指導してください
候補者への忖度はせず、良いとこは良い、悪いところは悪いと判断し客観的な評価を行ってください。
また面接の難易度は${settingDetail.difficulty}
面接のタイプは${settingDetail.type}
また、出力は以下のJSON形式で出力してください
{
    "feedback" : { // Ensure JSON keys are double-quoted
        "positive": "<良い点>",
        "negative": "<悪い点>"
    },
    "score": {
        "technical": "<技術力:10点満点で評価>",
        "communication": "<コミュニケーション力:10点満点で評価>",
        "teamwork": "<チームワーク:10点満点で評価>",
        "logicalThinking": "<論理的思考力:10点満点で評価>",
        "learningDesire": "<学習意欲:10点満点で評価>",
        "companyUnderstanding": "<企業理解・志望動機:10点満点で評価>"
    }
}
`;

            // Convert conversation log entries to a string format suitable for the prompt
            const conversationLogString = conversationLog.entries.map(entry => `${entry.role}: ${entry.message}`).join("\n");

            const prompt = `
#会話履歴
${conversationLogString}
#履歴書情報
${JSON.stringify(resumeInfo)}
#あなたの会社の情報
${JSON.stringify(companyInfo)}
`;
            // setProgress(50); // UI concern

            // Placeholder for AI call. The actual call will use this.aiService.
            // const rawResponse = await this.aiService.analyzeInterview(prompt, systemPrompt, "interviewResult");
            // For now, using a mock response structure:
            const mockAiApiResponse = {
                feedback: {
                    positive: "大変素晴らしい受け答えでした。",
                    negative: "特にありませんが、強いて言えばもう少し具体的なエピソードがあるとよかったです。"
                },
                score: {
                    technical: 8,
                    communication: 9,
                    teamwork: 7,
                    logicalThinking: 8,
                    learningDesire: 9,
                    companyUnderstanding: 7,
                }
            };
            // In a real scenario, this would be:
            // const response = JSON.parse(await CallOpenai('gpt-4o-mini-2024-07-18', systemPrompt, prompt, 'interviewResult'));
            // const response = rawResponse; // Assuming rawResponse is already parsed or this.aiService handles parsing

            const response = mockAiApiResponse; // Using mock for now

            // setProgress(70); // UI concern

            const positiveFeedback: Feedback = { text: response.feedback.positive };
            const negativeFeedback: Feedback = { text: response.feedback.negative };
            const scores: ScoreSet = {
                technical: response.score.technical,
                communication: response.score.communication,
                teamwork: response.score.teamwork,
                logicalThinking: response.score.logicalThinking,
                learningDesire: response.score.learningDesire,
                companyUnderstanding: response.score.companyUnderstanding,
            };

            const totalScore = Object.values(scores).reduce((sum, currentScore) => sum + (currentScore || 0), 0);
            const isPass = totalScore >= 40; // Example passing threshold

            const analysisResult: InterviewAnalysisResult = {
                id: "", // ID should be generated by repository or application service upon saving
                isPass: isPass,
                isRead: false, // Default value
                positiveFeedback: positiveFeedback,
                negativeFeedback: negativeFeedback,
                scores: scores,
            };

            return analysisResult;

        } catch (e) {
            console.error("Error in InterviewService.analyzeInterview:", e);
            // Domain services should throw domain-specific exceptions or return a result object indicating failure
            // For now, rethrowing, but this should be handled more gracefully.
            if (e instanceof Error) {
                throw new Error(`Interview analysis failed: ${e.message}`);
            }
            throw new Error("Interview analysis failed due to an unknown error.");
        }
    }
}

// Example usage (for testing purposes, would typically be in an application service)
/*
async function testService() {
    // Mock AI Service for testing
    const mockAiService: MockAiService = {
        analyzeInterview: async (prompt, systemPrompt, schemaName) => {
            console.log("Mock AI Service called with schema:", schemaName);
            return {
                feedback: { positive: "Mock positive", negative: "Mock negative" },
                score: { technical: 1, communication: 1, teamwork: 1, logicalThinking: 1, learningDesire: 1, companyUnderstanding: 1 }
            };
        }
    };

    const interviewService = new InterviewService(mockAiService);

    // Mock data (replace with actual instances of domain objects)
    const mockConversationLog: ConversationLog = { id: "cl1", entries: [{role: "user", message: "Hello", timestamp: new Date(), interestScore: 3}] };
    const mockCompany: Company = { id: "comp1", uid: "u1", name: "TestCo", businessPosition: "", requiredSkillset: "", mission: "", productDetails: "", companyCulture: "", additionalInformation: "" };
    const mockResume: Resume = { id: "res1", uid: "u1", name: "John Doe", education: "", programmingExperience: "", qualifications: "", birthday: "", age: "", gender: 1, selfPromotion: "", researchAchievements: "", studentAchievements: "", reasonForApplication: "" };
    const mockSetting: InterviewSetting = { id: "set1", difficultyLevel: "普通", durationMinutes: 30, interviewType: "複合面接", interviewMode: "chat" };

    try {
        const result = await interviewService.analyzeInterview(mockConversationLog, mockCompany, mockResume, mockSetting);
        console.log("Analysis Result:", result);
    } catch (error) {
        console.error("Test Error:", error);
    }
}
// testService();
*/
