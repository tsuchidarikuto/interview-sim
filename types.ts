export type ResumeTypes={ 
    id?:string;
    uid?: string;
    name: string;
    education: string;
    programming: string;
    qualification: string;
    birthday: string;
    age: string;
    sex: number;
    selfPromotion: string;
    research: string;
    studentAchievements: string;
    reasonForApply: string;
}

export type CompanyTypes={    
    id?:string;
    uid?:string;
    name:string;
    position:string;
    skillset:string;
    mission:string;
    product:string;
    culture:string;
    others:string;
}

export type SettingTypes={
    id?:string;
    uid?:string;
    difficulty:string;
    duration:number;
    interviewType:string;
    interviewMode: 'voice' | 'chat';
}

export type questionTypes={
    id:string;
    uid:string;
    question:string;
}

export type openaiTypes={
    model:string;
    system:string;
    prompt:string;
    schemaName:string;
}

export type ConversationTypes={
    role:string;
    message:string;
    interest?:number;
}

export type conversationTableTypes ={
    id?:string;
    uid?:string;
    role:string[];
    message:string[];
    interest:number[];
}

export type interviewResultTypes = {
    id?: string;
    uid?: string;
    isPass?: boolean;
    isRead: boolean;
    positiveFeedback: string;
    negativeFeedback: string;
    technicalScore: number;
    communicationScore: number;
    teamworkScore: number;
    logicalThinkingScore: number;
    learningDesireScore: number;
    companyUnderstandingScore: number;
};

export type HistoryTableTypes ={
    id?:string;
    uid?:string;    
    isRankIn:boolean;
    totalScore:number;
    isRead:boolean;
    companyId:string;
    conversationId:string;
    interviewResultId:string;
    resumeId:string;
    settingId:string;
    interestShift:number[];


}

export type RankingTypes ={
    uid?:string;
    userName:string;
    difficulty:string;
    totalScore:number;
}

export type SelectedResumeTypes = {
    uid:string;
    id:string;
    resumeId:string;
}

export type SelectedCompanyTypes = {
    uid:string;
    id:string;
    companyId:string;
}

export type FeedbackTypes ={
    uid:string;
    id:string;
    message:string;
}

export type Database = {
    public: {
      Tables: {
        [key: string]: {
          Row: unknown
          Insert: unknown
          Update: unknown
        }
      }
    }
  }

  export type UserTypes = {
    uid:string;
    name:string;
  }

  export type MailContentsTypes ={
    id:string;
    isRead:boolean;
    companyName:string;
    isPass:boolean;
    time:string;
  }

  export type HistoryDataTypes ={
    id:string;
    isRead:boolean;
    isRankIn:boolean;
    time:string;
    result:interviewResultTypes;
    company:CompanyTypes;
    resume:ResumeTypes;
    setting:SettingTypes;
    interestShift:number[];    
    totalScore:number;
  }