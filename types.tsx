export type ResumeTypes={
    id:string;
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
    difficulty:string;
    duration:number;
    interviewType:string;
}
export type openaiTypes={
    model:string;
    system:string;
    prompt:string;
    
}