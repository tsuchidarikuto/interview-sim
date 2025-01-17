import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { interviewResultTypes, CompanyTypes, ResumeTypes, SettingTypes, ConversationTypes } from '@/types';
import { formatDate } from "@/utils/formatDate";

export async function addToHistory(
    result: interviewResultTypes,
    company: CompanyTypes,
    resume: ResumeTypes,
    setting: SettingTypes,
    conversation: ConversationTypes[],
    uid: string
) {
    try {
        await addDoc(collection(firestore, 'history'), {
            uid: uid,
            isRead: false,
            time: formatDate(),
            result,
            company,
            resume,
            setting,
            conversation
        });
    } catch (e) {
        console.error('Error adding document:', e);
    }
}