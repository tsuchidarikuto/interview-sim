import type { Company } from "@/domain/company/entities";
import type { Resume } from "@/domain/resume/entities";
import type { InterviewAnalysisResult, InterviewSetting, ConversationLog } from "@/domain/interview/entities";

// Represents a historical record of an interview
export type InterviewHistory = {
    id: string;
    userId: string; // Renamed from uid for clarity
    isRankIn: boolean;
    totalScore: number;
    isRead: boolean;
    companyId: string;
    // conversationId: string; // If ConversationLog is a separate aggregate root
    // interviewResultId: string; // If InterviewAnalysisResult is a separate aggregate root
    resumeId: string;
    settingId: string;
    // Instead of IDs, consider embedding Value Objects or linking to other Aggregate Roots
    interviewResultSnapshot: InterviewAnalysisResult; // Snapshot of the result
    companySnapshot: Company; // Snapshot of company info at the time
    resumeSnapshot: Resume; // Snapshot of resume at the time
    interviewSettingSnapshot: InterviewSetting; // Snapshot of settings
    conversationLogSnapshot: ConversationLog; // Snapshot of conversation
    interestShift: number[]; // Timeline of interest scores
    conductedAt: Date; // Added for context
};

// Represents an entry in a ranking table
export type RankingEntry = {
    id: string; // If ranking entries are entities themselves
    userId: string; // Renamed from uid
    userName: string;
    difficultyLevel: string; // Renamed from "difficulty"
    totalScore: number;
    rankedAt: Date; // Added for context
};

// Represents a notification or mail item
export type Notification = {
    id: string;
    userId: string; // To whom the notification is addressed
    isRead: boolean;
    title: string; // e.g., "Interview Result for [Company Name]"
    message: string; // Detailed message
    type: "interview_result" | "system_update" | "feedback_reminder"; // Example types
    relatedEntityId?: string; // e.g., ID of the InterviewHistory
    createdAt: Date;
};
