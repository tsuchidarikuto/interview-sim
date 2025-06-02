// Domain-specific types have been moved to their respective domain directories.
// This file can be used for truly global, non-domain-specific types if any,
// or types related to external libraries that are not part of the infrastructure layer yet.

// Example: UI-specific view models or application-level DTOs if not placed elsewhere.
// export type SelectedItemType = { id: string; category: string };

// The original `Database` type for Supabase should ideally be co-located with Supabase client in infrastructure.
export type Database = {
    public: {
      Tables: {
        [key: string]: {
          Row: unknown
          Insert: unknown
          Update: unknown
        }
      }
    }
  };

// These types seem more like UI state or Application DTOs than core domain objects.
// They will be re-evaluated when refactoring the application layer and UI components.
export type SelectedResumeTypes = {
    uid:string; // Should be userId
    id:string; // What is this ID?
    resumeId:string;
}

export type SelectedCompanyTypes = {
    uid:string; // Should be userId
    id:string; // What is this ID?
    companyId:string;
}

// This is a very generic DTO, might be used by application layer.
export type HistoryDataTypes ={
    id:string;
    isRead:boolean;
    isRankIn:boolean;
    time:string; // Should be Date
    // These would be replaced by snapshots or specific DTOs from domain objects
    // result:interviewResultTypes;
    // company:CompanyTypes;
    // resume:ResumeTypes;
    // setting:SettingTypes;
    interestShift:number[];    
    totalScore:number;
  }
