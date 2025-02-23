export type ResumeTypes={ 
    id?:string;
    uid: string;
    name: string;
    education: string;
    programming: string;
    qualification: string;
    birthday: string;
    age: string;
    sex: number;
    selfProduction: string;
    research: string;
    studentAchievements: string;
    reasonForApply: string;
}

export type CompanyTypes={    
    uid:string;
    name:string;
    position:string;
    skillset?:string;
    mission:string;
    product:string;
    culture:string;
    others?:string;
}

export type SettingTypes={
    id:string;
    uid:string;
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


export type interviewResultTypes={
    id?:string;
    uid?:string;    
    isPass?:boolean;
    isRead:boolean;
    feedback :{
        positive:string;
        negative:string;
    }
    score: {
        technical:number;
        communication:number;
        teamwork:number;
        logicalThinking:number;
        learningDesire:number;
        companyUnderstanding:number;
    }
    
}

export type HistoryTypes ={
    id?:string;
    time:string;
    isRankedIn:boolean;
    totalScore:number;
    isRead:boolean;
    company:CompanyTypes;
    conversation:ConversationTypes[];
    result:interviewResultTypes;
    resume:ResumeTypes;
    setting:SettingTypes;
    interestShift:number[];


}

export type RankingTypes ={
    uid:string;
    name:string;
    difficulty:string;
    totalScore:number;
}

export type SelectedResumeTypes = {
    uid:string;
    id:string;
    selectedResumeId:string;
}

export type SelectedCompanyTypes = {
    uid:string;
    id:string;
    selectedCompanyId:string;
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
    userId:string;
    name:string;
  }