import {atom} from 'jotai';
import {questionTypes,interviewResultTypes} from '@/types';

export const questionsAtom = atom<questionTypes[]>([]);

export const interviewResultAtom = atom<interviewResultTypes>({
    uid:'',
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
})