// API-based History Service
import { HistoryDataTypes, MailContentsTypes } from "@/types";

// Helper functions that use the new API endpoints instead of direct database access
export class HandleHistoryTable {
  
  // Get mailbox data via API
  async getMailboxData(uid: string): Promise<MailContentsTypes[]> {
    const response = await fetch('/api/history');
    if (!response.ok) {
      throw new Error('Failed to fetch mailbox data');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error('API returned error');
    }
    
    return result.data;
  }
  
  // Get full history data via API
  async getAllHistoryData(id: string): Promise<HistoryDataTypes> {
    const response = await fetch(`/api/history/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch history data');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error('API returned error');
    }
    
    return result.data;
  }

  // Update history status via API
  async updateStatus(id: string, columnName: string, value: boolean) {
    const response = await fetch(`/api/history/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        columnName,
        value
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update history status');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('API returned error');
    }

    return result.data;
  }
}