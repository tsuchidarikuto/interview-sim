import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { SupabaseDatabase } from '@/utils/supabase/database';
import { HistoryTableTypes, interviewResultTypes, conversationTableTypes, MailContentsTypes } from '@/types';
import { formatDate } from '@/utils/formatDate';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            totalScore,
            result,
            company,
            resume,
            setting,
            conversation,
            interestShift
        } = body;

        // Validate request data
        if (!result || !company || !resume || !setting || !conversation) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create database instances
        const historyTable = new SupabaseDatabase<HistoryTableTypes>("histories", supabase);
        const interviewResultTable = new SupabaseDatabase<interviewResultTypes>("interviewResults", supabase);
        const conversationTable = new SupabaseDatabase<conversationTableTypes>("conversations", supabase);

        // Add interview result
        const interviewResultFromDatabase = await interviewResultTable.addData(result, user.id);

        // Prepare conversation data
        const conversationDataToSaveDatabase: conversationTableTypes = {
            message: conversation.map((c: any) => c.message),
            role: conversation.map((c: any) => c.role),
            interest: conversation.filter((c: any) => c.interest !== undefined).map((c: any) => c.interest!)
        };
        
        const conversationFromDatabase = await conversationTable.addData(conversationDataToSaveDatabase, user.id);

        // Prepare history data
        const historyData: HistoryTableTypes = {
            isRankIn: false,
            totalScore: totalScore,
            isRead: false,
            companyId: company.id ?? '',
            resumeId: resume.id ?? '',
            settingId: setting.id ?? '',
            interestShift: interestShift,
            conversationId: conversationFromDatabase.id ?? '',
            interviewResultId: interviewResultFromDatabase.id ?? ''
        };

        const result_data = await historyTable.addData(historyData, user.id);

        return NextResponse.json({ success: true, data: result_data });
    } catch (error) {
        console.error('Error in history API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get mailbox data
        const { data, error } = await supabase
            .from('histories')
            .select(`
                id,
                is_read,
                created_at,            
                companies(name),
                interview_results(is_pass)        
            `)
            .eq('uid', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        const mailContents: MailContentsTypes[] = data.map((d: any) => ({
            id: d.id,
            isRead: d.is_read,
            companyName: d.companies.name,
            isPass: d.interview_results.is_pass,
            time: formatDate(d.created_at)
        }));

        return NextResponse.json({ success: true, data: mailContents });
    } catch (error) {
        console.error('Error in history GET API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}