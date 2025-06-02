import { createClient, SupabaseClient } from "@/utils/supabase/client";
import type { ConversationLog, ConversationEntry } from "@/domain/interview/entities";
import type { IConversationLogRepository } from "@/domain/interview/repositories/IConversationLogRepository";

export class SupabaseConversationLogRepository implements IConversationLogRepository {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient();
    }

    async save(log: ConversationLog, userId: string): Promise<ConversationLog> {
        // Original `addToHistory` saved `message`, `role`, `interest` as arrays.
        // The `ConversationLog` entity has `entries: ConversationEntry[]`.
        // We should store `entries` as JSONB or in a related table if entries are numerous/complex.
        // For simplicity, storing as JSONB array of entries in the "conversations" table.

        const conversationTableData = {
            // id: log.id, // Handled by DB
            user_id: userId, // If table has user_id
            // Storing the array of ConversationEntry objects directly if column type is JSONB
            entries: log.entries.map(entry => ({ // Ensure structure matches DB expectations if not direct JSONB
                role: entry.role,
                message: entry.message,
                timestamp: entry.timestamp.toISOString(),
                interest_score: entry.interestScore,
            })),
            // Legacy way from addToHistory.ts if you want to keep separate arrays:
            // messages: log.entries.map(e => e.message),
            // roles: log.entries.map(e => e.role),
            // interests: log.entries.filter(e => e.interestScore !== undefined).map(e => e.interestScore),
        };

        const { data, error } = await this.supabase
            .from("conversations") // Table name from original addToHistory.ts
            .insert(conversationTableData)
            .select()
            .single();

        if (error) {
            console.error("Error saving conversation log:", error);
            throw new Error(`Supabase error saving conversation log: ${error.message}`);
        }
        if (!data) {
            throw new Error("Failed to save conversation log, no data returned.");
        }

        // Map DB row back to domain entity
        // If entries were stored as JSONB and returned directly:
        const entries: ConversationEntry[] = (data.entries || []).map((dbEntry: any) => ({
            role: dbEntry.role,
            message: dbEntry.message,
            timestamp: new Date(dbEntry.timestamp),
            interestScore: dbEntry.interest_score,
        }));

        return {
            ...log, // Keep original non-column properties
            id: data.id,
            // userId: data.user_id, // userId is an input param, not typically part of ConversationLog entity itself.
            entries: entries,
        };
    }
    // Implement findById, etc. if needed
}
