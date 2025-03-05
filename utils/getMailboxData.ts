// utils/getMailboxData.ts
import { MailContentsTypes } from "@/types";
import { createClient } from "./supabase/client";



export async function getMailboxData(uid: string):Promise<MailContentsTypes[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('histories')
        .select(`
            id,
            is_read,
            created_at,            
            companies(name),
            interview_results(is_pass)
        `)
        .eq('uid', uid)
        .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(data);
    return data.map((d: any) => ({
        id: d.id,
        isRead: d.is_read,
        companyName: d.companies.name,
        isPass: d.interview_results.is_pass,
        time: d.created_at
    }));

}