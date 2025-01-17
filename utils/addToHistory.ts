import {addDoc,doc,collection} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { interviewResultTypes ,CompanyTypes,ResumeTypes,SettingTypes,ConversationTypes} from '@/types';

export async function addToHistory(result:interviewResultTypes,company:CompanyTypes[],resume:ResumeTypes[],setting:SettingTypes[],conversation:ConversationTypes[],uid:string){
    try{
        await addDoc(collection(firestore,'history'),{
            uid:uid,            
            isRead:false,
            result,
            company: company[0],
            resume: resume[0],
            setting: setting[0],
            conversation
        });
        
    }catch(e){
        console.error('Error adding document:',e);
    }
}
