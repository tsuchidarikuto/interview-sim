'use client'
import CallOpenai from "@/features/callOpenai";
import { getInfo } from '@/features/getInfo';
import { ResumeTypes, CompanyTypes, SettingTypes } from '@/types';

export async function PreparationInterview() {
    const resumeInfo = await getInfo<ResumeTypes>('resumes');
    const companyInfo = await getInfo<CompanyTypes>('company');
    const settingInfo = await getInfo<SettingTypes>('setting');

    const settingDetail: { difficulty: string, type: string } = {
        difficulty: "",
        type: ""
    }

    switch (settingInfo[0].difficulty) {
        case "簡単":
            settingDetail.difficulty = "簡単です。大きく深堀はしないように、ある程度気になる部分だけ聞いてください";
            break;
        case "普通":
            settingDetail.difficulty = "普通です。ある程度気になる部分を聞きましょう";
            break;
        case "難しい":
            settingDetail.difficulty = "難しいです。気になる部分はすべて聞き、ある程度深堀しなさい";
            break;
        case "激ムズ":
            settingDetail.difficulty = "激ムズです。すべての質問に対して深堀し、あらゆる角度から質問をしてください";
            break;
    }

    switch (settingInfo[0].interviewType) {
        case "技術面接":
            settingDetail.type = "技術面接です。プログラミングの経験や研究成果について聞いてください";
            break;
        case "行動面接":
            settingDetail.type = "行動面接です。学生時代に頑張ったことや自己PRについて聞いてください";
            break;
        case "複合面接":
            settingDetail.type = "複合面接です。技術面接と行動面接の両方を行い、総合的に判断してください";
            break;
    }

    const systemPrompt = `
    # プロンプト

以下の情報を基に、模擬面接の準備に必要なコンテキスト情報をまとめてください。
これは面接官としてふるまうLLMに渡す情報として使います。

**設定:**

*   面接の難易度: ${settingDetail.difficulty}
*   面接時間: ${settingInfo[0].duration}分
*   面接のタイプ: ${settingDetail.type}
*   評価基準: ['技術力','コミュニケーション力','チームワーク','論理的思考力','学習意欲','企業理解・志望動機']

**出力形式:**

---
1. **模擬面接の概要**
    - 面接の目的と進め方の説明。
    - 面接の流れや時間配分の詳細。
    - 面接の評価基準とフィードバックの方法。

2. **面接官への指示**
    - 質問例や進行上の注意点。
    - 面接官の役割と期待される行動。
    - 面接中に注意すべきポイントやトラブルシューティングの方法。
---

`;

    const prompt = `
    #応募者の情報
    ##研究成果
    ${resumeInfo[0].research}
    ##プログラミングの経験・使用言語
    ${resumeInfo[0].programming}
    ##自己PR
    ${resumeInfo[0].selfPR}
    ##学生時代に頑張ったこと
    ${resumeInfo[0].bestAtStu}
    ##志望動機
    ${resumeInfo[0].reason}
    ##資格
    ${resumeInfo[0].qualification}   
    
    #会社情報
    ##会社名
    ${companyInfo[0].name}
    ##採用ポジション
    ${companyInfo[0].position}
    ##必須スキルセット
    ${companyInfo[0].skillset}
    ##主力製品・サービス
    ${companyInfo[0].product}
    ##社風
    ${companyInfo[0].culture}
    ##会社のミッション・ビジョン
    ${companyInfo[0].mission}
    ##その他特記事項
    ${companyInfo[0].others}
    `;

    const interviewSheet = await CallOpenai('gpt-4o-mini-2024-07-18', systemPrompt, prompt);

    console.log(interviewSheet);
}