import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { interviewResultTypes, CompanyTypes, ResumeTypes, SettingTypes, ConversationTypes } from '@/types';
import { formatDate } from "@/utils/formatDate";

export async function addToHistory(
    totalScore:number,
    result: interviewResultTypes,
    company: CompanyTypes,
    resume: ResumeTypes,
    setting: SettingTypes,
    conversation: ConversationTypes[],
    interestShift:number[],
    uid: string
) {
    try {
        await addDoc(collection(firestore, 'history'), {
            uid: uid,
            totalScore:totalScore,
            isRead: false,
            time: formatDate(),
            result,
            company,
            resume,
            setting,
            conversation,
            interestShift
        });
    } catch (e) {
        console.error('Error adding document:', e);
    }
}