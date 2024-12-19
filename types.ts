export type ResumeTypes={
    id:string;
    uid:string;
    name:string;
    birth:string;
    age:number|string;
    sex:number;
    education:string;
    programming:string;
    qualification:string;
    reason:string;
    selfPR:string;
    research:string;
    bestAtStu:string;
}

export type CompanyTypes={
    id:string;
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

export type conversationTypes={
    role:string;
    message:string;
}


export type interviewResultTypes={
    
    uid:string;
    isPass?:boolean;
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