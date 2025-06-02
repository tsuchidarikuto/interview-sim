// src/domain/interview/entities/InterviewSession.ts

import { User } from "@/domain/user/entities/User"; // Assuming User entity will be referenced

// Define possible status types for an interview session
export enum InterviewStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING_FEEDBACK = "pending_feedback",
}

export interface InterviewSession {
  id: string; // Unique identifier for the interview session
  candidateId: string; // ID of the candidate (references User entity)
  // In a real system, you might have multiple interviewers
  // For now, let's assume one primary interviewer or a reference to an Interviewer entity if distinct from User
  interviewerId: string; // ID of the interviewer (references User entity)
  jobId?: string; // Optional: ID of the job opening this interview is for
  scheduledAt: Date; // Date and time of the interview
  status: InterviewStatus; // Current status of the interview
  // Could include references to specific questions, answers, feedback forms, etc.
  // For example:
  // questionSetId?: string;
  // feedbackId?: string;
  // recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic methods might be added later, e.g.:
  // schedule(date: Date): void;
  // complete(): void;
  // cancel(): void;
}
