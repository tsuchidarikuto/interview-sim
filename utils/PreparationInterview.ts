'use client'
import CallOpenai from "@/utils/callOpenai";
import { getArrayDataFromFirestore, getDataFromFirestoreWithId } from '@/utils/handleFirebase';
import { ResumeTypes, CompanyTypes, SettingTypes, SelectedResumeTypes, SelectedCompanyTypes } from '@/types';


export async function PreparationInterview(
        setProgress: (progress: number) => void,
        setQuestions:(q:any)=>void,
        setResume:(r:any)=>void,
        setCopmany:(c:any)=>void,
        setSetting:(s:any)=>void,
        uid:string
    ){
    
    try{
        
    const selectedResumeId:SelectedResumeTypes[] = await getArrayDataFromFirestore<SelectedResumeTypes>('selectedResume',uid);
    const selectedCompanyId:SelectedCompanyTypes[] = await getArrayDataFromFirestore<SelectedCompanyTypes>('selectedCompany',uid);
    
    setProgress(20);
    
    const resumeDataFromFirestore = await getDataFromFirestoreWithId<ResumeTypes>('resumes',selectedResumeId[0].id)            
    const companyDataFromFirestore = await getDataFromFirestoreWithId<CompanyTypes>('resumes',selectedCompanyId[0].id)    
    const settingDataFromFirestore = await getArrayDataFromFirestore<SettingTypes>('setting',uid);

    setResume(resumeDataFromFirestore)
    setCopmany(companyDataFromFirestore)
    setSetting(settingDataFromFirestore[0])
    
    setProgress(40);


    if (!resumeDataFromFirestore || !companyDataFromFirestore || !settingDataFromFirestore ) {
        return [];
    }


    const settingDetail: { difficulty: string, type: string } = {
        difficulty: "",
        type: ""
    }

    switch (settingDataFromFirestore[0].difficulty) {
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

    switch (settingDataFromFirestore[0].interviewType) {
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
    // Replace the fixed numberOfQuestions with a log-based calculation
    const minDuration = 5;
    const maxDuration = 60;
    const minQuestions = 3;
    const maxQuestions = 20;

    const duration = settingDataFromFirestore[0].duration;
    const ratio = (Math.log(duration) - Math.log(minDuration)) / (Math.log(maxDuration) - Math.log(minDuration));
    const rawQuestions = minQuestions + ratio * (maxQuestions - minQuestions);
    let numberOfQuestions = Math.round(rawQuestions);
    numberOfQuestions = Math.min(Math.max(numberOfQuestions, minQuestions), maxQuestions);


    const systemPrompt = `
        以下の設定を参考にし、面接の質問リストをJSON形式で出力してください。実際の面接をシミュレーションするため、応募者の情報と会社情報を参考にしてください。
        面接内容は面接の難易度と面接のタイプに合わせて適切な質問をしてください。
        質問の量は面接時間に合わせてください。
        ただし質問の数は${numberOfQuestions}個にしてください。
        質問の順番は一般的な面接の流れに沿ってください。
        **設定:**

        *   面接の難易度: ${settingDetail.difficulty}
        *   面接時間: ${settingDataFromFirestore[0].duration}分
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
    console.log(systemPrompt);

    const prompt = `
        #応募者の情報
        ##研究成果
            ${resumeDataFromFirestore.research}
        ##プログラミングの経験・使用言語
            ${resumeDataFromFirestore.programming}
        ##自己PR
            ${resumeDataFromFirestore.selfPR}
        ##学生時代に頑張ったこと
            ${resumeDataFromFirestore.bestAtStu}
        ##志望動機
            ${resumeDataFromFirestore.reason}
        ##資格
            ${resumeDataFromFirestore.qualification}   
    
        #会社情報
        ##会社名
            ${companyDataFromFirestore.name}
        ##採用ポジション
            ${companyDataFromFirestore.position}
        ##必須スキルセット
            ${companyDataFromFirestore.skillset}
        ##主力製品・サービス
            ${companyDataFromFirestore.product}
        ##社風
            ${companyDataFromFirestore.culture}
        ##会社のミッション・ビジョン
            ${companyDataFromFirestore.mission}
        ##その他特記事項
            ${companyDataFromFirestore.others}
    `;

    setProgress(80);

    const questionList = await CallOpenai('gpt-4o-mini-2024-07-18', systemPrompt, prompt,"questions");
    setProgress(90);
    console.log(questionList)
    const parsedQuestionList = JSON.parse(questionList)
    console.log(parsedQuestionList)
    setQuestions(parsedQuestionList.questions)
    

    
    return;
}catch(e){
    console.error('Error during preparation:', e);
    return ;
}
}