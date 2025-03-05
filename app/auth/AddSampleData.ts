import { ResumeTypes,CompanyTypes, SelectedCompanyTypes, SelectedResumeTypes, SettingTypes } from "@/types";
import { SupabaseDatabase } from "@/utils/supabase/database";
import { createClient } from "@/utils/supabase/server";
import { sampleCompanyData,sampleResumeData, sampleSettingData } from "./SampleData";

export default async function AddSampleData() {
    const supabase = await createClient();
    const resumeTable = new SupabaseDatabase<ResumeTypes>("resumes", supabase);
    const companyTable = new SupabaseDatabase<CompanyTypes>("companies", supabase);
    const selectedResumeTable = new SupabaseDatabase<SelectedResumeTypes>("selectedResumes", supabase);
    const selectedCompanyTable = new SupabaseDatabase<SelectedCompanyTypes>("selectedCompanies", supabase);
    const settingTable = new SupabaseDatabase<SettingTypes>("settings",supabase);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user?.id) {        
            console.error('ユーザーが見つかりません');
            return;
        }
        
    

        const resumeData = await resumeTable.getArrayDataByUserId(user.id);
        const companyData = await companyTable.getArrayDataByUserId(user.id);
        const settingData = await settingTable.getArrayDataByUserId(user.id);

        if(resumeData.length === 0) {
            
            const createdResume = await resumeTable.addData(sampleResumeData, user.id);
            
            if (createdResume?.id) {
                console.log('Created resume:', createdResume);
                await selectedResumeTable.addData({                    
                    resumeId: createdResume.id,                    
                } as SelectedResumeTypes, user.id);
            }
        }

        if(companyData.length === 0) {
            
            const createdCompany = await companyTable.addData(sampleCompanyData, user.id);
            if (createdCompany?.id) {
                await selectedCompanyTable.addData({
                    companyId: createdCompany.id
                } as SelectedCompanyTypes, user.id);
            }
        }

        if(settingData.length === 0){
            await settingTable.addData(sampleSettingData,user.id);
        }

    } catch (error) {
        console.error('AddSampleData error:', error);
        throw error;
    }
}
