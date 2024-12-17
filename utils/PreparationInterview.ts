'use client'
import CallOpenai from "@/utils/callOpenai";
import { getInfo } from '@/utils/getInfo';
import { ResumeTypes, CompanyTypes, SettingTypes } from '@/types';



export async function PreparationInterview(setProgress: (progress: number) => void) {
    try{
    const resumeInfo = await getInfo<ResumeTypes>('resumes');
    setProgress(20);
    const companyInfo = await getInfo<CompanyTypes>('company');
    setProgress(30);
    const settingInfo = await getInfo<SettingTypes>('setting');
    setProgress(40);
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
        以下の設定を参考にし、面接の質問リストをJSON形式で出力してください。実際の面接をシミュレーションするため、応募者の情報と会社情報を参考にしてください。
        面接内容は面接の難易度と面接のタイプに合わせて適切な質問をしてください。
        質問の量は面接時間に合わせてください。

        質問の順番は一般的な面接の流れに沿ってください。
        **設定:**

        *   面接の難易度: ${settingDetail.difficulty}
        *   面接時間: ${settingInfo[0].duration}分
        *   面接のタイプ: ${settingDetail.type}
        *   評価基準: ['技術力','コミュニケーション力','チームワーク','論理的思考力','学習意欲','企業理解・志望動機']

        以下のJSON形式で回答を提供してください
            {
                questions:[{
                    id: <質問id>,
                    question: "<質問内容>"
                },]
            }


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

    setProgress(60);

    const data = await CallOpenai('gpt-4o-mini-2024-07-18', systemPrompt, prompt,"questions");
    setProgress(90);
    
    
    console.log(data);
    

    
    return data;
}catch(e){
    console.error('Error during preparation:', e);
    return [];
}
}