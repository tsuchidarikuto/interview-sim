// Represents a single entry (utterance) in a conversation
export type ConversationEntry = {
    role: "user" | "system" | "assistant"; // More specific than string
    message: string;
    timestamp: Date; // Added for better context
    interestScore?: number; // Renamed from "interest"
};

// Represents feedback text
export type Feedback = {
    text: string;
    // Potentially add category or severity
};

// Represents a set of scores for an interview
export type ScoreSet = {
    technical: number;
    communication: number;
    teamwork: number;
    logicalThinking: number;
    learningDesire: number;
    companyUnderstanding: number;
    overall?: number; // Optional overall score, could be calculated
};
