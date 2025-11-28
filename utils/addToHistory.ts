import { interviewResultTypes, CompanyTypes, ResumeTypes, SettingTypes, ConversationTypes } from '@/types';

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
        const response = await fetch('/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                totalScore,
                result,
                company,
                resume,
                setting,
                conversation,
                interestShift
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add history');
        }

        const responseData = await response.json();
        
        if (!responseData.success) {
            throw new Error('API returned error');
        }

        console.log('History added successfully:', responseData.data);
        return responseData.data;
    } catch (e) {
        console.error('Error adding document:', e);
        throw e;
    }
}