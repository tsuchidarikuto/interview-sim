'use client';
import { getInfo } from '@/utils/handleFirebase';
import CallOpenai from "@/utils/callOpenai";
import { ResumeTypes, SettingTypes,interviewResultTypes } from '@/types';


export default async function analyzeInterviewResult(conversationLog: string, setProgress: (progress: number) => void,uid:string) {

    try{        
        const resumeInfo = await getInfo<ResumeTypes>('resumes',uid);
        setProgress(20);
        const settingInfo = await getInfo<SettingTypes>('setting',uid);
        setProgress(40);
        const settingDetail: { difficulty: string, type: string } = {
            difficulty: "",
            type: ""
        }
    
        switch (settingInfo[0].difficulty) {
            case "簡単":
                settingDetail.difficulty = "簡単です。面接初心者なので激甘採点にしてください。ほとんど合格させてしまって構いません。";
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
        }
    
        switch (settingInfo[0].interviewType) {
            case "技術面接":
                settingDetail.type = "技術面接です。プログラミングの経験や研究成果について判断してください";
                break;
            case "行動面接":
                settingDetail.type = "行動面接です。学生時代に頑張ったことや自己PRについて判断してください";
                break;
            case "複合面接":
                settingDetail.type = "複合面接です。技術と行動両方を、総合的に判断してください";
                break;
        }

        const systemPrompt = `
        入力される候補者の情報を参考にして、面接結果を分析してください。
        候補者への忖度はせず、良いとこは良い、悪いところは悪いと判断し客観的な評価を行ってください。
        また面接の難易度は${settingDetail.difficulty}
        面接のタイプは${settingDetail.type}
        また、出力は以下のJSON形式で出力してください
        {
            feedback : {
                positive: <良い点>,
                negative: <悪い点>
            }
            score: {
            technical: <技術力:10点満点で評価>,
            communication: <コミュニケーション力:10点満点で評価>,
            teamwork: <チームワーク:10点満点で評価>,
            logicalThinking: <論理的思考力:10点満点で評価>,
            learningDesire: <学習意欲:10点満点で評価>,
            companyUnderstanding: <企業理解・志望動機:10点満点で評価>
            }
        }
        `

        const prompt = `
        #会話履歴
        ${conversationLog}
        #履歴書情報
        ${JSON.stringify(resumeInfo)}
        `;
        setProgress(50);
        const analysisResult:interviewResultTypes =  JSON.parse(await CallOpenai('gpt-4o-mini-2024-07-18', systemPrompt, prompt, 'interviewResult'));
        setProgress(70);
        
        const totalScore = analysisResult.score.technical +
                   analysisResult.score.communication +
                   analysisResult.score.teamwork +
                   analysisResult.score.logicalThinking +
                   analysisResult.score.learningDesire +
                   analysisResult.score.companyUnderstanding;
        analysisResult.isPass = totalScore >= 40;
        return analysisResult;
    }catch(e){
        console.error(e);
    }
}