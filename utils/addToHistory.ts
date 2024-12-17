import {addDoc,doc,collection} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { interviewResultTypes } from '@/types';

export async function addToHistory(result:interviewResultTypes){
    try{
        await addDoc(collection(firestore,'history'),{
            isPass:result.isPass,
            positiveFeedback:result.feedback.positive,
            negativeFeedback:result.feedback.negative,
            technicalScore:result.score.technical,
            communicationScore:result.score.communication,
            teamworkScore:result.score.teamwork,
            logicalThinkingScore:result.score.logicalThinking,
            learningDesireScore:result.score.learningDesire,
            companyUnderstandingScore:result.score.companyUnderstanding,            
        });
    }catch(e){
        console.error('Error adding document:',e);
    }
}
