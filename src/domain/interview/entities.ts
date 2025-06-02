// Represents an individual question in an interview
export type InterviewQuestion = {
    id: string;
    text: string; // Renamed from "question"
    // uid might not be needed if questions are part of an InterviewSetting or generated
};

// Represents the settings for a specific interview session
export type InterviewSetting = {
    id: string;
    // uid: string; // User ID of who configured this, if applicable
    difficultyLevel: string; // Renamed from "difficulty"
    durationMinutes: number; // Renamed from "duration"
    interviewType: string; // e.g., "technical", "behavioral"
    interviewMode: "voice" | "chat";
    // questions?: InterviewQuestion[]; // Questions might be linked by ID or embedded
};

// Represents the full log of a conversation
export type ConversationLog = {
    id: string;
    // uid: string; // User ID of the interviewee
    entries: ConversationEntry[]; // Using the Value Object
    // interestTimeline: number[]; // Renamed from "interest" which was part of conversationTableTypes, now part of ConversationEntry
};

// Represents the result of an interview analysis
export type InterviewAnalysisResult = {
    id: string;
    // uid: string; // User ID of the interviewee
    isPass: boolean;
    isRead: boolean;
    positiveFeedback: Feedback; // Using Value Object
    negativeFeedback: Feedback; // Using Value Object
    scores: ScoreSet; // Using Value Object
};
