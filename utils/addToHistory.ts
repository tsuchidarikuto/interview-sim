import { interviewResultTypes, CompanyTypes, ResumeTypes, SettingTypes, ConversationTypes, HistoryTypes, conversationTableTypes } from '@/types';
import { createClient } from "./supabase/client";
import { SupabaseDatabase } from "./supabase/database";

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
        const supabase = createClient();
        const historyTable = new SupabaseDatabase<HistoryTypes>("histories",supabase );
        const interviewResultTable = new SupabaseDatabase<interviewResultTypes>("interviewResults",supabase );
        const conversationTable = new SupabaseDatabase<conversationTableTypes>("conversations",supabase );

        const interviewResultFromDatabase = await interviewResultTable.addData(result,uid);

        const conversationDataToSaveDatabase: conversationTableTypes = {
            message: conversation.map(c => c.message),
            role: conversation.map(c => c.role),
            interest: conversation.filter(c => c.interest !== undefined).map(c => c.interest!)
        };
        
        const conversationFromDatabase = await conversationTable.addData(conversationDataToSaveDatabase, uid);

        
        

        const historyData:HistoryTypes = {            
            isRankIn: false,
            totalScore: totalScore,
            isRead: false,
            companyId: company.id ?? '',
            resumeId: resume.id ?? '',
            settingId: setting.id ?? '',
            interestShift: interestShift,
            conversationId: conversationFromDatabase.id ?? '',  
            interviewResultId: interviewResultFromDatabase.id ?? ''
        }

        console.log(historyData);
        await historyTable.addData(historyData,uid);
    } catch (e) {
        console.error('Error adding document:', e);
    }
}