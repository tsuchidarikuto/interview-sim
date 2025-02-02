import {atom} from 'jotai';
import {questionTypes,interviewResultTypes, CompanyTypes,ResumeTypes,SettingTypes,RankingTypes} from '@/types';

export const questionsAtom = atom<questionTypes[]>([]);

export const interviewResultAtom = atom<interviewResultTypes>({
    uid:'',
    isRead:false,
    feedback:{
        positive:'',
        negative:''
    },
    score:{
        technical:0,
        communication:0,
        teamwork:0,
        logicalThinking:0,
        learningDesire:0,
        companyUnderstanding:0
    }
});


export const companyAtom = atom<CompanyTypes>();
export const resumeAtom = atom<ResumeTypes>();
export const settingAtom = atom<SettingTypes>();

export const rankingAtom = atom<RankingTypes[]>([]);