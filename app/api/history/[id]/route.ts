import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { HistoryDataTypes } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { convertKeysToCamelCase, toSnakeCase } from '@/utils/case-converter';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Get full history data
        const { data, error } = await supabase
            .from('histories')
            .select(`
                *,
                companies(*),
                interview_results(*),
                resumes(*),
                settings(*),
                conversations(*)
            `)
            .eq('id', id)
            .eq('uid', user.id)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return NextResponse.json({ error: 'History not found' }, { status: 404 });
        }

        // Convert to camelCase and format response
        const company = convertKeysToCamelCase(data.companies);
        const result = convertKeysToCamelCase(data.interview_results);
        const resume = convertKeysToCamelCase(data.resumes);
        const setting = convertKeysToCamelCase(data.settings);
        
        const historyData: HistoryDataTypes = {
            id: data.id,
            isRead: data.is_read,
            isRankIn: data.is_rank_in,
            time: formatDate(data.created_at),
            result,
            company,
            resume,
            setting,      
            interestShift: data.interest_shift,
            totalScore: data.total_score
        };

        return NextResponse.json({ success: true, data: historyData });
    } catch (error) {
        console.error('Error in history GET API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { columnName, value } = body;

        // Validate request data
        if (!columnName || value === undefined) {
            return NextResponse.json({ error: 'Missing columnName or value' }, { status: 400 });
        }

        // Convert column name to snake_case for database
        const dbColumnName = toSnakeCase(columnName);

        // Update the record
        const { data, error } = await supabase
            .from('histories')
            .update({ [dbColumnName]: value })
            .eq('id', id)
            .eq('uid', user.id)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'History not found or not authorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: data[0] });
    } catch (error) {
        console.error('Error in history PATCH API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}