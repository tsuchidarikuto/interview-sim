import { ResumeTypes,CompanyTypes, SelectedCompanyTypes, SelectedResumeTypes } from "@/types";
import { SupabaseDatabase } from "@/utils/supabase/database";
import { createClient } from "@/utils/supabase/server";
import { sampleCompanyData,sampleResumeData } from "./SampleData";

export default async function AddSampleData() {
    const supabase = await createClient();
    const resumeTable = new SupabaseDatabase<ResumeTypes>("resumes", supabase);
    const companyTable = new SupabaseDatabase<CompanyTypes>("companies", supabase);
    const selectedResumeTable = new SupabaseDatabase<SelectedResumeTypes>("selectedResumes", supabase);
    const selectedCompanyTable = new SupabaseDatabase<SelectedCompanyTypes>("selectedCompanies", supabase);
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user?.id) {        
            console.error('ユーザーが見つかりません');
            return;
        }
        
        console.log('Current user:', user.id); // デバッグ用

        const resumeData = await resumeTable.getArrayDataByUserId(user.id);
        const companyData = await companyTable.getArrayDataByUserId(user.id);
        
        if(resumeData.length === 0) {
            console.log('Adding sample resume data...'); // デバッグ用
            const createdResume = await resumeTable.addData(sampleResumeData, user.id);
            
            if (createdResume?.id) {
                console.log('Created resume:', createdResume);
                await selectedResumeTable.addData({                    
                    resumeId: createdResume.id,                    
                } as SelectedResumeTypes, user.id);
            }
        }

        if(companyData.length === 0) {
            console.log('Adding sample company data...'); // デバッグ用
            const createdCompany = await companyTable.addData(sampleCompanyData, user.id);
            if (createdCompany?.id) {
                await selectedCompanyTable.addData({
                    companyId: createdCompany.id
                } as SelectedCompanyTypes, user.id);
            }
        }

    } catch (error) {
        console.error('AddSampleData error:', error);
        throw error;
    }
}
