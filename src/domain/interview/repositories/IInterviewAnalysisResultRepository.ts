import type { InterviewAnalysisResult } from "@/domain/interview/entities";
export interface IInterviewAnalysisResultRepository {
    save(result: InterviewAnalysisResult, userId: string): Promise<InterviewAnalysisResult>;
}
