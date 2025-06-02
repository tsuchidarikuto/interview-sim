// src/domain/interview/repositories/IInterviewSessionRepository.ts

import { InterviewSession, InterviewStatus } from "@/domain/interview/entities/InterviewSession";

export interface FindInterviewSessionsCriteria {
  candidateId?: string;
  interviewerId?: string;
  jobId?: string;
  status?: InterviewStatus;
  scheduledAfter?: Date;
  scheduledBefore?: Date;
}

export interface IInterviewSessionRepository {
  findById(id: string): Promise<InterviewSession | null>;
  save(interviewSession: InterviewSession): Promise<InterviewSession>; // Handles create and update
  delete(id: string): Promise<boolean>;
  findAll(criteria: FindInterviewSessionsCriteria): Promise<InterviewSession[]>;
  findUpcomingByCandidate(candidateId: string, limit?: number): Promise<InterviewSession[]>;
  findUpcomingByInterviewer(interviewerId: string, limit?: number): Promise<InterviewSession[]>;
  // Add more specific query methods as needed
}
