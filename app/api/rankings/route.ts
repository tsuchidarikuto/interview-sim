import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { SupabaseDatabase } from '@/utils/supabase/database';
import { RankingTypes } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { totalScore, userName, difficulty, historyId } = body;

        // Validate request data
        if (!totalScore || !userName || !difficulty) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create ranking entry
        const rankingTable = new SupabaseDatabase<RankingTypes>("rankings", supabase);
        const rankingData: RankingTypes = {
            totalScore,
            userName,
            difficulty,
        };

        const result = await rankingTable.addData(rankingData, user.id);

        // Update history record if historyId provided
        if (historyId) {
            const { error: updateError } = await supabase
                .from('histories')
                .update({ is_rank_in: true })
                .eq('id', historyId)
                .eq('uid', user.id);

            if (updateError) {
                console.error('Error updating history:', updateError);
            }
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Error in rankings API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}