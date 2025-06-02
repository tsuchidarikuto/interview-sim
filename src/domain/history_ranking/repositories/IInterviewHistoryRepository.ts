import type { InterviewHistory } from "@/domain/history_ranking/entities";
export interface IInterviewHistoryRepository {
    save(history: InterviewHistory): Promise<InterviewHistory>; // Returns saved history with ID
}
