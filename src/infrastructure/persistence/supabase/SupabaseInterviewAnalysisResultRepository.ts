import { createClient, SupabaseClient } from "../../../../utils/supabase/client";
import type { InterviewAnalysisResult } from "@/domain/interview/entities";
// Corrected: Feedback and ScoreSet are value objects, not entities directly for this import context.
// However, InterviewAnalysisResult itself uses them, so this import is fine if they are exported from entities.ts.
// For clarity, it's better to import them from their original definition if they are separate.
// Given the previous step defined them in 'src/domain/interview/value-objects.ts',
// and 'src/domain/interview/entities.ts' uses them, this is okay.
// Let's assume Feedback and ScoreSet are re-exported or accessible via InterviewAnalysisResult type structure.
import type { Feedback, ScoreSet } from "@/domain/interview/value-objects"; // More direct import
import type { IInterviewAnalysisResultRepository } from "@/domain/interview/repositories/IInterviewAnalysisResultRepository";

export class SupabaseInterviewAnalysisResultRepository implements IInterviewAnalysisResultRepository {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient();
    }

    async save(result: InterviewAnalysisResult, userId: string): Promise<InterviewAnalysisResult> {
        // Map domain entity to DB table structure for "interviewResults"
        const resultTableData = {
            // id: result.id, // Handled by DB
            user_id: userId, // Ensure column name matches DB if it exists on this table
            is_pass: result.isPass,
            is_read: result.isRead,
            // Storing complex objects like Feedback and ScoreSet as JSONB is common
            positive_feedback: result.positiveFeedback.text, // Assuming text for now, or JSON stringify Feedback
            negative_feedback: result.negativeFeedback.text, // Assuming text for now, or JSON stringify Feedback
            scores: result.scores, // Assuming Supabase handles JSONB for the ScoreSet object
            // Individual scores if the table is denormalized:
            // technical_score: result.scores.technical,
            // communication_score: result.scores.communication,
            // ... and so on for other scores
        };

        const { data, error } = await this.supabase
            .from("interviewResults") // Table name from original addToHistory.ts
            .insert(resultTableData)
            .select()
            .single();

        if (error) {
            console.error("Error saving interview analysis result:", error);
            throw new Error(`Supabase error saving interview analysis result: ${error.message}`);
        }
        if (!data) {
            throw new Error("Failed to save interview analysis result, no data returned.");
        }

        // Map DB row back to domain entity
        const positiveFeedbackVo: Feedback = { text: data.positive_feedback }; // Renamed to avoid conflict
        const negativeFeedbackVo: Feedback = { text: data.negative_feedback }; // Renamed to avoid conflict
        // Ensure scores are correctly parsed if stored as JSON or individual columns
        const scoresVo: ScoreSet = data.scores || { // Renamed to avoid conflict & fallback if scores column is not directly mapped
            technical: data.technical_score,
            communication: data.communication_score,
            teamwork: data.teamwork_score,
            logicalThinking: data.logical_thinking_score,
            learningDesire: data.learning_desire_score,
            companyUnderstanding: data.company_understanding_score,
        };

        return {
            ...result, // Keep original non-column properties
            id: data.id,
            // userId: data.user_id, // userId is an input param, not typically part of InterviewAnalysisResult entity itself.
                                  // If it is, ensure your domain entity InterviewAnalysisResult reflects this.
                                  // For now, assuming it's not directly on the entity but passed for context.
            isPass: data.is_pass,
            isRead: data.is_read,
            positiveFeedback: positiveFeedbackVo,
            negativeFeedback: negativeFeedbackVo,
            scores: scoresVo,
        };
    }
    // Implement findById, etc. if needed
}
