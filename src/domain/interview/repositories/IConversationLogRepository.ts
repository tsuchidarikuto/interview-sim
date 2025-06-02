import type { ConversationLog } from "@/domain/interview/entities";
export interface IConversationLogRepository {
    save(log: ConversationLog, userId: string): Promise<ConversationLog>;
}
