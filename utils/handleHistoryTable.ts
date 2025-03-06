// services/HistoryService.ts
import { createClient } from "./supabase/client";
import { CompanyTypes, ConversationTypes, HistoryDataTypes, interviewResultTypes, MailContentsTypes, ResumeTypes, SettingTypes } from "@/types";
import { formatDate } from "./formatDate";
import { convertKeysToCamelCase, toSnakeCase } from "@/utils/case-converter";

export class HandleHistoryTable {
  private supabase = createClient();
  
  // 既存のgetMailboxDataに相当
  async getMailboxData(uid: string): Promise<MailContentsTypes[]> {
    const { data, error } = await this.supabase
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
      time: formatDate(d.created_at)
    }));
  }
  
  // 新たに追加する正規化された履歴データ取得メソッド
  async getAllHistoryData(id: string):Promise<HistoryDataTypes >{
    const { data, error } = await this.supabase
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
      .single(); // Get a single row instead of an array

    if (error) throw error;

    
    
    // No need to map, just convert the single item
    const company:CompanyTypes = convertKeysToCamelCase(data.companies) as CompanyTypes;
    const result:interviewResultTypes = convertKeysToCamelCase(data.interview_results) as interviewResultTypes;
    const resume: ResumeTypes = convertKeysToCamelCase(data.resumes) as ResumeTypes;
    const setting:SettingTypes = convertKeysToCamelCase(data.settings) as SettingTypes;
    
    
    return {
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
  }

  async updateStatus(id:string,columnName:string,value:boolean){
    const { data, error } = await this.supabase
      .from('histories')
      .update({ [toSnakeCase(columnName)]: value })
      .eq('id', id);

    if (error) throw error;

    console.log(data);  
  }
}